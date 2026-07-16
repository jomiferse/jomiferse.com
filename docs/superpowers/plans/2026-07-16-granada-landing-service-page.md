# Granada Landing Service Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home-derived Granada landing with a transactional service-detail presentation that uses the site's canonical web-design pricing and the same `88rem` content width as the home.

**Architecture:** Keep routing, local SEO, schema, and data resolution in `[locale]/[landing].astro`. Resolve `web-wordpress:0` as the single source for pricing and scope, then pass it with three related services and one real project into a focused `GranadaWebDesignLanding.astro` component that reuses the existing service components.

**Tech Stack:** Astro 6, TypeScript, Tailwind CSS 4, Astro Icon, Node test runner.

## Global Constraints

- Work directly on `main`; no worktree or feature branch.
- Preserve `/es/diseno-web-granada/`, `/en/web-design-granada/`, canonical links, hreflang, sitemap, redirects, and local `areaServed` schema.
- Use the `web-wordpress:0` service offering as the only source for three pricing options, timeline, included scope, and boundaries.
- Use the same `88rem` content width and responsive shell padding as the home.
- Do not add address, agency, team, rankings, lead, traffic, or revenue claims.
- Validate at 1440 by 900 and 390 by 844, including dark mode, language switching, focus states, and horizontal overflow.
- Run `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run quality` before completion.

---

### Task 1: Lock the service-page and width contract

**Files:**
- Modify: `tests/granada-landing-layout.test.ts`

**Interfaces:**
- Consumes: source of `src/pages/[locale]/[landing].astro` and `src/components/landings/GranadaWebDesignLanding.astro`.
- Produces: source-level regression checks for service markers, reused components, removed home selector, and the `services-page` width hook.

- [ ] **Step 1: Replace the home-derived assertions with failing service assertions**

Require these component markers:

```ts
for (const marker of [
	"data-granada-service-hero",
	"data-granada-service-trust",
	"data-granada-service-outcome",
	"data-granada-service-pricing",
	"data-granada-service-scope",
	"data-granada-service-process",
	"data-granada-service-proof",
	"data-granada-related-services",
	"data-granada-service-faq",
	"data-granada-service-cta",
]) {
	assert.match(componentSource, new RegExp(marker));
}
for (const component of [
	"ServiceIconBadge",
	"ServiceTrustStrip",
	"ServicePricingGrid",
	"ServiceProofCard",
	"ConversionCta",
]) {
	assert.match(componentSource, new RegExp(component));
}
assert.match(componentSource, /class="services-page service-detail-page granada-service-page"/);
assert.doesNotMatch(componentSource, /granada-selector|data-granada-decision/);
```

Require the route to resolve `web-wordpress:0`, pass `offers` into `buildServicePage`, and fail if the commercial source is missing.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/granada-landing-layout.test.ts`

Expected: FAIL because the current component still renders the home-derived selector and markers.

---

### Task 2: Resolve one commercial source in the route

**Files:**
- Modify: `src/pages/[locale]/[landing].astro`
- Modify: `tests/granada-landing-layout.test.ts`

**Interfaces:**
- Consumes: `getServicePages(locale): ServiceItem[]` and `ServiceItem.pricingOptions`.
- Produces: `granadaWebDesignService: ServiceItem`, `granadaRelatedServices: ServiceItem[]`, an attributed `granadaContactHref`, a safe `whatsappHref`, and three structured-data offers.

- [ ] **Step 1: Add the Granada data resolver**

For `page.translationKey === "local-web-design"`, resolve the item whose `translationKey` is `web-wordpress:0`. Throw `Granada web design commercial source not found: ${locale}` when absent.

Resolve related items by:

```ts
const relatedKeys = new Set(["web-wordpress:0", "web-wordpress:5"]);
const granadaRelatedServices = servicePages.filter(
	(item) => relatedKeys.has(item.translationKey) || item.slug === "website-redesign",
);
```

Build WhatsApp with the existing public number and a localized message containing the landing title. Keep the current attributed contact URL.

- [ ] **Step 2: Add pricing offers to local structured data**

Pass these offers to `buildServicePage` only for the Granada landing:

```ts
offers: granadaWebDesignService?.pricingOptions.map((option) => ({
	key: option.key,
	name: option.label,
	description: option.description,
	price: option.amount,
	currency: option.currency,
	billingUnit: option.billingUnit,
	path: landingPath,
})) ?? [],
```

- [ ] **Step 3: Pass the resolved model to the component**

Replace `servicePages` and `yearsWorking` props with:

```astro
service={granadaWebDesignService}
relatedServices={granadaRelatedServices}
featuredProject={featuredProject}
whatsappHref={whatsappHref}
```

- [ ] **Step 4: Run the focused test**

Expected: the route assertions pass while the presentation assertions remain RED.

---

### Task 3: Replace the home-derived presentation with service sections

**Files:**
- Modify: `src/components/landings/GranadaWebDesignLanding.astro`
- Modify: `tests/granada-landing-layout.test.ts`

**Interfaces:**
- Consumes: `{ locale; page; contactHref; whatsappHref; service; relatedServices; featuredProject }`.
- Produces: the ten `data-granada-service-*`/related markers and shared service-component output.

- [ ] **Step 1: Replace component props and derived values**

Use `ServiceItem` for `service` and `ServiceItem[]` for `relatedServices`. Derive the entry price with `Intl.NumberFormat`, deduplicate pricing boundaries, resolve localized service/project URLs, and build trust-strip copy locally in both languages.

- [ ] **Step 2: Build the service hero and trust strip**

Use `ServiceIconBadge`, the existing Granada H1 and intro, contact and WhatsApp actions, and a summary panel showing the first pricing amount, tax label, timeline, and `#granada-pricing-options` link. Wrap the entire component in:

