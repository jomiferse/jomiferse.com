# Contact Conversion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/contact` as a bilingual conversion page with a three-field enquiry form, visible WhatsApp route, safe status handling, and an accessible automatic marquee of technologies actually used.

**Architecture:** Keep the native `POST /api/contact` flow and the existing hidden service/source context. Split presentation into the contact page, the shared simplified form, and a dedicated technology marquee; protect each delivery with a phase-based source and generated-output verifier before moving to the next phase.

**Tech Stack:** Astro 7, TypeScript 5.9, Tailwind CSS 4, scoped Astro CSS, astro-icon, Resend, Node verification scripts, static Vercel output.

## Global Constraints

- Work directly on `main`; do not create a worktree unless the user asks.
- Use Node `>=24.0.0` through `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"` and `pnpm`.
- Keep the current header and footer unchanged.
- Preserve name, email, message, locale, service, scope, source category, and source path in the contact flow.
- Remove GitHub from `/contact`; remove project type and PDF attachment from the shared form and API.
- Do not label technologies as partners, collaborators, clients, certifications, or endorsements.
- Use `var(--home-navy)`, `var(--action)`, and existing surface variables; do not introduce the cyan commercial palette.
- Keep the form as the only large card surface and use restrained editorial rows for direct contact methods.
- Required manual viewports are `1440x900` and `390x844`, in Spanish and English, light and dark.
- No page-level horizontal overflow; primary actions must be at least 44px high.

---

### Task 1: Simplify the shared form and API contract

**Files:**

- Create: `scripts/verify-contact-redesign.mjs`
- Modify: `package.json`
- Modify: `src/components/forms/ContactForm.astro`
- Modify: `src/pages/api/contact.ts`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

**Interfaces:**

- Consumes: `locale: Locale`, optional `selectedService`, `selectedScope`, `sourceCategory`, `sourcePath`, and `idPrefix` props already accepted by `ContactForm`.
- Produces: a native form with exactly three visible controls named `name`, `email`, and `message`, plus the existing hidden commercial context.
- Produces: `POST /api/contact` redirects to `/{locale}/contact?sent=1`, `?error=missing`, or `?error=send`, preserving valid `service` and `scope` parameters.

- [ ] **Step 1: Create the failing form/API verifier**

Create `scripts/verify-contact-redesign.mjs` with a phase parser and a `form` phase:

```js
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
		'<select',
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
```

Add the package script:

```json
"verify:contact-redesign": "node scripts/verify-contact-redesign.mjs"
```

- [ ] **Step 2: Run the focused verifier and confirm the red state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-contact-redesign.mjs --phase=form
```

Expected: exit code `1`, including forbidden `select`, `file`, project-type, and attachment markers plus missing privacy and API status markers.

- [ ] **Step 3: Reduce `ContactForm` to three visible fields**

In `src/components/forms/ContactForm.astro`:

- Remove `projectTypes`.
- Keep the service option and scope lookup code, hidden fields, selection summary, and client-side query synchronization unchanged.
- Render the name and email controls in the existing two-column grid.
- Render only the message textarea below them.
- Remove the project type and attachment blocks.
- Change the form class to `contact-form p-5 md:p-6`, remove the obsolete
  `enctype="multipart/form-data"`, replace the submit action, and append the
  privacy note:

```astro
<button type="submit" class="button-action mt-6 w-full">
	{contactCopy.submit}
	<Icon name="arrow-right" class="h-4 w-4" aria-hidden="true" />
</button>
<p class="contact-form__privacy">
	{contactCopy.privacyNote}
	<a href={`/${locale}/privacy/`}>{contactCopy.privacyLink}</a>
</p>
```

Add scoped styles:

```css
.contact-form {
	border: 1px solid var(--surface-border);
	border-radius: 1.25rem;
	background: var(--surface);
	box-shadow: var(--shadow-card);
}

