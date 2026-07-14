# Global Header Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a conversion-focused global header with an 88rem desktop composition, a compact scroll state and an accessible full-screen mobile navigation.

**Architecture:** `Header.astro` remains the global entry point and owns route localization and the desktop bar. `MobileHeaderMenu.astro` renders the full-screen mobile layer, while `header-controller.ts` owns scroll, theme and accessible menu behaviour. Global CSS defines shared responsive visual states, and a repository verification script protects structure, copy, interaction markers and generated output.

**Tech Stack:** Astro 7, TypeScript 5.9, Tailwind CSS 4, CSS custom properties, Node.js 24 verification scripts.

## Global Constraints

- Work directly on `main`; do not create a worktree or feature branch.
- Use `pnpm` with Node `>=24.0.0` and `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"` when required.
- Keep the header globally shared through `src/layouts/BaseLayout.astro`.
- Use `var(--home-navy)` for identity and primary navigation.
- Use `var(--action)` only for the primary CTA, active route and small conversion signals.
- Keep one primary header CTA: the localized free initial assessment linking to `/{locale}/contact?service=assessment`.
- Do not add WhatsApp, social links, cyan commercial accents, ornamental cards or excessive shadows.
- Preserve Spanish and English routes, light and dark themes, visible focus and reduced-motion behaviour.
- Validate 390px mobile, representative tablet widths and 1440px desktop without horizontal overflow.

---

## File Structure

- Create `scripts/verify-header-redesign.mjs`: phased source and generated-output contract.
- Create `src/components/common/MobileHeaderMenu.astro`: mobile-only full-screen menu markup.
- Create `src/lib/header-controller.ts`: browser controller for compact state, theme synchronization, focus containment and menu lifecycle.
- Modify `src/components/common/Header.astro`: localized route model, desktop composition, compact mobile bar and controller initialization.
- Modify `src/styles/global.css`: desktop, tablet, mobile, open-menu and reduced-motion presentation.
- Modify `src/i18n/es.json` and `src/i18n/en.json`: bilingual role, availability, preferences and full CTA copy.
- Modify `package.json`: expose `pnpm run verify:header-redesign`.

The components share this structural interface:

```ts
export interface HeaderNavigationItem {
	index: string;
	href: string;
	label: string;
	active: boolean;
}
```

The browser module exposes:

```ts
export const initSiteHeader = (): void => {};
```

---

### Task 1: Protect localized conversion copy with a phased verifier

**Files:**

- Create: `scripts/verify-header-redesign.mjs`
- Modify: `package.json`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

**Interfaces:**

- Consumes: existing JSON dictionaries and repository source files.
- Produces: `pnpm run verify:header-redesign` and the keys `header.role`, `header.availability`, `header.preferences`, and `header.assessmentCta`.

- [ ] **Step 1: Write the verification script**

Create `scripts/verify-header-redesign.mjs`:

```js
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
		else if (current <= previous) failures.push(`${label}: wrong order ${marker}`);
		previous = current;
	}
};

if (includesPhase("copy")) {
	for (const locale of ["es", "en"]) {
		const dictionary = JSON.parse(
			await readSource("src", "i18n", `${locale}.json`),
		);
		for (const key of ["role", "availability", "preferences", "assessmentCta"]) {
			if (!dictionary.header?.[key]) failures.push(`${locale}: missing header.${key}`);
		}
	}
}

if (includesPhase("structure")) {
	const header = await readSource("src", "components", "common", "Header.astro");
	const mobile = await readSource("src", "components", "common", "MobileHeaderMenu.astro");
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
	const header = await readSource("src", "components", "common", "Header.astro");
	const controller = await readSource("src", "lib", "header-controller.ts");
	requireMarkers("header controller import", header, ["initSiteHeader", "initSiteHeader();"]);
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
				if (!html.includes(marker)) failures.push(`${locale}: dist missing ${marker}`);
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
```

- [ ] **Step 2: Add the package command**

Add beside the existing verification scripts in `package.json`:

```json
"verify:header-redesign": "node scripts/verify-header-redesign.mjs"
```

