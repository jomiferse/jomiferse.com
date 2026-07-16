import { access, readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

import { legacyRedirects } from "../../../src/lib/legacy-redirects.ts";

const SITE = "https://www.jomiferse.com";
const MAX_HTML_BYTES = 180_000;
const MAX_INLINE_CSS_BYTES = 2_000;

interface BuiltPage {
	file: string;
	html: string;
	canonical: string;
	indexable: boolean;
	alternates: Map<string, string>;
	schemas: unknown[];
}

export interface BuildAuditResult {
	pages: number;
	indexablePages: number;
	maxHtmlBytes: number;
	failures: string[];
}

const exists = async (path: string) => {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
};

const walkFiles = async (directory: string): Promise<string[]> => {
	const entries = await readdir(directory, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const path = join(directory, entry.name);
			return entry.isDirectory() ? walkFiles(path) : [path];
		}),
	);
	return nested.flat();
};

const getAttribute = (tag: string, name: string) =>
	tag.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`, "i"))?.[1];

const getTags = (html: string, tagName: string) =>
	[...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map(
		(match) => match[0],
	);

const decodeHtml = (value: string) =>
	value
		.replaceAll("&amp;", "&")
		.replaceAll("&quot;", '"')
		.replaceAll("&#39;", "'")
		.replaceAll("&lt;", "<")
		.replaceAll("&gt;", ">");

const normalizePublicUrl = (value: string) => {
	const url = new URL(value, SITE);
	const pathname = url.pathname.replace(/\/+$/, "") || "/";
	return `${url.origin}${pathname}`;
};

const publicPath = (value: string) => new URL(value, SITE).pathname;

const findSchemas = (
	value: unknown,
	type: string,
): Record<string, unknown>[] => {
	if (Array.isArray(value)) {
		return value.flatMap((item) => findSchemas(item, type));
	}
	if (!value || typeof value !== "object") return [];
	const object = value as Record<string, unknown>;
	const current = object["@type"] === type ? [object] : [];
	return [
		...current,
		...Object.values(object).flatMap((item) => findSchemas(item, type)),
	];
};

const parsePage = (
	file: string,
	html: string,
	failures: string[],
): BuiltPage => {
	const label = relative(process.cwd(), file);
	const links = getTags(html, "link");
	const canonicalLinks = links.filter(
		(tag) => getAttribute(tag, "rel") === "canonical",
	);
	if (canonicalLinks.length !== 1) {
		failures.push(
			`${label}: expected one canonical, found ${canonicalLinks.length}`,
		);
	}
	const canonical = getAttribute(canonicalLinks[0] ?? "", "href") ?? "";
	if (!links.some((tag) => getAttribute(tag, "rel") === "stylesheet")) {
		failures.push(`${label}: missing extracted stylesheet`);
	}
	const robots =
		html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] ?? "";
	const indexable = !robots.includes("noindex");
	const alternates = new Map<string, string>();
	for (const tag of links) {
		if (getAttribute(tag, "rel") !== "alternate") continue;
		const language = getAttribute(tag, "hreflang");
		const href = getAttribute(tag, "href");
		if (language && href) alternates.set(language, href);
	}

	const title = decodeHtml(
		html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "",
	);
	const description = decodeHtml(
		html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? "",
	);
	if (!title || title.length > 65) {
		failures.push(`${label}: title length is ${title.length}`);
	}
	if (!description || description.length > 165) {
		failures.push(`${label}: description length is ${description.length}`);
	}
	const h1Count = (html.match(/<h1\b/gi) ?? []).length;
	if (h1Count !== 1)
		failures.push(`${label}: expected one h1, found ${h1Count}`);

	const schemas: unknown[] = [];
	for (const match of html.matchAll(
		/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
	)) {
		try {
			schemas.push(JSON.parse(match[1]));
		} catch (error) {
			failures.push(`${label}: invalid JSON-LD (${String(error)})`);
		}
	}
	if (!schemas.length) failures.push(`${label}: missing JSON-LD`);
	if (
		!findSchemas(schemas, "Person").some(
			(item) => item["@id"] === `${SITE}/#person`,
		)
	) {
		failures.push(`${label}: missing stable Person entity`);
	}
	if (
		!findSchemas(schemas, "WebSite").some(
			(item) => item["@id"] === `${SITE}/#website`,
		)
	) {
		failures.push(`${label}: missing stable WebSite entity`);
	}

	const route = canonical ? publicPath(canonical) : "";
	if (/\/(en|es)\/blog\/(?!page\/|$)/.test(route)) {
		const postings = findSchemas(schemas, "BlogPosting");
		if (postings.length !== 1) {
			failures.push(`${label}: expected one BlogPosting schema`);
		} else if (
			!String(postings[0].image ?? "").includes("/images/blog/covers/")
		) {
			failures.push(`${label}: BlogPosting must use its article cover`);
		}
	}

	const inlineCssBytes = (
		html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) ?? []
	).join("").length;
	if (inlineCssBytes > MAX_INLINE_CSS_BYTES) {
		failures.push(`${label}: ${inlineCssBytes} inline CSS bytes exceed budget`);
	}
	if (Buffer.byteLength(html) > MAX_HTML_BYTES) {
		failures.push(`${label}: HTML exceeds ${MAX_HTML_BYTES} bytes`);
	}

	for (const tag of getTags(html, "img")) {
		for (const attribute of ["width", "height", "sizes", "decoding"]) {
			if (!getAttribute(tag, attribute)) {
				failures.push(`${label}: image missing ${attribute}`);
			}
		}
		if (
			!getAttribute(tag, "loading") &&
			getAttribute(tag, "fetchpriority") !== "high"
		) {
			failures.push(`${label}: image missing loading or high priority`);
		}
		if (tag.includes("data-hover-preview") && getAttribute(tag, "src")) {
			failures.push(`${label}: hover preview must not ship with a network src`);
		}
	}

	return { file, html, canonical, indexable, alternates, schemas };
};

