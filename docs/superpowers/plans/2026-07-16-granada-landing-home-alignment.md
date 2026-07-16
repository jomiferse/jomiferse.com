# Granada Landing Home Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the bilingual Granada web-design landing as a compact local extension of the home page while preserving its SEO ownership, canonical routes, and structured data.

**Architecture:** Keep the generic commercial route responsible for metadata and schema, then dispatch only the `local-web-design` landing to a focused `GranadaWebDesignLanding.astro` presentation component. The component consumes existing typed landing, service, CV, and project data so unrelated commercial landings keep their current template.

**Tech Stack:** Astro 6, TypeScript, Tailwind CSS 4, Astro Icon, Node test runner.

## Global Constraints

- Work directly on `main`; do not create a worktree.
- Preserve `/es/diseno-web-granada/` and `/en/web-design-granada/`, canonical links, hreflang, `Service`, `FAQPage`, and breadcrumb JSON-LD.
- Preserve `Diseño web Granada` in the Spanish title, H1, introduction, and natural supporting copy.
- Use `var(--home-navy)` for headings and `var(--action)` only for conversion cues.
- Do not add unsupported address, agency, team, ranking, lead, traffic, or revenue claims.
- Validate 1440 px and 390 px, dark mode, language switching, focus states, and horizontal overflow.
- Run `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run quality` before completion.

---

### Task 1: Lock the Granada-only presentation contract

**Files:**
- Create: `tests/granada-landing-layout.test.ts`
- Modify: `src/pages/[locale]/[landing].astro`

**Interfaces:**
- Consumes: `CommercialLandingPage.translationKey: string` from `src/lib/commercial-landings.ts`.
- Produces: a route branch marked by the `GranadaWebDesignLanding` import while preserving the generic `.commercial-landing` fallback.

- [ ] **Step 1: Write the failing source-contract test**

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const routeSource = readFileSync(
	new URL("../src/pages/[locale]/[landing].astro", import.meta.url),
	"utf8",
);

