# Shared Conversion CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace duplicated final CTA markup on every interior page with one reusable Astro component that preserves the approved project CTA design.

**Architecture:** A presentation-only `ConversionCta.astro` component accepts localized content and typed link actions, while each route remains responsible for choosing copy and destinations. One semantic `.conversion-cta` style replaces page-specific final CTA styles, and a focused source/dist verifier prevents duplicate implementations from returning.

**Tech Stack:** Astro 7, TypeScript 5.9, Tailwind CSS 4, Astro Icon, Node.js 24, pnpm.

## Global Constraints

- Work directly on `main`; do not create a worktree or feature branch.
- Preserve the existing bespoke home CTA and all non-final hero, form, header, footer, and exit-intent actions.
- Keep Spanish and English content equivalent in intent.
- Expose content and link behavior only; do not expose slots or arbitrary presentation classes.
- The primary action always uses `button-action` and `arrow-right`.
- The optional secondary action always uses `button-secondary`; external secondary actions use `move-up-right`, `_blank`, and `noopener noreferrer nofollow`.
- Preserve `data-contact-modal-open` on individual service-page primary actions.
- Use `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"` for every pnpm or Node command.
- Preserve unrelated user changes in the dirty worktree and stage only files belonging to each task.

---

## File map

- Create `src/components/common/ConversionCta.astro`: typed, presentation-only shared CTA.
- Create `scripts/verify-conversion-cta.mjs`: source and generated-output regression verifier.
- Modify `package.json`: expose `verify:conversion-cta`.
- Modify `scripts/verify-project-redesign.mjs`: replace its obsolete project-only CTA contract with the shared component contract.
- Modify `src/styles/global.css`: rename the canonical project CTA style and remove obsolete About CTA styling.
- Modify `src/pages/[locale]/projects/[project].astro`: first consumer and canonical migration.
- Modify `src/pages/[locale]/about.astro`: use the shared CTA.
- Modify `src/pages/[locale]/education.astro`: use the shared CTA.
- Modify `src/pages/[locale]/blog/index.astro`: use the shared CTA.
- Modify `src/pages/[locale]/blog/page/[page].astro`: use the shared CTA.
- Modify `src/layouts/BlogPostLayout.astro`: use the shared CTA on every article.
- Modify `src/pages/[locale]/services.astro`: use the shared CTA.
- Modify `src/pages/[locale]/services/[service].astro`: preserve modal and WhatsApp behavior through typed actions.
- Modify `src/pages/[locale]/[landing].astro`: use the shared CTA for every commercial landing.
- Modify `src/i18n/es.json` and `src/i18n/en.json`: add the two missing localized eyebrows.

---

### Task 1: Establish the component contract and migrate project details

**Files:**

- Create: `scripts/verify-conversion-cta.mjs`
- Create: `src/components/common/ConversionCta.astro`
- Modify: `package.json`
- Modify: `scripts/verify-project-redesign.mjs`
- Modify: `src/styles/global.css`
- Modify: `src/pages/[locale]/projects/[project].astro`

**Interfaces:**

- Produces `PrimaryCtaAction = { label: string; href: string; opensContactModal?: boolean }`.
- Produces `SecondaryCtaAction = { label: string; href: string; external?: boolean }`.
- Produces `ConversionCta` props `{ eyebrow, title, text, primary, secondary?, headingId? }`.
- Produces the stable markers `data-conversion-cta`, `data-conversion-primary`, and `data-conversion-secondary`.

- [ ] **Step 1: Write the failing component verifier**

Create `scripts/verify-conversion-cta.mjs` with source readers and these initial assertions:

```js
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
	'aria-labelledby={headingId}',
	'Icon name="arrow-right"',
	'Icon name="move-up-right"',
	"button-action",
	"button-secondary",
	'noopener noreferrer nofollow',
]) {
	if (!component.includes(marker)) failures.push(`component: missing ${marker}`);
}

for (const marker of [".conversion-cta {", ".dark .conversion-cta {"]) {
	if (!globalStyles.includes(marker)) failures.push(`styles: missing ${marker}`);
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
```

Add the package script:

```json
"verify:conversion-cta": "node scripts/verify-conversion-cta.mjs"
```

- [ ] **Step 2: Run the verifier and confirm the RED state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta
```

Expected: exit 1 with failures for the missing component, `.conversion-cta` style, and project consumer.

- [ ] **Step 3: Implement the minimal shared component**

Create `src/components/common/ConversionCta.astro`:

```astro
---
import { Icon } from "astro-icon/components";

