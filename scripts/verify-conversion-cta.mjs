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
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("Shared conversion CTA verification passed.");
}