- [ ] **Step 3: Run the copy phase and verify the red state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:header-redesign -- --phase=copy
```

Expected: FAIL with missing `header.role`, `header.preferences`, and `header.assessmentCta`.

- [ ] **Step 4: Add the exact bilingual copy**

Merge these values into `src/i18n/es.json`:

```json
"role": "Desarrollador full-stack",
"availability": "Disponible para nuevos proyectos",
"preferences": "Preferencias",
"assessmentCta": "Primera valoración gratuita"
```

Merge the equivalent values into `src/i18n/en.json`:

```json
"role": "Full-stack developer",
"availability": "Available for new projects",
"preferences": "Preferences",
"assessmentCta": "Free initial assessment"
```

- [ ] **Step 5: Verify, format and commit**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:header-redesign -- --phase=copy
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier scripts/verify-header-redesign.mjs package.json src/i18n/es.json src/i18n/en.json --write
git add scripts/verify-header-redesign.mjs package.json src/i18n/es.json src/i18n/en.json
git commit -m "test(header): define redesign contract"
```

Expected: PASS through `copy`, followed by one focused commit.

---

### Task 2: Build the desktop and mobile semantic structure

**Files:**

- Create: `src/components/common/MobileHeaderMenu.astro`
- Create: `src/lib/header-controller.ts`
- Modify: `src/components/common/Header.astro`

**Interfaces:**

- Consumes: Task 1 copy, `ThemeToggle`, `LanguageToggle`, `Locale`, and localized alternate URLs.
- Produces: `[data-site-header]`, `[data-menu-open]`, `#mobile-header-menu`, and the complete navigation DOM used by Tasks 3 and 4.

- [ ] **Step 1: Run the structural phase and verify the red state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:header-redesign -- --phase=structure
```

Expected: FAIL because `MobileHeaderMenu.astro` and the new data attributes do not exist.

- [ ] **Step 2: Create `MobileHeaderMenu.astro`**

Create the component with the following full structure:

```astro
---
import { Icon } from "astro-icon/components";
import LanguageToggle from "@/components/common/LanguageToggle.astro";
import ThemeToggle from "@/components/common/ThemeToggle.astro";
import { t, type Locale } from "@/i18n";

export interface HeaderNavigationItem {
	index: string;
	href: string;
	label: string;
	active: boolean;
}

interface Props {
	locale: Locale;
	languageHref?: string;
	links: HeaderNavigationItem[];
	contactHref: string;
}

const { locale, languageHref, links, contactHref } = Astro.props as Props;
---

<div id="mobile-header-menu" class="mobile-header-menu" data-mobile-menu aria-hidden="true" hidden>
	<section class="mobile-header-menu__panel" data-menu-panel role="dialog" aria-modal="true" aria-labelledby="mobile-header-title">
		<header class="mobile-header-menu__top">
			<div>
				<p id="mobile-header-title" class="mobile-header-menu__name">José Miguel Fernández</p>
				<p class="mobile-header-menu__role">{t(locale, "header.role")}</p>
			</div>
			<button type="button" class="header-utility mobile-header-menu__close" data-menu-close aria-label={t(locale, "header.closeMenu")}>
				<Icon name="x" class="h-5 w-5" />
			</button>
		</header>

		<div class="mobile-header-menu__body">
			<nav aria-label={t(locale, "header.mobileNav")}>
				<ul class="mobile-header-menu__list">
					{links.map((link) => (
						<li>
							<a href={link.href} class="mobile-header-menu__link" aria-current={link.active ? "page" : undefined} data-close-menu>
								<span class="mobile-header-menu__link-index">{link.index}</span>
								<span>{link.label}</span>
								<Icon name="arrow-up-right" class="h-5 w-5" />
							</a>
						</li>
					))}
				</ul>
			</nav>

			<div class="mobile-header-menu__preferences">
				<div>
					<p class="eyebrow">{t(locale, "header.preferences")}</p>
					<p class="mobile-header-menu__availability"><span aria-hidden="true"></span>{t(locale, "header.availability")}</p>
				</div>
				<div class="mobile-header-menu__controls">
					<LanguageToggle locale={locale} href={languageHref} />
					<ThemeToggle locale={locale} />
				</div>
			</div>
		</div>

		<footer class="mobile-header-menu__footer">
			<a href={contactHref} class="button-action w-full" data-close-menu>
				{t(locale, "header.assessmentCta")}<Icon name="arrow-right" class="h-4 w-4" />
			</a>
		</footer>
	</section>
