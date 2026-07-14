# Services Hero Title Composition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the services hub headline read as intentional blocks like the `/about` headline, while restoring its former desktop scale and preserving the current Spanish and English copy.

**Architecture:** Keep the existing localized `page.title` and `page.titleAccent` data flow. Change only the services hub hero presentation and its source-level regression contract: the accent becomes a block, the heading receives the available copy-column width, and the former fluid desktop size returns while the existing mobile cap remains.

**Tech Stack:** Astro 6, TypeScript, scoped Astro CSS, Node verification scripts, Tailwind CSS 4 project tokens.

## Global Constraints

- Keep `page.title` and `page.titleAccent` unchanged in Spanish and English.
- Limit implementation changes to `src/pages/[locale]/services.astro` and `scripts/verify-service-redesign.mjs`.
- Preserve the compact section spacing, two-column hero, CTA hierarchy, signal card, and current mobile title cap.
- At 1440px and 390px, Spanish and English must have no horizontal overflow.
- Preserve light and dark theme variables; do not introduce hard-coded colours.

---

### Task 1: Protect and implement the title composition

**Files:**

- Modify: `scripts/verify-service-redesign.mjs:277-294`
- Modify: `src/pages/[locale]/services.astro:119-122`
- Modify: `src/pages/[locale]/services.astro:319-332`

**Interfaces:**

- Consumes: `page.title: string` and `page.titleAccent: string` from the existing localized services page copy.
- Produces: the existing `#services-title` heading with a block-level accent phrase and the former fluid desktop scale.

- [ ] **Step 1: Write the failing visual contract**

Replace the current compact-title markers in `scripts/verify-service-redesign.mjs` so the hub phase requires the approved composition:

```js
requireMarkers("compact services hub", hub, [
	"--services-section-space: clamp(3.25rem, 5vw, 4.5rem);",
	"--services-content-gap: 2.25rem;",
	"--services-card-padding: clamp(1.35rem, 2vw, 1.75rem);",
	"padding-block: clamp(1.5rem, 3vw, 2.5rem)",
	"max-width: 56rem;",
	"font-size: clamp(3rem, 6.25vw, 6rem);",
	".services-hero h1 span {\n\t\tdisplay: block;",
	"font-size: 1rem;",
]);
rejectMarkers("compact services hub", hub, [
	"padding-block: clamp(4.5rem, 8vw, 7rem);",
	"max-width: 15ch;",
	"font-size: clamp(2.75rem, 5.1vw, 4.8rem);",
]);
```

- [ ] **Step 2: Run the focused verifier and confirm the red state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-service-redesign.mjs --phase=hub
```

Expected: exit code `1`, reporting the missing `max-width: 56rem`, restored font size, or block accent marker, and/or the still-forbidden current compact title markers.

- [ ] **Step 3: Implement the minimal Astro CSS change**

Keep the existing heading markup and update its scoped styles in `src/pages/[locale]/services.astro`:

```css
.services-hero h1 {
	max-width: 56rem;
	margin-top: 1rem;
	color: var(--home-navy);
	font-size: clamp(3rem, 6.25vw, 6rem);
	font-weight: 950;
	letter-spacing: -0.07em;
	line-height: 0.93;
	text-wrap: balance;
}

.services-hero h1 span {
	display: block;
	color: var(--action);
}
```

Do not change the existing mobile override:

```css
@media (max-width: 767px) {
	.services-hero h1 {
		font-size: clamp(2.6rem, 12vw, 3.6rem);
	}
}
```

- [ ] **Step 4: Run the focused verifier and confirm the green state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-service-redesign.mjs --phase=hub
```

Expected: `Service redesign verification passed through hub.`

- [ ] **Step 5: Format and run static validation**

Run each command separately:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:service-redesign
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
```

Expected: Prettier reports matching files, Astro reports zero diagnostics, ESLint exits with zero warnings, service verification passes through SEO, and the production build completes.

- [ ] **Step 6: Inspect the responsive result**

Start the local server and inspect `/es/services/` and `/en/services/` at `1440x900` and `390x844`.

At both widths, verify:

- `document.documentElement.scrollWidth <= window.innerWidth`.
- The accent phrase begins on its own visual line.
- The title forms balanced blocks without a single-word orphan caused by the old `15ch` restriction.
- The signal card remains fully visible on desktop.
- The mobile CTA buttons remain full width and at least 44px high.
- Light and dark themes retain readable title and accent colours.

- [ ] **Step 7: Commit the implementation**

```bash
git add scripts/verify-service-redesign.mjs src/pages/[locale]/services.astro
git commit -m "fix(services): balance hero title composition"
```
