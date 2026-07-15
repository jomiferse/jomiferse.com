import { readFile, readdir } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const verifyGeneratedOutput = process.argv.includes("--dist");
const distRootArgumentIndex = process.argv.indexOf("--dist-root");
const distRootArgument =
	distRootArgumentIndex >= 0
		? process.argv[distRootArgumentIndex + 1]
		: undefined;
const distRoot = distRootArgument
	? isAbsolute(distRootArgument)
		? distRootArgument
		: resolve(root, distRootArgument)
	: join(root, "dist", "client");
const validRoles = new Set(["buyer-led", "technical-authority", "case-study"]);
const validAudiences = new Set(["business", "technical"]);
const expectedClusters = new Set([
	"freelance-developer",
	"wordpress",
	"custom-software",
	"excel-replacement",
	"process-automation",
	"ai-automation",
	"api-integrations",
	"spring-boot-development",
	"spring-boot-maintenance",
	"legacy-modernization",
	"technical-audit",
]);

const contentRoot = join(root, "src", "content", "blog");
const readEntries = async (locale) => {
	const directory = join(contentRoot, locale);
	const files = (await readdir(directory)).filter((file) =>
		file.endsWith(".md"),
	);

	return Promise.all(
		files.map(async (file) => ({
			locale,
			file,
			source: await readFile(join(directory, file), "utf8"),
		})),
	);
};

const getFrontmatter = (source) =>
	source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
const getTopLevelField = (frontmatter, name) =>
	frontmatter
		.match(new RegExp(`^${name}: ["']?([^"'\\n]+)["']?$`, "m"))?.[1]
		?.trim();
const getCommercialField = (frontmatter, name) => {
	const commercialBlock = frontmatter.match(
		/^commercial:\n((?: {2}[^\n]+\n?)*)/m,
	)?.[1];
	return commercialBlock
		?.match(new RegExp(`^  ${name}: ["']?([^"'\\n]+)["']?$`, "m"))?.[1]
		?.trim();
};

const entries = [...(await readEntries("es")), ...(await readEntries("en"))];
if (entries.length !== 54) {
	failures.push(`blog entries: expected 54, found ${entries.length}`);
}
for (const locale of ["es", "en"]) {
	const localeCount = entries.filter((entry) => entry.locale === locale).length;
	if (localeCount !== 27) {
		failures.push(`${locale} entries: expected 27, found ${localeCount}`);
	}
}

const expectedBodyLinks = new Map([
	[
		"es/ajustar-tamano-pods-kubernetes-requests-limits.md",
		"/es/mantenimiento-spring-boot/",
	],
	[
		"en/right-sizing-kubernetes-pods-requests-limits.md",
		"/en/spring-boot-maintenance/",
	],
	[
		"es/monolito-modular-vs-microservicios.md",
		"/es/auditoria-backend-api-arquitectura/",
	],
	[
		"en/modular-monolith-vs-microservices.md",
		"/en/backend-api-architecture-audit/",
	],
]);

for (const [entryPath, expectedLink] of expectedBodyLinks) {
	const entry = entries.find(
		(candidate) => `${candidate.locale}/${candidate.file}` === entryPath,
	);
	if (!entry?.source.includes(expectedLink)) {
		failures.push(`${entryPath}: missing body link ${expectedLink}`);
	}
}

const classifiedEntries = entries.map((entry) => {
	const frontmatter = getFrontmatter(entry.source);
	const commercial = {
		role: getCommercialField(frontmatter, "role"),
		audience: getCommercialField(frontmatter, "audience"),
		cluster: getCommercialField(frontmatter, "cluster"),
	};

	if (!validRoles.has(commercial.role)) {
		failures.push(`${entry.locale}/${entry.file}: invalid commercial.role`);
	}
	if (!validAudiences.has(commercial.audience)) {
		failures.push(`${entry.locale}/${entry.file}: invalid commercial.audience`);
	}
	if (!expectedClusters.has(commercial.cluster)) {
		failures.push(`${entry.locale}/${entry.file}: invalid commercial.cluster`);
	}

	return {
		...entry,
		translationSlug: getTopLevelField(frontmatter, "translationSlug"),
		commercial,
	};
});

const englishEntries = new Map(
	classifiedEntries
		.filter((entry) => entry.locale === "en")
		.map((entry) => [entry.file.replace(/\.md$/, ""), entry]),
);

for (const spanishEntry of classifiedEntries.filter(
	(entry) => entry.locale === "es",
)) {
	const englishEntry = englishEntries.get(spanishEntry.translationSlug);
	if (!englishEntry) {
		failures.push(
			`es/${spanishEntry.file}: missing English translation ${spanishEntry.translationSlug ?? ""}`,
		);
		continue;
	}

	for (const field of ["role", "audience", "cluster"]) {
		if (spanishEntry.commercial[field] !== englishEntry.commercial[field]) {
			failures.push(
				`es/${spanishEntry.file}: commercial.${field} differs from en/${englishEntry.file}`,
			);
		}
	}
}

