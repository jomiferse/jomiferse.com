import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const phases = [
	"catalog",
	"hub-components",
	"hub",
	"detail-components",
	"detail",
	"contact",
	"seo",
];
const phaseArgument = process.argv.find((value) =>
	value.startsWith("--phase="),
);
const requestedPhase = phaseArgument?.split("=")[1] ?? "seo";
const requestedIndex = phases.indexOf(requestedPhase);
const verifyGeneratedOutput = process.argv.includes("--dist");

if (requestedIndex < 0) {
	throw new Error(`Unknown verification phase: ${requestedPhase}`);
}

const includesPhase = (phase) => phases.indexOf(phase) <= requestedIndex;
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
const requireOrder = (name, source, markers) => {
	let previousIndex = -1;
	for (const marker of markers) {
		const index = source.indexOf(marker);
		if (index < 0) {
			failures.push(`${name}: missing ordered marker ${marker}`);
			continue;
		}
		if (index <= previousIndex) {
			failures.push(`${name}: marker out of order ${marker}`);
		}
		previousIndex = index;
	}
};

const catalog = await readSource("src", "lib", "service-commercial.ts");
const services = await readSource("src", "lib", "services.ts");
const spanishSource = await readSource("src", "i18n", "es.json");
const englishSource = await readSource("src", "i18n", "en.json");
const spanish = spanishSource ? JSON.parse(spanishSource) : {};
const english = englishSource ? JSON.parse(englishSource) : {};

const requiredAreas = [
	"web-conversion",
	"custom-software",
	"automation-ai",
	"maintenance-support",
];
const requiredPricingKeys = ["intervention", "project", "support"];
const requiredTranslationKeys = [
	"base:business-website",
	"base:website-redesign",
	"base:custom-web-application",
	"base:internal-tools",
	"base:automation-workflows",
	"base:api-integrations",
	"base:backend-spring-boot",
	"base:maintenance-support",
	...Array.from({ length: 7 }, (_, index) => `it-consulting:${index}`),
	...Array.from({ length: 6 }, (_, index) => `web-wordpress:${index}`),
	...Array.from({ length: 5 }, (_, index) => `ai-automation:${index}`),
	"maintenance-support:0",
];
const requiredProfiles = [
	"businessWebsite",
	"websiteRedesign",
	"customApplication",
	"internalTool",
	"workflowAutomation",
	"apiIntegration",
	"springBackend",
	"technicalMaintenance",
	"projectManagement",
	"technicalAdvisory",
	"secondOpinion",
	"wordpressWebsite",
	"wordpressMaintenance",
	"wordpressOptimization",
	"woocommerce",
	"wordpressMigration",
	"landingPage",
	"businessAi",
	"chatbot",
	"aiAutomation",
	"aiAgent",
	"aiTraining",
];

requireMarkers("commercial catalog", catalog, [
	"serviceAreaSlugs",
	"pricingKeys",
	"CommercialServiceDefinition",
	"serviceCommercialDefinitions",
	"getCommercialServiceDefinition",
	"resolvePricingOptions",
]);
for (const marker of [
	...requiredAreas,
	...requiredPricingKeys,
	...requiredTranslationKeys,
]) {
	if (!catalog.includes(`"${marker}"`)) {
		failures.push(`commercial catalog: missing explicit ${marker}`);
	}
}
for (const [locale, dictionary] of [
	["es", spanish],
	["en", english],
]) {
	const commercial = dictionary.services?.commercial;
	if (!commercial) {
		failures.push(`${locale}: missing services.commercial`);
		continue;
	}
	for (const area of requiredAreas) {
		if (!commercial.areas?.[area])
			failures.push(`${locale}: missing area ${area}`);
	}
	for (const profile of requiredProfiles) {
		const options = commercial.pricingProfiles?.[profile];
		if (!options) {
			failures.push(`${locale}: missing pricing profile ${profile}`);
			continue;
		}
		for (const key of requiredPricingKeys) {
			const option = options[key];
			if (!option) {
				failures.push(`${locale}: ${profile} missing ${key}`);
				continue;
			}
			if (
				!Array.isArray(option.deliverables) ||
				option.deliverables.length < 3
			) {
				failures.push(`${locale}: ${profile}.${key} needs three deliverables`);
			}
			for (const field of ["label", "description", "boundary", "ctaLabel"]) {
				if (!option[field])
					failures.push(`${locale}: ${profile}.${key} missing ${field}`);
			}
		}
	}
	if (!dictionary.services?.items?.["maintenance-support"]) {
		failures.push(`${locale}: missing maintenance-support service item`);
	}
	if (
		!dictionary.services?.hub?.groups?.["maintenance-support"]?.offerings?.[0]
	) {
		failures.push(`${locale}: missing maintenance-support canonical offering`);
	}
}

requireMarkers("service resolver", services, [
	'| "maintenance-support"',
	"getCanonicalServicePages",
	"getServiceAreas",
	"getRelatedServices",
	"pricingOptions",
	"featuredRank",
]);
if (services.includes("if (pagesBySlug.has(offering.slug)) continue;")) {
	failures.push(
		"service resolver: localized slug collisions must not silently discard explicit offering metadata",
	);
}