.contact-form__privacy {
	margin-top: 1rem;
	color: var(--text-muted);
	font-size: 0.78rem;
	line-height: 1.6;
	text-align: center;
}

.contact-form__privacy a {
	color: var(--action);
	font-weight: 800;
	text-decoration: underline;
	text-underline-offset: 0.2em;
}
```

Update the localized `contactForm` objects:

```json
// es
"messageLabel": "Mensaje",
"messagePlaceholder": "Cuéntame qué tienes ahora, qué quieres mejorar y qué resultado buscas.",
"submit": "Enviar consulta",
"privacyNote": "Usaré tus datos únicamente para responder a esta consulta. ",
"privacyLink": "Ver privacidad"
```

```json
// en
"messageLabel": "Message",
"messagePlaceholder": "Tell me what you have now, what you want to improve and what result you need.",
"submit": "Send enquiry",
"privacyNote": "I will only use your details to respond to this enquiry. ",
"privacyLink": "View privacy information"
```

Delete `projectTypeLabel`, `projectTypePlaceholder`, `projectTypes`, `attachmentLabel`, and `attachmentHint` from both locale files.

- [ ] **Step 4: Simplify and harden `POST /api/contact`**

Remove attachment and project-type processing. Add:

```ts
const isValidEmail = (value: string) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const redirectToContact = (
	locale: Locale,
	status: { sent?: "1"; error?: "missing" | "send" },
	selectedService: string,
	selectedScope: string,
) => {
	const params = new URLSearchParams();
	if (status.sent) params.set("sent", status.sent);
	if (status.error) params.set("error", status.error);
	if (selectedService) params.set("service", selectedService);
	if (selectedScope) params.set("scope", selectedScope);
	return new Response(null, {
		status: 303,
		headers: { Location: `/${locale}/contact?${params.toString()}` },
	});
};
```

Resolve and validate service/scope before field validation, then use:

```ts
if (!name || !email || !isValidEmail(email) || !message) {
	return redirectToContact(
		locale,
		{ error: "missing" },
		selectedService,
		selectedScope,
	);
}
```

Send the email without project type or attachments:

```ts
try {
	const result = await resend.emails.send({
		from: "Website <onboarding@resend.dev>",
		to: cv.email,
		replyTo: email,
		subject: `Website contact from ${email}`,
		text: `Name: ${name}\nEmail: ${email}\nService: ${selectedServiceLabel ?? "-"}\nScope: ${selectedScopeLabel ?? "-"}\nLocale: ${locale}\nSource: ${source.category}${source.path ? ` (${source.path})` : ""}\n\n${message}`,
	});

	if (result.error) {
		return redirectToContact(
			locale,
			{ error: "send" },
			selectedService,
			selectedScope,
		);
	}
} catch {
	return redirectToContact(
		locale,
		{ error: "send" },
		selectedService,
		selectedScope,
	);
}

return redirectToContact(
	locale,
	{ sent: "1" },
	selectedService,
	selectedScope,
);
```

- [ ] **Step 5: Run focused and compiler verification**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-contact-redesign.mjs --phase=form
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: contact verifier passes through `form`; Astro reports zero diagnostics.

- [ ] **Step 6: Commit the simplified flow**

```bash
git add package.json scripts/verify-contact-redesign.mjs src/components/forms/ContactForm.astro src/pages/api/contact.ts src/i18n/es.json src/i18n/en.json
git commit -m "refactor(contact): simplify enquiry flow"
```

---

### Task 2: Rebuild the commercial contact page

**Files:**

- Modify: `scripts/verify-contact-redesign.mjs`
- Modify: `src/pages/[locale]/contact.astro`
- Modify: `src/styles/global.css`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

**Interfaces:**

- Consumes: `ContactForm locale={locale}` and CV email/LinkedIn data.
- Produces: localized WhatsApp URL, direct contact rows, three trust signals, success/error banners, and a wide `.contact-page` commercial shell.

- [ ] **Step 1: Extend the verifier with a failing `page` phase**

Add:

```js
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
		const copy = JSON.parse(
			await readSource("src", "i18n", `${locale}.json`),
		).contact.page;
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
```

- [ ] **Step 2: Run the page phase and confirm it fails**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-contact-redesign.mjs --phase=page
```