</div>
```

- [ ] **Step 3: Replace `Header.astro` with the approved composition**

Keep the current locale helpers, but replace `links`, CTA selection, markup and inline script with:

```astro
---
import { Icon } from "astro-icon/components";
import LanguageToggle from "@/components/common/LanguageToggle.astro";
import MobileHeaderMenu from "@/components/common/MobileHeaderMenu.astro";
import ThemeToggle from "@/components/common/ThemeToggle.astro";
import { t, type Locale } from "@/i18n";

interface NavLink { href: string; labelKey: string }
interface Props { locale?: Locale; languageHref?: string }

const links: NavLink[] = [
	{ href: "/", labelKey: "nav.home" },
	{ href: "/services", labelKey: "nav.services" },
	{ href: "/projects", labelKey: "nav.projects" },
	{ href: "/about", labelKey: "nav.about" },
	{ href: "/blog", labelKey: "nav.blog" },
];
const { locale = "es", languageHref } = Astro.props as Props;
const normalizePath = (path: string) => path === "/" ? "/" : path.replace(/\/$/, "");
const withLocale = (href: string, loc: Locale) => href === "/" ? `/${loc}` : `/${loc}${href}`;
const stripLocalePrefix = (pathname: string) => pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
const normalizedCurrent = normalizePath(stripLocalePrefix(Astro.url.pathname));
const contactHref = withLocale("/contact?service=assessment", locale);
const navigationItems = links.map((link, index) => ({
	index: String(index + 1).padStart(2, "0"),
	href: withLocale(link.href, locale),
	label: t(locale, link.labelKey),
	active: normalizedCurrent === link.href || (link.href !== "/" && normalizedCurrent.startsWith(`${link.href}/`)),
}));
---

<header class="header-bar sticky top-0 z-50" data-site-header data-compact="false">
	<div class="header-shell">
		<div class="header-inner" data-header-inner>
			<a href={withLocale("/", locale)} class="header-brand" aria-label={t(locale, "nav.home")}>
				<span class="header-brand__mark">JMF</span>
				<span class="header-brand__copy">
					<strong><span class="header-brand__name-short">José Miguel</span><span class="header-brand__name-full">José Miguel Fernández</span></strong>
					<span>{t(locale, "header.role")}</span>
				</span>
			</a>
			<nav class="header-desktop-nav" aria-label="Main">
				{navigationItems.map((link) => (
					<a href={link.href} class="header-nav-link" aria-current={link.active ? "page" : undefined}>{link.label}</a>
				))}
			</nav>
			<div class="header-desktop-actions">
				<LanguageToggle locale={locale} href={languageHref} />
				<ThemeToggle locale={locale} />
				<a href={contactHref} class="button-action header-cta">{t(locale, "header.assessmentCta")}<Icon name="arrow-right" class="h-4 w-4" /></a>
			</div>
			<div class="header-mobile-actions">
				<LanguageToggle locale={locale} href={languageHref} />
				<button type="button" class="header-utility header-menu-trigger" data-menu-open aria-expanded="false" aria-controls="mobile-header-menu" aria-label={t(locale, "header.openMenu")}>
					<Icon name="menu" class="h-5 w-5" />
				</button>
			</div>
		</div>
	</div>
</header>

<MobileHeaderMenu locale={locale} languageHref={languageHref} links={navigationItems} contactHref={contactHref} />

<script>
	import { initSiteHeader } from "@/lib/header-controller";
	initSiteHeader();
</script>
```

- [ ] **Step 4: Add the temporary controller export**

Create `src/lib/header-controller.ts`:

```ts
export const initSiteHeader = (): void => {};
```

- [ ] **Step 5: Verify, format and commit**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:header-redesign -- --phase=structure
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier src/components/common/Header.astro src/components/common/MobileHeaderMenu.astro src/lib/header-controller.ts --write
git add src/components/common/Header.astro src/components/common/MobileHeaderMenu.astro src/lib/header-controller.ts
git commit -m "refactor(header): build editorial navigation"
```

Expected: structure and Astro checks pass, then one semantic-structure commit is created.

---

### Task 3: Apply the wide responsive visual system

**Files:**

- Modify: `src/styles/global.css`

**Interfaces:**

- Consumes: the classes and data attributes created in Task 2.
- Produces: an 88rem shell, an 80px-to-64px compact treatment, one complete 68rem desktop/mobile switch, and a full-viewport mobile menu.

