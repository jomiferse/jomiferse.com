import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const phases = [
	"copy",
	"shell",
	"contact",
	"exit",
	"cookies",
	"project",
	"dist",
];
const phaseArgument = process.argv.find((value) => value.startsWith("--phase="));
const requestedPhase = phaseArgument?.split("=")[1] ?? "project";
const requestedIndex = phases.indexOf(requestedPhase);
const verifyDist = process.argv.includes("--dist") || requestedPhase === "dist";

if (requestedIndex < 0) {
	throw new Error(`Unknown popup phase: ${requestedPhase}`);
}

const includesPhase = (phase) => phases.indexOf(phase) <= requestedIndex;
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

if (includesPhase("copy")) {
	for (const locale of ["es", "en"]) {
		const dictionary = JSON.parse(
			await readSource("src", "i18n", `${locale}.json`),
		);
		for (const [group, keys] of Object.entries({
			contact: [
				"eyebrow",
				"title",
				"description",
				"close",
				"submit",
				"submitting",
				"successTitle",
				"successText",
				"validationError",
				"deliveryError",
				"whatsapp",
			],
			exitIntent: [
				"eyebrow",
				"genericTitle",
				"serviceTitle",
				"projectTitle",
				"articleTitle",
				"description",
				"pointOne",
				"pointTwo",
				"primary",
				"whatsapp",
				"dismiss",
				"close",
			],
		})) {
			for (const key of keys) {
				if (!dictionary.popups?.[group]?.[key]) {
					failures.push(`${locale}: missing popups.${group}.${key}`);
				}
			}
		}
	}
}

if (verifyDist) {
	const generatedHome = join(root, "dist", "client", "es", "index.html");
	try {
		await access(generatedHome);
	} catch {
		failures.push("generated Spanish home missing");
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.warn(`Popup system verification passed through ${requestedPhase}.`);

export { rejectMarkers, requireMarkers };
