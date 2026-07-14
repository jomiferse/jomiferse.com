# Footer Conversion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the shared minimal footer with an editorial, conversion-first footer that promotes the free assessment, exposes six priority services, and keeps direct contact and legal controls easy to reach on every localized page.

**Architecture:** Keep one server-rendered `Footer.astro` inside `BaseLayout.astro`. Build all service routes from the existing service registry, render desktop link groups and native mobile disclosures from the same arrays, and use the existing cookie-consent event contract instead of adding a footer controller. Protect the redesign with a phased source-and-build verifier so copy, structure, styling, and generated localized output can be developed in red-green cycles.

**Tech Stack:** Astro 7 components, TypeScript 5.9, Tailwind CSS 4 plus repository CSS, Astro Icon, Node 24 verification scripts, localized JSON dictionaries.

## Global Constraints

- Work directly on `main`; do not create a worktree unless the user explicitly asks for one.
- Use `pnpm` with Node `>=24.0.0`; on this machine prefix commands with `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"` when required.
- Preserve the approved primary href `/{locale}/contact?service=assessment`.
- Keep a single red primary CTA; WhatsApp, email, and LinkedIn remain secondary text links.
- Use six priority services: business website, website redesign, custom web application, internal tools, automation workflows, and Spring Boot backend.
- Remove GitHub from the footer.
- Use `var(--action)` only for the CTA and small conversion cues; do not introduce cyan as a commercial footer accent.
- Desktop inner width is `88rem`; required visual checks are `1440 × 900` and `390 × 844` in Spanish, English, light mode, and dark mode.
- Mobile Services and Explore groups use native disclosures without a client-side footer controller.
- Maintain visible focus, at least 44px effective mobile targets, reduced-motion support, and no horizontal overflow.

---

## File map

- Create `scripts/verify-footer-redesign.mjs`: phased contract verifier for copy, structure, styles, and generated output.
- Modify `package.json`: expose `verify:footer-redesign`.
- Modify `src/i18n/es.json`: approved Spanish footer copy and accessible labels.
- Modify `src/i18n/en.json`: equivalent English footer copy and accessible labels.
- Modify `src/components/common/Footer.astro`: semantic conversion band, shared link data, desktop navigation, mobile disclosures, contact routes, and legal close.
- Modify `src/layouts/BaseLayout.astro`: add the stable `#top` target used by the footer utility.
- Modify `src/styles/global.css`: footer theme variables, atmospheric background, layout, disclosures, focus, responsive rules, and reduced motion.

---

### Task 1: Add the phased footer contract and localized copy

**Files:**

- Create: `scripts/verify-footer-redesign.mjs`
- Modify: `package.json`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

**Interfaces:**

- Produces: command `pnpm run verify:footer-redesign -- --phase=<copy|structure|styles> [--dist]`.
- Produces: `getTranslations(locale).footer` fields consumed by `Footer.astro` in Task 2.
- Consumes: current JSON dictionaries and the generated `dist/client/{locale}/index.html` convention.

- [ ] **Step 1: Create the complete verifier before adding copy**

Create `scripts/verify-footer-redesign.mjs`:

```js
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
```

Add to `package.json` beside the other verification commands:

```json
"verify:footer-redesign": "node scripts/verify-footer-redesign.mjs"
```