export interface PrimaryCtaAction {
	label: string;
	href: string;
	opensContactModal?: boolean;
}

export interface SecondaryCtaAction {
	label: string;
	href: string;
	external?: boolean;
}

interface Props {
	eyebrow: string;
	title: string;
	text: string;
	primary: PrimaryCtaAction;
	secondary?: SecondaryCtaAction;
	headingId?: string;
}

const {
	eyebrow,
	title,
	text,
	primary,
	secondary,
	headingId = "conversion-cta-title",
} = Astro.props;
---

<section
	class="conversion-cta section-reveal mb-4 grid gap-8 rounded-[1.35rem] px-5 py-12 text-center sm:px-10 md:mb-10 md:py-14"
	aria-labelledby={headingId}
	data-conversion-cta
>
	<div>
		<p class="eyebrow text-[var(--action)]">{eyebrow}</p>
		<h2
			id={headingId}
			class="mx-auto mt-4 max-w-4xl text-4xl leading-tight font-black text-[var(--home-navy)] md:text-6xl"
		>
			{title}
		</h2>
		<p class="muted-copy mx-auto mt-5 max-w-2xl text-lg leading-8">
			{text}
		</p>
	</div>
	<div class="flex flex-col justify-center gap-3 sm:flex-row">
		<a
			href={primary.href}
			class="button-action w-full sm:w-auto"
			data-contact-modal-open={primary.opensContactModal || undefined}
			data-conversion-primary
		>
			{primary.label}
			<Icon name="arrow-right" class="h-4 w-4" aria-hidden="true" />
		</a>
		{
			secondary ? (
				<a
					href={secondary.href}
					target={secondary.external ? "_blank" : undefined}
					rel={
						secondary.external
							? "noopener noreferrer nofollow"
							: undefined
					}
					class="button-secondary w-full sm:w-auto"
					data-conversion-secondary
				>
					{secondary.label}
					{secondary.external ? (
						<Icon
							name="move-up-right"
							class="h-4 w-4"
							aria-hidden="true"
						/>
					) : null}
				</a>
			) : null
		}
	</div>
</section>
```

- [ ] **Step 4: Rename the canonical global style**

In `src/styles/global.css`, rename both `.project-detail-cta` selectors to `.conversion-cta` without changing their declarations:

```css
.conversion-cta {
	border: 1px solid color-mix(in srgb, var(--action) 18%, var(--surface-border));
	background:
		radial-gradient(
			circle at 92% 10%,
			color-mix(in srgb, var(--action) 14%, transparent),
			transparent 17rem
		),
		linear-gradient(
			145deg,
			var(--surface-strong),
			color-mix(in srgb, var(--surface) 94%, var(--action) 6%)
		);
	box-shadow:
		var(--shadow-card),
		inset 0 1px 0 color-mix(in srgb, var(--surface-strong) 82%, transparent);
}

.dark .conversion-cta {
	border-color: color-mix(in srgb, var(--action) 20%, var(--surface-border));
	background:
		radial-gradient(
			circle at 92% 10%,
			color-mix(in srgb, var(--action) 11%, transparent),
			transparent 17rem
		),
		linear-gradient(145deg, var(--surface-strong), var(--surface));
}
```

- [ ] **Step 5: Replace the project detail CTA markup**

Import the component in `src/pages/[locale]/projects/[project].astro` and replace the final section with:

```astro
<ConversionCta
	eyebrow={copy.cta.eyebrow}
	title={copy.cta.title}
	text={copy.cta.text}
	primary={{
		label: copy.cta.primary,
		href: `/${locale}/contact?service=assessment`,
	}}
	secondary={{ label: copy.cta.secondary, href: archivePath }}
	headingId="project-conversion-title"