- [ ] **Step 1: Run the style phase and verify the red state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:header-redesign -- --phase=styles
```

Expected: FAIL with missing `.header-shell`, compact-state, breakpoint and mobile-menu markers.

- [ ] **Step 2: Replace the current header rules in `global.css`**

Remove the old `.header-bar`, `.header-nav-link` and `.header-utility` rules, then insert this complete replacement in the same location:

```css
.header-bar {
	height: 5rem;
	background: transparent;
	color: var(--home-navy);
}

.header-shell {
	width: 100%;
	max-width: 88rem;
	height: 100%;
	margin-inline: auto;
	padding-inline: 1rem;
}

.header-inner {
	display: flex;
	min-height: 5rem;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	border-bottom: 1px solid var(--surface-border);
	background: color-mix(in srgb, var(--bg) 84%, transparent);
	backdrop-filter: blur(18px);
	transition: min-height 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
}

.header-bar[data-compact="true"] .header-inner {
	min-height: 4rem;
	background: color-mix(in srgb, var(--surface) 94%, transparent);
	box-shadow: 0 10px 30px color-mix(in srgb, var(--home-navy) 8%, transparent);
}

.header-brand {
	display: inline-flex;
	min-width: 0;
	align-items: center;
	gap: 0.75rem;
	color: var(--home-navy);
}

.header-brand__mark {
	display: grid;
	width: 2.5rem;
	height: 2.5rem;
	flex: 0 0 auto;
	place-items: center;
	border: 1px solid color-mix(in srgb, var(--action) 30%, var(--surface-border));
	border-radius: 999px;
	background: var(--surface);
	font-size: 0.72rem;
	font-weight: 900;
	letter-spacing: 0.04em;
}

.header-brand__copy {
	display: grid;
	line-height: 1.15;
}

.header-brand__copy strong {
	font-size: 0.86rem;
	font-weight: 800;
}

.header-brand__copy > span {
	margin-top: 0.2rem;
	font-size: 0.68rem;
	color: var(--text-muted);
}

.header-brand__name-full {
	display: none;
}

.header-brand__name-short {
	display: inline;
}

.header-desktop-nav,
.header-desktop-actions {
	display: none;
}

.header-mobile-actions,
.mobile-header-menu__controls {
	display: flex;
	align-items: center;
	gap: 0.25rem;
}

.header-menu-trigger,
.mobile-header-menu__close {
	display: inline-grid;
	min-width: 2.75rem;
	min-height: 2.75rem;
	place-items: center;
	border-radius: 999px;
}

.header-utility {
	border: 1px solid transparent;
	background: transparent;
	color: var(--text-muted);
}

.header-utility:hover,
.header-utility:focus-visible {
	border-color: var(--surface-border);
	background: var(--surface);
	color: var(--home-navy);
}

.mobile-header-menu {
	position: fixed;
	inset: 0;
	z-index: 70;
	background: var(--bg);
	opacity: 0;
	visibility: hidden;
	transition: opacity 220ms ease, visibility 220ms ease;
}

.mobile-header-menu[data-open="true"] {
	opacity: 1;
	visibility: visible;
}

.mobile-header-menu__panel {
	display: grid;
	height: 100dvh;
	grid-template-rows: auto minmax(0, 1fr) auto;
	background: radial-gradient(circle at 90% 10%, color-mix(in srgb, var(--action) 9%, transparent), transparent 30%), var(--bg);
}

.mobile-header-menu__top,
.mobile-header-menu__footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem;
}

.mobile-header-menu__top {
	border-bottom: 1px solid var(--surface-border);
}

.mobile-header-menu__name {
	font-size: 0.95rem;
	font-weight: 850;
	color: var(--home-navy);
}

.mobile-header-menu__role {
	margin-top: 0.2rem;
	font-size: 0.76rem;
	color: var(--text-muted);
}

.mobile-header-menu__body {
	overflow-y: auto;
	overscroll-behavior: contain;
	padding: 0.5rem 1rem 1.25rem;
}

.mobile-header-menu__list,
.mobile-header-menu__list li {
	border-top: 1px solid var(--surface-border);
}

.mobile-header-menu__list li + li {
	border-top: 0;
}

