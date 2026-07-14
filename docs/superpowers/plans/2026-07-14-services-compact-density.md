# Services Compact Density Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce excess spacing and oversized service cards while improving disclosure readability and preserving the approved commercial design.

**Architecture:** Introduce a small set of cascading density variables on the two service page roots, then consume them in the existing Astro components. Protect the visual contract with source-level assertions in the existing service verifier and finish with measured browser checks at the two required viewports.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS 4, scoped Astro CSS, native `details` disclosures, existing Node verification scripts, pnpm, Vercel static output.

## Global Constraints

- Work directly on `main`; do not create a worktree or feature branch.
- Preserve all service content, prices, routes, section order, conversion behavior, structured data, and localization.
- Use `var(--home-navy)` for headings, `var(--action)` for conversion cues, and existing surface variables in both themes.
- Desktop service sections use `clamp(3.25rem, 5vw, 4.5rem)` vertical padding.
- The hub hero uses `clamp(1.5rem, 3vw, 2.5rem)` top padding, `clamp(3.5rem, 5vw, 4.5rem)` bottom padding, and `clamp(2.75rem, 5.1vw, 4.8rem)` for its `h1`.
- Heading-to-content gaps are `2.25rem` on desktop and `1.75rem` on mobile.
- Interactive controls remain at least 44 px high with visible focus states.
- Validate at 1440 × 900 and 390 × 844 in Spanish, English, light mode, and dark mode.
- Run with Node 24 using `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"`.

## File map

- `scripts/verify-service-redesign.mjs`: enforce compact-density source contracts and reject the artificial sizing rules that caused the regression.
- `src/pages/[locale]/services.astro`: define the shared hub density variables and compact its hero, sections, FAQ, and content gaps.
- `src/components/services/ServiceAreaCard.astro`: remove the fixed introduction height and compact the card rhythm.
- `src/components/services/EngagementModels.astro`: remove the 22rem minimum and consume the shared spacing values.
- `src/components/services/ServiceDirectory.astro`: consume shared section spacing and increase disclosure description size.
- `src/components/services/ServicePricingCard.astro`: make pricing cards content-driven and balance their CTA spacing.
- `src/components/services/ServicePricingGrid.astro`: remove compensation for the translated CTA and tighten the mobile stack.
- `src/pages/[locale]/services/[service].astro`: define detail density variables and compact its hero, sections, related cards, and FAQ.

---

### Task 1: Add a failing compact-density contract

**Files:**

- Modify: `scripts/verify-service-redesign.mjs`
- Test: `scripts/verify-service-redesign.mjs`

**Interfaces:**

- Consumes: existing `readSource`, `requireMarkers`, and phase-based verification.
- Produces: `rejectMarkers(name, source, markers)` and density assertions used by later tasks.

- [ ] **Step 1: Add a helper that rejects obsolete CSS markers**

Insert after `requireMarkers`:

```js
const rejectMarkers = (name, source, markers) => {
	for (const marker of markers) {
		if (source.includes(marker)) failures.push(`${name}: forbidden ${marker}`);
	}
};
```

- [ ] **Step 2: Add hub-component density assertions**

Inside `if (includesPhase("hub-components"))`, after the existing marker checks, add:

```js
requireMarkers("compact area card", areaCard, [
	"padding: var(--services-card-padding);",
	"padding-block: 1.5rem;",
]);
rejectMarkers("compact area card", areaCard, ["min-height: 10.5rem;"]);

requireMarkers("compact engagement models", models, [
	"padding-block: var(--services-section-space);",
	"padding: var(--services-card-padding);",
]);
rejectMarkers("compact engagement models", models, ["min-height: 22rem;"]);

requireMarkers("readable service directory", directory, [
	"padding-block: var(--services-section-space);",
	"font-size: 0.875rem;",
	"line-height: 1.55;",
]);
```

- [ ] **Step 3: Add hub-page density assertions**

Inside `if (includesPhase("hub"))`, after the existing hub markers, add:

```js
requireMarkers("compact services hub", hub, [
	"--services-section-space: clamp(3.25rem, 5vw, 4.5rem);",
	"--services-content-gap: 2.25rem;",
	"--services-card-padding: clamp(1.35rem, 2vw, 1.75rem);",
	"padding-block: clamp(1.5rem, 3vw, 2.5rem)",
	"font-size: clamp(2.75rem, 5.1vw, 4.8rem);",
	"font-size: 1rem;",
]);
rejectMarkers("compact services hub", hub, [
	"padding-block: clamp(4.5rem, 8vw, 7rem);",
	"font-size: clamp(3rem, 6.25vw, 6rem);",
]);
```

