import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const verifyGeneratedOutput = process.argv.includes("--dist");

const requiredPaths = [
	"consultancyHero.eyebrow",
	"consultancyHero.title",
	"consultancyHero.intro",
	"consultancyHero.primaryCta",
	"consultancyHero.caseCta",
	"serviceSelector.title",
	"serviceSelector.intro",
	"serviceSelector.items",
	"assessment.eyebrow",
	"assessment.title",
	"assessment.intro",
	"assessment.items",
	"assessment.boundary",
	"specializedServices.eyebrow",
	"specializedServices.title",
	"specializedServices.intro",
	"specializedServices.items",
	"hero.eyebrow",
	"hero.title",
	"hero.intro",
	"hero.primaryCta",
	"hero.secondaryCta",
	"hero.directTitle",
	"hero.directText",
	"trust.items",
	"servicePaths.items",
	"featuredWork.eyebrow",
	"featuredWork.title",
	"featuredWork.problemLabel",
	"featuredWork.solutionLabel",
	"featuredWork.link",
	"process.steps",
	"proof.points",
	"skills.eyebrow",
	"skills.title",
	"skills.pauseLabel",
	"cta.button",
];

const getPath = (value, path) =>
	path.split(".").reduce((current, key) => current?.[key], value);

const [
	globalStyles,
	homeHero,
	assessment,
	specializedServices,
	homeProcess,
	homePage,
] = await Promise.all([
	readFile(join(root, "src", "styles", "global.css"), "utf8"),
	readFile(join(root, "src", "components", "home", "HomeHero.astro"), "utf8"),
	readFile(
		join(root, "src", "components", "home", "HomeServicePaths.astro"),
		"utf8",
	),
	readFile(
		join(root, "src", "components", "home", "HomeSpecializedServices.astro"),
		"utf8",
	),
	readFile(
		join(root, "src", "components", "home", "HomeProcess.astro"),
		"utf8",
	),
	readFile(join(root, "src", "pages", "[locale]", "index.astro"), "utf8"),
]);

if (
	!globalStyles.includes(
		"body:has(.consultancy-hero) main.site-shell {\n\tmax-width: 88rem;",
	)
) {
	failures.push("home density: desktop shell must use a max width of 88rem");
}

for (const [source, marker] of [
	[homeHero, "padding-bottom: 4.5rem"],
	[assessment, "calc((100vw - 88rem) / 2)"],
	[specializedServices, "padding-top: clamp(4.5rem, 6vw, 6.5rem)"],
	[homeProcess, "padding-block: clamp(4.5rem, 7vw, 6.5rem)"],
	[
		homePage,
		"padding: clamp(3.5rem, 6vw, 5.25rem) max(1rem, calc((100vw - 88rem) / 2))",
	],
]) {
	if (!source.includes(marker)) {
		failures.push(`home density: missing compact desktop rule ${marker}`);
	}
}

for (const marker of [
	'import TechnologyMarquee from "@/components/common/TechnologyMarquee.astro"',
	"<HomeSpecializedServices",
	"<TechnologyMarquee",
	"<HomeProcess",
	'headingId="home-technologies-title"',
	"page.skills.eyebrow",
	"page.skills.title",
	"page.skills.pauseLabel",
]) {
	if (!homePage.includes(marker)) {
		failures.push(`home technology marquee: missing ${marker}`);
	}
}

const servicesIndex = homePage.indexOf("<HomeSpecializedServices");
const marqueeIndex = homePage.indexOf("<TechnologyMarquee");
const processIndex = homePage.indexOf("<HomeProcess");
if (!(servicesIndex < marqueeIndex && marqueeIndex < processIndex)) {
	failures.push("home technology marquee: incorrect section order");
}

for (const locale of ["en", "es"]) {
	const translations = JSON.parse(
		await readFile(join(root, "src", "i18n", `${locale}.json`), "utf8"),
	);
	const page = translations.home?.page;

	for (const path of requiredPaths) {
		const value = getPath(page, path);
		if (
			value == null ||
			value === "" ||
			(Array.isArray(value) && !value.length)
		) {
			failures.push(`${locale}: missing home.page.${path}`);
		}
	}

	const servicePaths = page?.servicePaths?.items ?? [];
	if (servicePaths.length !== 3) {
		failures.push(`${locale}: expected exactly three service paths`);
	}

	const consultancyServices = page?.serviceSelector?.items ?? [];
	if (consultancyServices.length !== 6) {
		failures.push(`${locale}: expected exactly six consultancy service areas`);
	}

	const assessmentItems = page?.assessment?.items ?? [];
	if (assessmentItems.length !== 3) {
		failures.push(`${locale}: expected exactly three assessment steps`);
	}

	const specializedServices = page?.specializedServices?.items ?? [];
	if (specializedServices.length !== 3) {
		failures.push(`${locale}: expected exactly three specialized services`);
	}

	const processSteps = page?.process?.steps ?? [];
	if (processSteps.length !== 3) {
		failures.push(`${locale}: expected exactly three process steps`);
	}

	const outputPath = join(root, "dist", "client", locale, "index.html");
	if (verifyGeneratedOutput) {
		try {
			await access(outputPath);
			const html = await readFile(outputPath, "utf8");
			const expectedMarkers =
				locale === "es"
					? [
							"Consultoría informática para mejorar",
							"Solicitar valoración gratuita",
							"Nuestros servicios especializados",
							"/es/contact",
							"/es/services",
						]
					: [
							"IT consulting to improve",
							"Request a free assessment",
							"Our specialized services",
							"/en/contact",
							"/en/services",
						];

			for (const marker of expectedMarkers) {
				if (!html.includes(marker)) {
					failures.push(`${locale}: generated home is missing ${marker}`);
				}
			}
		} catch {
			failures.push(`${locale}: generated home is missing`);
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("Home conversion verification passed.");
}