.mobile-header-menu__list li {
	border-bottom: 1px solid var(--surface-border);
}

.mobile-header-menu__link {
	display: grid;
	min-height: 4.75rem;
	grid-template-columns: 2.25rem minmax(0, 1fr) auto;
	align-items: center;
	gap: 0.75rem;
	color: var(--home-navy);
	font-size: clamp(1.35rem, 6vw, 1.8rem);
	font-weight: 850;
}

.mobile-header-menu__link-index {
	font-size: 0.66rem;
	font-weight: 800;
	letter-spacing: 0.16em;
	color: var(--text-muted);
}

.mobile-header-menu__link[aria-current="page"],
.mobile-header-menu__link:hover,
.mobile-header-menu__link:focus-visible,
.mobile-header-menu__link[aria-current="page"] .mobile-header-menu__link-index {
	color: var(--action);
}

.mobile-header-menu__preferences {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 1rem;
	padding-top: 1.5rem;
}

.mobile-header-menu__availability {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 0.65rem;
	font-size: 0.78rem;
	font-weight: 700;
	color: var(--text-muted);
}

.mobile-header-menu__availability span {
	width: 0.5rem;
	height: 0.5rem;
	border-radius: 999px;
	background: var(--action);
	box-shadow: 0 0 0 0.25rem color-mix(in srgb, var(--action) 12%, transparent);
}

.mobile-header-menu__footer {
	border-top: 1px solid var(--surface-border);
	background: color-mix(in srgb, var(--surface) 92%, transparent);
}

body.mobile-menu-open {
	overflow: hidden;
}

@media (max-width: 24rem) {
	.header-brand__copy strong { font-size: 0.78rem; }
	.header-brand__copy > span { display: none; }
	.header-brand__name-short { display: inline; }
}

@media (min-width: 40rem) {
	.header-shell,
	.mobile-header-menu__top,
	.mobile-header-menu__body,
	.mobile-header-menu__footer { padding-inline: 1.5rem; }
}

@media (min-width: 68rem) {
	.header-brand__name-full { display: inline; }
	.header-brand__name-short { display: none; }
	.header-desktop-nav,
	.header-desktop-actions { display: flex; align-items: center; }
	.header-desktop-nav { gap: 0.15rem; }
	.header-desktop-actions { gap: 0.25rem; }
	.header-mobile-actions { display: none; }
	.header-nav-link {
		position: relative;
		min-height: 2.75rem;
		padding: 0.8rem 0.7rem;
		color: var(--text-muted);
		font-size: 0.82rem;
		font-weight: 750;
	}
	.header-nav-link::after {
		position: absolute;
		right: 0.7rem;
		bottom: 0.35rem;
		left: 0.7rem;
		height: 2px;
		border-radius: 999px;
		background: var(--action);
		content: "";
		transform: scaleX(0);
		transition: transform 160ms ease;
	}
	.header-nav-link:hover,
	.header-nav-link:focus-visible,
	.header-nav-link[aria-current="page"] { color: var(--home-navy); }
	.header-nav-link[aria-current="page"]::after { transform: scaleX(1); }
	.header-cta {
		min-height: 2.75rem;
		padding: 0.7rem 1rem;
		font-size: 0.78rem;
		white-space: nowrap;
	}
	.mobile-header-menu { display: none; }
}

@media (min-width: 76rem) {
	.header-nav-link { padding-inline: 0.9rem; }
	.header-nav-link::after { right: 0.9rem; left: 0.9rem; }
	.header-cta { padding-inline: 1.15rem; font-size: 0.82rem; }
}

@media (prefers-reduced-motion: reduce) {
	.header-inner,
	.header-nav-link::after,
	.mobile-header-menu { transition: none; }
}
```

- [ ] **Step 3: Verify, format and commit**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:header-redesign -- --phase=styles
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier src/styles/global.css --write
git add src/styles/global.css
git commit -m "style(header): add responsive conversion layout"
```

Expected: style and Astro checks pass, then a CSS-only commit is created.

---

### Task 4: Implement compact scroll and accessible menu behaviour

**Files:**

- Modify: `src/lib/header-controller.ts`

**Interfaces:**

- Consumes: `[data-site-header]`, `[data-menu-open]`, `[data-mobile-menu]`, `[data-menu-panel]`, `[data-menu-close]`, and `[data-close-menu]`.
- Produces: idempotent `initSiteHeader(): void`, a 24px compact threshold, theme synchronization, focus containment, focus restoration and cleanup at 68rem.