- [ ] **Step 4: Add pricing and detail density assertions**

Inside `if (includesPhase("detail-components"))`, after the pricing carousel check, add:

```js
requireMarkers("compact pricing card", card, [
	"padding: var(--services-card-padding);",
	"margin-top: 1.5rem;",
	"font-size: 0.875rem;",
]);
rejectMarkers("compact pricing card", card, [
	"min-height: 6rem;",
	"transform: translateY(1.5rem);",
]);
rejectMarkers("compact pricing grid", grid, ["padding-bottom: 1.5rem;"]);
```

Inside `if (includesPhase("detail"))`, after the existing obsolete-code checks, add:

```js
requireMarkers("compact service detail", detail, [
	"--services-section-space: clamp(3.25rem, 5vw, 4.5rem);",
	"--services-content-gap: 2.25rem;",
	"padding-block: clamp(1.5rem, 3vw, 2.5rem)",
	"font-size: clamp(2.75rem, 5vw, 4.65rem);",
	"font-size: 1rem;",
]);
rejectMarkers("compact service detail", detail, [
	"padding-block: clamp(4.5rem, 8vw, 7rem);",
	"transform: translateY(1.2rem);",
]);
```

- [ ] **Step 5: Run the verifier and confirm the contract fails**

Run:

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"
node scripts/verify-service-redesign.mjs --phase=detail
```

Expected: exit code 1 with failures including `compact area card`, `compact engagement models`, `compact services hub`, `compact pricing card`, and `compact service detail`.

- [ ] **Step 6: Commit the failing contract**

```bash
git add scripts/verify-service-redesign.mjs
git commit -m "test(services): define compact density contract"
```

---

### Task 2: Compact the services hub and its disclosures

**Files:**

- Modify: `src/pages/[locale]/services.astro`
- Modify: `src/components/services/ServiceAreaCard.astro`
- Modify: `src/components/services/EngagementModels.astro`
- Modify: `src/components/services/ServiceDirectory.astro`
- Test: `scripts/verify-service-redesign.mjs`

**Interfaces:**

- Consumes: CSS variables declared on `.services-page` and inherited by nested service components.
- Produces: `--services-section-space`, `--services-content-gap`, `--services-card-padding`, and `--services-list-gap` for hub descendants.

- [ ] **Step 1: Define the density variables and compact the hub hero**

Replace the `.services-page`, `.services-hero`, and `.services-hero h1` sizing declarations with:

```css
.services-page {
	--services-section-space: clamp(3.25rem, 5vw, 4.5rem);
	--services-content-gap: 2.25rem;
	--services-card-padding: clamp(1.35rem, 2vw, 1.75rem);
	--services-list-gap: 0.75rem;
	--services-heading: clamp(2.2rem, 4vw, 3.85rem);
}

.services-hero {
	display: grid;
	grid-template-columns: minmax(0, 1.2fr) minmax(19rem, 0.55fr);
	gap: clamp(2.5rem, 7vw, 7rem);
	align-items: end;
	padding-block: clamp(1.5rem, 3vw, 2.5rem)
		clamp(3.5rem, 5vw, 4.5rem);
}

.services-hero h1 {
	max-width: 15ch;
	margin-top: 1rem;
	color: var(--home-navy);
	font-size: clamp(2.75rem, 5.1vw, 4.8rem);
	font-weight: 950;
	letter-spacing: -0.065em;
	line-height: 0.95;
	text-wrap: balance;
}
```

- [ ] **Step 2: Apply shared section and content spacing in the hub**

Use the shared variable for `.services-areas`, `.services-process`, `.services-faq`, and `.services-proof`; change the area, proof, process, and FAQ content margins to `var(--services-content-gap)`:

```css
.services-areas,
.services-process,
.services-faq {
	padding-block: var(--services-section-space);
}

.services-areas__grid,
.services-process__steps {
	margin-top: var(--services-content-gap);
}

.services-proof {
	padding: var(--services-section-space)
		max(1rem, calc((100vw - 88rem) / 2));
}