if (includesPhase("hub-components")) {
	const iconBadge = await readSource(
		"src",
		"components",
		"services",
		"ServiceIconBadge.astro",
	);
	const areaCard = await readSource(
		"src",
		"components",
		"services",
		"ServiceAreaCard.astro",
	);
	const models = await readSource(
		"src",
		"components",
		"services",
		"EngagementModels.astro",
	);
	const directory = await readSource(
		"src",
		"components",
		"services",
		"ServiceDirectory.astro",
	);
	requireMarkers("service icon", iconBadge, [
		"data-service-icon",
		"aria-hidden",
	]);
	requireMarkers("area card", areaCard, [
		"data-service-area-card",
		"button-secondary",
		"arrow-right",
	]);
	requireMarkers("engagement models", models, ["data-engagement-models"]);
	requireMarkers("service directory", directory, [
		"data-service-directory",
		"<details",
		"<summary",
	]);
	for (const source of [areaCard, models, directory]) {
		if (source.includes("carousel"))
			failures.push("hub components: carousel is forbidden");
	}
}

if (includesPhase("hub")) {
	const hub = await readSource("src", "pages", "[locale]", "services.astro");
	const globalStyles = await readSource("src", "styles", "global.css");
	requireOrder("services hub", hub, [
		"data-services-hero",
		"data-services-areas",
		"data-engagement-models",
		"data-services-proof",
		"data-services-process",
		"data-service-directory",
		"data-services-faq",
		"<ConversionCta",
	]);
	requireMarkers("services hub", hub, [
		'class="services-page"',
		"button-action",
		"ServiceAreaCard",
		"EngagementModels",
		"ServiceDirectory",
		"ProjectArchiveCard",
		"getProjectPages",
	]);
	requireMarkers("service styles", globalStyles, [
		"body:has(.services-page) main.site-shell",
		"max-width: 88rem",
	]);
	for (const obsolete of [
		"definitionTitle",
		"advantagesTitle",
		"recommendationTitle",
		"useCasesTitle",
		"commercialLandingCopy",
	]) {
		if (hub.includes(obsolete))
			failures.push(`services hub: obsolete ${obsolete}`);
	}
}

if (includesPhase("detail-components")) {
	const trust = await readSource(
		"src",
		"components",
		"services",
		"ServiceTrustStrip.astro",
	);
	const card = await readSource(
		"src",
		"components",
		"services",
		"ServicePricingCard.astro",
	);
	const grid = await readSource(
		"src",
		"components",
		"services",
		"ServicePricingGrid.astro",
	);
	const proof = await readSource(
		"src",
		"components",
		"services",
		"ServiceProofCard.astro",
	);
	requireMarkers("trust strip", trust, ["data-service-trust"]);
	requireMarkers("pricing card", card, [
		"data-pricing-option",
		"data-pricing-featured",
		"data-pricing-boundary",
		"data-service-selection",
		"data-scope-selection",
		"button-action",
	]);
	requireMarkers("pricing grid", grid, [
		"data-service-pricing",
		"intervention",
		"project",
		"support",
	]);
	requireMarkers("proof card", proof, ["data-service-proof", "arrow-right"]);
	if (`${card}${grid}`.includes("carousel")) {
		failures.push("pricing components: carousel is forbidden");
	}
}

if (includesPhase("detail")) {
	const detail = await readSource(
		"src",
		"pages",
		"[locale]",
		"services",
		"[service].astro",
	);
	requireOrder("service detail", detail, [
		"data-service-hero",
		"data-service-trust",
		"data-service-outcome",
		"data-service-pricing",
		"data-service-scope",
		"data-service-process",
		"data-service-proof",
		"data-related-services",
		"data-service-faq",
		"<ConversionCta",
		'id="service-contact-dialog"',
	]);
	requireMarkers("service detail", detail, [
		"ServiceTrustStrip",
		"ServicePricingGrid",
		"ServiceProofCard",
		"getRelatedServices",
		"getProjectPages",
	]);
	if (/service\.pricing(?:\.|\[)/.test(detail)) {
		failures.push("service detail: obsolete service.pricing");
	}
	if (detail.includes("getRelatedKeys")) {
		failures.push("service detail: obsolete getRelatedKeys");
	}
}

if (includesPhase("contact")) {
	const form = await readSource(
		"src",
		"components",
		"forms",
		"ContactForm.astro",
	);
	const api = await readSource("src", "pages", "api", "contact.ts");
	requireMarkers("contact form", form, [
		'name="service"',
		'name="scope"',
		"data-selected-service",
		"data-selected-scope",
		"intervention",
		"project",
		"support",
		"URLSearchParams",
	]);
	requireMarkers("contact API", api, [
		"getServicePages",
		'form.get("service")',
		'form.get("scope")',
		"Service:",
		"Scope:",
	]);
}

if (includesPhase("seo")) {
	const seo = await readSource("src", "lib", "seo.ts");
	const llms = await readSource("public", "llms.txt");
	requireMarkers("service SEO", seo, [
		"StartingPriceOfferSeo",
		"priceCurrency",
		"UnitPriceSpecification",
		"priceSpecification",
	]);
	requireMarkers("llms.txt", llms, [
		"/es/services/mantenimiento-y-soporte-tecnico/",
		"/en/services/maintenance-and-technical-support/",
	]);
}

if (verifyGeneratedOutput) {
	const generatedRoutes = [
		["es", "services", "index.html"],
		["en", "services", "index.html"],
		["es", "services", "mantenimiento-y-soporte-tecnico", "index.html"],
		["en", "services", "maintenance-and-technical-support", "index.html"],
	];
	for (const parts of generatedRoutes) {
		const output = join(root, "dist", "client", ...parts);
		try {
			await access(output);
			const html = await readFile(output, "utf8");
			requireMarkers(parts.join("/"), html, ["data-conversion-cta"]);
		} catch {
			failures.push(`generated route missing: ${parts.join("/")}`);
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn(
		`Service redesign verification passed through ${requestedPhase}.`,
	);
}