Expected: exit code `1` for missing contact layout/status markers and forbidden GitHub card usage.

- [ ] **Step 3: Add bilingual page copy**

Replace legacy `contact.page` presentation keys with these exact values.

Spanish:

```json
"eyebrow": "Primera valoración gratuita",
"title": "Cuéntame qué quieres resolver.",
"intro": "Explícame brevemente qué tienes ahora y qué te gustaría mejorar. Te responderé personalmente con el siguiente paso que considero más razonable.",
"signals": ["Sin compromiso", "Trato directo", "Respuesta personal"],
"methodsEyebrow": "También puedes escribirme directamente",
"whatsappLabel": "WhatsApp",
"whatsappText": "Cuéntame tu caso por mensaje",
"whatsappMessage": "Hola José Miguel, me gustaría comentarte una necesidad digital y saber cuál sería el siguiente paso más razonable.",
"emailText": "Escribir por email",
"linkedinText": "Conectar en LinkedIn",
"successTitle": "Consulta enviada",
"successText": "He recibido tu mensaje. Te responderé personalmente lo antes posible.",
"missingTitle": "Falta algún dato",
"missingText": "Revisa el nombre, el email y el mensaje antes de volver a enviarlo.",
"errorTitle": "No se ha podido enviar",
"errorText": "Ha ocurrido un problema temporal. Puedes escribirme por WhatsApp o email."
```

English:

```json
"eyebrow": "Free initial assessment",
"title": "Tell me what you want to solve.",
"intro": "Briefly explain what you have now and what you would like to improve. I will reply personally with the next step I think makes the most sense.",
"signals": ["No obligation", "Direct contact", "Personal reply"],
"methodsEyebrow": "You can also contact me directly",
"whatsappLabel": "WhatsApp",
"whatsappText": "Tell me about your case by message",
"whatsappMessage": "Hi José Miguel, I would like to discuss a digital need and find out what the most sensible next step would be.",
"emailText": "Send an email",
"linkedinText": "Connect on LinkedIn",
"successTitle": "Enquiry sent",
"successText": "I have received your message. I will reply personally as soon as possible.",
"missingTitle": "Some information is missing",
"missingText": "Check the name, email and message before sending again.",
"errorTitle": "The enquiry could not be sent",
"errorText": "There was a temporary problem. You can contact me by WhatsApp or email."
```

Delete `titleAccent`, `linkedin`, and `github` legacy presentation keys if no other consumer uses them.

- [ ] **Step 4: Rebuild `contact.astro`**

Keep metadata and structured data. Add:

```ts
const whatsappHref = `https://wa.me/34609221290?text=${encodeURIComponent(page.whatsappMessage)}`;
```

Use this page hierarchy:

```astro
<div class="contact-page">
	<section data-contact-hero class="contact-hero section-reveal">
		<div class="contact-hero__copy">
			<p class="eyebrow">{page.eyebrow}</p>
			<h1>{page.title}</h1>
			<p class="contact-hero__intro">{page.intro}</p>
			<ul class="contact-signals" aria-label={page.eyebrow}>
				{page.signals.map((signal) => (
					<li><Icon name="check" aria-hidden="true" />{signal}</li>
				))}
			</ul>
			<div data-contact-methods class="contact-methods">
				<p class="eyebrow">{page.methodsEyebrow}</p>
				<a href={whatsappHref} target="_blank" rel="noopener noreferrer nofollow" class="contact-method contact-method--whatsapp button-secondary">
					<span><strong>{page.whatsappLabel}</strong><small>{page.whatsappText}</small></span>
					<Icon name="message-square" aria-hidden="true" />
				</a>
				<a href={`mailto:${cv.email}`} class="contact-method">
					<span><strong>Email</strong><small>{cv.email}</small></span>
					<Icon name="move-up-right" aria-hidden="true" />
				</a>
				<a href={cv.links.linkedin} target="_blank" rel="noopener noreferrer nofollow" class="contact-method">
					<span><strong>LinkedIn</strong><small>{page.linkedinText}</small></span>
					<Icon name="move-up-right" aria-hidden="true" />
				</a>
			</div>
		</div>
		<div class="contact-form-column">
			<div data-contact-status="sent" hidden class="contact-status contact-status--success" role="status">
				<strong>{page.successTitle}</strong><p>{page.successText}</p>
			</div>
			<div data-contact-status="missing" hidden class="contact-status" role="alert">
				<strong>{page.missingTitle}</strong><p>{page.missingText}</p>
			</div>
			<div data-contact-status="send" hidden class="contact-status" role="alert">
				<strong>{page.errorTitle}</strong><p>{page.errorText}</p>
				<a href={whatsappHref}>{page.whatsappLabel}</a>
				<a href={`mailto:${cv.email}`}>Email</a>
			</div>
			<ContactForm locale={locale} />
		</div>
	</section>
</div>
```

Replace the existing success-only script with:

```astro
<script>
	const params = new URLSearchParams(window.location.search);
	const status = params.get("sent") === "1" ? "sent" : params.get("error");
	if (status) {
		document
			.querySelector<HTMLElement>(`[data-contact-status="${status}"]`)
			?.removeAttribute("hidden");
	}
