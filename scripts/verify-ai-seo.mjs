import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const verifyGeneratedOutput = process.argv.includes("--dist");

const readSource = async (...parts) => {
	try {
		return await readFile(join(root, ...parts), "utf8");
	} catch {
		failures.push(`missing source: ${parts.join("/")}`);
		return "";
	}
};

const requireMarkers = (name, source, markers) => {
	for (const marker of markers) {
		if (!source.includes(marker)) failures.push(`${name}: missing ${marker}`);
	}
};

const seo = await readSource("src", "lib", "seo.ts");
const hub = await readSource("src", "pages", "[locale]", "services.astro");
const detail = await readSource(
	"src",
	"pages",
	"[locale]",
	"services",
	"[service].astro",
);
const config = await readSource("astro.config.mjs");
const llms = await readSource("public", "llms.txt");
const homeServices = await readSource(
	"src",
	"components",
	"home",
	"HomeSpecializedServices.astro",
);
const spanishHome = await readSource("src", "i18n", "es.json");
const englishHome = await readSource("src", "i18n", "en.json");
const spanishArticle = await readSource(
	"src",
	"content",
	"blog",
	"es",
	"cuando-necesita-empresa-mantenimiento-spring-boot.md",
);
const englishArticle = await readSource(
	"src",
	"content",
	"blog",
	"en",
	"when-company-needs-spring-boot-maintenance.md",
);
const robots = await readSource("public", "robots.txt");

requireMarkers("service schema", seo, [
	"StartingPriceOfferSeo",
	"OfferCatalog",
	"makesOffer",
	"priceCurrency",
	"UnitPriceSpecification",
	"priceSpecification",
	"unitText",
]);
requireMarkers("hub schema", hub, [
	"offers:",
	"pricingOptions",
	"getServiceAreas",
]);
requireMarkers("detail schema", detail, [
	"offers:",
	"pricingOptions",
	"#pricing-options",
]);
requireMarkers("sitemap", config, [
	'"/es/services/maintenance-support/"',
	'"/en/services/maintenance-support/"',
]);
requireMarkers("llms.txt", llms, [
	"/es/services/mantenimiento-y-soporte-tecnico/",
	"/en/services/maintenance-and-technical-support/",
]);
requireMarkers("home services", homeServices, ["secondaryLink", "arrow-right"]);
requireMarkers("Spanish home", spanishHome, [
	'"secondaryLink"',
	'"/es/services/mantenimiento-y-soporte-tecnico/"',
]);
requireMarkers("English home", englishHome, [
	'"secondaryLink"',
	'"/en/services/maintenance-and-technical-support/"',
]);
requireMarkers("Spanish maintenance article", spanishArticle, [
	"/es/services/mantenimiento-y-soporte-tecnico/",
]);
requireMarkers("English maintenance article", englishArticle, [
	"/en/services/maintenance-and-technical-support/",
]);
if (!robots.includes("Allow: /"))
	failures.push("robots: public pages are not allowed");

if (verifyGeneratedOutput) {
	const outputs = [
		[
			"Spanish maintenance",
			["es", "services", "mantenimiento-y-soporte-tecnico", "index.html"],
		],
		[
			"English maintenance",
			["en", "services", "maintenance-and-technical-support", "index.html"],
		],
		["Spanish services", ["es", "services", "index.html"]],
		["English services", ["en", "services", "index.html"]],
	];

	for (const [name, parts] of outputs) {
		const output = join(root, "dist", "client", ...parts);
		try {
			await access(output);
			const html = await readFile(output, "utf8");
			for (const marker of ["priceCurrency", "priceSpecification", "EUR"]) {
				if (!html.includes(marker))
					failures.push(`dist ${name}: missing ${marker}`);
			}
		} catch {
			failures.push(`dist ${name}: generated route is missing`);
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("AI and service SEO verification passed.");
}
