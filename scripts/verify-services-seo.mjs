import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const site = "https://www.jomiferse.com";
const distPath = fileURLToPath(new URL("../dist/client/", import.meta.url));

const readDist = (path) => readFileSync(join(distPath, path), "utf8");

const fail = (message) => {
	throw new Error(message);
};

const assertIncludes = (content, expected, label) => {
	if (!content.includes(expected)) fail(`${label}: missing ${expected}`);
};

const assertExcludes = (content, unexpected, label) => {
	if (content.includes(unexpected)) fail(`${label}: unexpected ${unexpected}`);
};

const htmlToRoute = (filePath) => {
	const route = `/${relative(distPath, filePath).replace(/\/index\.html$/, "/")}`;
	return route === "//" ? "/" : route;
};

const routeToFilePath = (route) => {
	const normalized = route.endsWith("/") ? route : `${route}/`;
	return join(distPath, normalized, "index.html");
};

const walkHtml = (directory) =>
	readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = join(directory, entry.name);
		if (entry.isDirectory()) return walkHtml(entryPath);
		return entry.name === "index.html" ? [entryPath] : [];
	});

const page = (route) => readFileSync(routeToFilePath(route), "utf8");

const extract = (html, regex, label) => {
	const match = html.match(regex);
	if (!match?.[1]) fail(`${label}: not found`);
	return match[1];
};

const extractAll = (html, regex) =>
	[...html.matchAll(regex)].map((match) => match);

const toRoute = (href) => {
	if (href.startsWith("#")) return null;
	if (href.startsWith("mailto:") || href.startsWith("tel:")) return null;
	if (href.startsWith("https://wa.me/")) return null;
	const url = new URL(href, site);
	if (url.origin !== site) return null;
	return url.pathname;
};

const servicePageFiles = walkHtml(join(distPath, "es", "services"))
	.concat(walkHtml(join(distPath, "en", "services")))
	.filter((filePath) => !filePath.endsWith(join("services", "index.html")));
const serviceRoutes = servicePageFiles.map(htmlToRoute).sort();
const serviceRouteSet = new Set(serviceRoutes);
const commercialLandingPairs = [
	["/es/software-a-medida-pymes/", "/en/custom-software-small-businesses/"],
	[
		"/es/automatizacion-tareas-administrativas/",
		"/en/administrative-task-automation/",
	],
	[
		"/es/consultor-tecnologico-pequenas-empresas/",
		"/en/technology-consultant-small-businesses/",
	],
	["/es/integracion-herramientas-negocio/", "/en/business-tools-integration/"],
	["/es/desarrollador-freelance-espana/", "/en/freelance-developer-spain/"],
];
const commercialLandingRoutes = commercialLandingPairs.flat();
const sitemap = readDist("sitemap-0.xml");

if (serviceRoutes.length < 40) {
	fail(`expected to audit many service pages, found ${serviceRoutes.length}`);
}

const canonicalByRoute = new Map();
const alternateByRoute = new Map();

for (const route of serviceRoutes) {
	const html = page(route);
	const label = route;
	const title = extract(html, /<title>([^<]+)<\/title>/, `${label} title`);
	const description = extract(
		html,
		/<meta name="description" content="([^"]+)"/,
		`${label} description`,
	);
	const canonical = extract(
		html,
		/<link rel="canonical" href="([^"]+)"/,
		`${label} canonical`,
	);
	const h1s = extractAll(html, /<h1\b[^>]*>/g);
	const h2s = extractAll(html, /<h2\b[^>]*>/g);
	const alternates = Object.fromEntries(
		extractAll(
			html,
			/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g,
		).map((match) => [match[1], match[2]]),
	);
	const canonicalRoute = new URL(canonical).pathname;

	if (title.length < 35 || title.length > 80) {
		fail(`${label}: weak title length (${title.length})`);
	}
	if (description.length < 90 || description.length > 180) {
		fail(`${label}: weak meta description length (${description.length})`);
	}
	if (h1s.length !== 1)
		fail(`${label}: expected exactly one h1, found ${h1s.length}`);
	if (h2s.length < 4) fail(`${label}: expected useful h2 structure`);
	if (!canonical.endsWith("/"))
		fail(`${label}: canonical lacks trailing slash`);
	if (!existsSync(routeToFilePath(canonicalRoute))) {
		fail(`${label}: canonical target does not exist (${canonicalRoute})`);
	}
	for (const hreflang of ["en", "es", "x-default"]) {
		if (!alternates[hreflang]) fail(`${label}: missing ${hreflang} alternate`);
		if (!alternates[hreflang].endsWith("/")) {
			fail(`${label}: ${hreflang} alternate lacks trailing slash`);
		}
	}
	if (alternates["x-default"] !== alternates.es) {
		fail(`${label}: x-default should point to the Spanish alternate`);
	}
	if (!html.includes('"@type":"Service"'))
		fail(`${label}: missing Service schema`);
	if (!html.includes('"@type":"FAQPage"'))
		fail(`${label}: missing FAQPage schema`);
	if (!html.includes('"@type":"BreadcrumbList"')) {
		fail(`${label}: missing BreadcrumbList schema`);
	}
	for (const requiredText of [
		"WhatsApp",
		route.startsWith("/es/") ? "Problemas que resuelve" : "Problems it solves",
		route.startsWith("/es/") ? "Para quién encaja" : "Who it fits",
		route.startsWith("/es/") ? "Qué incluye" : "What is included",
	]) {
		assertIncludes(html, requiredText, label);
	}

	canonicalByRoute.set(route, canonicalRoute);
	alternateByRoute.set(route, alternates);

	for (const [, rawHref] of extractAll(html, /<a\b[^>]*href="([^"]+)"/g)) {
		const linkedRoute = toRoute(rawHref);
		if (!linkedRoute) continue;
		if (!existsSync(routeToFilePath(linkedRoute))) {
			fail(`${label}: broken internal link ${rawHref}`);
		}
	}
}