- [ ] **Step 2: Run the copy phase and confirm the red state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:footer-redesign -- --phase=copy
```

Expected: FAIL with missing keys such as `es: missing footer.eyebrow` and `en: missing footer.ctaTitle`.

- [ ] **Step 3: Replace the Spanish footer dictionary with the approved copy**

In `src/i18n/es.json`, replace the current `footer` object with:

```json
"footer": {
  "eyebrow": "Primera valoración gratuita",
  "ctaTitle": "¿Tienes algo que mejorar, construir o automatizar?",
  "ctaDescription": "Cuéntame qué necesitas y te propondré el siguiente paso más razonable.",
  "ctaLabel": "Solicitar valoración gratuita",
  "identityDescription": "Desarrollo web, software a medida y automatización con trato directo.",
  "availability": "Disponible para nuevos proyectos · Trabajo remoto",
  "servicesLabel": "Servicios",
  "viewAllServices": "Ver todos los servicios",
  "exploreLabel": "Explorar",
  "contactLabel": "Contacto directo",
  "navigationLabel": "Navegación del pie de página",
  "whatsapp": "WhatsApp",
  "email": "Email",
  "linkedin": "LinkedIn",
  "privacy": "Privacidad",
  "cookieSettings": "Configurar cookies",
  "backToTop": "Volver arriba",
  "opensNewWindow": "se abre en una pestaña nueva"
}
```

- [ ] **Step 4: Replace the English footer dictionary with equivalent intent**

In `src/i18n/en.json`, replace the current `footer` object with:

```json
"footer": {
  "eyebrow": "Free initial assessment",
  "ctaTitle": "Something to improve, build or automate?",
  "ctaDescription": "Tell me what you need and I’ll suggest the most sensible next step.",
  "ctaLabel": "Request a free assessment",
  "identityDescription": "Web development, custom software and automation with direct communication.",
  "availability": "Available for new projects · Remote work",
  "servicesLabel": "Services",
  "viewAllServices": "View all services",
  "exploreLabel": "Explore",
  "contactLabel": "Direct contact",
  "navigationLabel": "Footer navigation",
  "whatsapp": "WhatsApp",
  "email": "Email",
  "linkedin": "LinkedIn",
  "privacy": "Privacy",
  "cookieSettings": "Cookie settings",
  "backToTop": "Back to top",
  "opensNewWindow": "opens in a new tab"
}
```

- [ ] **Step 5: Format and confirm the copy phase is green**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier package.json scripts/verify-footer-redesign.mjs src/i18n/es.json src/i18n/en.json --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:footer-redesign -- --phase=copy
```

Expected: `Footer redesign verification passed through copy.`

- [ ] **Step 6: Commit the contract and copy**

```bash
git add package.json scripts/verify-footer-redesign.mjs src/i18n/es.json src/i18n/en.json
git commit -m "test(footer): define conversion redesign contract"
```

---

### Task 2: Build the semantic conversion footer

**Files:**

- Modify: `src/components/common/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Test: `scripts/verify-footer-redesign.mjs`

**Interfaces:**

- Consumes: `getTranslations(locale).footer`, `getTranslations(locale).contact.page.whatsappMessage`, `getCv(locale)`, and `getService(locale, slug)`.
- Produces: the markers protected by the structure phase and a single footer landmark shared by every `BaseLayout` route.
- Produces: stable `#top` destination on the `body` element.

- [ ] **Step 1: Run the structure phase and confirm the red state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:footer-redesign -- --phase=structure
```

Expected: FAIL with missing markers including `data-footer-cta`, `data-footer-mobile-disclosures`, and `<body id="top"`.

- [ ] **Step 2: Replace `Footer.astro` with the semantic structure**

Use this data setup in the frontmatter:

```astro
---
import { Icon } from "astro-icon/components";
import { getTranslations, type Locale } from "@/i18n";
import { getService, type ServiceSlug } from "@/lib/services";
import { getCv } from "@cv";

interface Props {
	locale?: Locale;
}

const { locale = "es" } = Astro.props as Props;
const cv = getCv(locale);
const translations = getTranslations(locale);
const footer = translations.footer;
const year = new Date().getFullYear();
const contactHref = `/${locale}/contact?service=assessment`;
const whatsappHref = `https://wa.me/34609221290?text=${encodeURIComponent(translations.contact.page.whatsappMessage)}`;

const priorityServiceSlugs = [
	"business-website",
	"website-redesign",
	"custom-web-application",
	"internal-tools",
	"automation-workflows",
	"backend-spring-boot",
] as const satisfies readonly ServiceSlug[];

const serviceLinks = priorityServiceSlugs.map((slug) => {
	const service = getService(locale, slug);
	if (!service) throw new Error(`Missing footer service: ${locale}/${slug}`);

	return {
		href:
			service.canonicalPath ??
			`/${locale}/services/${service.slug}`,
		label: service.shortTitle,
	};
});