```astro
<div class="services-page service-detail-page granada-service-page">
```

Render `ServiceTrustStrip` with direct communication, written scope, and client ownership signals.

- [ ] **Step 3: Build outcome, pricing, and scope**

Render the existing local problem copy and the first three buyer situations as benefits. Reuse `ServicePricingGrid` with `service.pricingOptions`, the landing contact path, and localized commercial labels from props or a focused local copy object. Render included scope and deduplicated boundaries in the same semantic two-column pattern as service details.

- [ ] **Step 4: Build process, proof, related services, FAQ, and CTA**

Render the four local process steps, `ServiceProofCard` with GetYourTicket, three related canonical services, the four local FAQs, and `ConversionCta`. Do not render the old needs selector, decision band, home-style service grid, or decorative home final CTA.

- [ ] **Step 5: Replace styles with the service-detail visual contract**

Use the service page spacing, heading, summary, outcome, scope, process, related-service, and FAQ patterns. Do not set a narrower `max-width`. Full-width bands use:

```css
padding-inline: max(1rem, calc((100vw - 88rem) / 2));
```

At `max-width: 760px`, collapse hero, scope, process, and related-service grids. The existing `ServicePricingGrid` handles its own one-column breakpoint.

- [ ] **Step 6: Run focused tests and Astro check**

Run:

```sh
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/granada-landing-layout.test.ts tests/commercial-landings.test.ts
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: all focused tests pass and Astro reports zero diagnostics.

---

### Task 4: Verify production output and responsive behavior

**Files:**
- Modify: `tests/build/support/build-artifact.ts`
- Test: `tests/build/site-artifact.test.ts`

**Interfaces:**
- Consumes: generated HTML and JSON-LD for both localized Granada pages.
- Produces: failures for missing service sections, prices, offers, canonical buyer paths, project proof, or obsolete home markers.

- [ ] **Step 1: Update artifact expectations before rebuilding**

Replace the old seven home markers with the ten service markers. Require three pricing cards, three `Offer` objects in the service schema, the existing local `areaServed`, WordPress/redesign/landing-page links, project link, and absence of `granada-selector` and `data-granada-related-posts`.

- [ ] **Step 2: Run build artifact verification**

Run:

```sh
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run test:build
```

Expected: production artifact contract passes.

- [ ] **Step 3: Format and run the complete quality gate**

Run:

```sh
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run quality
```

Expected: formatting and lint are clean, all Node tests pass, Astro has zero diagnostics, build succeeds, and artifact tests pass.

- [ ] **Step 4: Inspect both locales in the browser**

At 1440 by 900 and 390 by 844 verify `scrollWidth === clientWidth`, the desktop `main.site-shell` resolves to the home width, hero/price/CTA are visible, pricing collapses on mobile, language switching is correct, dark mode remains readable, and console errors are empty.

- [ ] **Step 5: Commit the implementation**

Run `git diff --check` and commit only the approved implementation and tests with `refactor(landing): present Granada offer as a service`.