</script>
```

- [ ] **Step 5: Add restrained commercial styling**

In `global.css`, add:

```css
body:has(.contact-page) main.site-shell {
	max-width: 88rem;
}
```

In `contact.astro`, add scoped styles with these exact layout rules:

```css
.contact-page .eyebrow { color: var(--action); }
.contact-hero {
	display: grid;
	grid-template-columns: minmax(0, 0.9fr) minmax(30rem, 1.1fr);
	gap: clamp(3rem, 7vw, 7rem);
	align-items: start;
	padding-block: clamp(1.5rem, 3vw, 2.5rem) clamp(3.5rem, 5vw, 4.5rem);
}
.contact-hero h1 {
	max-width: 12ch;
	margin-top: 1rem;
	color: var(--home-navy);
	font-size: clamp(3rem, 5.6vw, 5.4rem);
	font-weight: 950;
	letter-spacing: -0.065em;
	line-height: 0.95;
	text-wrap: balance;
}
.contact-hero__intro { max-width: 39rem; margin-top: 1.5rem; color: var(--text-muted); font-size: 1.05rem; line-height: 1.75; }
.contact-signals { display: flex; flex-wrap: wrap; gap: 0.65rem 1.2rem; margin-top: 1.6rem; }
.contact-signals li { display: inline-flex; gap: 0.45rem; align-items: center; color: var(--text); font-size: 0.82rem; font-weight: 800; }
.contact-signals :global(svg) { width: 1rem; color: var(--action); }
.contact-methods { margin-top: 2.4rem; border-top: 1px solid var(--surface-border); }
.contact-methods > .eyebrow { padding-block: 1.2rem; }
.contact-method { display: flex; min-height: 4.75rem; align-items: center; justify-content: space-between; gap: 1rem; border-top: 1px solid var(--surface-border); color: var(--text); }
.contact-method strong, .contact-method small { display: block; }
.contact-method small { margin-top: 0.25rem; color: var(--text-muted); font-size: 0.8rem; }
.contact-method:hover strong { color: var(--action); }
.contact-method--whatsapp { width: 100%; margin-block: 0.2rem 0.9rem; padding-inline: 1rem; }
.contact-method--whatsapp :global(svg) { color: #25d366; }
.contact-status { margin-bottom: 1rem; padding: 1rem 1.1rem; border: 1px solid color-mix(in srgb, var(--action) 28%, var(--surface-border)); border-radius: 1rem; background: color-mix(in srgb, var(--action) 7%, var(--surface)); color: var(--text); }
.contact-status p { margin-top: 0.25rem; color: var(--text-muted); line-height: 1.6; }
.contact-status a { margin-right: 1rem; color: var(--action); font-weight: 850; }
@media (max-width: 900px) {
	.contact-hero { grid-template-columns: 1fr; gap: 2.5rem; }
}
@media (max-width: 767px) {
	.contact-hero { padding-top: 1.25rem; }
	.contact-hero h1 { font-size: clamp(2.75rem, 12vw, 3.65rem); }
}
```

- [ ] **Step 6: Verify and commit the page**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-contact-redesign.mjs --phase=page
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: page phase passes and Astro reports zero diagnostics.

Commit:

```bash
git add scripts/verify-contact-redesign.mjs src/pages/[locale]/contact.astro src/styles/global.css src/i18n/es.json src/i18n/en.json
git commit -m "feat(contact): rebuild conversion page"
```

---

### Task 3: Add the accessible technology marquee

**Files:**

- Create: `src/components/contact/ContactTechnologyMarquee.astro`
- Create: `src/icons/java.svg`
- Create: `src/icons/react.svg`
- Create: `src/icons/astro.svg`
- Create: `src/icons/redis.svg`
- Create: `src/icons/wordpress.svg`
- Modify: `scripts/verify-contact-redesign.mjs`
- Modify: `src/pages/[locale]/contact.astro`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

**Interfaces:**

- Consumes: `title: string` and `pauseLabel: string` props.
- Produces: `data-contact-technologies`, a labelled focusable viewport, one semantic technology list, and one `aria-hidden` duplicate visual list.

- [ ] **Step 1: Extend the verifier with a failing `marquee` phase**

Add source checks for:

```js
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
		const copy = JSON.parse(
			await readSource("src", "i18n", `${locale}.json`),
		).contact.page;
		if (!copy?.technologiesTitle)
			failures.push(`${locale}: missing contact.page.technologiesTitle`);
		if (!copy?.technologiesPauseLabel)
			failures.push(`${locale}: missing contact.page.technologiesPauseLabel`);
	}
}
```

- [ ] **Step 2: Run the marquee phase and confirm it fails**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-contact-redesign.mjs --phase=marquee
```

Expected: exit code `1` because the component and integration do not exist.

- [ ] **Step 3: Add the five missing official SVG marks**

Use these exact Simple Icons assets, whose current responses were checked while
writing this plan:

| Local file | Source read via `curl` to stdout | Expected SHA-256 |
| --- | --- | --- |
| `src/icons/java.svg` | `https://cdn.simpleicons.org/openjdk` | `4c4618e49d30e7d026dfda95688ae1746c68a70e4f570c7b2f796715930c1951` |
| `src/icons/react.svg` | `https://cdn.simpleicons.org/react` | `37c8c23bc6ea999ad58b7f3883fc08b7e22128ec25adcca60ae1046ff878bcc3` |
| `src/icons/astro.svg` | `https://cdn.simpleicons.org/astro` | `38502102492c2b4a0cb93227c51f12150fe8b695aca236d66a29302166b2b4c2` |
| `src/icons/redis.svg` | `https://cdn.simpleicons.org/redis` | `4245419834dd111d83a8ed645a2e305c67faa0af5c5b864eb5f0991de156034c` |
| `src/icons/wordpress.svg` | `https://cdn.simpleicons.org/wordpress` | `0d45778b7cb89372dd4710f38874c5b87045a8bbc8aba5bb7f40fbaf5fcb8808` |

