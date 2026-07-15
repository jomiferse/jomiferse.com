import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const requestedPhase =
	process.argv
		.find((argument) => argument.startsWith("--phase="))
		?.split("=")[1] ?? "source";
const sourcePhases = [
	"nav",
	"privacy-copy",
	"privacy-page",
	"education-copy",
	"education-cards",
	"education-page",
];
const allowedPhases = [...sourcePhases, "source", "dist"];

if (!allowedPhases.includes(requestedPhase)) {
	throw new Error(`Unknown privacy/education phase: ${requestedPhase}`);
}

const failures = [];
const includesPhase = (phase) =>
	requestedPhase === phase ||
	requestedPhase === "source" ||
	requestedPhase === "dist";
const readSource = (...parts) => readFile(join(root, ...parts), "utf8");
const requireMarkers = (label, source, markers) => {
	for (const marker of markers) {
		if (!source.includes(marker)) failures.push(`${label}: missing ${marker}`);
	}
};
const rejectMarkers = (label, source, markers) => {
	for (const marker of markers) {
		if (source.includes(marker)) failures.push(`${label}: contains ${marker}`);
	}
};

if (includesPhase("nav")) {
	const sectionToc = await readSource(
		"src",
		"components",
		"common",
		"SectionToc.astro",
	).catch(() => "");
	const blogToc = await readSource(
		"src",
		"components",
		"common",
		"BlogArticleToc.astro",
	);
	requireMarkers("generic section navigation", sectionToc, [
		"data-section-toc",
		'setAttribute("aria-current", "location")',
		"IntersectionObserver",
		"prefers-reduced-motion",
		"max-h-[calc(100svh-7.5rem)]",
	]);
	requireMarkers("blog navigation wrapper", blogToc, [
		"SectionToc",
		"headings",
		"currentLabel",
	]);
}

for (const locale of ["es", "en"]) {
	const dictionary = JSON.parse(
		await readSource("src", "i18n", `${locale}.json`),
	);
	if (includesPhase("privacy-copy")) {
		for (const key of [
			"updated",
			"summary",
			"navigation",
			"sections",
			"storageTable",
			"actions",
		]) {
			if (!dictionary.privacy?.[key]) {
				failures.push(`${locale}: missing privacy.${key}`);
			}
		}
		for (const key of [
			"controller",
			"data",
			"purposes",
			"retention",
			"providers",
			"transfers",
			"rights",
			"cookies",
			"withdraw",
		]) {
			if (!dictionary.privacy?.sections?.[key]) {
				failures.push(`${locale}: missing privacy.sections.${key}`);
			}
		}
		for (const storageKey of [
			"theme",
			"jomiferse.cookie-consent.v1",
			"jomiferse.exit-intent.v2",
			"_ga",
			"_ga_<container-id>",
		]) {
			if (
				!dictionary.privacy?.storageTable?.rows?.some(
					(row) => row.name === storageKey,
				)
			) {
				failures.push(`${locale}: missing privacy storage entry ${storageKey}`);
			}
		}
	}
	if (includesPhase("education-copy")) {
		for (const key of [
			"summary",
			"applied",
			"certifications",
			"education",
			"cta",
		]) {
			if (!dictionary.education?.page?.[key]) {
				failures.push(`${locale}: missing education.page.${key}`);
			}
		}
		if (dictionary.education?.page?.applied?.items?.length !== 3) {
			failures.push(
				`${locale}: education applied section must contain three items`,
			);
		}
	}
}

if (includesPhase("privacy-page")) {
	const privacy = await readSource("src", "pages", "[locale]", "privacy.astro");
	requireMarkers("privacy page", privacy, [
		"SectionToc",
		"data-privacy-page",
		"data-privacy-summary",
		"data-privacy-storage-table",
		"data-cookie-settings-trigger",
		"cv.email",
		"noindex",
	]);
	rejectMarkers("privacy commercial palette", privacy, ["var(--accent"]);
}

if (includesPhase("education-cards")) {
	const certification = await readSource(
		"src",
		"components",
		"cards",
		"CertificationCard.astro",
	);
	const education = await readSource(
		"src",
		"components",
		"cards",
		"EducationCard.astro",
	);
	requireMarkers("certification record", certification, [
		"data-certification-record",
		"button-secondary",
		"opensNewWindow",
	]);
	requireMarkers("education record", education, [
		"data-education-record",
		"data-education-period",
	]);
	rejectMarkers("certification commercial palette", certification, [
		"dark-card",
		"hover-card",
		"var(--accent",
	]);
	rejectMarkers("education commercial palette", education, [
		"dark-card",
		"hover-card",
		"var(--accent",
	]);
}

if (includesPhase("education-page")) {
	const education = await readSource(
		"src",
		"pages",
		"[locale]",
		"education.astro",
	);
	requireMarkers("education page", education, [
		"data-education-page",
		"certifications.length",
		"education.length",
		"data-applied-learning",
		"CertificationCard",
		"EducationCard",
		"href: `/${locale}/projects`",
		"href: `/${locale}/about`",
	]);
	rejectMarkers("education commercial palette", education, ["var(--accent"]);
}

if (requestedPhase === "dist") {
	for (const locale of ["es", "en"]) {
		for (const route of ["privacy", "education"]) {
			const output = join(root, "dist", "client", locale, route, "index.html");
			try {
				await access(output);
				const html = await readFile(output, "utf8");
				if (!html.includes(`data-${route}-page`)) {
					failures.push(`/${locale}/${route}: missing page marker`);
				}
				if (route === "privacy" && !html.includes('content="noindex,follow"')) {
					failures.push(`/${locale}/privacy: missing noindex`);
				}
			} catch {
				failures.push(`/${locale}/${route}: generated route missing`);
			}
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

process.stdout.write(
	`Privacy and education redesign verification passed through ${requestedPhase}.\n`,
);