for (const route of serviceRoutes) {
	const canonicalRoute = canonicalByRoute.get(route);
	const isCanonical = canonicalRoute === route;
	const loc = `<loc>${site}${route}</loc>`;
	if (isCanonical) {
		assertIncludes(sitemap, loc, "sitemap");
	} else {
		assertExcludes(sitemap, loc, "sitemap");
	}

	const alternates = alternateByRoute.get(route);
	const counterpart = route.startsWith("/es/")
		? new URL(alternates.en).pathname
		: new URL(alternates.es).pathname;
	if (!serviceRouteSet.has(counterpart)) {
		fail(
			`${route}: hreflang counterpart is not a generated service route (${counterpart})`,
		);
	}
	if (!isCanonical) continue;

	const counterpartAlternates = alternateByRoute.get(counterpart);
	const reciprocal = route.startsWith("/es/")
		? new URL(counterpartAlternates.es).pathname
		: new URL(counterpartAlternates.en).pathname;
	if (reciprocal !== route) {
		fail(`${route}: hreflang is not reciprocal with ${counterpart}`);
	}
}

for (const route of commercialLandingRoutes) {
	if (!existsSync(routeToFilePath(route))) {
		fail(`commercial landing missing: ${route}`);
	}

	const html = page(route);
	const label = route;
	const title = extract(html, /<title>([^<]+)<\/title>/, `${label} title`);
	const description = extract(
		html,
		/<meta name="description" content="([^"]+)"/,
		`${label} description`,
	);
	const canonical = extract(
		html,
		/<link rel="canonical" href="([^"]+)"/,
		`${label} canonical`,
	);
	const h1s = extractAll(html, /<h1\b[^>]*>/g);
	const h2s = extractAll(html, /<h2\b[^>]*>/g);
	const alternates = Object.fromEntries(
		extractAll(
			html,
			/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g,
		).map((match) => [match[1], match[2]]),
	);
	const canonicalRoute = new URL(canonical).pathname;

	if (title.length < 35 || title.length > 80) {
		fail(`${label}: weak title length (${title.length})`);
	}
	if (description.length < 90 || description.length > 180) {
		fail(`${label}: weak meta description length (${description.length})`);
	}
	if (h1s.length !== 1)
		fail(`${label}: expected exactly one h1, found ${h1s.length}`);
	if (h2s.length < 5) fail(`${label}: expected useful h2 structure`);
	if (canonicalRoute !== route) {
		fail(`${label}: canonical should be self-referencing`);
	}
	if (!canonical.endsWith("/")) {
		fail(`${label}: canonical lacks trailing slash`);
	}
	for (const hreflang of ["en", "es", "x-default"]) {
		if (!alternates[hreflang]) fail(`${label}: missing ${hreflang} alternate`);
		if (!alternates[hreflang].endsWith("/")) {
			fail(`${label}: ${hreflang} alternate lacks trailing slash`);
		}
	}
	if (alternates["x-default"] !== alternates.es) {
		fail(`${label}: x-default should point to the Spanish alternate`);
	}
	if (!html.includes('"@type":"Service"')) {
		fail(`${label}: missing Service schema`);
	}
	if (!html.includes('"@type":"FAQPage"')) {
		fail(`${label}: missing FAQPage schema`);
	}
	if (!html.includes('"@type":"BreadcrumbList"')) {
		fail(`${label}: missing BreadcrumbList schema`);
	}
	for (const requiredText of [
		route.startsWith("/es/") ? "Problema que resuelve" : "Problem it solves",
		route.startsWith("/es/") ? "Cuándo merece la pena" : "When it is worth it",
		route.startsWith("/es/") ? "Servicios relacionados" : "Related services",
	]) {
		assertIncludes(html, requiredText, label);
	}
	for (const [, rawHref] of extractAll(html, /<a\b[^>]*href="([^"]+)"/g)) {
		const linkedRoute = toRoute(rawHref);
		if (!linkedRoute) continue;
		if (!existsSync(routeToFilePath(linkedRoute))) {
			fail(`${label}: broken internal link ${rawHref}`);
		}
	}
	assertIncludes(sitemap, `<loc>${site}${route}</loc>`, "sitemap");
}