/>
```

Keep the `Icon` import because the page still renders its back arrow.

- [ ] **Step 6: Update the existing project verifier for the shared contract**

In `scripts/verify-project-redesign.mjs`, replace the `data-project-detail-cta` assertion with:

```js
if (!detail.includes("ConversionCta")) {
	failures.push("detail CTA: shared ConversionCta component is required");
}
```

Replace its project-only CSS marker array with:

```js
for (const marker of [".conversion-cta {", ".dark .conversion-cta {"]) {
	if (!globalStyles.includes(marker)) {
		failures.push(`detail CTA: missing shared background style ${marker}`);
	}
}
```

In the generated output check, require `data-conversion-cta` instead of `data-project-detail-cta`.

- [ ] **Step 7: Run the focused verifier, project verifier, and Astro check**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-project-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: all three commands exit 0; Astro reports 0 errors, warnings, and hints.

- [ ] **Step 8: Commit the component contract**

```bash
git add package.json scripts/verify-conversion-cta.mjs scripts/verify-project-redesign.mjs src/components/common/ConversionCta.astro src/styles/global.css 'src/pages/[locale]/projects/[project].astro'
git commit -m "feat(cta): add shared conversion component"
```

---

### Task 2: Migrate standard interior page CTAs

**Files:**

- Modify: `scripts/verify-conversion-cta.mjs`
- Modify: `src/pages/[locale]/about.astro`
- Modify: `src/pages/[locale]/education.astro`
- Modify: `src/pages/[locale]/blog/index.astro`
- Modify: `src/pages/[locale]/blog/page/[page].astro`
- Modify: `src/layouts/BlogPostLayout.astro`
- Modify: `src/pages/[locale]/services.astro`
- Modify: `src/pages/[locale]/[landing].astro`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Modify: `src/styles/global.css`

**Interfaces:**

- Consumes the `ConversionCta` props and action types from Task 1.
- Preserves each page's existing destinations and localized copy.
- Adds `blog.page.cta.eyebrow` and `services.hub.ctaEyebrow` in both locales.

- [ ] **Step 1: Extend the verifier for every standard consumer**

Add source reads for the seven consumers and require the shared component:

```js
const standardConsumers = [
	["about", "src/pages/[locale]/about.astro"],
	["education", "src/pages/[locale]/education.astro"],
	["blog index", "src/pages/[locale]/blog/index.astro"],
	["blog pagination", "src/pages/[locale]/blog/page/[page].astro"],
	["blog posts", "src/layouts/BlogPostLayout.astro"],
	["services index", "src/pages/[locale]/services.astro"],
	["commercial landings", "src/pages/[locale]/[landing].astro"],
];

for (const [name, path] of standardConsumers) {
	const source = await readSource(...path.split("/"));
	if (!source.includes("ConversionCta")) {
		failures.push(`${name}: shared CTA is not used`);
	}
}
```

Require removal of the exact legacy wrappers:

```js
const legacyWrappers = [
	["about", "about-cta"],
	["education", "section-band section-reveal py-16 text-center md:py-24"],
	["blog index", "section-band section-reveal py-16 text-center md:py-20"],
	["blog pagination", "section-band section-reveal py-16 text-center md:py-20"],
	["blog posts", "section-band mt-20 rounded-3xl"],
	["services index", "section-band section-reveal py-20 text-center md:py-28"],
	["commercial landings", "section-reveal py-16 text-center md:py-28"],
];

for (const [name, marker] of legacyWrappers) {
	const path = standardConsumers.find(([consumer]) => consumer === name)?.[1];
	if (!path) continue;
	const source = await readSource(...path.split("/"));
	if (source.includes(marker)) {
		failures.push(`${name}: legacy CTA wrapper remains`);
	}
}
```

Read both translation files and require:

```js
for (const locale of ["en", "es"]) {
	const translations = JSON.parse(
		await readSource("src", "i18n", `${locale}.json`),
	);
	if (!translations.blog.page.cta.eyebrow) {
		failures.push(`${locale}: missing blog.page.cta.eyebrow`);
	}
	if (!translations.services.hub.ctaEyebrow) {
		failures.push(`${locale}: missing services.hub.ctaEyebrow`);
	}
}
```

Also read `src/pages/[locale]/index.astro` and require that it contains `home-final-cta` and does not contain `ConversionCta`. Fail when `globalStyles.includes(".about-cta")`.

Under `--dist`, check that the following generated files contain `data-conversion-cta`:

```js
const generatedConsumers = [
	["about", ["es", "about", "index.html"]],
	["education", ["en", "education", "index.html"]],
	["blog index", ["es", "blog", "index.html"]],
	["blog pagination", ["en", "blog", "page", "2", "index.html"]],
	[
		"blog post",
		[
			"es",
			"blog",
			"que-debe-tener-web-profesional-para-captar-clientes",
			"index.html",
		],
	],
	["services index", ["en", "services", "index.html"]],
	["commercial landing", ["es", "software-a-medida-pymes", "index.html"]],
];