.services-proof__grid,
.services-faq__list {
	margin-top: var(--services-content-gap);
}
```

Add explicit readable FAQ sizing:

```css
.services-faq summary {
	font-size: 1rem;
}

.services-faq details p {
	font-size: 1rem;
	line-height: 1.7;
}
```

Inside the existing `@media (max-width: 680px)`, set:

```css
.services-page {
	--services-content-gap: 1.75rem;
}

.services-hero {
	padding-top: 1.25rem;
}

.services-hero h1 {
	font-size: clamp(2.6rem, 12vw, 3.6rem);
}
```

- [ ] **Step 3: Remove the service-area artificial height**

In `ServiceAreaCard.astro`, use shared card padding and replace the introduction sizing with:

```css
.service-area-card {
	padding: var(--services-card-padding);
}

.service-area-card__intro {
	padding-block: 1.5rem;
}

.service-area-card__services a {
	padding: 0.85rem 0;
}

.service-area-card__footer {
	padding-top: 1.2rem;
}
```

Delete the desktop `min-height` declaration and the complete mobile `.service-area-card__intro` override because `padding-block: 1.5rem` now covers both breakpoints.

- [ ] **Step 4: Make engagement models content-driven**

In `EngagementModels.astro`, replace the large spacing rules with:

```css
.engagement-models {
	padding-block: var(--services-section-space);
}

.engagement-models__list {
	margin-top: var(--services-content-gap);
}

.engagement-models__list li {
	position: relative;
	padding: var(--services-card-padding);
}

.engagement-models h3 {
	margin-top: 1.75rem;
}

.engagement-models li > strong {
	margin-top: 1.5rem;
}
```

Delete `min-height: 22rem` and the now-unnecessary mobile `min-height: 0`.

- [ ] **Step 5: Improve directory density and readability**

In `ServiceDirectory.astro`, update:

```css
.service-directory {
	padding-block: var(--services-section-space);
}

.service-directory__groups {
	margin-top: var(--services-content-gap);
}

.service-directory summary {
	min-height: 5rem;
}

.service-directory li a {
	min-height: 4.75rem;
	padding-block: 0.8rem;
}

.service-directory li small {
	font-size: 0.875rem;
	line-height: 1.55;
}
```

Keep the two-line clamp and all native `details` behavior.

- [ ] **Step 6: Run hub verification**

Run:

```bash
node scripts/verify-service-redesign.mjs --phase=hub
pnpm run check
```

Expected: both commands exit 0; Astro reports 0 errors, 0 warnings, and 0 hints.

- [ ] **Step 7: Commit the hub refinement**

```bash
git add src/pages/'[locale]'/services.astro src/components/services/ServiceAreaCard.astro src/components/services/EngagementModels.astro src/components/services/ServiceDirectory.astro
git commit -m "refactor(services): compact services hub rhythm"
```

---

### Task 3: Balance and compact pricing cards

**Files:**

- Modify: `src/components/services/ServicePricingCard.astro`
- Modify: `src/components/services/ServicePricingGrid.astro`
- Test: `scripts/verify-service-redesign.mjs`

**Interfaces:**

- Consumes: `--services-card-padding` from `.service-detail-page`.
- Produces: three equal-height, content-driven pricing cards whose CTAs remain inside normal flow.

- [ ] **Step 1: Replace artificial pricing-card sizing**

In `ServicePricingCard.astro`, apply these exact compact values:

```css
.service-pricing-card {
	padding: var(--services-card-padding);
}

.service-pricing-card__description {
	margin-top: 0.85rem;
	color: var(--text-muted);
	font-size: 0.875rem;
	line-height: 1.6;
}

.service-pricing-card__price {
	margin-top: 1.25rem;
	padding-block: 1.15rem;
}

.service-pricing-card__deliverables {
	margin-top: 1.25rem;
}

.service-pricing-card__deliverables ul {
	gap: 0.7rem;
	margin-top: 0.85rem;
}

.service-pricing-card__deliverables li {
	font-size: 0.875rem;
	line-height: 1.5;
}

.service-pricing-card__boundary {
	margin-top: 1.25rem;
	padding: 0.8rem;
	font-size: 0.8rem;
	line-height: 1.5;
}