for (const [esRoute, enRoute] of commercialLandingPairs) {
	const esAlternates = Object.fromEntries(
		extractAll(
			page(esRoute),
			/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g,
		).map((match) => [match[1], match[2]]),
	);
	const enAlternates = Object.fromEntries(
		extractAll(
			page(enRoute),
			/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g,
		).map((match) => [match[1], match[2]]),
	);

	if (new URL(esAlternates.en).pathname !== enRoute) {
		fail(`${esRoute}: English alternate should be ${enRoute}`);
	}
	if (new URL(enAlternates.es).pathname !== esRoute) {
		fail(`${enRoute}: Spanish alternate should be ${esRoute}`);
	}
}

const serviceHub = page("/es/services/");
for (const serviceName of [
	"Diseño web WordPress",
	"Mantenimiento WordPress",
	"Optimización WordPress",
	"WooCommerce",
	"Migración a WordPress",
	"Automatización de procesos",
	"IA para empresas",
	"Chatbots y asistentes",
	"Automatizaciones con IA",
]) {
	assertIncludes(
		serviceHub,
		`"name":"${serviceName}"`,
		"Spanish service schema",
	);
}

for (const route of commercialLandingRoutes) {
	const hubRoute = route.startsWith("/es/") ? "/es/services/" : "/en/services/";
	assertIncludes(page(hubRoute), `href="${route}"`, `${hubRoute} landing link`);
}

const root = page("/");
assertIncludes(root, 'href="https://www.jomiferse.com/es/"', "root hreflang");
assertIncludes(
	root,
	'<link rel="canonical" href="https://www.jomiferse.com/es/"',
	"root canonical",
);
assertIncludes(
	root,
	'<link rel="alternate" hreflang="x-default" href="https://www.jomiferse.com/es/"',
	"root x-default",
);
assertIncludes(root, 'href="/es/services/"', "root service link");
assertIncludes(root, 'href="/en/services/"', "root service link");
assertExcludes(sitemap, `<loc>${site}/</loc>`, "sitemap");

for (const canonicalService of [
	"https://www.jomiferse.com/es/services/diseno-web-wordpress/",
	"https://www.jomiferse.com/es/services/mantenimiento-wordpress/",
	"https://www.jomiferse.com/es/services/automatizacion-de-procesos/",
	"https://www.jomiferse.com/en/services/wordpress-web-design/",
	"https://www.jomiferse.com/en/services/wordpress-maintenance/",
	"https://www.jomiferse.com/en/services/process-automation/",
]) {
	assertIncludes(sitemap, `<loc>${canonicalService}</loc>`, "sitemap");
}

for (const duplicateService of [
	"https://www.jomiferse.com/en/services/automation-workflows/",
	"https://www.jomiferse.com/en/services/business-website/",
	"https://www.jomiferse.com/en/services/custom-web-application/",
	"https://www.jomiferse.com/es/services/business-website/",
	"https://www.jomiferse.com/es/services/automation-workflows/",
	"https://www.jomiferse.com/es/services/api-integrations/",
	"https://www.jomiferse.com/es/services/custom-web-application/",
]) {
	assertExcludes(sitemap, `<loc>${duplicateService}</loc>`, "sitemap");
}

console.warn(
	`Service SEO output checks passed for ${serviceRoutes.length} service pages and ${commercialLandingRoutes.length} commercial landings.`,
);
