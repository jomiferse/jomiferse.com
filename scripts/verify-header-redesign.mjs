import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const phases = ["copy", "structure", "styles", "behavior"];
const phaseArg = process.argv.find((value) => value.startsWith("--phase="));
const requestedPhase = phaseArg?.split("=")[1] ?? "behavior";
const requestedIndex = phases.indexOf(requestedPhase);
const verifyDist = process.argv.includes("--dist");

if (requestedIndex < 0) throw new Error(`Unknown phase: ${requestedPhase}`);

const includesPhase = (name) => phases.indexOf(name) <= requestedIndex;
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
const requireOrder = (label, source, markers) => {
	let previous = -1;
	for (const marker of markers) {
		const current = source.indexOf(marker);
		if (current < 0) failures.push(`${label}: missing ${marker}`);
		else if (current <= previous)
			failures.push(`${label}: wrong order ${marker}`);
		previous = current;
	}
};

if (includesPhase("copy")) {
	for (const locale of ["es", "en"]) {
		const dictionary = JSON.parse(
			await readSource("src", "i18n", `${locale}.json`),
		);
		for (const key of [
			"role",
			"availability",
			"preferences",
			"assessmentCta",
		]) {
			if (!dictionary.header?.[key]) {
				failures.push(`${locale}: missing header.${key}`);
			}
		}
	}
}

if (includesPhase("structure")) {
	const header = await readSource(
		"src",
		"components",
		"common",
		"Header.astro",
	);
	const mobile = await readSource(
		"src",
		"components",
		"common",
		"MobileHeaderMenu.astro",
	);
	requireMarkers("header", header, [
		"data-site-header",
		"data-header-inner",
		"data-menu-open",
		'aria-controls="mobile-header-menu"',
		"MobileHeaderMenu",
		"button-action",
		"header.assessmentCta",
		"contact?service=assessment",
	]);
	requireOrder("desktop navigation", header, [
		'labelKey: "nav.home"',
		'labelKey: "nav.services"',
		'labelKey: "nav.projects"',
		'labelKey: "nav.about"',
		'labelKey: "nav.blog"',
	]);
	requireMarkers("mobile menu", mobile, [
		'id="mobile-header-menu"',
		"data-mobile-menu",
		"data-menu-panel",
		"data-menu-close",
		'role="dialog"',
		'aria-modal="true"',
		"mobile-header-menu__link-index",
		"ThemeToggle",
		"LanguageToggle",
		"button-action",
	]);
	rejectMarkers("header", header, ["button-primary", "dark-card"]);
}

if (includesPhase("styles")) {
	const styles = await readSource("src", "styles", "global.css");
	requireMarkers("header styles", styles, [
		".header-shell",
		"max-width: 88rem",
		'.header-bar[data-compact="true"]',
		".header-desktop-nav",
		".mobile-header-menu",
		'.mobile-header-menu__link[aria-current="page"]',
		"body.mobile-menu-open",
		"@media (min-width: 68rem)",
		"@media (prefers-reduced-motion: reduce)",
	]);
}

if (includesPhase("behavior")) {
	const header = await readSource(
		"src",
		"components",
		"common",
		"Header.astro",
	);
	const controller = await readSource("src", "lib", "header-controller.ts");
	requireMarkers("header controller import", header, [
		"initSiteHeader",
		"initSiteHeader();",
	]);
	requireMarkers("header behavior", controller, [
		"export const initSiteHeader",
		"window.scrollY > 24",
		'setAttribute("aria-expanded", "true")',
		'setAttribute("aria-hidden", "false")',
		'classList.add("mobile-menu-open")',
		'e.key === "Escape"',
		'e.key !== "Tab"',
		"previousFocus?.focus()",
		"prefers-reduced-motion: reduce",
		"min-width: 68rem",
	]);
}

if (verifyDist) {
	for (const [locale, expected] of [
		["es", ["Primera valoración gratuita", "Servicios", "Proyectos"]],
		["en", ["Free initial assessment", "Services", "Projects"]],
	]) {
		const output = join(root, "dist", "client", locale, "index.html");
		try {
			await access(output);
			const html = await readFile(output, "utf8");
			for (const marker of expected) {
				if (!html.includes(marker)) {
					failures.push(`${locale}: dist missing ${marker}`);
				}
			}
		} catch {
			failures.push(`${locale}: generated home missing`);
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.warn(`Header redesign verification passed through ${requestedPhase}.`);