const exploreLinks = [
	{ href: `/${locale}/projects`, label: translations.nav.projects },
	{ href: `/${locale}/about`, label: translations.nav.about },
	{ href: `/${locale}/blog`, label: translations.nav.blog },
	{ href: `/${locale}/contact`, label: translations.nav.contact },
];

const directContactLinks = [
	{
		href: whatsappHref,
		label: footer.whatsapp,
		icon: "message-square",
		external: true,
	},
	{
		href: `mailto:${cv.email}`,
		label: footer.email,
		icon: "mail",
		external: false,
	},
	{
		href: cv.links.linkedin,
		label: footer.linkedin,
		icon: "linkedin",
		external: true,
	},
];
---
```

Then render this body:

```astro
<footer class="footer-bar mt-auto" data-site-footer>
	<div class="footer-shell">
		<section class="footer-conversion" data-footer-cta>
			<div>
				<p class="footer-eyebrow">{footer.eyebrow}</p>
				<h2>{footer.ctaTitle}</h2>
				<p class="footer-conversion__copy">{footer.ctaDescription}</p>
			</div>
			<a href={contactHref} class="button-action footer-cta">
				{footer.ctaLabel}
				<Icon name="arrow-right" aria-hidden="true" />
			</a>
		</section>

		<div class="footer-directory">
			<section class="footer-identity" aria-labelledby="footer-identity-title">
				<p id="footer-identity-title" class="footer-group-title">
					José Miguel Fernández
				</p>
				<p>{footer.identityDescription}</p>
				<p class="footer-availability">
					<span aria-hidden="true"></span>
					{footer.availability}
				</p>
			</section>

			<nav
				class="footer-desktop-nav"
				data-footer-desktop-nav
				aria-label={footer.navigationLabel}
			>
				<div class="footer-link-group">
					<p class="footer-group-title">{footer.servicesLabel}</p>
					<ul>
						{serviceLinks.map((link) => <li><a href={link.href}>{link.label}</a></li>)}
						<li><a href={`/${locale}/services`} class="footer-group-more">{footer.viewAllServices}<Icon name="arrow-right" aria-hidden="true" /></a></li>
					</ul>
				</div>
				<div class="footer-link-group">
					<p class="footer-group-title">{footer.exploreLabel}</p>
					<ul>
						{exploreLinks.map((link) => <li><a href={link.href}>{link.label}</a></li>)}
					</ul>
				</div>
			</nav>

			<div class="footer-mobile-disclosures" data-footer-mobile-disclosures>
				<details class="footer-disclosure">
					<summary>{footer.servicesLabel}<Icon name="plus" aria-hidden="true" /></summary>
					<ul>
						{serviceLinks.map((link) => <li><a href={link.href}>{link.label}</a></li>)}
						<li><a href={`/${locale}/services`} class="footer-group-more">{footer.viewAllServices}<Icon name="arrow-right" aria-hidden="true" /></a></li>
					</ul>
				</details>
				<details class="footer-disclosure">
					<summary>{footer.exploreLabel}<Icon name="plus" aria-hidden="true" /></summary>
					<ul>
						{exploreLinks.map((link) => <li><a href={link.href}>{link.label}</a></li>)}
					</ul>
				</details>
			</div>

			<nav class="footer-contact" aria-label={footer.contactLabel}>
				<p class="footer-group-title">{footer.contactLabel}</p>
				<ul>
					{directContactLinks.map((link) => (
						<li>
							<a
								href={link.href}
								target={link.external ? "_blank" : undefined}
								rel={link.external ? "noopener noreferrer nofollow" : undefined}
								aria-label={link.external ? `${link.label}, ${footer.opensNewWindow}` : link.label}
							>
								<Icon name={link.icon} aria-hidden="true" />
								<span>{link.label}</span>
								<Icon name="arrow-up-right" aria-hidden="true" />
							</a>
						</li>
					))}
				</ul>
			</nav>
		</div>

		<div class="footer-legal">
			<p>© {year} {cv.name}</p>
			<div class="footer-legal__links">
				<a href={`/${locale}/privacy`}>{footer.privacy}</a>
				<button type="button" data-cookie-settings-trigger>
					{footer.cookieSettings}
				</button>
				<a href="#top">{footer.backToTop} <span aria-hidden="true">↑</span></a>
			</div>
		</div>
	</div>