.service-pricing-card__action {
	width: 100%;
	margin-top: 1.5rem;
	padding-top: 0.9rem;
	padding-bottom: 0.9rem;
}
```

Delete `min-height: 6rem`, `transform: translateY(1.5rem)`, and the full media query that only reset the description minimum.

- [ ] **Step 2: Remove grid compensation and tighten mobile spacing**

In `ServicePricingGrid.astro`, replace the grid rules with:

```css
.service-pricing-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1rem;
	align-items: stretch;
}

@media (max-width: 960px) {
	.service-pricing-grid {
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}
}
```

- [ ] **Step 3: Run pricing-component verification**

Run:

```bash
node scripts/verify-service-redesign.mjs --phase=detail-components
pnpm run check
```

Expected: both commands exit 0.

- [ ] **Step 4: Commit the pricing refinement**

```bash
git add src/components/services/ServicePricingCard.astro src/components/services/ServicePricingGrid.astro
git commit -m "fix(services): balance pricing card spacing"
```

---

### Task 4: Compact the service detail template

**Files:**

- Modify: `src/pages/[locale]/services/[service].astro`
- Test: `scripts/verify-service-redesign.mjs`

**Interfaces:**

- Consumes: all existing service data, pricing components, related services, FAQ data, contact modal behavior, and commercial color variables.
- Produces: density variables inherited by detail components and a compact, readable shared detail layout.

- [ ] **Step 1: Define detail density and compact the hero**

Replace the root and hero sizing declarations with:

```css
.service-detail-page {
	--services-section-space: clamp(3.25rem, 5vw, 4.5rem);
	--services-content-gap: 2.25rem;
	--services-card-padding: clamp(1.35rem, 2vw, 1.75rem);
	--services-list-gap: 0.75rem;
	--detail-heading: clamp(2.15rem, 3.8vw, 3.75rem);
}

.service-detail-hero {
	display: grid;
	grid-template-columns: minmax(0, 1.15fr) minmax(19rem, 0.55fr);
	gap: clamp(2.5rem, 7vw, 7rem);
	align-items: end;
	padding-block: clamp(1.5rem, 3vw, 2.5rem)
		clamp(3.5rem, 5vw, 4.5rem);
}

.service-detail-hero h1 {
	max-width: 15ch;
	margin-top: 1.25rem;
	color: var(--home-navy);
	font-size: clamp(2.75rem, 5vw, 4.65rem);
	font-weight: 950;
	letter-spacing: -0.065em;
	line-height: 0.95;
	text-wrap: balance;
}
```

Reduce `.service-detail-hero__identity` top margin to `2rem`.

- [ ] **Step 2: Apply shared section and content gaps**

Use:

```css
.service-outcome,
.service-pricing,
.service-scope,
.service-detail-process,
.service-detail-proof,
.related-services,
.service-detail-faq {
	padding-block: var(--services-section-space);
}

.service-outcome__content,
.service-pricing :global([data-service-pricing]),
.service-detail-proof :global([data-service-proof]),
.service-scope__columns,
.service-detail-process ol,
.related-services__grid,
.service-detail-faq__list {
	margin-top: var(--services-content-gap);
}
```

Keep each selector's existing layout, grid, border, width, and background declarations; change only its margin value.

- [ ] **Step 3: Compact scope, process, and related cards**

Update these declarations:

```css
.service-scope__columns article,
.related-services__grid article {
	padding: var(--services-card-padding);
}

.service-scope h3 {
	margin-top: 1.25rem;
}

.service-scope ul {
	gap: var(--services-list-gap);
	margin-top: 1rem;
}

.service-detail-process li {
	padding: 1.5rem;
}

.service-detail-process li p {
	margin-top: 1rem;
	font-size: 0.9rem;
}

.related-services h3 {
	margin-top: 1.25rem;
}

.related-services article > p {
	font-size: 0.875rem;
	line-height: 1.6;
}

.related-services .button-secondary {
	width: 100%;
	margin-top: 1.25rem;
	font-size: 0.8rem;
}
```

Delete `transform: translateY(1.2rem)`.

- [ ] **Step 4: Increase detail FAQ readability**

Apply:

```css
.service-detail-faq summary {
	font-size: 1rem;
}

.service-detail-faq details > p {
	padding: 0 2rem 1.5rem 0;
	color: var(--text-muted);
	font-size: 1rem;
	line-height: 1.7;
}
```

Inside `@media (max-width: 680px)`, use:

```css
.service-detail-page {
	--services-content-gap: 1.75rem;
}

