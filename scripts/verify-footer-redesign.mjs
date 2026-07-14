import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const phases = ["copy", "structure", "styles"];
const phaseArg = process.argv.find((value) => value.startsWith("--phase="));
const requestedPhase = phaseArg?.split("=")[1] ?? "styles";
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

if (includesPhase("copy")) {
	for (const locale of ["es", "en"]) {
		const dictionary = JSON.parse(
			await readSource("src", "i18n", `${locale}.json`),
		);
		for (const key of [
			"eyebrow",
			"ctaTitle",
			"ctaDescription",
			"ctaLabel",
			"identityDescription",
			"availability",
			"servicesLabel",
			"viewAllServices",
			"exploreLabel",
			"contactLabel",
			"navigationLabel",
			"whatsapp",
			"email",
			"linkedin",
			"privacy",
			"cookieSettings",
			"backToTop",
			"opensNewWindow",
		]) {
			if (!dictionary.footer?.[key]) {
				failures.push(`${locale}: missing footer.${key}`);
			}
		}
	}
}

if (includesPhase("structure")) {
	const footer = await readSource(
		"src",
		"components",
		"common",
		"Footer.astro",
	);
	const layout = await readSource("src", "layouts", "BaseLayout.astro");
	requireMarkers("footer", footer, [
		"data-site-footer",
		"data-footer-cta",
		"contact?service=assessment",
		"data-footer-desktop-nav",
		"data-footer-mobile-disclosures",
		"<details",
		"data-cookie-settings-trigger",
		'href="#top"',
		"https://wa.me/34609221290",
		"cv.links.linkedin",
		"getService(locale, slug)",
		'"business-website"',
		'"website-redesign"',
		'"custom-web-application"',
		'"internal-tools"',
		'"automation-workflows"',
		'"backend-spring-boot"',
	]);
	requireMarkers("layout", layout, ['<body id="top"']);
	rejectMarkers("footer", footer, ["cv.links.github", 'name="github"']);
}

if (includesPhase("styles")) {
	const styles = await readSource("src", "styles", "global.css");
	requireMarkers("footer styles", styles, [
		"--footer-bg",
		".footer-shell",
		"max-width: 88rem",
		".footer-conversion",
		".footer-directory",
		".footer-mobile-disclosures",
		".footer-disclosure[open]",
		".footer-legal",
		"@media (min-width: 68rem)",
		"@media (prefers-reduced-motion: reduce)",
	]);
}

if (verifyDist) {
	for (const [locale, expected] of [
		[
			"es",
			[
				"¿Tienes algo que mejorar, construir o automatizar?",
				"Solicitar valoración gratuita",
				"Disponible para nuevos proyectos",
			],
		],
		[
			"en",
			[
				"Something to improve, build or automate?",
				"Request a free assessment",
				"Available for new projects",
			],
		],
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
			if (html.includes('aria-label="GitHub"')) {
				failures.push(`${locale}: dist still exposes GitHub in footer`);
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

console.warn(`Footer redesign verification passed through ${requestedPhase}.`);
