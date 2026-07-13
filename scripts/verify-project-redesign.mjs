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

for (const marker of ["project.technicalView", "copy.technicalView"]) {
	if (detail.includes(marker)) {
		failures.push(`detail: obsolete technical view marker ${marker}`);
	}
}

if (!detail.includes("ProjectServiceCard")) {
	failures.push("detail: missing ProjectServiceCard component");
}

if (!detail.includes("data-project-detail-cta")) {
	failures.push("detail CTA: missing stable CTA marker");
}

for (const marker of [
	".project-detail-cta {",
	"background:",
	".dark .project-detail-cta {",
]) {
	if (!globalStyles.includes(marker)) {
		failures.push(`detail CTA: missing explicit background style ${marker}`);
	}
}

if (detail.includes("<aside")) {
	failures.push("detail: project service sidebar must not remain inline");
}

for (const marker of [
	"data-project-service-card",
	"data-project-service-action",
	"data-project-technology-list",
	"button-action",
	"arrow-right",
	"move-up-right",
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
	if (!serviceCard.includes(marker)) {
		failures.push(`service card: missing ${marker}`);
	}
}

if (
	serviceCard.indexOf("data-project-service-action") >
	serviceCard.indexOf("data-project-technology-list")
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
			"caseStudy?.problem",
			"caseStudy?.decisions",
			"caseStudy?.delivered",
			"contact?service=assessment",
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

for (const locale of ["en", "es"]) {
	const translations = JSON.parse(
		await readSource("src", "i18n", `${locale}.json`),
	);
	const cv = cvByLocale[locale];

	for (const path of [
		"projects.page.viewCase",
		"projects.page.carouselPrevious",
		"projects.page.carouselNext",
		"projects.page.carouselPosition",
		"projects.detail.challenge",
		"projects.detail.outcome",
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

	const projects = [
		...(cv.projects?.company ?? []),
		...(cv.projects?.personal ?? []),
	];
	if (getPath(translations, "projects.detail.technicalView")) {
		failures.push(`${locale}: obsolete projects.detail.technicalView copy`);
	}

	for (const project of projects) {
		if (project.technicalView) {
			failures.push(`${locale}/${project.id}: obsolete technicalView data`);
		}
	}

	for (const id of ["betx", "realtime-websocket-gateway"]) {
		const project = projects.find((item) => item.id === id);
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
			if (!html.includes(`/${locale}/contact?service=assessment`)) {
				failures.push(`${locale}/${project.slug}: project CTA is missing`);
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
