import { readFile } from "node:fs/promises";

const locales = ["en", "es"];
const failures = [];

for (const locale of locales) {
	const file = new URL(`../src/data/cv.${locale}.json`, import.meta.url);
	const cv = JSON.parse(await readFile(file, "utf8"));
	const projects = [
		...(cv.projects?.company ?? []),
		...(cv.projects?.personal ?? []),
	];

	for (const project of projects) {
		if (!project.id) failures.push(`${locale}: ${project.title} is missing id`);
		if (!project.slug)
			failures.push(`${locale}: ${project.title} is missing slug`);
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("Project data verification passed.");
}