for (const [name, parts] of generatedConsumers) {
	const output = join(root, "dist", "client", ...parts);
	try {
		await access(output);
		const html = await readFile(output, "utf8");
		if (!html.includes("data-conversion-cta")) {
			failures.push(`dist ${name}: shared CTA marker is missing`);
		}
	} catch {
		failures.push(`dist ${name}: generated page is missing`);
	}
}
```

- [ ] **Step 2: Run the verifier and confirm the migration RED state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta
```

Expected: exit 1 listing every unmigrated consumer and both missing localized eyebrow keys.

- [ ] **Step 3: Add the missing bilingual eyebrow copy**

In `src/i18n/es.json` add:

```json
"blog.page.cta.eyebrow": "¿Tienes un proyecto en mente?",
"services.hub.ctaEyebrow": "Primera valoración gratuita"
```

In `src/i18n/en.json` add:

```json
"blog.page.cta.eyebrow": "Have a project in mind?",
"services.hub.ctaEyebrow": "Free initial assessment"
```

Insert the values inside their existing `blog.page.cta` and `services.hub` objects; do not create dot-delimited JSON keys.

- [ ] **Step 4: Migrate About and Education**

Import `ConversionCta` in both routes. Replace each final CTA block with the following page-specific calls:

```astro
<ConversionCta
	eyebrow={page.cta.eyebrow}
	title={page.cta.title}
	text={page.cta.text}
	primary={{
		label: page.cta.primary,
		href: `/${locale}/contact?service=assessment`,
	}}
	secondary={{
		label: page.cta.secondary,
		href: `/${locale}/projects`,
	}}
	headingId="about-conversion-title"
/>
```

```astro
<ConversionCta
	eyebrow={page.cta.eyebrow}
	title={page.cta.title}
	text={page.cta.text}
	primary={{ label: page.cta.primary, href: `/${locale}/about` }}
	secondary={{ label: page.cta.secondary, href: `/${locale}/contact` }}
	headingId="education-conversion-title"
/>
```

Remove `.about-cta` from `src/styles/global.css` after its final consumer is gone.

- [ ] **Step 5: Migrate blog archives and blog posts**

Import `ConversionCta` in both archive routes and use the same data in each:

```astro
<ConversionCta
	eyebrow={page.cta.eyebrow}
	title={page.cta.title}
	text={page.cta.text}
	primary={{ label: page.cta.services, href: `/${locale}/services` }}
	secondary={{ label: page.cta.contact, href: `/${locale}/contact` }}
	headingId="blog-conversion-title"
/>
```

Import `ConversionCta` in `src/layouts/BlogPostLayout.astro` and replace the article CTA with:

```astro
<ConversionCta
	eyebrow={postCta.eyebrow}
	title={postCta.title}
	text={postCta.text}
	primary={{ label: postCta.services, href: `/${locale}/services` }}
	secondary={{ label: postCta.contact, href: contactPath }}
	headingId="article-conversion-title"
/>
```

Preserve the article footer and back-to-blog link after the shared CTA.

- [ ] **Step 6: Migrate the services index and generic landings**

In `src/pages/[locale]/services.astro` use:

```astro
<ConversionCta
	eyebrow={page.ctaEyebrow}
	title={page.ctaTitle}
	text={page.ctaText}
	primary={{ label: page.ctaButton, href: contactHref }}
	headingId="services-conversion-title"
/>
```

In `src/pages/[locale]/[landing].astro` use:

```astro
<ConversionCta
	eyebrow={page.cta.eyebrow}
	title={page.cta.title}
	text={page.cta.text}
	primary={{ label: page.cta.button, href: contactHref }}
	secondary={{
		label:
			locale === "es" ? "Ver todos los servicios" : "View all services",
		href: servicesHref,
	}}
	headingId="landing-conversion-title"
/>
```

- [ ] **Step 7: Run the focused verifier, legacy verifiers, and Astro check**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-about-merge.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-project-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: all commands exit 0.

- [ ] **Step 8: Commit the standard page migration**

```bash
git add scripts/verify-conversion-cta.mjs src/i18n/en.json src/i18n/es.json src/styles/global.css 'src/pages/[locale]/about.astro' 'src/pages/[locale]/education.astro' 'src/pages/[locale]/blog/index.astro' 'src/pages/[locale]/blog/page/[page].astro' src/layouts/BlogPostLayout.astro 'src/pages/[locale]/services.astro' 'src/pages/[locale]/[landing].astro'
git commit -m "refactor(cta): unify interior page conversions"
```

