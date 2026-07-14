import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const verifyGeneratedOutput = process.argv.includes("--dist");
const phaseArg = process.argv.find((arg) => arg.startsWith("--phase="));
const phase = phaseArg?.split("=")[1] ?? "all";
const includesPhase = (name) => phase === "all" || phase === name;
const readSource = async (...parts) => {
	try {
		return await readFile(join(root, ...parts), "utf8");
	} catch {
		failures.push(`missing source: ${parts.join("/")}`);
		return "";
	}
};
const requireMarkers = (label, source, markers) => {
	for (const marker of markers) {
		if (!source.includes(marker)) failures.push(`${label}: missing ${marker}`);
	}
};
const rejectMarkers = (label, source, markers) => {
	for (const marker of markers) {
		if (source.includes(marker)) failures.push(`${label}: forbidden ${marker}`);
	}
};

if (includesPhase("form")) {
	const form = await readSource(
		"src",
		"components",
		"forms",
		"ContactForm.astro",
	);
	const api = await readSource("src", "pages", "api", "contact.ts");
	requireMarkers("contact form", form, [
		'name="name"',
		'name="email"',
		'name="message"',
		'name="service"',
		'name="scope"',
		'name="sourceCategory"',
		'name="sourcePath"',
		"data-service-selection-summary",
		"contactForm.privacyNote",
		"contactForm.privacyLink",
		"button-action",
	]);
	rejectMarkers("contact form", form, [
		"<select",
		'type="file"',
		'name="projectType"',
		'name="attachment"',
		"projectTypes",
	]);
	requireMarkers("contact API", api, [
		"isValidEmail",
		'error: "missing"',
		'error: "send"',
		"result.error",
		"selectedServiceLabel",
		"selectedScopeLabel",
		"source.category",
	]);
	rejectMarkers("contact API", api, [
		"MAX_PDF_BYTES",
		"Buffer.from",
		"attachments",
		'form.get("projectType")',
		'form.get("attachment")',
		"Project type:",
	]);
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.log(`Contact redesign verification passed through ${phase}.`);