</footer>
```

- [ ] **Step 3: Add the stable top target to the shared layout**

In `src/layouts/BaseLayout.astro`, change:

```astro
<body class="relative flex min-h-screen flex-col">
```

to:

```astro
<body id="top" class="relative flex min-h-screen flex-col">
```

- [ ] **Step 4: Format and confirm the structure phase is green**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier src/components/common/Footer.astro src/layouts/BaseLayout.astro --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:footer-redesign -- --phase=structure
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: structure verifier passes and Astro reports `0 errors`, `0 warnings`, `0 hints`.

- [ ] **Step 5: Commit the semantic footer**

```bash
git add src/components/common/Footer.astro src/layouts/BaseLayout.astro
git commit -m "refactor(footer): build conversion-first structure"
```

---

### Task 3: Apply the editorial visual system and responsive disclosures

**Files:**

- Modify: `src/styles/global.css`
- Test: `scripts/verify-footer-redesign.mjs`

**Interfaces:**

- Consumes: all `footer-*` classes emitted by Task 2.
- Produces: dark full-width footer, `88rem` shell, split conversion band, four-block desktop directory, mobile disclosures, and legal close.
- Produces: footer-specific colour variables for both root themes.

- [ ] **Step 1: Run the styles phase and confirm the red state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:footer-redesign -- --phase=styles
```

Expected: FAIL with missing markers including `--footer-bg`, `.footer-shell`, and `.footer-disclosure[open]`.

- [ ] **Step 2: Add theme variables**

Add to `:root` in `src/styles/global.css`:

```css
--footer-bg: #0b223b;
--footer-surface: #102d4f;
--footer-text: #f4f8fc;
--footer-muted: #aebdcb;
--footer-border: rgba(226, 235, 244, 0.16);
```

Add to `.dark`:

```css
--footer-bg: #05070b;
--footer-surface: #0b1018;
--footer-text: #f4f7fb;
--footer-muted: #a1acba;
--footer-border: rgba(207, 217, 230, 0.12);
```

- [ ] **Step 3: Add the base footer, conversion, directory, and link styles**

Append the following footer block before the header component styles in `src/styles/global.css`:

```css
.footer-bar {
	position: relative;
	isolation: isolate;
	overflow: clip;
	background: var(--footer-bg);
	color: var(--footer-text);
}

.footer-bar::before {
	position: absolute;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	content: "";
	background:
		radial-gradient(
			circle at 92% 8%,
			color-mix(in srgb, var(--action) 18%, transparent),
			transparent 26rem
		),
		linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
		linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
	background-size: auto, 72px 72px, 72px 72px;
}

.footer-shell {
	width: min(100%, 88rem);
	max-width: 88rem;
	margin-inline: auto;
	padding: clamp(3.5rem, 8vw, 6.5rem) 1rem 1.5rem;
}

.footer-conversion {
	display: grid;
	gap: 2rem;
	align-items: end;
	padding-bottom: clamp(3rem, 6vw, 5rem);
	border-bottom: 1px solid var(--footer-border);
}

.footer-eyebrow,
.footer-group-title {
	font-size: 0.72rem;
	font-weight: 850;
	letter-spacing: 0.18em;
	text-transform: uppercase;
}

.footer-eyebrow {
	color: var(--action);
}

.footer-conversion h2 {
	max-width: 18ch;
	margin-top: 0.9rem;
	color: var(--footer-text);
	font-size: clamp(2.35rem, 5.5vw, 5.25rem);
	font-weight: 850;
	line-height: 0.98;
	letter-spacing: -0.055em;
}

.footer-conversion__copy {
	max-width: 46rem;
	margin-top: 1.25rem;
	color: var(--footer-muted);
	font-size: clamp(1rem, 1.6vw, 1.2rem);
	line-height: 1.65;
}

.footer-cta {
	width: 100%;
	min-height: 3.25rem;
	justify-content: center;
	white-space: nowrap;
}

.footer-cta svg,
.footer-group-more svg,
.footer-contact a svg {
	width: 1rem;
	height: 1rem;
}

.footer-directory {
	display: grid;
	gap: 2.25rem;
	padding-block: clamp(2.75rem, 5vw, 4.5rem);
	border-bottom: 1px solid var(--footer-border);
}

.footer-group-title {
	margin-bottom: 1rem;
	color: var(--footer-text);
}

.footer-identity > p:not(.footer-group-title, .footer-availability) {
	max-width: 28rem;
	color: var(--footer-muted);
	line-height: 1.7;
}

.footer-availability {
	display: flex;
	align-items: center;
	gap: 0.6rem;
	margin-top: 1.2rem;
	color: var(--footer-text);
	font-size: 0.84rem;
	font-weight: 750;
}

.footer-availability > span {
	width: 0.5rem;
	height: 0.5rem;
	flex: 0 0 auto;
	border-radius: 999px;
	background: var(--action);
	box-shadow: 0 0 0 0.28rem color-mix(in srgb, var(--action) 14%, transparent);
}

.footer-desktop-nav {
	display: none;
}

.footer-mobile-disclosures {
	display: grid;
	border-top: 1px solid var(--footer-border);
}

.footer-disclosure {
	border-bottom: 1px solid var(--footer-border);
}

.footer-disclosure summary {
	display: flex;
	min-height: 3.5rem;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	cursor: pointer;
	color: var(--footer-text);
	font-size: 0.78rem;
	font-weight: 850;
	letter-spacing: 0.16em;
	list-style: none;
	text-transform: uppercase;
}

.footer-disclosure summary::-webkit-details-marker {
	display: none;
}

.footer-disclosure summary svg {
	width: 1.1rem;
	height: 1.1rem;
	color: var(--action);
	transition: transform 180ms ease;
}

.footer-disclosure[open] summary svg {
	transform: rotate(45deg);
}

.footer-disclosure ul {
	display: grid;
	gap: 0.1rem;
	padding-bottom: 1rem;
}

.footer-link-group ul,
.footer-contact ul {
	display: grid;
	gap: 0.2rem;
}

.footer-link-group a,
.footer-disclosure a,
.footer-contact a,
.footer-legal a,
.footer-legal button {
	color: var(--footer-muted);
}

.footer-link-group a,
.footer-disclosure a {
	display: inline-flex;
	min-height: 2.75rem;
	align-items: center;
	gap: 0.45rem;
	font-size: 0.92rem;
	font-weight: 650;
}

.footer-link-group a:hover,
.footer-link-group a:focus-visible,
.footer-disclosure a:hover,
.footer-disclosure a:focus-visible,
.footer-contact a:hover,
.footer-contact a:focus-visible,
.footer-legal a:hover,
.footer-legal a:focus-visible,
.footer-legal button:hover,
.footer-legal button:focus-visible {
	color: var(--action);
}

.footer-group-more {
	color: var(--footer-text) !important;
}

.footer-contact a {
	display: grid;
	min-height: 2.75rem;
	grid-template-columns: 1.25rem minmax(0, 1fr) auto;
	align-items: center;
	gap: 0.7rem;
	border-bottom: 1px solid var(--footer-border);
	font-size: 0.92rem;
	font-weight: 700;
}

.footer-legal {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding-top: 1.5rem;
	color: var(--footer-muted);
	font-size: 0.8rem;
}

.footer-legal__links {
	display: flex;
	flex-wrap: wrap;
	gap: 0.65rem 1.25rem;
}

.footer-legal button {
	padding: 0;
	border: 0;
	background: transparent;
	cursor: pointer;
	font: inherit;
}
```