const layoutSource = await readFile(
	join(root, "src", "layouts", "BlogPostLayout.astro"),
	"utf8",
);
for (const marker of [
	"resolveBlogCommercialCta",
	"frontmatter.commercial",
	"postCopy.commercialCta",
	"primary={commercialCta.primary}",
	"secondary={commercialCta.secondary}",
]) {
	if (!layoutSource.includes(marker)) {
		failures.push(`blog layout: missing ${marker}`);
	}
}
if (layoutSource.includes("postCta.services")) {
	failures.push("blog layout: generic services CTA is still present");
}

for (const locale of ["es", "en"]) {
	const translations = JSON.parse(
		await readFile(join(root, "src", "i18n", `${locale}.json`), "utf8"),
	);
	const commercialCta = translations.blog?.post?.commercialCta;

	for (const role of validRoles) {
		for (const field of ["eyebrow", "title", "text", "contact"]) {
			if (
				typeof commercialCta?.[role]?.[field] !== "string" ||
				commercialCta[role][field].trim().length === 0
			) {
				failures.push(
					`${locale} translations: missing blog.post.commercialCta.${role}.${field}`,
				);
			}
		}
	}
}

const clusterSource = await readFile(
	join(root, "src", "lib", "seo-clusters.ts"),
	"utf8",
);
const tupleSource = clusterSource.match(
	/export const commercialSeoClusterKeys = \[([\s\S]*?)\] as const;/,
)?.[1];

if (!tupleSource) {
	failures.push("seo clusters: missing commercialSeoClusterKeys tuple");
} else {
	const actualClusters = new Set(
		[...tupleSource.matchAll(/"([^"]+)"/g)].map((match) => match[1]),
	);

	for (const cluster of expectedClusters) {
		if (!actualClusters.has(cluster)) {
			failures.push(`seo clusters: missing ${cluster}`);
		}
	}
	for (const cluster of actualClusters) {
		if (!expectedClusters.has(cluster)) {
			failures.push(`seo clusters: unexpected ${cluster}`);
		}
	}
}

if (verifyGeneratedOutput) {
	const readGenerated = async (label, ...parts) => {
		try {
			return await readFile(join(distRoot, ...parts), "utf8");
		} catch {
			failures.push(`dist: missing ${label}`);
			return "";
		}
	};
	const decodeHtmlEntities = (value) =>
		value
			.replaceAll("&amp;", "&")
			.replaceAll("&#38;", "&")
			.replaceAll("&#x26;", "&");
	const getConversionHref = (html, marker) =>
		decodeHtmlEntities(
			html.match(new RegExp(`<a href="([^"]+)"[^>]*${marker}`))?.[1] ?? "",
		);

	const sitemap = await readGenerated("sitemap-0.xml", "sitemap-0.xml");
	for (const entry of entries) {
		const slug = entry.file.replace(/\.md$/, "");
		const expectedUrl = `https://www.jomiferse.com/${entry.locale}/blog/${slug}/`;
		if (!sitemap.includes(expectedUrl)) {
			failures.push(`dist sitemap: missing ${expectedUrl}`);
		}
	}
	if (sitemap.includes("/blog/page/")) {
		failures.push("dist sitemap: blog pagination must be excluded");
	}

	const representativePages = [
		{
			label: "Spanish buyer-led article",
			locale: "es",
			slug: "evaluar-presupuesto-software-a-medida",
			primary: "/es/services/software-a-medida/",
			service: "software-a-medida",
		},
		{
			label: "English technical-authority article",
			locale: "en",
			slug: "modular-monolith-vs-microservices",
			primary: "/en/backend-api-architecture-audit/",
			service: "technology-second-opinion",
		},
		{
			label: "Spanish case-study article",
			locale: "es",
			slug: "creando-cv-studio",
			primary: "/es/services/software-a-medida/",
			service: "software-a-medida",
		},
	];

	for (const page of representativePages) {
		const html = await readGenerated(
			page.label,
			page.locale,
			"blog",
			page.slug,
			"index.html",
		);
		if (!html) continue;

		const primaryHref = getConversionHref(html, "data-conversion-primary");
		const secondaryHref = getConversionHref(html, "data-conversion-secondary");
		const articlePath = `/${page.locale}/blog/${page.slug}/`;

		if (primaryHref !== page.primary) {
			failures.push(
				`dist ${page.label}: expected primary ${page.primary}, found ${primaryHref || "none"}`,
			);
		}
		if (!secondaryHref.includes(`service=${page.service}`)) {
			failures.push(
				`dist ${page.label}: missing contact service ${page.service}`,
			);
		}
		if (!secondaryHref.includes("sourceCategory=article")) {
			failures.push(`dist ${page.label}: missing article source category`);
		}
		if (
			!secondaryHref.includes(`sourcePath=${encodeURIComponent(articlePath)}`)
		) {
			failures.push(`dist ${page.label}: missing encoded source path`);
		}
		if (primaryHref === `/${page.locale}/services`) {
			failures.push(`dist ${page.label}: generic services primary remains`);
		}
	}
}

if (failures.length > 0) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.log("Blog commercial source verification passed.");
}
