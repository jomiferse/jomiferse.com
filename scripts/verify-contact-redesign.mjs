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
		"try {\n\t\tconst resend = new Resend",
		"result.error",
		"selectedServiceLabel",
		"selectedScopeLabel",
		"source.category",
	]);
	rejectMarkers("contact API", api, [
		"const resend = new Resend(import.meta.env.RESEND_API_KEY);\n\nconst isLocale",
		"MAX_PDF_BYTES",
		"Buffer.from",
		"attachments",
		'form.get("projectType")',
		'form.get("attachment")',
		"Project type:",
	]);
}

if (includesPhase("page")) {
	const page = await readSource("src", "pages", "[locale]", "contact.astro");
	const styles = await readSource("src", "styles", "global.css");
	requireMarkers("contact page", page, [
		"contact-page",
		"data-contact-hero",
		"data-contact-methods",
		"data-contact-status",
		"page.signals",
		"page.whatsappMessage",
		"https://wa.me/34609221290",
		"ContactForm",
		"cv.links.linkedin",
		"cv.email",
		"button-secondary",
	]);
	rejectMarkers("contact page", page, [
		"cv.links.github",
		">GitHub<",
		"page.github",
		"dark-card hover-card",
	]);
	requireMarkers("contact shell", styles, [
		"body:has(.contact-page) main.site-shell",
		"max-width: 88rem",
	]);
	for (const locale of ["es", "en"]) {
		const copy = JSON.parse(await readSource("src", "i18n", `${locale}.json`))
			.contact.page;
		for (const key of [
			"eyebrow",
			"title",
			"intro",
			"signals",
			"methodsEyebrow",
			"whatsappLabel",
			"whatsappText",
			"whatsappMessage",
			"emailText",
			"linkedinText",
			"successTitle",
			"successText",
			"missingTitle",
			"missingText",
			"errorTitle",
			"errorText",
		]) {
			if (!copy?.[key]) failures.push(`${locale}: missing contact.page.${key}`);
		}
		if (copy?.signals?.length !== 3)
			failures.push(`${locale}: contact page needs three signals`);
	}
}

if (includesPhase("marquee")) {
	const page = await readSource("src", "pages", "[locale]", "contact.astro");
	const marquee = await readSource(
		"src",
		"components",
		"contact",
		"ContactTechnologyMarquee.astro",
	);
	requireMarkers("contact page marquee", page, [
		"ContactTechnologyMarquee",
		"page.technologiesTitle",
		"page.technologiesPauseLabel",
	]);
	requireMarkers("technology marquee", marquee, [
		"data-contact-technologies",
		'tabindex="0"',
		'aria-hidden="true"',
		"contact-marquee__track",
		"animation-play-state: paused",
		"@media (prefers-reduced-motion: reduce)",
		"Java",
		"Spring Boot",
		"Docker",
		"Kubernetes",
		"React",
		"Astro",
		"PostgreSQL",
		"Redis",
		"Apache Kafka",
		"WordPress",
	]);
	rejectMarkers("technology marquee", marquee, [
		"partner",
		"Partner",
		"client",
		"endorsement",
	]);
	for (const locale of ["es", "en"]) {
		const copy = JSON.parse(await readSource("src", "i18n", `${locale}.json`))
			.contact.page;
		if (!copy?.technologiesTitle)
			failures.push(`${locale}: missing contact.page.technologiesTitle`);
		if (!copy?.technologiesPauseLabel)
			failures.push(`${locale}: missing contact.page.technologiesPauseLabel`);
	}
}

if (verifyGeneratedOutput) {
	for (const locale of ["es", "en"]) {
		const output = join(
			root,
			"dist",
			"client",
			locale,
			"contact",
			"index.html",
		);
		try {
			await access(output);
			const html = await readFile(output, "utf8");
			const expected =
				locale === "es"
					? [
							"Cuéntame qué quieres resolver.",
							"Enviar consulta",
							"Tecnologías y plataformas con las que trabajo",
							"WhatsApp",
						]
					: [
							"Tell me what you want to solve.",
							"Send enquiry",
							"Technologies and platforms I work with",
							"WhatsApp",
						];
			for (const marker of expected) {
				if (!html.includes(marker))
					failures.push(`${locale}: generated contact missing ${marker}`);
			}
			const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
			for (const forbidden of ["GitHub", "projectType", "attachment"]) {
				if (main.includes(forbidden))
					failures.push(`${locale}: generated contact includes ${forbidden}`);
			}
		} catch {
			failures.push(`${locale}: generated contact output missing`);
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.warn(`Contact redesign verification passed through ${phase}.`);
