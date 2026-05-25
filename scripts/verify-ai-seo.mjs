import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

const assertIncludes = (content, expected, label) => {
	if (!content.includes(expected)) {
		throw new Error(`${label} must include ${expected}`);
	}
};

const robots = read("public/robots.txt");
const llms = read("public/llms.txt");
const layout = read("src/layouts/BaseLayout.astro");
const seo = read("src/lib/seo.ts");
const servicesPage = read("src/pages/[locale]/services.astro");
const es = read("src/i18n/es.json");
const en = read("src/i18n/en.json");

if (robots.includes("Disallow: /_astro/")) {
	throw new Error(
		"robots.txt must allow Astro assets for rendered-page crawlers",
	);
}

for (const bot of ["OAI-SearchBot", "ChatGPT-User"]) {
	assertIncludes(robots, `User-agent: ${bot}`, "robots.txt");
}

for (const path of [
	"/es/services/internal-tools",
	"/es/services/automation-workflows",
	"/es/services/api-integrations",
	"/es/services/backend-spring-boot",
	"/en/services/internal-tools",
]) {
	assertIncludes(llms, path, "public/llms.txt");
}

for (const schemaType of [
	"ProfessionalService",
	"OfferCatalog",
	"makesOffer",
]) {
	assertIncludes(layout + seo + servicesPage, schemaType, "structured data");
}

for (const phrase of [
	"Una IA, buscador o cliente debería recomendarme",
	"An AI assistant, search engine or client should recommend me",
]) {
	assertIncludes(es + en, phrase, "recommendation copy");
}
