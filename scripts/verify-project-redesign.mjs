import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const verifyGeneratedOutput = process.argv.includes("--dist");

const readSource = async (...parts) => {
	const path = join(root, ...parts);

	try {
		return await readFile(path, "utf8");
	} catch {
		failures.push(`missing source: ${parts.join("/")}`);
		return "";
	}
};

const getPath = (value, path) =>
	path.split(".").reduce((current, key) => current?.[key], value);

const archive = await readSource("src", "pages", "[locale]", "projects.astro");
const detail = await readSource(
	"src",
	"pages",
	"[locale]",
	"projects",
	"[project].astro",
);
const card = await readSource(
	"src",
	"components",
	"projects",
	"ProjectArchiveCard.astro",
);
const carousel = await readSource(
	"src",
	"components",
	"projects",
	"ProjectCarousel.astro",
);
const serviceCard = await readSource(
	"src",
	"components",
	"projects",
	"ProjectServiceCard.astro",
);
const technologyGrid = await readSource(
	"src",
	"components",
	"common",
	"TechnologyGrid.astro",
);
const globalStyles = await readSource("src", "styles", "global.css");
const cvByLocale = Object.fromEntries(
	await Promise.all(
		["en", "es"].map(async (locale) => [
			locale,
			JSON.parse(await readSource("src", "data", `cv.${locale}.json`)),
		]),
	),
);

if (
	!globalStyles.includes(
		"body:has(.projects-page) main.site-shell {\n\tmax-width: 88rem;\n}",
	)
) {
	failures.push("projects layout: wide shell must be scoped to main content");
}

if (
	!globalStyles.includes(
		".projects-page .eyebrow {\n\tcolor: var(--action);\n}",
	)
) {
	failures.push("projects palette: eyebrows must use the action color");
}

if (card.includes("project.role")) {
	failures.push("card: project roles must not be shown in archive cards");
}

if (card.includes("project.companyRelated")) {
	failures.push(
		"card: project organizations must not be shown in archive cards",
	);
}

if (
	card.includes("project.technologies") ||
	card.includes("visibleTechnologies") ||
	card.includes("hiddenTechnologyCount")
) {
	failures.push("card: technologies must not be shown in archive cards");
}

for (const marker of [
	"project.sector",
	"project.caseStudy.problem",
	"project.impact",
	"copy.outcomeLabel",
]) {
	if (!card.includes(marker)) {
		failures.push(`card: missing client-oriented marker ${marker}`);
	}
}

for (const marker of ["project.technicalView", "copy.technicalView"]) {
	if (detail.includes(marker)) {
		failures.push(`detail: obsolete technical view marker ${marker}`);
	}
}

if (!detail.includes("ProjectServiceCard")) {
	failures.push("detail: missing ProjectServiceCard component");
}

if (!detail.includes("ConversionCta")) {
	failures.push("detail CTA: shared ConversionCta component is required");
}

for (const marker of [".conversion-cta {", ".dark .conversion-cta {"]) {
	if (!globalStyles.includes(marker)) {
		failures.push(`detail CTA: missing shared background style ${marker}`);
	}
}

if (detail.includes("<aside")) {
	failures.push("detail: project service sidebar must not remain inline");
}

for (const marker of [
	"data-project-service-card",
	"data-project-service-action",
	"button-action",
	"arrow-right",
	"move-up-right",
	"TechnologyGrid",
	"<TechnologyGrid",
]) {
	if (!serviceCard.includes(marker)) {
		failures.push(`service card: missing ${marker}`);
	}
}

for (const marker of [
	"data-project-technology-list",
	"getTechnologyIcon",
	'"springboot"',
	'"docker"',
	'"kubernetes"',
	'"postgresql"',
	'"rabbitmq"',
	'"apachekafka"',
	'"liquibase"',
	'"globe"',
	'"git-branch"',
	'"cloud"',
	'"layers"',
	'"code"',
]) {
	if (!technologyGrid.includes(marker)) {
		failures.push(`technology grid: missing ${marker}`);
	}
}

if (
	serviceCard.indexOf("data-project-service-action") >
	serviceCard.indexOf("<TechnologyGrid")
) {
	failures.push(
		"service card: related service action must precede technologies",
	);
}

for (const [sourceName, source] of [
	["archive", archive],
	["detail", detail],
]) {
	if (!source.includes("BaseLayout")) {
		failures.push(`${sourceName}: must use the shared BaseLayout`);
	}
	if (source.includes("Header.astro") || source.includes("Footer.astro")) {
		failures.push(
			`${sourceName}: must not create project-specific site chrome`,
		);
	}
}

