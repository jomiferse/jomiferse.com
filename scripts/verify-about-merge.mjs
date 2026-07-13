import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const verifyGeneratedOutput = process.argv.includes("--dist");

const readSource = (...parts) => readFile(join(root, ...parts), "utf8");
const getPath = (value, path) =>
	path.split(".").reduce((current, key) => current?.[key], value);

const requiredAboutPaths = [
	"trustSignals",
	"help.eyebrow",
	"help.title",
	"help.intro",
	"help.items",
	"experience.eyebrow",
	"experience.title",
	"experience.intro",
	"experience.roleStacks",
	"workingStyle.eyebrow",
	"workingStyle.title",
	"workingStyle.items",
	"educationSummary.eyebrow",
	"educationSummary.title",
	"educationSummary.body",
	"cta.eyebrow",
	"cta.title",
	"cta.text",
	"cta.primary",
];

const header = await readSource("src", "components", "common", "Header.astro");
if (header.includes('{ href: "/experience"')) {
	failures.push(
		"header: Experience must not be an independent navigation item",
	);
}

const astroConfig = await readSource("astro.config.mjs");
for (const [source, destination] of [
	["/es/experience", "/es/about"],
	["/en/experience", "/en/about"],
]) {
	if (!astroConfig.includes(`"${source}": "${destination}"`)) {
		failures.push(
			`config: missing permanent redirect ${source} -> ${destination}`,
		);
	}
}

const aboutPage = await readSource("src", "pages", "[locale]", "about.astro");
for (const marker of ["getCv(locale)", "AboutHelp", "AboutExperience"]) {
	if (!aboutPage.includes(marker)) {
		failures.push(`about source: missing ${marker}`);
	}
}

const aboutComponents = await Promise.all([
	readSource("src", "components", "about", "AboutHelp.astro"),
	readSource("src", "components", "about", "AboutExperience.astro"),
]);
const aboutStyles = await readSource("src", "styles", "global.css");
const aboutStyleStart = aboutStyles.indexOf("body:has(.about-page)");
const aboutStyleEnd = aboutStyles.indexOf(".section-band", aboutStyleStart);
const aboutStyleBlock = aboutStyles.slice(aboutStyleStart, aboutStyleEnd);
const aboutSources = [aboutPage, ...aboutComponents, aboutStyleBlock];

if (
	!aboutStyles.includes(
		"body:has(.about-page) main.site-shell {\n\tmax-width: 88rem;\n}",
	)
) {
	failures.push("about density: wide shell must be scoped to main content");
}

for (const source of aboutSources) {
	for (const accent of [
		"var(--accent)",
		"var(--accent-strong)",
		"var(--accent-soft)",
		"var(--accent-line)",
	]) {
		if (source.includes(accent)) {
			failures.push(`about palette: cian accent ${accent} is still in use`);
		}
	}
}

if (!aboutSources.some((source) => source.includes("var(--home-navy)"))) {
	failures.push("about palette: headings must use the home navy variable");
}

if (!aboutSources.some((source) => source.includes("var(--action)"))) {
	failures.push("about palette: signals must use the home action variable");
}

if (!aboutStyleBlock.includes("max-width: 88rem")) {
	failures.push("about density: desktop shell must use a max width of 88rem");
}

for (const [source, utility] of [
	[aboutPage, "md:pb-18"],
	[aboutComponents[0], "md:py-20"],
	[aboutComponents[1], "md:py-20"],
	[aboutPage, "md:py-20"],
	[aboutPage, "md:py-18"],
	[aboutPage, "md:py-14"],
]) {
	if (!source.includes(utility)) {
		failures.push(`about density: missing desktop utility ${utility}`);
	}
}

for (const locale of ["en", "es"]) {
	const translations = JSON.parse(
		await readSource("src", "i18n", `${locale}.json`),
	);
	const page = translations.about?.page;

	for (const path of requiredAboutPaths) {
		const value = getPath(page, path);
		if (
			value == null ||
			value === "" ||
			(Array.isArray(value) && value.length === 0)
		) {
			failures.push(`${locale}: missing about.page.${path}`);
		}
	}

	if ((page?.trustSignals ?? []).length !== 4) {
		failures.push(`${locale}: expected four About trust signals`);
	}

	if ((page?.help?.items ?? []).length !== 4) {
		failures.push(`${locale}: expected four About help areas`);
	}

	if (verifyGeneratedOutput) {
		const outputPath = join(
			root,
			"dist",
			"client",
			locale,
			"about",
			"index.html",
		);
		try {
			await access(outputPath);
			const html = await readFile(outputPath, "utf8");
			const expectedMarkers =
				locale === "es"
					? [
							"Experiencia aplicada",
							"Cómo es trabajar conmigo",
							"Solicitar valoración gratuita",
						]
					: [
							"Applied experience",
							"What it is like to work with me",
							"Request a free assessment",
						];

			for (const marker of expectedMarkers) {
				if (!html.includes(marker)) {
					failures.push(`${locale}: generated About is missing ${marker}`);
				}
			}
		} catch {
			failures.push(`${locale}: generated About page is missing`);
		}

		const vercelConfig = JSON.parse(
			await readSource(".vercel", "output", "config.json"),
		);
		const redirect = vercelConfig.routes?.find(
			(route) =>
				route.src === `^/${locale}/experience$` &&
				route.status === 301 &&
				route.headers?.Location === `/${locale}/about`,
		);
		if (!redirect) {
			failures.push(`${locale}: Vercel Experience redirect is missing`);
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("About and experience merge verification passed.");
}