- [ ] **Step 1: Run the behaviour phase and verify the red state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:header-redesign -- --phase=behavior
```

Expected: FAIL because the temporary controller has no interaction implementation.

- [ ] **Step 2: Replace the controller with the full implementation**

Write `src/lib/header-controller.ts`:

```ts
const FOCUSABLE_SELECTOR = [
	'a[href]:not([tabindex="-1"])',
	'button:not([disabled]):not([tabindex="-1"])',
	'[tabindex]:not([tabindex="-1"])',
].join(",");

const isDark = () => document.documentElement.classList.contains("dark");

const syncThemeButtons = () => {
	document.querySelectorAll<HTMLButtonElement>("button.theme-toggle").forEach((button) => {
		const sun = button.querySelector<HTMLElement>('[data-theme-icon="sun"]');
		const moon = button.querySelector<HTMLElement>('[data-theme-icon="moon"]');
		const dark = isDark();
		sun?.classList.toggle("hidden", !dark);
		moon?.classList.toggle("hidden", dark);
		button.setAttribute(
			"aria-label",
			dark
				? button.dataset.labelLight ?? "Switch to light mode"
				: button.dataset.labelDark ?? "Switch to dark mode",
		);
	});
};

export const initSiteHeader = (): void => {
	const header = document.querySelector<HTMLElement>("[data-site-header]");
	const trigger = document.querySelector<HTMLButtonElement>("[data-menu-open]");
	const menu = document.querySelector<HTMLElement>("[data-mobile-menu]");
	const panel = document.querySelector<HTMLElement>("[data-menu-panel]");
	const closeButton = document.querySelector<HTMLButtonElement>("[data-menu-close]");
	if (!header || header.dataset.initialized === "true") return;
	header.dataset.initialized = "true";

	let previousFocus: HTMLElement | null = null;
	let closeTimer: number | undefined;
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const desktop = window.matchMedia("(min-width: 68rem)");

	const setCompactState = () => {
		header.dataset.compact = String(window.scrollY > 24);
	};
	const getFocusable = () =>
		panel
			? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
					(element) => element.getClientRects().length > 0,
				)
			: [];
	const finishClose = (restoreFocus: boolean) => {
		if (!menu) return;
		menu.hidden = true;
		if (restoreFocus) previousFocus?.focus();
		previousFocus = null;
	};
	const closeMenu = (restoreFocus = true) => {
		if (!menu || menu.hidden) return;
		window.clearTimeout(closeTimer);
		menu.dataset.open = "false";
		menu.setAttribute("aria-hidden", "true");
		trigger?.setAttribute("aria-expanded", "false");
		document.body.classList.remove("mobile-menu-open");
		closeTimer = window.setTimeout(
			() => finishClose(restoreFocus),
			reducedMotion.matches ? 0 : 220,
		);
	};
	const openMenu = () => {
		if (!menu || !panel || !trigger) return;
		window.clearTimeout(closeTimer);
		previousFocus = document.activeElement as HTMLElement | null;
		menu.hidden = false;
		menu.setAttribute("aria-hidden", "false");
		trigger.setAttribute("aria-expanded", "true");
		document.body.classList.add("mobile-menu-open");
		requestAnimationFrame(() => {
			menu.dataset.open = "true";
			closeButton?.focus();
		});
	};
	const containFocus = (e: KeyboardEvent) => {
		if (e.key === "Escape" && menu && !menu.hidden) {
			e.preventDefault();
			closeMenu();
			return;
		}
		if (e.key !== "Tab" || !menu || menu.hidden) return;
		const focusable = getFocusable();
		const first = focusable[0];
		const last = focusable.at(-1);
		if (!first || !last) return;
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	};

	document.querySelectorAll<HTMLElement>("a[data-lang]").forEach((link) => {
		link.addEventListener("click", () => {
			const language = link.dataset.lang;
			if (language === "en" || language === "es") localStorage.setItem("lang", language);
		});
	});
	syncThemeButtons();
	document.querySelectorAll<HTMLButtonElement>("button.theme-toggle").forEach((button) => {
		button.addEventListener("click", () => {
			const nextDark = !isDark();
			document.documentElement.classList.toggle("dark", nextDark);
			localStorage.setItem("theme", nextDark ? "dark" : "light");
			syncThemeButtons();
		});
	});

	setCompactState();
	window.addEventListener("scroll", setCompactState, { passive: true });
	trigger?.addEventListener("click", openMenu);
	closeButton?.addEventListener("click", () => closeMenu());
	menu?.querySelectorAll<HTMLElement>("[data-close-menu]").forEach((element) => {
		element.addEventListener("click", () => closeMenu(false));
	});
	document.addEventListener("keydown", containFocus);
	desktop.addEventListener("change", (event) => {
		if (event.matches) closeMenu(false);
	});
};
```

- [ ] **Step 3: Verify, format and commit**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:header-redesign -- --phase=behavior
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier src/lib/header-controller.ts --write
git add src/lib/header-controller.ts
git commit -m "feat(header): add accessible menu behavior"
```

