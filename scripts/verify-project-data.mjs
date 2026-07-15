import { readFile } from "node:fs/promises";

const locales = ["en", "es"];
const failures = [];
const projectsByLocale = {};
const canonicalServiceHrefs = {
	en: new Set([
		"/en/services/backend-spring-boot/",
		"/en/services/custom-software/",
		"/en/services/internal-tools/",
		"/en/services/maintenance-and-technical-support/",
	]),
	es: new Set([
		"/es/services/backend-spring-boot/",
		"/es/services/software-a-medida/",
		"/es/services/internal-tools/",
		"/es/services/mantenimiento-y-soporte-tecnico/",
	]),
};
const requiredProjectPaths = [
	"id",
	"slug",
	"clientLabel",
	"sector",
	"summary",
	"impact",
	"caseStudy.problem",
	"caseStudy.decisions",
	"caseStudy.delivered",
	"caseStudy.outcome",
	"caseStudy.serviceHref",
	"img.imgStatic.src",
	"technologies",
];

const getPath = (value, path) =>
	path.split(".").reduce((current, key) => current?.[key], value);

for (const locale of locales) {
	const file = new URL(`../src/data/cv.${locale}.json`, import.meta.url);
	const cv = JSON.parse(await readFile(file, "utf8"));
	const projects = cv.projects?.items;

	if (!Array.isArray(projects)) {
		failures.push(`${locale}: projects.items must be an array`);
		projectsByLocale[locale] = [];
		continue;
	}

	projectsByLocale[locale] = projects;

	if ("company" in cv.projects || "personal" in cv.projects) {
		failures.push(
			`${locale}: legacy company/personal project collections remain`,
		);
	}

	if (projects.length !== 7) {
		failures.push(`${locale}: expected 7 projects, found ${projects.length}`);
	}

	const ids = projects.map((project) => project.id);
	if (new Set(ids).size !== ids.length) {
		failures.push(`${locale}: project ids must be unique`);
	}

	for (const project of projects) {
		for (const path of requiredProjectPaths) {
			const value = getPath(project, path);
			if (
				value === undefined ||
				value === null ||
				value === "" ||
				(Array.isArray(value) && value.length === 0)
			) {
				failures.push(
					`${locale}/${project.id ?? project.title}: missing ${path}`,
				);
			}
		}

		if ("companyRelated" in project) {
			failures.push(`${locale}/${project.id}: obsolete companyRelated field`);
		}

		if (!canonicalServiceHrefs[locale].has(project.caseStudy.serviceHref)) {
			failures.push(
				`${locale}/${project.id}: noncanonical serviceHref ${project.caseStudy.serviceHref}`,
			);
		}

		if (
			["betx", "cv-studio"].includes(project.id) &&
			/(proyecto personal|personal project|github\.com)/i.test(
				JSON.stringify(project),
			)
		) {
			failures.push(
				`${locale}/${project.id}: personal-project or GitHub copy remains`,
			);
		}
	}

	const getYourTicket = projects.find(
		(project) => project.id === "getyourticket-ticketing-platform",
	);
	if (!getYourTicket) {
		failures.push(`${locale}: missing getyourticket-ticketing-platform`);
	} else {
		const content = JSON.stringify(getYourTicket);
		for (const marker of [
			/attendize/i,
			/docker/i,
			/vps/i,
			/certbot/i,
			/stripe/i,
			/(registro|registration)/i,
			/(mantenimiento|maintenance)/i,
			/(10|ten)/i,
			/(1[.,]000|1000|one thousand)/i,
		]) {
			if (!marker.test(content)) {
				failures.push(
					`${locale}/getyourticket-ticketing-platform: missing ${marker}`,
				);
			}
		}

		if (getYourTicket.link !== "https://www.getyourticket.es/") {
			failures.push(
				`${locale}/getyourticket-ticketing-platform: unexpected public link`,
			);
		}
	}
}

const publishedProjectContent = [
	{
		path: "../src/content/blog/en/building-cv-studio.md",
		forbidden: [/personal project/i, /github\.com\/jomiferse\/cv-studio/i],
	},
	{
		path: "../src/content/blog/es/creando-cv-studio.md",
		forbidden: [/proyecto personal/i, /github\.com\/jomiferse\/cv-studio/i],
	},
	{
		path: "../src/content/blog/en/how-i-built-an-automated-betting-system-in-java.md",
		forbidden: [
			/personal project/i,
			/backtesting/i,
			/paper trading/i,
			/closing line value|\bclv\b/i,
		],
	},
	{
		path: "../src/content/blog/es/como-construi-un-sistema-automatizado-de-apuestas-en-java.md",
		forbidden: [
			/proyecto personal/i,
			/backtesting/i,
			/paper trading/i,
			/closing line value|\bclv\b/i,
		],
	},
];

for (const publishedFile of publishedProjectContent) {
	const file = new URL(publishedFile.path, import.meta.url);
	const content = await readFile(file, "utf8");
	for (const pattern of publishedFile.forbidden) {
		if (pattern.test(content)) {
			failures.push(
				`${publishedFile.path}: contradictory project copy matches ${pattern}`,
			);
		}
	}
}

const enIds = new Set((projectsByLocale.en ?? []).map((project) => project.id));
const esIds = new Set((projectsByLocale.es ?? []).map((project) => project.id));
if (
	enIds.size !== esIds.size ||
	[...enIds].some((projectId) => !esIds.has(projectId))
) {
	failures.push("en/es: project id sets must match");
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("Project data verification passed.");
}
