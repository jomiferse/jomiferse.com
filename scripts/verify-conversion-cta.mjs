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

const component = await readSource(
	"src",
	"components",
	"common",
	"ConversionCta.astro",
);
const globalStyles = await readSource("src", "styles", "global.css");
const projectDetail = await readSource(
	"src",
	"pages",
	"[locale]",
	"projects",
	"[project].astro",
);
const home = await readSource("src", "pages", "[locale]", "index.astro");
const standardConsumers = [
	["about", "src/pages/[locale]/about.astro"],
	["education", "src/pages/[locale]/education.astro"],
	["blog index", "src/pages/[locale]/blog/index.astro"],
	["blog pagination", "src/pages/[locale]/blog/page/[page].astro"],
	["blog posts", "src/layouts/BlogPostLayout.astro"],
	["services index", "src/pages/[locale]/services.astro"],
	["commercial landings", "src/pages/[locale]/[landing].astro"],
];

for (const marker of [
	"interface PrimaryCtaAction",
	"interface SecondaryCtaAction",
	"data-conversion-cta",
	"data-conversion-primary",
	"data-conversion-secondary",
	"data-contact-modal-open",
	"aria-labelledby={headingId}",
	'Icon name="arrow-right"',
	'Icon name="move-up-right"',
	"button-action",
	"button-secondary",
	"noopener noreferrer nofollow",
]) {
	if (!component.includes(marker))
		failures.push(`component: missing ${marker}`);
}

for (const marker of [".conversion-cta {", ".dark .conversion-cta {"]) {
	if (!globalStyles.includes(marker))
		failures.push(`styles: missing ${marker}`);
}

if (!projectDetail.includes("ConversionCta")) {
	failures.push("project detail: shared CTA is not used");
}
if (projectDetail.includes("project-detail-cta")) {
	failures.push("project detail: obsolete CTA implementation remains");
}

for (const [name, path] of standardConsumers) {
	const source = await readSource(...path.split("/"));
	if (!source.includes("ConversionCta")) {
		failures.push(`${name}: shared CTA is not used`);
	}
}

const legacyWrappers = [
	["about", "about-cta"],
	["education", "section-band section-reveal py-16 text-center md:py-24"],
	["blog index", "section-band section-reveal py-16 text-center md:py-20"],
	["blog pagination", "section-band section-reveal py-16 text-center md:py-20"],
	["blog posts", "section-band mt-20 rounded-3xl"],
	["services index", "section-band section-reveal py-20 text-center md:py-28"],
	["commercial landings", "section-reveal py-16 text-center md:py-28"],
];

for (const [name, marker] of legacyWrappers) {
	const path = standardConsumers.find(([consumer]) => consumer === name)?.[1];
	if (!path) continue;
	const source = await readSource(...path.split("/"));
	if (source.includes(marker)) {
		failures.push(`${name}: legacy CTA wrapper remains`);
	}
}

for (const locale of ["en", "es"]) {
	const translations = JSON.parse(
		await readSource("src", "i18n", `${locale}.json`),
	);
	if (!translations.blog.page.cta.eyebrow) {
		failures.push(`${locale}: missing blog.page.cta.eyebrow`);
	}
	if (!translations.services.hub.ctaEyebrow) {
		failures.push(`${locale}: missing services.hub.ctaEyebrow`);
	}
}

if (!home.includes("home-final-cta")) {
	failures.push("home: special CTA is missing");
}
if (home.includes("ConversionCta")) {
	failures.push("home: shared CTA must not replace the special CTA");
}
if (globalStyles.includes(".about-cta")) {
	failures.push("styles: obsolete .about-cta remains");
}

if (verifyGeneratedOutput) {
	const output = join(
		root,
		"dist",
		"client",
		"es",
		"projects",
		"betx",
		"index.html",
	);
	try {
		await access(output);
		const html = await readFile(output, "utf8");
		if (!html.includes("data-conversion-cta")) {
			failures.push("dist: project CTA marker is missing");
		}
	} catch {
		failures.push("dist: representative project page is missing");
	}

	const generatedConsumers = [
		["about", ["es", "about", "index.html"]],
		["education", ["en", "education", "index.html"]],
		["blog index", ["es", "blog", "index.html"]],
		["blog pagination", ["en", "blog", "page", "2", "index.html"]],
		[
			"blog post",
			[
				"es",
				"blog",
				"que-debe-tener-web-profesional-para-captar-clientes",
				"index.html",
			],
		],
		["services index", ["en", "services", "index.html"]],
		["commercial landing", ["es", "software-a-medida-pymes", "index.html"]],
	];

	for (const [name, parts] of generatedConsumers) {
		const output = join(root, "dist", "client", ...parts);
		try {
			await access(output);
			const html = await readFile(output, "utf8");
			if (!html.includes("data-conversion-cta")) {
				failures.push(`dist ${name}: shared CTA marker is missing`);
			}
		} catch {
			failures.push(`dist ${name}: generated page is missing`);
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("Shared conversion CTA verification passed.");
}