export const auditBuildArtifact = async (
	root: string,
): Promise<BuildAuditResult> => {
	const failures: string[] = [];
	const dist = join(root, "dist", "client");
	if (!(await exists(dist))) {
		return {
			pages: 0,
			indexablePages: 0,
			maxHtmlBytes: 0,
			failures: ["dist/client is missing; run the production build first"],
		};
	}

	const files = await walkFiles(dist);
	const htmlFiles = files.filter(
		(file) => file.endsWith("index.html") || file.endsWith("404.html"),
	);
	const pages = await Promise.all(
		htmlFiles.map(async (file) =>
			parsePage(file, await readFile(file, "utf8"), failures),
		),
	);
	const canonicalMap = new Map<string, BuiltPage>();
	for (const page of pages) {
		if (!page.canonical) continue;
		const normalized = normalizePublicUrl(page.canonical);
		if (canonicalMap.has(normalized))
			failures.push(`duplicate canonical: ${normalized}`);
		canonicalMap.set(normalized, page);
	}

	for (const page of pages.filter((candidate) => candidate.indexable)) {
		for (const language of ["en", "es", "x-default"]) {
			const alternate = page.alternates.get(language);
			if (!alternate) {
				failures.push(
					`${relative(root, page.file)}: missing ${language} alternate`,
				);
				continue;
			}
			if (!canonicalMap.has(normalizePublicUrl(alternate))) {
				failures.push(
					`${relative(root, page.file)}: alternate target is missing: ${alternate}`,
				);
			}
		}
	}

	const aliasPaths = new Set(Object.keys(legacyRedirects));
	for (const page of pages) {
		for (const tag of getTags(page.html, "a")) {
			const href = getAttribute(tag, "href");
			if (!href || href.startsWith("#")) continue;
			let url: URL;
			try {
				url = new URL(href, SITE);
			} catch {
				continue;
			}
			if (url.origin !== SITE) continue;
			const path = `${url.pathname.replace(/\/+$/, "") || "/"}/`;
			if (aliasPaths.has(path)) {
				failures.push(
					`${relative(root, page.file)}: internal link uses alias ${path}`,
				);
			}
			if (
				url.pathname === "/" ||
				/^\/(en|es)\/contact\/?$/.test(url.pathname) ||
				url.pathname.startsWith("/api/") ||
				extname(url.pathname)
			) {
				continue;
			}
			const target = join(dist, url.pathname.replace(/^\//, ""), "index.html");
			if (!(await exists(target))) {
				failures.push(
					`${relative(root, page.file)}: broken internal link ${href}`,
				);
			}
		}

		for (const tag of getTags(page.html, "img")) {
			const source =
				getAttribute(tag, "src") ?? getAttribute(tag, "data-hover-src");
			if (!source || !source.startsWith("/") || source.startsWith("//"))
				continue;
			if (!(await exists(join(dist, source.replace(/^\//, ""))))) {
				failures.push(
					`${relative(root, page.file)}: missing image asset ${source}`,
				);
			}
		}
		for (const tag of [
			...getTags(page.html, "link"),
			...getTags(page.html, "script"),
		]) {
			const source = getAttribute(tag, "href") ?? getAttribute(tag, "src");
			if (!source || !source.startsWith("/") || !extname(publicPath(source)))
				continue;
			if (!(await exists(join(dist, publicPath(source).replace(/^\//, ""))))) {
				failures.push(
					`${relative(root, page.file)}: missing referenced asset ${source}`,
				);
			}
		}
	}

	const sitemap = await readFile(join(dist, "sitemap-0.xml"), "utf8");
	const sitemapUrls = new Set(
		[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
			normalizePublicUrl(match[1]),
		),
	);
	for (const page of pages.filter((candidate) => candidate.indexable)) {
		const canonical = normalizePublicUrl(page.canonical);
		if (!sitemapUrls.has(canonical))
			failures.push(`sitemap missing ${canonical}`);
	}
	for (const alias of aliasPaths) {
		if (sitemapUrls.has(normalizePublicUrl(alias))) {
			failures.push(`sitemap contains service alias ${alias}`);
		}
		if (await exists(join(dist, alias.replace(/^\//, ""), "index.html"))) {
			failures.push(`service alias generated HTML: ${alias}`);
		}
	}
	if (
		!sitemap.includes("/en/blog/page/2/") ||
		!sitemap.includes("/es/blog/page/2/")
	) {
		failures.push("sitemap is missing indexable blog pagination");
	}

	const robots = await readFile(join(dist, "robots.txt"), "utf8");
	const llms = await readFile(join(dist, "llms.txt"), "utf8");
	if (!robots.includes("Allow: /") || !robots.includes("sitemap-index.xml")) {
		failures.push("robots.txt is missing public crawl or sitemap directives");
	}
	for (const path of [
		"/es/services/software-a-medida/",
		"/es/services/automatizacion-de-procesos/",
		"/es/services/integraciones-api/",
		"/en/services/custom-software/",
		"/en/services/process-automation/",
		"/en/services/api-integrations/",
	]) {
		if (!llms.includes(path)) failures.push(`llms.txt is missing ${path}`);
	}
	if (!(await exists(join(dist, "images", "og", "portfolio-og.png")))) {
		failures.push("default PNG social image is missing");
	}

	const vercelConfig = JSON.parse(
		await readFile(join(root, ".vercel", "output", "config.json"), "utf8"),
	) as {
		routes?: Array<{
			src?: string;
			status?: number;
			headers?: { Location?: string };
		}>;
	};
	const redirects = vercelConfig.routes ?? [];
	if (
		!redirects.some(
			(route) =>
				route.src === "^/$" &&
				route.status === 301 &&
				route.headers?.Location === "/es/",
		)
	) {
		failures.push("root path is not a permanent redirect to /es/");
	}
	for (const [source, destination] of Object.entries(legacyRedirects)) {
		const routeSource = `^${source.replace(/\/$/, "")}$`;
		if (
			!redirects.some(
				(route) =>
					route.src === routeSource &&
					route.status === 301 &&
					route.headers?.Location === destination,
			)
		) {
			failures.push(
				`missing permanent alias redirect ${source} -> ${destination}`,
			);
		}
	}

	return {
		pages: pages.length,
		indexablePages: pages.filter((page) => page.indexable).length,
		maxHtmlBytes: Math.max(
			...pages.map((page) => Buffer.byteLength(page.html)),
		),
		failures,
	};
};
