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
	const projects = cv.projects?.items ?? [];

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

		if (!html.includes("CreativeWork")) {
			failures.push(`${route}: missing CreativeWork structured data`);
		}
		if (html.includes("SoftwareApplication")) {
			failures.push(`${route}: obsolete SoftwareApplication structured data`);
		}

		for (const marker of [
			project.clientLabel,
			project.sector,
			project.caseStudy?.outcome,
			"sourceCategory=project",
			`sourcePath=%2F${locale}%2Fprojects%2F${project.slug}%2F`,
		]) {
			if (marker && !html.includes(marker)) {
				failures.push(`${route}: missing ${marker}`);
			}
		}

		const serviceSlug = project.caseStudy?.serviceHref
			?.split("/")
			.filter(Boolean)
			.at(-1);
		if (serviceSlug && !html.includes(`service=${serviceSlug}`)) {
			failures.push(`${route}: missing related service contact context`);
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("Project page verification passed.");
}
