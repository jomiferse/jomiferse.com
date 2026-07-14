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
const phaseArgument = process.argv.find((value) =>
	value.startsWith("--phase="),
);
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

if (includesPhase("shell")) {
	const shell = await readSource(
		"src",
		"components",
		"common",
		"DialogShell.astro",
	);
	const styles = await readSource("src", "styles", "global.css");
	requireMarkers("dialog shell", shell, [
		"<dialog",
		"aria-labelledby={labelledBy}",
		"aria-describedby={describedBy}",
		"data-dialog-shell",
		'<slot name="header"',
		'<slot name="footer"',
	]);
	requireMarkers("dialog styles", styles, [
		"--dialog-max-width",
		".dialog-shell::backdrop",
		".dialog-shell__surface",
		".dialog-shell__close",
		".dialog-shell[open]",
		"@media (prefers-reduced-motion: reduce)",
	]);
}

if (includesPhase("contact")) {
	const dialog = await readSource(
		"src",
		"components",
		"common",
		"GlobalContactDialog.astro",
	);
	const form = await readSource(
		"src",
		"components",
		"forms",
		"ContactForm.astro",
	);
	const layout = await readSource("src", "layouts", "BaseLayout.astro");
	const serviceDetail = await readSource(
		"src",
		"pages",
		"[locale]",
		"services",
		"[service].astro",
	);
	const conversionCta = await readSource(
		"src",
		"components",
		"common",
		"ConversionCta.astro",
	);
	const pricingCard = await readSource(
		"src",
		"components",
		"services",
		"ServicePricingCard.astro",
	);

	requireMarkers("global contact dialog", dialog, [
		"DialogShell",
		'size="form"',
		"data-global-contact-dialog",
		"ContactForm",
		"data-contact-status",
		"data-contact-dialog-open",
		"parseContactSubmissionResult",
		"fetch(form.action",
		"reportValidity()",
		"lastContactTrigger",
		"requestAnimationFrame",
	]);
	requireMarkers("modal contact form", form, [
		'variant?: "page" | "modal"',
		"data-contact-form-variant",
	]);
	requireMarkers("contact layout mount", layout, [
		"GlobalContactDialog",
		"showGlobalContact",
	]);
	for (const [label, source] of [
		["service detail", serviceDetail],
		["conversion CTA", conversionCta],
		["pricing card", pricingCard],
	]) {
		requireMarkers(label, source, ["data-contact-dialog-open"]);
		rejectMarkers(label, source, ["data-contact-modal-open"]);
	}
	rejectMarkers("service detail", serviceDetail, [
		'id="service-contact-dialog"',
		"contactDialog.showModal()",
	]);
}

if (includesPhase("exit")) {
	const exitDialog = await readSource(
		"src",
		"components",
		"common",
		"GlobalExitIntent.astro",
	);
	const exitRules = await readSource("src", "lib", "exit-intent.ts");
	const layout = await readSource("src", "layouts", "BaseLayout.astro");
	const servicesHub = await readSource(
		"src",
		"pages",
		"[locale]",
		"services.astro",
	);
	const serviceDetail = await readSource(
		"src",
		"pages",
		"[locale]",
		"services",
		"[service].astro",
	);
	const blogDetail = await readSource(
		"src",
		"pages",
		"[locale]",
		"blog",
		"[...slug].astro",
	);
	const projectDetail = await readSource(
		"src",
		"pages",
		"[locale]",
		"projects",
		"[project].astro",
	);

	requireMarkers("global exit dialog", exitDialog, [
		"DialogShell",
		'size="compact"',
		"data-global-exit-dialog",
		"data-contact-dialog-open",
		"EXIT_INTENT_SESSION_KEY",
		"CONSENT_STORAGE_KEY",
		"cookieBannerVisible",
		"25_000",
	]);
	requireMarkers("exit rules", exitRules, [
		'"jomiferse.exit-intent.v2"',
		"isExitIntentRouteExcluded",
		"getExitIntentContext",
		"canShowExitIntent",
		"15_000",
		"25_000",
		"0.25",
		"0.5",
	]);
	requireMarkers("global exit layout mount", layout, [
		"GlobalExitIntent",
		"popupContext?: PopupContext",
		"isExitIntentRouteExcluded",
		"getExitIntentContext",
	]);
	requireMarkers("service popup context", serviceDetail, [
		"popupContext={{",
		'kind: "service"',
	]);
	requireMarkers("article popup context", blogDetail, [
		'popupContext={{ kind: "article"',
	]);
	requireMarkers("project popup context", projectDetail, [
		'popupContext={{ kind: "project"',
	]);
	for (const [label, source] of [
		["services hub", servicesHub],
		["service detail", serviceDetail],
	]) {
		rejectMarkers(label, source, ["ServicesExitIntent"]);
	}
}

if (includesPhase("cookies")) {
	const cookieConsent = await readSource(
		"src",
		"components",
		"common",
		"CookieConsent.astro",
	);
	requireMarkers("cookie consent", cookieConsent, [
		"DialogShell",
		"data-cookie-banner",
		"data-cookie-equal-action",
		'type="checkbox"',
		"data-cookie-close-icon",
		"event.target === dialog",
		"lastFocusedElement?.focus()",
		'role="region"',
		'aria-live="polite"',
	]);
	rejectMarkers("cookie consent commercial palette", cookieConsent, [
		"var(--accent",
	]);
}

if (includesPhase("project")) {
	const projectCard = await readSource(
		"src",
		"components",
		"cards",
		"ProjectCard.astro",
	);
	requireMarkers("project dialog", projectCard, [
		"DialogShell",
		'size="detail"',
		'type="button"',
		'aria-haspopup="dialog"',
		"data-project-dialog-open",
		"projectDialogHandler",
		"lastProjectTrigger",
		"event.target === dialog",
		"lastProjectTrigger?.focus()",
	]);
	rejectMarkers("project dialog legacy UI", projectCard, [
		'role="button"',
		"onclick=",
		"onkeydown=",
		"glass-panel m-auto",
		"rounded-[2rem]",
	]);
	for (const locale of ["es", "en"]) {
		const dictionary = JSON.parse(
			await readSource("src", "i18n", `${locale}.json`),
		);
		if (!dictionary.projectCard?.openDialog) {
			failures.push(`${locale}: missing projectCard.openDialog`);
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
