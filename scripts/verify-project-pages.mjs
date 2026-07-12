import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];

for (const locale of ["en", "es"]) {
	const cv = JSON.parse(
		await readFile(
			new URL(`../src/data/cv.${locale}.json`, import.meta.url),
			"utf8",
		),
	);
	const projects = [
		...(cv.projects?.company ?? []),
		...(cv.projects?.personal ?? []),
	];

	for (const project of projects) {
		const route = `/${locale}/projects/${project.slug}/`;
		const outputPath = join(
			root,
			"dist",
			"client",
			locale,
			"projects",
			project.slug,
			"index.html",
		);

		let html = "";
		try {
			html = await readFile(outputPath, "utf8");
		} catch {
			failures.push(`${route}: generated page is missing`);
			continue;
		}

		for (const marker of [route, "BreadcrumbList"]) {
			if (!html.includes(marker)) failures.push(`${route}: missing ${marker}`);
		}

		if (
			!html.includes("SoftwareApplication") &&
			!html.includes("CreativeWork")
		) {
			failures.push(`${route}: missing project structured data`);
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("Project page verification passed.");
}