Read each source without writing it, verify the hash, then add its returned SVG
with `apply_patch`. Remove only the root `fill` attribute so the mark inherits
`currentColor`; keep `role`, `viewBox`, namespace, title, and path unchanged. For
`java.svg`, change only the title from `OpenJDK` to `Java`. OpenJDK is the
vendor-neutral Java mark available in Simple Icons. Do not download or hotlink
assets at runtime. Existing local `springboot`, `docker`, `kubernetes`,
`postgresql`, and `apachekafka` icons complete the approved set.

- [ ] **Step 4: Create `ContactTechnologyMarquee.astro`**

Use this component structure:

```astro
---
import { Icon } from "astro-icon/components";

const { title, pauseLabel } = Astro.props as {
	title: string;
	pauseLabel: string;
};
const technologies = [
	{ label: "Java", icon: "java" },
	{ label: "Spring Boot", icon: "springboot" },
	{ label: "Docker", icon: "docker" },
	{ label: "Kubernetes", icon: "kubernetes" },
	{ label: "React", icon: "react" },
	{ label: "Astro", icon: "astro" },
	{ label: "PostgreSQL", icon: "postgresql" },
	{ label: "Redis", icon: "redis" },
	{ label: "Apache Kafka", icon: "apachekafka" },
	{ label: "WordPress", icon: "wordpress" },
] as const;
---

<section data-contact-technologies class="contact-technologies section-reveal" aria-labelledby="contact-technologies-title">
	<p class="eyebrow">Stack</p>
	<h2 id="contact-technologies-title">{title}</h2>
	<div class="contact-marquee" tabindex="0" aria-label={pauseLabel}>
		<div class="contact-marquee__track">
			<ul class="contact-marquee__list">
				{technologies.map((technology) => (
					<li><Icon name={technology.icon} aria-hidden="true" /><span>{technology.label}</span></li>
				))}
			</ul>
			<ul class="contact-marquee__list" aria-hidden="true">
				{technologies.map((technology) => (
					<li><Icon name={technology.icon} aria-hidden="true" /><span>{technology.label}</span></li>
				))}
			</ul>
		</div>
	</div>
</section>
```

Add scoped CSS:

```css
.contact-technologies { padding-block: clamp(3.25rem, 5vw, 4.5rem); border-top: 1px solid var(--surface-border); }
.contact-technologies .eyebrow { color: var(--action); }
.contact-technologies h2 { max-width: 18ch; margin-top: 0.9rem; color: var(--home-navy); font-size: clamp(2.2rem, 4vw, 3.8rem); font-weight: 950; letter-spacing: -0.055em; line-height: 0.98; }
.contact-marquee { margin-top: 2.5rem; overflow: hidden; -webkit-mask-image: linear-gradient(to right, transparent, black 7%, black 93%, transparent); mask-image: linear-gradient(to right, transparent, black 7%, black 93%, transparent); }
.contact-marquee__track { display: flex; width: max-content; animation: contact-marquee 34s linear infinite; }
.contact-marquee__list { display: flex; gap: 0.85rem; padding-right: 0.85rem; }
.contact-marquee__list li { display: inline-flex; min-width: 10rem; min-height: 5rem; align-items: center; justify-content: center; gap: 0.75rem; padding: 1rem 1.2rem; border: 1px solid var(--surface-border); border-radius: 1rem; background: color-mix(in srgb, var(--surface) 84%, transparent); color: var(--text); font-size: 0.9rem; font-weight: 850; }
.contact-marquee__list :global(svg) { width: 1.6rem; height: 1.6rem; color: var(--text-muted); fill: currentColor; }
.contact-marquee:hover .contact-marquee__track,
.contact-marquee:focus .contact-marquee__track { animation-play-state: paused; }
@keyframes contact-marquee { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
	.contact-marquee { overflow: visible; -webkit-mask-image: none; mask-image: none; }
	.contact-marquee__track { width: 100%; animation: none; }
	.contact-marquee__list { width: 100%; flex-wrap: wrap; justify-content: center; padding: 0; }
	.contact-marquee__list[aria-hidden="true"] { display: none; }
}
```