Expected: behaviour and type checks pass, followed by one interaction-only commit.

---

### Task 5: Verify generated routes and responsive presentation

**Files:**

- Modify only when validation exposes a defect: `src/components/common/Header.astro`, `src/components/common/MobileHeaderMenu.astro`, `src/lib/header-controller.ts`, `src/styles/global.css`, `src/i18n/es.json`, `src/i18n/en.json`, `scripts/verify-header-redesign.mjs`, `package.json`.

**Interfaces:**

- Consumes: the complete implementation from Tasks 1–4.
- Produces: a production build with the new header on Spanish and English pages and a completed visual QA pass.

- [ ] **Step 1: Run the complete automated validation set**

Run each command separately:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:ai-seo
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:header-redesign -- --phase=behavior --dist
```

Expected: every command exits 0; the final command reports `Header redesign verification passed through behavior.`

- [ ] **Step 2: Start the production preview**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run preview -- --host 127.0.0.1
```

Expected: Astro prints a local preview URL, normally `http://127.0.0.1:4321`.

- [ ] **Step 3: Check desktop and tablet presentation**

At 1440px and representative widths around 1100px and 900px, inspect both `/es` and `/en/services` and confirm:

- the initial header aligns with the 88rem commercial shell;
- desktop order is Home, Services, Projects, About, Blog;
- the red free-assessment CTA is the only primary action;
- scrolling beyond 24px produces the compact state without collision;
- below 68rem the complete desktop navigation is replaced by the menu trigger;
- active state remains correct on a Spanish service detail and an English blog detail;
- light and dark themes preserve contrast without cyan commercial accents.

- [ ] **Step 4: Check the 390px mobile menu and keyboard flow**

At 390px, inspect `/es/blog` and `/en/projects` and confirm:

- the visible bar has no horizontal overflow;
- opening blocks background scroll and focuses the close button;
- links are large, numbered and divided by lines;
- the active route is red and exposes `aria-current="page"`;
- `Tab` and `Shift+Tab` remain inside the dialog;
- `Escape` closes and restores focus to the trigger;
- theme and language controls work inside the menu;
- the bottom CTA remains reachable on a short-height viewport;
- reduced-motion emulation removes visual transitions.

- [ ] **Step 5: Review repository scope**

Run:

```bash
git status -sb
git diff --check
git diff --stat
```

Expected: only planned header files appear and `git diff --check` emits no output.

- [ ] **Step 6: Commit validation corrections only when necessary**

If validation changed source files, run:

```bash
git add src/components/common/Header.astro src/components/common/MobileHeaderMenu.astro src/lib/header-controller.ts src/styles/global.css src/i18n/es.json src/i18n/en.json scripts/verify-header-redesign.mjs package.json
git commit -m "fix(header): polish responsive navigation"
```

Expected: no commit when validation required no correction; otherwise a header-only polish commit.

---

## Completion Criteria

- The global header uses an 88rem shell and the approved editorial conversion hierarchy.
- The CTA always shows the localized free initial assessment and uses the localized assessment contact URL.
- Desktop navigation remains complete until the single 68rem breakpoint.
- The full-screen mobile menu contains keyboard focus, restores focus and handles short viewports.
- Scroll compacting, theme switching, language persistence and nested-route active states work in both locales.
- Required repository checks and the production build pass.
- Manual checks at 390px, tablet widths and 1440px show no overflow, collision or dark-mode regression.