---

### Task 3: Preserve individual service-page interactions

**Files:**

- Modify: `scripts/verify-conversion-cta.mjs`
- Modify: `src/pages/[locale]/services/[service].astro`

**Interfaces:**

- Consumes `primary.opensContactModal` to retain the existing dialog interception.
- Consumes `secondary.external` to retain the WhatsApp new-tab behavior and external-link icon.

- [ ] **Step 1: Add failing service interaction assertions**

Read the dynamic service page and require these markers:

```js
const serviceDetail = await readSource(
	"src",
	"pages",
	"[locale]",
	"services",
	"[service].astro",
);

for (const marker of [
	"ConversionCta",
	"opensContactModal: true",
	"external: true",
	"whatsappHref",
]) {
	if (!serviceDetail.includes(marker)) {
		failures.push(`service detail: missing ${marker}`);
	}
}

if (
	serviceDetail.includes(
		"section-band section-reveal py-20 text-center md:py-28",
	)
) {
	failures.push("service detail: legacy CTA wrapper remains");
}
```

Under `--dist`, inspect `dist/client/es/services/backend-spring-boot/index.html` and require `data-conversion-cta`, `data-contact-modal-open`, the WhatsApp URL prefix, `target="_blank"`, and `rel="noopener noreferrer nofollow"`.

- [ ] **Step 2: Run the verifier and confirm the service RED state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta
```

Expected: exit 1 listing the missing dynamic service consumer and interaction flags.

- [ ] **Step 3: Replace the individual service CTA**

Import `ConversionCta` and replace only the final contact section with:

```astro
<ConversionCta
	eyebrow={serviceCopy.contactEyebrow}
	title={serviceCopy.contactTitle}
	text={serviceCopy.contactText}
	primary={{
		label: serviceCopy.contactButton,
		href: contactHref,
		opensContactModal: true,
	}}
	secondary={{
		label: serviceCopy.whatsappButton,
		href: whatsappHref,
		external: true,
	}}
	headingId="service-conversion-title"
/>
```

Do not modify the dialog, its script, hero buttons, pricing actions, or `ServicesExitIntent`.

- [ ] **Step 4: Run source validation**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
```

Expected: all commands exit 0.

- [ ] **Step 5: Commit the service interaction migration**

```bash
git add scripts/verify-conversion-cta.mjs 'src/pages/[locale]/services/[service].astro'
git commit -m "refactor(services): use shared conversion CTA"
```

---

### Task 4: Production and visual verification

**Files:**

- Verify: all files modified in Tasks 1–3.

**Interfaces:**

- Validates source contracts, generated HTML, responsive layout, both themes, and the service contact dialog.

- [ ] **Step 1: Format the complete migration**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format
```

Expected: Prettier completes without an error.

- [ ] **Step 2: Run the full automated validation set**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:project-pages
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-project-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-about-merge.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-home-conversion.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta -- --dist
git diff --check
```

Expected: every command exits 0; Astro reports 0 diagnostics; the build completes; the focused dist verifier passes.

- [ ] **Step 3: Verify representative pages visually**

Serve `dist/client` locally and inspect these routes at 390 × 844 and 1440 × 900:

- `/es/about/` in light mode.
- `/en/blog/` in dark mode.
- `/es/projects/betx/` in light and dark mode.
- `/en/services/backend-spring-boot/` in light and dark mode.
- `/es/software-a-medida-pymes/`, generated by `src/pages/[locale]/[landing].astro`.

For each page confirm:

- The CTA has the same surface, border, typography, spacing, and button hierarchy.
- Buttons stack at mobile width and sit inline at desktop width.
- Long button labels wrap without clipping.
- `document.documentElement.scrollWidth <= window.innerWidth`.
- The home page still uses `.home-final-cta`, not `data-conversion-cta`.

On the individual service route, click the primary CTA and confirm the existing contact dialog opens. Close it, then confirm the WhatsApp action has a new-tab target and safe relationship values without navigating away during the test.

- [ ] **Step 4: Review the final diff and repository state**

Run:

```bash
git status -sb
git diff --stat
git diff --check
```

Expected: only the intended CTA migration and pre-existing user changes remain; no untracked build output is staged.