- [ ] **Step 4: Add desktop and reduced-motion rules**

Append:

```css
@media (min-width: 40rem) {
	.footer-shell {
		padding-inline: 1.5rem;
	}

	.footer-cta {
		width: fit-content;
	}

	.footer-legal {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
}

@media (min-width: 68rem) {
	.footer-conversion {
		grid-template-columns: minmax(0, 1.6fr) auto;
	}

	.footer-directory {
		grid-template-columns: minmax(16rem, 1.35fr) minmax(22rem, 1.45fr) minmax(13rem, 0.8fr);
		gap: clamp(2rem, 4vw, 5rem);
	}

	.footer-desktop-nav {
		display: grid;
		grid-template-columns: minmax(12rem, 1.25fr) minmax(8rem, 0.75fr);
		gap: clamp(2rem, 4vw, 4rem);
	}

	.footer-mobile-disclosures {
		display: none;
	}
}

@media (prefers-reduced-motion: reduce) {
	.footer-disclosure summary svg,
	.footer-link-group a,
	.footer-disclosure a,
	.footer-contact a {
		transition: none;
	}
}
```

- [ ] **Step 5: Format and confirm the styles phase is green**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier src/styles/global.css --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:footer-redesign -- --phase=styles
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
```

Expected: footer verifier passes through styles, Astro reports no diagnostics, and ESLint exits with code `0`.

- [ ] **Step 6: Commit the editorial visual system**

```bash
git add src/styles/global.css
git commit -m "style(footer): add responsive editorial layout"
```

---

### Task 4: Verify generated output and visual behavior

**Files:**

- Test: `scripts/verify-footer-redesign.mjs`
- Inspect: `dist/client/es/index.html`
- Inspect: `dist/client/en/index.html`

**Interfaces:**

- Consumes: complete footer implementation from Tasks 1–3.
- Produces: fresh evidence that source checks, generated localized output, responsive layout, dark mode, disclosures, cookie settings, and contact routes work together.

- [ ] **Step 1: Run repository formatting**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format
```

Expected: Prettier completes without an error. Review `git diff --stat` and ensure only planned files changed.

- [ ] **Step 2: Run the required static validation set**

Run each command and require exit code `0`:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:footer-redesign -- --phase=styles
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:ai-seo
```

Expected: Astro has zero diagnostics, ESLint has zero warnings, formatting is clean, and both verification scripts pass.

- [ ] **Step 3: Build and verify generated localized output**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:footer-redesign -- --phase=styles --dist
```

Expected: Astro completes the production build and the footer verifier reports `Footer redesign verification passed through styles.`

- [ ] **Step 4: Perform desktop visual checks**

Start the local server with:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run dev
```

At `1440 × 900`, inspect `/es`, `/en/services`, and one long blog article. Confirm:

- The footer is full width while its content aligns to the `88rem` header shell.
- The conversion band has one dominant red CTA and does not look like a card.
- The six priority service links and their localized routes are visible.
- The availability signal, WhatsApp, email, and LinkedIn are readable.
- GitHub is absent.
- Light and dark themes preserve contrast and the footer remains visually distinct from the page.
- The page has no horizontal overflow.

- [ ] **Step 5: Perform mobile interaction checks**

At `390 × 844`, inspect `/es`, `/en/blog`, and `/es/contact`. Confirm:

- The CTA is full width and all text wraps without clipping.
- Identity and direct contact remain visible.
- Services and Explore disclosures open and close with pointer and keyboard input.
- Disclosure summaries, CTA, contact rows, and legal utilities have comfortable touch targets.
- The cookie-settings action opens the existing settings dialog.
- Back to top moves the viewport to `#top` without changing route.
- Dark mode and long English labels do not create horizontal overflow.

- [ ] **Step 6: Review the final Git state**

Run:

```bash
git diff --check
git status -sb
git log --oneline -5
```

Expected: no unstaged implementation changes remain, no whitespace errors are reported, and the footer commits are the latest focused commits on `main`.