for (const [sourceName, source, markers] of [
	[
		"archive",
		archive,
		["projects-page", "ProjectCarousel", "var(--home-navy)", "var(--action)"],
	],
	[
		"card",
		card,
		["aspect-[16/9]", "line-clamp-3", "viewLabel", "var(--action)"],
	],
	[
		"carousel",
		carousel,
		[
			"data-project-carousel",
			"snap-x",
			"aria-controls",
			"sm:grid-cols-2",
			"lg:grid-cols-3",
			"prefers-reduced-motion",
		],
	],
	[
		"detail",
		detail,
		[
			"projects-page",
			"project.clientLabel",
			"project.sector",
			"caseStudy?.problem",
			"caseStudy?.decisions",
			"caseStudy?.delivered",
			"caseStudy?.outcome",
			"getProjectContactHref",
			"var(--home-navy)",
			"var(--action)",
		],
	],
]) {
	for (const marker of markers) {
		if (!source.includes(marker)) {
			failures.push(`${sourceName}: missing ${marker}`);
		}
	}
}

for (const marker of [
	'kind === "personal"',
	"buildSoftwareApplication",
	"project.companyRelated",
	"project.role ?",
]) {
	if (archive.includes(marker) || detail.includes(marker)) {
		failures.push(`projects: obsolete client-case marker ${marker}`);
	}
}

for (const locale of ["en", "es"]) {
	const translations = JSON.parse(
		await readSource("src", "i18n", `${locale}.json`),
	);
	const cv = cvByLocale[locale];

	for (const path of [
		"projects.page.viewCase",
		"projects.page.outcomeLabel",
		"projects.page.carouselPrevious",
		"projects.page.carouselNext",
		"projects.page.carouselPosition",
		"projects.detail.challenge",
		"projects.detail.solution",
		"projects.detail.delivered",
		"projects.detail.outcome",
		"projects.detail.client",
		"projects.detail.sector",
		"projects.detail.caseLabel",
		"projects.detail.cta.eyebrow",
		"projects.detail.cta.title",
		"projects.detail.cta.text",
		"projects.detail.cta.primary",
		"projects.detail.cta.secondary",
		"projects.detail.serviceCard.eyebrow",
		"projects.detail.serviceCard.body",
	]) {
		if (!getPath(translations, path)) {
			failures.push(`${locale}: missing ${path}`);
		}
	}

	const projects = [...(cv.projects?.items ?? [])];
	if (getPath(translations, "projects.detail.technicalView")) {
		failures.push(`${locale}: obsolete projects.detail.technicalView copy`);
	}
	for (const path of [
		"projects.detail.context",
		"projects.detail.contribution",
		"projects.detail.decisions",
		"projects.detail.role",
		"projects.detail.organization",
	]) {
		if (getPath(translations, path)) {
			failures.push(`${locale}: obsolete ${path} copy`);
		}
	}

	for (const project of projects) {
		if (project.technicalView) {
			failures.push(`${locale}/${project.id}: obsolete technicalView data`);
		}
		for (const path of [
			"clientLabel",
			"sector",
			"impact",
			"caseStudy.outcome",
		]) {
			if (!getPath(project, path)) {
				failures.push(`${locale}/${project.id}: missing ${path}`);
			}
		}
		if (project.companyRelated) {
			failures.push(`${locale}/${project.id}: obsolete companyRelated data`);
		}
	}

	for (const project of projects) {
		const id = project.id;
		const imageSrc = project?.img?.imgStatic?.src;

		if (!imageSrc) {
			failures.push(`${locale}/${id}: missing project image`);
			continue;
		}

		try {
			await access(join(root, "public", imageSrc.replace(/^\/+/, "")));
		} catch {
			failures.push(`${locale}/${id}: project image file is missing`);
		}
	}

	if (!verifyGeneratedOutput) continue;

	const archiveOutput = join(
		root,
		"dist",
		"client",
		locale,
		"projects",
		"index.html",
	);

	try {
		await access(archiveOutput);
		const html = await readFile(archiveOutput, "utf8");
		if (!html.includes("data-project-carousel")) {
			failures.push(`${locale}: generated project archive is not redesigned`);
		}
	} catch {
		failures.push(`${locale}: generated project archive is missing`);
	}

	for (const project of projects) {
		const output = join(
			root,
			"dist",
			"client",
			locale,
			"projects",
			project.slug,
			"index.html",
		);

		try {
			await access(output);
			const html = await readFile(output, "utf8");
			if (!html.includes("data-conversion-cta")) {
				failures.push(
					`${locale}/${project.slug}: project CTA marker is missing`,
				);
			}
			if (!html.includes("sourceCategory=project")) {
				failures.push(`${locale}/${project.slug}: project source is missing`);
			}
			if (
				!html.includes(
					`sourcePath=%2F${locale}%2Fprojects%2F${project.slug}%2F`,
				)
			) {
				failures.push(
					`${locale}/${project.slug}: project source path is missing`,
				);
			}
			if (!html.includes("data-project-service-card")) {
				failures.push(`${locale}/${project.slug}: service card is missing`);
			}
			if (
				project.caseStudy?.serviceHref &&
				!html.includes("data-project-service-action")
			) {
				failures.push(`${locale}/${project.slug}: service action is missing`);
			}
			if (project.link && !html.includes("data-project-external-action")) {
				failures.push(`${locale}/${project.slug}: external action is missing`);
			}
		} catch {
			failures.push(
				`${locale}/${project.slug}: generated project detail is missing`,
			);
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("Project redesign verification passed.");
}