- [ ] **Step 5: Integrate and localize the marquee**

Import and render below the contact hero:

```astro
<ContactTechnologyMarquee
	title={page.technologiesTitle}
	pauseLabel={page.technologiesPauseLabel}
/>
```

Add:

```json
// es
"technologiesTitle": "Tecnologías y plataformas con las que trabajo",
"technologiesPauseLabel": "Tecnologías en movimiento. Mantén el foco aquí para pausar la animación."
```

```json
// en
"technologiesTitle": "Technologies and platforms I work with",
"technologiesPauseLabel": "Moving technology list. Keep focus here to pause the animation."
```

- [ ] **Step 6: Verify and commit the marquee**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-contact-redesign.mjs --phase=marquee
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: marquee phase passes and Astro reports zero diagnostics.

Commit:

```bash
git add scripts/verify-contact-redesign.mjs src/components/contact/ContactTechnologyMarquee.astro src/icons/java.svg src/icons/react.svg src/icons/astro.svg src/icons/redis.svg src/icons/wordpress.svg src/pages/[locale]/contact.astro src/i18n/es.json src/i18n/en.json
git commit -m "feat(contact): add technology marquee"
```

---

### Task 4: Protect generated output and verify the complete experience

**Files:**

- Modify: `scripts/verify-contact-redesign.mjs`
- Modify only if browser evidence requires correction: `src/pages/[locale]/contact.astro`
- Modify only if browser evidence requires correction: `src/components/forms/ContactForm.astro`
- Modify only if browser evidence requires correction: `src/components/contact/ContactTechnologyMarquee.astro`

**Interfaces:**

- Consumes: completed contact page, form, API, translations, and marquee.
- Produces: generated-output checks and an evidence-backed responsive handoff.

- [ ] **Step 1: Add generated-output checks**

Append:

```js
if (verifyGeneratedOutput) {
	for (const locale of ["es", "en"]) {
		const output = join(root, "dist", "client", locale, "contact", "index.html");
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
```

- [ ] **Step 2: Run formatting and static checks**

Run each command separately:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:contact-redesign
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:ai-seo
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-contact-redesign.mjs --dist
```

Expected: all commands exit `0`; Astro reports zero diagnostics; generated contact output passes for both locales.

- [ ] **Step 3: Verify the UI in the local browser**

Inspect `/es/contact/` and `/en/contact/` at `1440x900` and `390x844` in light and dark themes. Confirm:

- No horizontal overflow.
- Exactly three visible form controls.
- Submit and WhatsApp actions are at least 44px high.
- GitHub, project type, and attachment are absent.
- Direct methods appear before the form on mobile.
- The marquee moves, pauses on hover/focus, and becomes a static grid when reduced motion is emulated.
- Success, missing, and send-error banners appear for `?sent=1`, `?error=missing`, and `?error=send`.
- `/es/contact?service=website-redesign&scope=project` shows the compact service and scope summary.
- The service-detail modal still renders the simplified shared form and preserves its hidden context.

- [ ] **Step 4: Apply only evidence-driven corrections**

If a browser check fails, add the smallest targeted style or markup correction, rerun the relevant verifier, then repeat the failed viewport/state. Do not add new sections, fields, technologies, animations, or copy beyond the approved specification.

- [ ] **Step 5: Commit final verification changes**

If Step 4 changed source files:

```bash
git add scripts/verify-contact-redesign.mjs src/pages/[locale]/contact.astro src/components/forms/ContactForm.astro src/components/contact/ContactTechnologyMarquee.astro
git commit -m "fix(contact): polish responsive contact flow"
```

If only the generated-output verifier changed:

```bash
git add scripts/verify-contact-redesign.mjs
git commit -m "test(contact): verify generated conversion page"
```