.service-detail-hero h1 {
	font-size: clamp(2.5rem, 12vw, 3.5rem);
}
```

- [ ] **Step 5: Run complete source verification**

Run:

```bash
node scripts/verify-service-redesign.mjs
pnpm run check
pnpm run lint
```

Expected: all three commands exit 0; Astro reports no diagnostics and ESLint reports no warnings.

- [ ] **Step 6: Commit the detail refinement**

```bash
git add src/pages/'[locale]'/services/'[service]'.astro
git commit -m "refactor(services): compact service detail rhythm"
```

---

### Task 5: Measure responsive behavior and run production validation

**Files:**

- Verify: `src/pages/[locale]/services.astro`
- Verify: `src/pages/[locale]/services/[service].astro`
- Verify: `src/components/services/*.astro`
- Verify: generated files under `dist/client/`

**Interfaces:**

- Consumes: completed compact-density implementation.
- Produces: verified responsive, bilingual, theme-safe production output with no uncommitted fixes.

- [ ] **Step 1: Format and run the static validation set**

Run:

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"
pnpm run format
git diff --check
pnpm run format:check
pnpm run check
pnpm run lint
pnpm run verify:conversion-cta
pnpm run verify:service-redesign
pnpm run verify:ai-seo
pnpm run build
node scripts/verify-service-redesign.mjs --dist
node scripts/verify-ai-seo.mjs --dist
```

Expected: every command exits 0; build generates both localized hubs and all service detail routes.

- [ ] **Step 2: Start the local server for visual verification**

Run:

```bash
pnpm run dev --host 127.0.0.1
```

Open these representative routes:

```text
http://127.0.0.1:4321/es/services/
http://127.0.0.1:4321/es/services/website-redesign/
http://127.0.0.1:4321/en/services/maintenance-and-technical-support/
```

- [ ] **Step 3: Measure the 1440 × 900 desktop layout**

For the hub, confirm:

```text
document.documentElement.scrollWidth <= window.innerWidth
h1 computed font-size <= 77px
hero computed padding-top <= 40px
standard service section computed padding-top and padding-bottom are 72px
FAQ answer computed font-size >= 16px
directory description computed font-size >= 14px
```

For the website-redesign detail, confirm:

```text
all three pricing cards have the same rendered height
pricing card rendered height <= 640px
pricing CTA transform is "none"
pricing CTA bottom gap >= 20px
related-service CTA transform is "none"
related-service CTA bottom gap >= 20px
FAQ answer computed font-size >= 16px
```

- [ ] **Step 4: Verify the 390 × 844 mobile layout**

For all three representative routes, confirm:

```text
document.documentElement.scrollWidth <= window.innerWidth
the h1 wraps without clipping
service and pricing cards form one column
CTA controls are at least 44px high
FAQ summary and answer text do not overlap the plus icon
no button extends outside its card
```

- [ ] **Step 5: Verify theme, language, keyboard, and contact behavior**

Confirm in both light and dark mode:

```text
headings use the theme-resolved navy token
primary actions remain coral and secondary actions remain neutral
card borders and disclosure dividers remain visible
focus-visible rings are not clipped
```

Open and close at least one native FAQ disclosure using the keyboard. Activate the featured pricing CTA and confirm the contact dialog displays the correct localized service and `project` scope without submitting the form.

- [ ] **Step 6: Commit only if formatting or visual verification required a correction**

If tracked files changed during Steps 1–5, inspect the exact diff and commit only the verified correction:

```bash
git status -sb
git diff --check
git add scripts/verify-service-redesign.mjs src/pages/'[locale]'/services.astro src/pages/'[locale]'/services/'[service]'.astro src/components/services/ServiceAreaCard.astro src/components/services/EngagementModels.astro src/components/services/ServiceDirectory.astro src/components/services/ServicePricingCard.astro src/components/services/ServicePricingGrid.astro
git commit -m "fix(services): finalize compact responsive spacing"
```

If no tracked files changed, do not create an empty commit.

- [ ] **Step 7: Confirm the final repository state**

Run:

```bash
git status -sb
git log -6 --oneline
```

Expected: clean worktree on `main`, with the compact-density commits listed above the approved specification commit.