test("uses the home-derived presentation only for local web design", () => {
	assert.match(routeSource, /GranadaWebDesignLanding/);
	assert.match(routeSource, /page\.translationKey === "local-web-design"/);
	assert.match(routeSource, /commercial-landing/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/granada-landing-layout.test.ts`

Expected: FAIL because the route does not import or render `GranadaWebDesignLanding`.

- [ ] **Step 3: Add the route-level branch**

Import `GranadaWebDesignLanding`, resolve the existing GetYourTicket project with:

```ts
const featuredProject = getProjectPages(locale).find(
	(project) => project.id === "getyourticket-ticketing-platform",
);
const isGranadaWebDesign = page.translationKey === "local-web-design";
```

Render the new component only when `isGranadaWebDesign` is true, passing `locale`, `page`, `contactHref`, `relatedServices`, `featuredProject`, and `cv.yearsWorking`. Keep the current generic markup as the fallback branch.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/granada-landing-layout.test.ts`

Expected: PASS.

---

### Task 2: Build the home-derived Granada presentation

**Files:**
- Create: `src/components/landings/GranadaWebDesignLanding.astro`
- Modify: `tests/granada-landing-layout.test.ts`
- Modify: `tests/build/support/build-artifact.ts`

**Interfaces:**
- Consumes: `{ locale: Locale; page: CommercialLandingPage; contactHref: string; relatedServices: ServicePage[]; featuredProject?: ProjectEntry; yearsWorking: string }`.
- Produces: semantic sections marked with `data-granada-hero`, `data-granada-decision`, `data-granada-services`, `data-granada-proof`, `data-granada-process`, `data-granada-faq`, and `data-granada-cta`.

- [ ] **Step 1: Extend the source and production artifact contracts**

Read the component source and assert:

```ts
for (const marker of [
	"data-granada-hero",
	"data-granada-decision",
	"data-granada-services",
	"data-granada-proof",
	"data-granada-process",
	"data-granada-faq",
	"data-granada-cta",
]) {
	assert.match(componentSource, new RegExp(marker));
}
assert.doesNotMatch(componentSource, /relatedPosts/);
assert.match(componentSource, /getServiceHref/);
assert.match(componentSource, /featuredProject/);
```

For both localized production routes, require all seven `data-granada-*` markers. For Spanish require links to:

```ts
[
	"/es/services/diseno-web-wordpress/",
	"/es/services/website-redesign/",
	"/es/services/landing-pages/",
	"/es/projects/plataforma-ticketing-getyourticket/",
]
```

Require `data-granada-related-posts` to be absent, while retaining the existing canonical, H1, `areaServed`, and internal-discovery assertions.

Run the focused source test and then the production build. Expect failure because the component does not exist yet and its markers cannot be rendered.

- [ ] **Step 2: Implement the typed component structure**

Build these seven sections:

1. Hero with centered eyebrow/H1, two-column pitch, experience signal, primary CTA, project link, and four needs links resolved from canonical service pages.
2. Full-width decision band using the first three `page.whenWorthIt.items`.
3. Three-column typical-work section using the first three `page.cases.items`, each with scope points drawn from `page.builds.items` and a canonical service link.
4. Real project preview using `featuredProject.img.imgStatic`, title, status, and localized project route.
5. Four-step process using `page.process.steps`.
6. Visible FAQ accordion using four purchase-intent entries from `page.faq`.
7. Home-style final CTA using `page.cta` and `contactHref`.

Use native `details`/`summary`, semantic headings, and existing `Icon` names. Do not render `page.problem`, `page.avoid`, `page.relatedPosts`, or the generic related-service card grid.

- [ ] **Step 3: Implement the component styles**

Use component-scoped CSS that mirrors the home contracts:

```css
.granada-hero > h1,
.granada-section-heading h2,
.granada-final-cta h2 {
	color: var(--home-navy);
	font-weight: 900;
	letter-spacing: -0.055em;
	text-wrap: balance;
}

.granada-decision {
	width: 100vw;
	margin-inline: calc(50% - 50vw);
	padding-inline: max(1rem, calc((100vw - 88rem) / 2));
	background: var(--bg-band);
}
```

Use editorial dividers for decision, services, and process; reserve restrained bordered surfaces for the needs selector and real project preview. At `max-width: 760px`, collapse all grids, remove vertical dividers, left-align the hero, stretch the primary CTA, and preserve DOM reading order. Do not hard-code light-only colors.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/granada-landing-layout.test.ts tests/commercial-landings.test.ts`

Expected: all tests pass.

---

### Task 3: Verify production SEO and presentation output

**Files:**
- Test: `tests/build/build-artifact.test.ts`

**Interfaces:**
- Consumes: generated HTML for both localized Granada paths.
- Produces: artifact failures when home-derived markers, real project evidence, canonical service links, SEO output, or the absence of the old related-post presentation regress.

- [ ] **Step 1: Run the production artifact contract**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build && PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run test:build`

Expected: PASS with both Granada pages containing the home-derived markers, project evidence, canonical service links, and existing SEO output.

- [ ] **Step 2: Correct any output mismatch at its source**

Resolve service links by `translationKey`, using the existing `canonicalPath` when available and the localized service route otherwise. Keep the language-switch alternate route unchanged.

- [ ] **Step 3: Format and run the complete quality gate**

Run:

```sh
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run quality
```

Expected: Prettier clean, ESLint clean, all Node tests pass, Astro reports zero diagnostics, production build succeeds, and the build artifact contract passes.

- [ ] **Step 4: Inspect responsive output**

Open both localized pages in the local browser. At 1440×900 and 390×844 verify:

- `scrollWidth === clientWidth`.
- H1 and primary CTA are visible.
- The Spanish/English language switch points to the alternate Granada route.
- Heading color resolves from the home navy theme.
- No console errors appear.
- Dark mode preserves readable headings, text, dividers, and focus indicators.

- [ ] **Step 5: Review diff and commit**

Run `git diff --check` and `git status -sb`, then commit only the landing, tests, and plan changes with a focused conventional commit.
