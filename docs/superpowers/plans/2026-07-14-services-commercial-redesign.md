# Services Commercial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the localized services hub and service-detail routes as a wide, conversion-focused catalog with four commercial areas, visible entry prices, three explicit engagement options per service, and a qualified contact path.

**Architecture:** Keep `src/lib/services.ts` as the public service resolver, but move commercial metadata and numeric prices into a focused typed catalog. Compose the hub and detail routes from small Astro components, keep localized buyer copy in the parallel JSON dictionaries, and validate every generated service record before route generation so no offering can inherit an unrelated price silently.

**Tech Stack:** Astro 7, TypeScript 5.9, Tailwind CSS 4, `astro-icon`, localized JSON dictionaries, Schema.org JSON-LD, Node 24 verification scripts, pnpm.

## Global Constraints

- Work directly on `main`; do not create a worktree unless the user explicitly requests one.
- Use Node `>=24.0.0` and `pnpm`; prepend `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"` when the default shell selects an older Node.
- Preserve every useful existing localized service URL and alternate-language pairing.
- Add only the approved core service, `maintenance-support`; do not invent additional top-level service areas.
- Present exactly four areas: web and conversion, custom software, automation and applied AI, and maintenance and technical support.
- Present exactly three pricing keys per public service: `intervention`, `project`, and `support`.
- Display prices as starting prices plus tax: `Desde X € + IVA` in Spanish and `From €X + VAT` in English.
- Use the approved area baselines: web `120/590/69`, software `250/1200/149`, automation `180/650/99`, and maintenance `90/290/69` for intervention/project/monthly support.
- Keep numeric EUR amounts separate from localized labels and never parse a formatted price string to build structured data.
- Keep the free first assessment as the primary promise; there is no checkout, deposit, hourly-rate table, or 24-hour support guarantee.
- Reuse the 88rem shell, technical grid, navy/coral tokens, `button-action`, `button-secondary`, existing surface tokens, and project/blog card geometry.
- Use only repository line icons; no emoji and no new icon package.
- Do not use a carousel for service areas or pricing cards. Both must remain fully visible and stack on mobile.
- Keep Spanish and English copy equivalent in intent, natural, specific, and free of generic AI marketing language.
- Preserve one `h1`, logical headings, native keyboard-accessible disclosures, visible focus, reduced-motion behavior, and readable light/dark contrast.
- Use `apply_patch` for hand edits, preserve unrelated changes, and make focused Conventional Commits.

---

## File map

### New production files

- `src/lib/service-commercial.ts`: commercial types, four-area definitions, icon mapping, explicit numeric prices, localized pricing resolution, and catalog assertions.
- `src/components/services/ServiceIconBadge.astro`: consistent icon container used by area and detail components.
- `src/components/services/ServiceAreaCard.astro`: large solution-showcase card for the hub.
- `src/components/services/EngagementModels.astro`: concise intervention/project/support explainer.
- `src/components/services/ServiceDirectory.astro`: four native disclosure groups containing canonical service links.
- `src/components/services/ServiceTrustStrip.astro`: three direct-service trust signals.
- `src/components/services/ServicePricingCard.astro`: one engagement option with inclusions, boundary, price, and contact action.
- `src/components/services/ServicePricingGrid.astro`: ordered, responsive three-option comparison.
- `src/components/services/ServiceProofCard.astro`: project/article proof using the established project-card language.
- `scripts/verify-service-redesign.mjs`: source, data, generated-route, contact, and responsive-contract checks.
- `scripts/verify-ai-seo.mjs`: focused discovery checks for service URLs, structured-data builders, robots, and `llms.txt`.

### Modified production files

- `src/lib/services.ts`: add the maintenance slug and expose resolved area, icon, featured rank, timeline, and three pricing options.
- `src/lib/seo.ts`: accept starting-price offers in `Service` and `ProfessionalService` schemas.
- `src/i18n/es.json`: Spanish hub, detail, area, maintenance, pricing-profile, trust, directory, and contact-selection copy.
- `src/i18n/en.json`: English copy with equivalent intent and matching keys.
- `src/pages/[locale]/services.astro`: replace the long hub with the approved commercial sequence.
- `src/pages/[locale]/services/[service].astro`: replace inherited-detail markup with the reusable service template.
- `src/components/forms/ContactForm.astro`: show and submit selected service and scope.
- `src/pages/api/contact.ts`: validate and include optional service/scope in contact emails.
- `src/pages/[locale]/contact.astro`: retain query selection after success and provide the service map to the form.
- `src/styles/global.css`: opt service routes into 88rem and add only shared service-page selectors/tokens.
- `src/components/home/HomeSpecializedServices.astro`: allow the general maintenance service to be linked naturally from Home copy.
- `src/content/blog/es/cuando-necesita-empresa-mantenimiento-spring-boot.md`: add a natural internal link to general maintenance and technical support.
- `src/content/blog/en/when-company-needs-spring-boot-maintenance.md`: equivalent English link.
- `astro.config.mjs`: keep the internal non-canonical maintenance route out of the sitemap.
- `public/llms.txt`: list maintenance/support in both languages and preserve existing service references.
- `package.json`: expose `verify:service-redesign` and the repository-required `verify:ai-seo` commands.
- `scripts/verify-conversion-cta.mjs`: keep the shared CTA contract compatible with new service markup.

---

### Task 1: Lock and implement the explicit commercial catalog

**Files:**

- Create: `src/lib/service-commercial.ts`
- Create: `scripts/verify-service-redesign.mjs`
- Modify: `src/lib/services.ts`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Modify: `package.json`
- Test: `scripts/verify-service-redesign.mjs`

**Interfaces:**

- Produces these shared types in `service-commercial.ts`:

```ts
export const serviceAreaSlugs = [
	"web-conversion",
	"custom-software",
	"automation-ai",
	"maintenance-support",
] as const;

export const pricingKeys = ["intervention", "project", "support"] as const;

export type ServiceAreaSlug = (typeof serviceAreaSlugs)[number];
export type PricingKey = (typeof pricingKeys)[number];
export type BillingUnit = "one-off" | "month";

export interface PricingOption {
	key: PricingKey;
	label: string;
	description: string;
	amount: number;
	currency: "EUR";
	billingUnit: BillingUnit;
	deliverables: string[];
	boundary: string;
	ctaLabel: string;
}

export interface CommercialServiceDefinition {
	area: ServiceAreaSlug;
	icon: string;
	featuredRank?: 1 | 2 | 3;
	pricingProfile: string;
	prices: Record<PricingKey, number>;
	timeline?: string;
}
```

Declare `ServiceArea` in `services.ts`, where `ServiceItem` already lives, and import only `ServiceAreaSlug` from `service-commercial.ts`; this avoids a circular runtime import.

- `getCommercialServiceDefinition(translationKey)` returns one explicit record or throws.
- `resolvePricingOptions(locale, translationKey)` returns a tuple `[PricingOption, PricingOption, PricingOption]` in the order intervention, project, support.
- `getServiceAreas(locale)` returns four `ServiceArea` records with exactly three featured canonical services each:

```ts
export interface ServiceArea {
	slug: ServiceAreaSlug;
	title: string;
	description: string;
	icon: string;
	entryPrice: number;
	featuredServices: readonly [ServiceItem, ServiceItem, ServiceItem];
	services: ServiceItem[];
}
```

- `getCanonicalServicePages(locale)` removes internal base duplicates whose `canonicalPath` points at a localized offering.
- `getRelatedServices(locale, service, limit)` returns other canonical services from the same area first and fills any remaining positions from different areas without returning the current service.

- [ ] **Step 1: Add the failing catalog verifier**

Create `scripts/verify-service-redesign.mjs` with source reads for the new catalog, both dictionaries, hub route, detail route, contact form, SEO helper, global styles, `llms.txt`, and optionally `dist/client` when `--dist` is passed. Support cumulative phases so early tasks can pass before later UI exists:

```js
const phases = [
	"catalog",
	"hub-components",
	"hub",
	"detail-components",
	"detail",
	"contact",
	"seo",
];
const phaseArgument = process.argv.find((value) => value.startsWith("--phase="));
const requestedPhase = phaseArgument?.split("=")[1] ?? "seo";
const requestedIndex = phases.indexOf(requestedPhase);
if (requestedIndex < 0) throw new Error(`Unknown phase: ${requestedPhase}`);
const includesPhase = (phase) => phases.indexOf(phase) <= requestedIndex;
```

Guard each later assertion block with `includesPhase(...)`. Require:

```js
const requiredAreas = [
	"web-conversion",
	"custom-software",
	"automation-ai",
	"maintenance-support",
];
const requiredPricingKeys = ["intervention", "project", "support"];
const requiredTranslationKeys = [
	"base:business-website",
	"base:website-redesign",
	"base:custom-web-application",
	"base:internal-tools",
	"base:automation-workflows",
	"base:api-integrations",
	"base:backend-spring-boot",
	"base:maintenance-support",
	...Array.from({ length: 7 }, (_, index) => `it-consulting:${index}`),
	...Array.from({ length: 6 }, (_, index) => `web-wordpress:${index}`),
	...Array.from({ length: 5 }, (_, index) => `ai-automation:${index}`),
	"maintenance-support:0",
];
```

The verifier must fail for a missing area, icon, explicit translation key, pricing key, numeric price, localized profile, maintenance route, source marker, or generated route. Add to `package.json`:

```json
"verify:service-redesign": "node scripts/verify-service-redesign.mjs"
```

- [ ] **Step 2: Run the verifier and confirm the expected failure**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-service-redesign.mjs --phase=catalog
```

Expected: exit code `1` listing the missing `service-commercial.ts`, maintenance definition, pricing keys, and route/component markers.

- [ ] **Step 3: Define all explicit commercial records**

Create `serviceCommercialDefinitions` as a `Record<string, CommercialServiceDefinition>`. It must contain all 27 keys from Step 1. Use only these repository icon names: `globe`, `pen-tool`, `laptop`, `layers`, `code`, `git-branch`, `cloud`, `brain`, `sparkles`, `message-square`, `briefcase-business`, `lightbulb`, `circle-check-big`, and `springboot`.

Use this exact featured mapping:

| Area | Featured rank 1 | Featured rank 2 | Featured rank 3 |
| --- | --- | --- | --- |
| `web-conversion` | `web-wordpress:0` | `base:website-redesign` | `web-wordpress:5` |
| `custom-software` | `it-consulting:3` | `base:internal-tools` | `it-consulting:4` |
| `automation-ai` | `it-consulting:5` | `ai-automation:2` | `ai-automation:1` |
| `maintenance-support` | `maintenance-support:0` | `web-wordpress:1` | `it-consulting:6` |

Use this explicit price matrix; the order in every tuple is intervention/project/support:

```ts
const prices = {
	"base:business-website": [120, 590, 69],
	"base:website-redesign": [120, 390, 69],
	"base:custom-web-application": [250, 1200, 149],
	"base:internal-tools": [250, 900, 149],
	"base:automation-workflows": [180, 650, 99],
	"base:api-integrations": [250, 450, 149],
	"base:backend-spring-boot": [250, 700, 149],
	"base:maintenance-support": [90, 290, 69],
	"it-consulting:0": [250, 900, 149],
	"it-consulting:1": [120, 450, 99],
	"it-consulting:2": [120, 390, 99],
	"it-consulting:3": [250, 1200, 149],
	"it-consulting:4": [250, 450, 149],
	"it-consulting:5": [180, 650, 99],
	"it-consulting:6": [90, 290, 69],
	"web-wordpress:0": [120, 590, 69],
	"web-wordpress:1": [90, 290, 69],
	"web-wordpress:2": [120, 390, 69],
	"web-wordpress:3": [180, 890, 99],
	"web-wordpress:4": [150, 590, 69],
	"web-wordpress:5": [120, 490, 69],
	"ai-automation:0": [180, 650, 99],
	"ai-automation:1": [180, 650, 99],
	"ai-automation:2": [180, 650, 99],
	"ai-automation:3": [250, 900, 149],
	"ai-automation:4": [180, 450, 99],
	"maintenance-support:0": [90, 290, 69],
} as const;
```

Each definition must assign its own pricing profile explicitly. Use focused profiles named `businessWebsite`, `websiteRedesign`, `customApplication`, `internalTool`, `workflowAutomation`, `apiIntegration`, `springBackend`, `technicalMaintenance`, `projectManagement`, `technicalAdvisory`, `secondOpinion`, `wordpressWebsite`, `wordpressMaintenance`, `wordpressOptimization`, `woocommerce`, `wordpressMigration`, `landingPage`, `businessAi`, `chatbot`, `aiAutomation`, `aiAgent`, and `aiTraining`.

- [ ] **Step 4: Add localized pricing profiles and page-level labels**

Under `services.commercial` in both dictionaries, add matching `areas`, `engagementModels`, `trust`, `directory`, `pricing`, `scope`, and `proof` objects. Use this complete Spanish `businessWebsite` profile as the structural reference:

```json
{
  "intervention": {
    "label": "Intervención puntual",
    "description": "Una revisión acotada para aclarar el mensaje y corregir el principal bloqueo de conversión.",
    "deliverables": [
      "Revisión de oferta, jerarquía y camino de contacto.",
      "Lista priorizada de mejoras con alcance claro.",
      "Una mejora concreta en la página principal o landing."
    ],
    "boundary": "No incluye el rediseño completo ni la creación de todas las páginas del sitio.",
    "ctaLabel": "Consultar esta intervención"
  },
  "project": {
    "label": "Proyecto completo",
    "description": "Una web profesional lista para explicar la oferta, generar confianza y captar contactos.",
    "deliverables": [
      "Arquitectura, mensajes y llamadas a la acción.",
      "Diseño responsive y desarrollo de hasta cinco secciones.",
      "Formulario, SEO técnico básico, rendimiento y despliegue.",
      "Revisión final y entrega de accesos."
    ],
    "boundary": "No incluye identidad visual completa, campañas publicitarias ni contenido audiovisual.",
    "ctaLabel": "Solicitar valoración del proyecto"
  },
  "support": {
    "label": "Soporte mensual",
    "description": "Mantenimiento y pequeñas mejoras priorizadas después de publicar.",
    "deliverables": [
      "Revisión mensual de funcionamiento y formulario.",
      "Actualizaciones técnicas y correcciones menores.",
      "Una cola priorizada de mejoras de contenido o conversión."
    ],
    "boundary": "No incluye disponibilidad 24/7 ni respuesta inmediata salvo acuerdo específico.",
    "ctaLabel": "Consultar soporte mensual"
  }
}
```

Every other profile follows the same exact object shape and uses its named operational scope: `wordpressMaintenance` covers diagnosis plus one bounded correction, then updates/backups/security/stabilization, then scheduled checks and a prioritized queue; `apiIntegration` covers contract/authentication review, then implementation with errors/retries, then monitoring and evolution; `aiAutomation` covers representative-sample assessment, then implementation/evaluation/human review/usage limits, then monitored iteration; `technicalMaintenance` covers one diagnosed incident, then stabilization of dependencies/deployment/observability, then prioritized recurring evolution. The remaining profiles derive their deliverables directly from the existing `builds` and `process` copy for that service, but each must state one concrete intervention, one completed outcome, one recurring responsibility, and one explicit exclusion. English must express the same operational boundaries rather than translate word-for-word.

- [ ] **Step 5: Add the maintenance service and localized canonical offering**

Extend `ServiceSlug` and `serviceSlugs` with `maintenance-support`. Add `services.items.maintenance-support` in both dictionaries with a full record matching the existing service shape. Use these public titles and canonical offering titles:

```json
// es
"title": "Mantenimiento y soporte técnico",
"shortTitle": "Mantenimiento técnico"

// en
"title": "Maintenance and technical support",
"shortTitle": "Technical maintenance"
```

Add a fourth hub group key, `maintenance-support`, with one offering at index `0`. Its localized title must generate `/es/services/mantenimiento-y-soporte-tecnico/` and `/en/services/maintenance-and-technical-support/`. Map `canonicalOfferingByLocale.maintenance-support` to those slugs.

- [ ] **Step 6: Resolve commercial metadata without inherited pricing**

Remove the old single `pricing` property from `ServiceItem` and add:

```ts
area: ServiceAreaSlug;
icon: string;
featuredRank?: 1 | 2 | 3;
pricingOptions: readonly [PricingOption, PricingOption, PricingOption];
timeline?: string;
```

In both base-service and offering construction, resolve commercial metadata by the final `translationKey`. Do not spread the canonical service's pricing options into the offering. Throw an error that names locale and translation key when commercial data or localized profile copy is absent.

- [ ] **Step 7: Re-run focused validation and commit**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-service-redesign.mjs --phase=catalog
```

Expected: Astro reports zero errors and the catalog/data phase passes. Commit:

```bash
git add src/lib/service-commercial.ts src/lib/services.ts src/i18n/es.json src/i18n/en.json scripts/verify-service-redesign.mjs package.json
git commit -m "feat(services): model commercial pricing catalog"
```

---

### Task 2: Build the reusable hub components

**Files:**

- Create: `src/components/services/ServiceIconBadge.astro`
- Create: `src/components/services/ServiceAreaCard.astro`
- Create: `src/components/services/EngagementModels.astro`
- Create: `src/components/services/ServiceDirectory.astro`
- Modify: `scripts/verify-service-redesign.mjs`
- Test: `scripts/verify-service-redesign.mjs`

**Interfaces:**

- `ServiceIconBadge` consumes `{ icon: string; label?: string; size?: "sm" | "lg" }` and treats the icon as decorative when no label is supplied.
- `ServiceAreaCard` consumes:

```ts
interface Props {
	locale: Locale;
	area: ServiceArea;
	exploreLabel: string;
	pricePrefix: string;
	taxLabel: string;
}
```

- `EngagementModels` consumes the localized three-model array and renders in intervention/project/support order.
- `ServiceDirectory` consumes `{ areas: ServiceArea[]; title: string; openLabel: string }` and outputs four native `<details>` elements.

- [ ] **Step 1: Extend the verifier with failing component contracts**

Require the four new files and these markers: `data-service-area-card`, `data-service-icon`, `data-engagement-models`, `data-service-directory`, `<details`, `<summary`, `button-secondary`, `arrow-right`, and no carousel data attributes.

- [ ] **Step 2: Confirm the new contract fails**

Run `node scripts/verify-service-redesign.mjs --phase=hub-components` with Node 24. Expected: missing component and marker failures.

- [ ] **Step 3: Implement the shared icon badge**

Use `Icon` from `astro-icon/components`, a soft coral square/rounded container, current surface tokens, and `aria-hidden={!label}`. Keep the visual size stable at 2.75rem small and 3.5rem large.

- [ ] **Step 4: Implement the large area card**

Render icon, area title, one outcome sentence, exactly three featured service links, the intervention entry price, and a final explore link. The whole card must not be a nested anchor. Use project/blog card border, radius, shadow and hover lift; individual links retain visible focus.

- [ ] **Step 5: Implement engagement models and compact directory**

Render engagement models as three ordered columns with numeric labels `01`, `02`, `03`; highlight project only with position and a small `Más habitual`/`Most common` label. In the directory, each area `<summary>` shows icon, title and service count, while the expanded content is a compact list of canonical links without duplicated paragraphs.

- [ ] **Step 6: Run the verifier and commit**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-service-redesign.mjs --phase=hub-components
```

Expected: catalog and hub-component checks pass.

```bash
git add src/components/services scripts/verify-service-redesign.mjs
git commit -m "feat(services): add commercial hub components"
```

---

### Task 3: Rebuild the services hub in the approved sequence

**Files:**

- Modify: `src/pages/[locale]/services.astro`
- Modify: `src/styles/global.css`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Modify: `scripts/verify-conversion-cta.mjs`
- Modify: `scripts/verify-service-redesign.mjs`
- Test: `scripts/verify-service-redesign.mjs`

**Interfaces:**

- Consumes `getServiceAreas(locale)`, `getCanonicalServicePages(locale)`, `getProjectPages(locale)`, all Task 2 components, and the shared `ConversionCta`.
- Produces one `.services-page` with sections in this exact order: hero, area grid, engagement models, proof, four-step process, compact directory, FAQ, conversion CTA.

- [ ] **Step 1: Add failing route-order and design assertions**

Require route markers in increasing source order:

```js
const hubMarkers = [
	'data-services-hero',
	'data-services-areas',
	'data-engagement-models',
	'data-services-proof',
	'data-services-process',
	'data-service-directory',
	'data-services-faq',
	'ConversionCta',
];
```

Also require `.services-page`, `button-action`, `ServiceAreaCard`, `EngagementModels`, `ServiceDirectory`, `getProjectPages`, and the 88rem selector. Reject the old `definitionTitle`, `advantagesTitle`, `recommendationTitle`, `useCasesTitle`, and `commercialLandingCopy` markup.

- [ ] **Step 2: Replace the hub composition**

Wrap route content in `<div class="services-page">`. Build a split editorial hero: left side contains eyebrow and balanced `h1`; right side contains the short intro, free-assessment line, coral `button-action` to `/${locale}/contact?service=assessment`, and neutral projects action.

Render the four area cards in a 2×2 grid from `getServiceAreas(locale)`. Render `EngagementModels` immediately after. Do not retain the current definition, generic advantages, fit/no-fit, use-case, or commercial-landing card walls.

- [ ] **Step 3: Add selected proof and process**

Select project IDs `cv-studio`, `educash-affiliate-platform`, and `realtime-websocket-gateway` from `getProjectPages(locale)`. Reuse `ProjectArchiveCard.astro` to link to their case studies and preserve localized title/summary/image without introducing another hub-only card. Keep the existing four-step process copy, but present it as a restrained numbered strip/cards under `data-services-process`.

- [ ] **Step 4: Add directory, FAQ and shared CTA**

Render all canonical service routes through the four directory disclosures. Keep six useful buyer FAQs, including starting price, VAT, what the free assessment includes, ownership, monthly support, and how final scope is calculated. Keep `ConversionCta` last and use `button-action` through its existing API.

- [ ] **Step 5: Add the wide service shell**

Add:

```css
body:has(.services-page) main.site-shell {
	max-width: 88rem;
}

.services-page .eyebrow {
	color: var(--action);
}

.services-page h1,
.services-page h2,
.services-page h3 {
	color: var(--home-navy);
}
```

Use route-local Tailwind for layout; add global CSS only for shared page tokens and dark-mode corrections that cannot be expressed cleanly in components.

- [ ] **Step 6: Validate, visually inspect and commit**

Run `node scripts/verify-service-redesign.mjs --phase=hub`, then inspect `/es/services/` and `/en/services/` at 390×844 and 1440×900 in light/dark themes. Check that all four areas are visible without horizontal scrolling, prices wrap, disclosures work by keyboard, and the CTA hierarchy matches Home/Projects.

```bash
git add 'src/pages/[locale]/services.astro' src/styles/global.css src/i18n/es.json src/i18n/en.json scripts/verify-conversion-cta.mjs scripts/verify-service-redesign.mjs
git commit -m "refactor(services): rebuild commercial services hub"
```

---

### Task 4: Build the reusable detail-page components

**Files:**

- Create: `src/components/services/ServiceTrustStrip.astro`
- Create: `src/components/services/ServicePricingCard.astro`
- Create: `src/components/services/ServicePricingGrid.astro`
- Create: `src/components/services/ServiceProofCard.astro`
- Modify: `scripts/verify-service-redesign.mjs`
- Test: `scripts/verify-service-redesign.mjs`

**Interfaces:**

- `ServiceTrustStrip` consumes a three-item localized array with `{ icon, title, text }`.
- `ServicePricingCard` consumes:

```ts
interface Props {
	locale: Locale;
	serviceSlug: string;
	serviceTitle: string;
	option: PricingOption;
	featured?: boolean;
	contactHref: string;
	mostCommonLabel: string;
	pricePrefix: string;
	taxLabel: string;
}
```

- `ServicePricingGrid` consumes the three-option tuple and preserves DOM order.
- `ServiceProofCard` consumes `{ eyebrow, title, description, href, actionLabel, image? }` and uses the project-card border/radius/action-line language.

- [ ] **Step 1: Add failing detail-component assertions**

Require `data-service-trust`, three `data-pricing-option` values, `data-pricing-featured`, `data-pricing-boundary`, `data-service-proof`, `button-action`, contact query construction, and no carousel marker.

Run `node scripts/verify-service-redesign.mjs --phase=detail-components`. Expected: the new detail-component assertions fail before the files exist.

- [ ] **Step 2: Implement the trust strip**

Use exactly three signals: free first assessment; direct communication with the person doing the work; clear ownership of code, accounts and handoff. Make the list understandable without icon color.

- [ ] **Step 3: Implement pricing cards and grid**

Format numeric EUR amounts with `Intl.NumberFormat(locale === "es" ? "es-ES" : "en-GB")`. Append `/mes` or `/month` only when `billingUnit === "month"`; append localized tax copy separately. Mark only `project` as featured. Each card renders 3–5 deliverables, one boundary, and an href of:

```ts
`/${locale}/contact?service=${encodeURIComponent(serviceSlug)}&scope=${option.key}`
```

Also add `data-contact-modal-open`, `data-service-selection`, and `data-scope-selection` so the same action can open the detail modal progressively.

- [ ] **Step 4: Implement the proof card**

Support either a project image or a text-only article state. Keep one clear action line with an arrow icon, no tag cloud, and no technologies/organization/role metadata.

- [ ] **Step 5: Verify and commit**

Run `node scripts/verify-service-redesign.mjs --phase=detail-components`. Expected: catalog, hub and detail-component phases pass.

```bash
git add src/components/services scripts/verify-service-redesign.mjs
git commit -m "feat(services): add reusable service detail components"
```

---

### Task 5: Rebuild every service detail route from the shared template

**Files:**

- Modify: `src/pages/[locale]/services/[service].astro`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Modify: `scripts/verify-conversion-cta.mjs`
- Modify: `scripts/verify-service-redesign.mjs`
- Test: `scripts/verify-service-redesign.mjs`

**Interfaces:**

- Consumes the resolved `ServiceItem`, Task 4 components, `getProjectPages(locale)`, `getRelatedServices(locale, service, 3)`, and shared `ConversionCta`/`ContactForm`.
- Produces one reusable `.services-page.service-detail-page` in this exact order: hero, trust, problem/result, pricing, included/excluded, process, proof/article, related services, FAQ, conversion CTA, contact dialog.

- [ ] **Step 1: Add failing detail-order assertions**

Require these markers in source order:

```js
const detailMarkers = [
	'data-service-hero',
	'data-service-trust',
	'data-service-outcome',
	'data-service-pricing',
	'data-service-scope',
	'data-service-process',
	'data-service-proof',
	'data-related-services',
	'data-service-faq',
	'ConversionCta',
	'id="service-contact-dialog"',
];
```

Reject the old single `service.pricing`, hard-coded `getRelatedKeys`, and third “view all services” button in the hero CTA row.

Run `node scripts/verify-service-redesign.mjs --phase=detail`. Expected: route-order failures before the old detail template is replaced.

- [ ] **Step 2: Build the split hero and trust strip**

Left: quiet back link to all services, icon badge, eyebrow, `h1`, concise description, coral assessment CTA and WhatsApp secondary action. Right: a compact summary card with intervention starting price, localized timeline when present, VAT note, and anchor link to `#pricing-options`. Place `ServiceTrustStrip` directly below.

- [ ] **Step 3: Compose outcome, pricing and scope**

Merge current overview/problem/benefits into one concise problem-and-result section. Render `ServicePricingGrid` with `project` as most common. Render included scope from `service.builds` and explicit exclusions from the three pricing boundaries; deduplicate repeated boundaries before display.

- [ ] **Step 4: Compose process, proof and related services**

Keep the service-specific four process steps. Choose the first project whose `caseStudy.serviceHref` matches the current canonical path or canonical service route; otherwise use the first `service.relatedPosts` entry. Render three related services from the same area before falling back to other areas. Related cards use icon, title, short description and a neutral action, not tag pills.

- [ ] **Step 5: Compose FAQ, CTA and dialog**

Retain service-specific FAQ content, followed by the shared conversion CTA. Keep the dialog and exit-intent behavior, but ensure every pricing trigger updates the modal form's selected service/scope before opening. Keep WhatsApp as secondary and preserve external-link security attributes.

- [ ] **Step 6: Validate representative route families and commit**

Run `node scripts/verify-service-redesign.mjs --phase=detail`. Then inspect at least these routes in both languages: business website, custom software, AI automation, maintenance/support, and Spring Boot. Confirm long titles, all three cards, localized prices, missing-project fallback, related-service area logic, dark mode and mobile stacking.

```bash
git add 'src/pages/[locale]/services/[service].astro' src/i18n/es.json src/i18n/en.json scripts/verify-conversion-cta.mjs scripts/verify-service-redesign.mjs
git commit -m "refactor(services): rebuild service detail template"
```

---

### Task 6: Carry service and scope through the contact flow

**Files:**

- Modify: `src/components/forms/ContactForm.astro`
- Modify: `src/pages/[locale]/contact.astro`
- Modify: `src/pages/api/contact.ts`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Modify: `scripts/verify-service-redesign.mjs`
- Test: `scripts/verify-service-redesign.mjs`

**Interfaces:**

- `ContactForm` adds optional props:

```ts
selectedService?: string;
selectedScope?: PricingKey;
```

- Form fields submit optional `service` and `scope`; the existing required `projectType` remains unchanged for non-service entry points.
- API accepts service only when it is `assessment` or matches a slug returned by `getServicePages(locale)`; scope is accepted only when it is one of the three pricing keys.
- The reserved `assessment` service value resolves to the localized “Primera valoración gratuita” / “Free initial assessment” label even though it is not a service-page slug.

- [ ] **Step 1: Add failing contact assertions**

Require `name="service"`, `name="scope"`, `data-selected-service`, `data-selected-scope`, the three valid scope values, query-param reads, API validation, and email lines `Service:` and `Scope:`.

Run `node scripts/verify-service-redesign.mjs --phase=contact`. Expected: contact-selection failures before the form/API changes.

- [ ] **Step 2: Add a visible optional selection summary**

Add hidden inputs plus a compact visible summary above the generic project-type field. It remains hidden when no valid service is selected. Use localized labels “Servicio consultado / Modalidad” and “Selected service / Engagement”. Resolve the service title from `getServicePages(locale)` rather than displaying a raw slug.

- [ ] **Step 3: Populate selection from query or modal trigger**

On `/contact`, read `service` and `scope`, validate them against data embedded by the Astro component, update hidden inputs and reveal the summary. In the service dialog, the clicked pricing card's data attributes take precedence. A plain assessment CTA with `service=assessment` remains valid but has no pricing scope.

- [ ] **Step 4: Validate and include selection in the email**

In `api/contact.ts`, normalize optional values. Reject an invalid non-empty scope with `400`; ignore a service value unless it equals `assessment` or matches `getServicePages(locale)`. Add localized-safe email lines without using raw input in the subject. Preserve attachment, source and redirect behavior.

- [ ] **Step 5: Verify all entry paths and commit**

Run `node scripts/verify-service-redesign.mjs --phase=contact`. Test direct contact, assessment, each of the three pricing scopes, modal open, successful submit redirect, and malformed scope. Commit:

```bash
git add src/components/forms/ContactForm.astro 'src/pages/[locale]/contact.astro' src/pages/api/contact.ts src/i18n/es.json src/i18n/en.json scripts/verify-service-redesign.mjs
git commit -m "feat(contact): capture selected service scope"
```

---

### Task 7: Publish valid offer schema and discovery signals

**Files:**

- Modify: `src/lib/seo.ts`
- Modify: `src/pages/[locale]/services.astro`
- Modify: `src/pages/[locale]/services/[service].astro`
- Create: `scripts/verify-ai-seo.mjs`
- Modify: `package.json`
- Modify: `public/llms.txt`
- Modify: `astro.config.mjs`
- Modify: `src/components/home/HomeSpecializedServices.astro`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Modify: `src/content/blog/es/cuando-necesita-empresa-mantenimiento-spring-boot.md`
- Modify: `src/content/blog/en/when-company-needs-spring-boot-maintenance.md`
- Modify: `scripts/verify-service-redesign.mjs`
- Test: `scripts/verify-ai-seo.mjs`

**Interfaces:**

- Add:

```ts
export interface StartingPriceOfferSeo {
	key: PricingKey;
	name: string;
	description: string;
	price: number;
	currency: "EUR";
	billingUnit: BillingUnit;
	path: string;
}
```

- `buildServicePage` accepts `offers: StartingPriceOfferSeo[]`.
- Each `ProfessionalServiceSeo.services[]` accepts its own `offers` array.

- [ ] **Step 1: Write the failing AI/SEO verifier**

Create checks for `ProfessionalService`, `OfferCatalog`, `makesOffer`, `priceCurrency`, `priceSpecification`, three pricing keys, maintenance URLs in both languages, robots allowing public pages, `llms.txt` maintenance entries, and existence of generated localized routes. Add:

```json
"verify:ai-seo": "node scripts/verify-ai-seo.mjs"
```

- [ ] **Step 2: Confirm SEO checks fail before implementation**

Run `pnpm run verify:ai-seo`. Expected: missing numeric offer and maintenance discovery failures.

- [ ] **Step 3: Extend service schema builders**

For every starting-price option emit an `Offer` with localized name/description, the absolute canonical service URL ending in `#pricing-options`, `priceCurrency: "EUR"`, and `UnitPriceSpecification` containing numeric `price`. Use `unitText: "MONTH"` only for support and a localized description stating that it is a starting price subject to final scope. Do not use `lowPrice/highPrice` ranges that are not displayed.

The hub catalog should expose four area services with their three area-baseline offers; each detail route exposes its own three explicit offers.

- [ ] **Step 4: Add maintenance discovery and internal links**

Add both canonical maintenance service URLs and concise descriptions to `public/llms.txt`. Add the internal base maintenance paths to `nonCanonicalServicePaths` so only localized canonical offerings appear in the sitemap. Extend the first Home specialized-service item with an optional secondary link rendered by `HomeSpecializedServices.astro`: “Mantenimiento y soporte técnico” → `/es/services/mantenimiento-y-soporte-tecnico/` and “Maintenance and technical support” → `/en/services/maintenance-and-technical-support/`. Keep the approved three-card Home layout. In the two Spring Boot maintenance articles, add a sentence that distinguishes the general maintenance service from the existing Spring-specific landing and links to the new canonical route.

- [ ] **Step 5: Verify schema, sitemap inputs and generated routes**

Run check, build, `verify:ai-seo`, `verify:service-redesign --dist`, and inspect JSON-LD on the Spanish/English hub plus one detail page from every area. Expected: numeric EUR offers, correct canonical URLs, no noncanonical maintenance entry in sitemap, and all localized routes generated.

- [ ] **Step 6: Commit discovery work**

```bash
git add src/lib/seo.ts 'src/pages/[locale]/services.astro' 'src/pages/[locale]/services/[service].astro' scripts/verify-ai-seo.mjs scripts/verify-service-redesign.mjs package.json public/llms.txt astro.config.mjs src/components/home/HomeSpecializedServices.astro src/i18n/es.json src/i18n/en.json src/content/blog/es/cuando-necesita-empresa-mantenimiento-spring-boot.md src/content/blog/en/when-company-needs-spring-boot-maintenance.md
git commit -m "feat(seo): publish maintenance service offers"
```

---

### Task 8: Complete responsive, theme and accessibility verification

**Files:**

- Verify: all files changed in Tasks 1–7
- Modify if failures require it: affected focused component, route, dictionary, or verifier only

**Interfaces:**

- Produces a clean source tree, passing production build, and manual evidence across representative routes.

- [ ] **Step 1: Format all touched files**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format
git diff --check
```

Expected: Prettier completes and `git diff --check` prints nothing.

- [ ] **Step 2: Run the complete static validation set**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:service-redesign
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:ai-seo
```

Expected: zero warnings/errors and all focused verifiers print their passing message.

- [ ] **Step 3: Build and verify generated output**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-service-redesign.mjs --dist
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-ai-seo.mjs --dist
```

Expected: production build succeeds and both generated-output checks pass.

- [ ] **Step 4: Inspect the route matrix manually**

At 390×844 and 1440×900, inspect light and dark themes for:

- `/es/services/` and `/en/services/`.
- Web: `/es/services/diseno-web-wordpress/` and English alternate.
- Software: `/es/services/software-a-medida/` and English alternate.
- AI: `/es/services/automatizaciones-con-ia/` and English alternate.
- Maintenance: `/es/services/mantenimiento-y-soporte-tecnico/` and English alternate.
- Backend: `/es/services/backend-spring-boot/` and English alternate.

Check one `h1`, no horizontal overflow, price wrapping, visible focus, disclosure keyboard control, pricing DOM order, project label, modal focus/close, contact selection, long English titles, and all CTA destinations.

- [ ] **Step 5: Review the final diff and commit only verification fixes**

Run `git status -sb`, `git diff --stat`, and `git diff --check`. Do not create an empty commit. If visual/validation fixes were necessary, commit them as:

```bash
git add src/components/services 'src/pages/[locale]/services.astro' 'src/pages/[locale]/services/[service].astro' src/styles/global.css
git commit -m "fix(services): resolve responsive verification issues"
```

---

## Acceptance checklist

- The services hub is visibly aligned with Home/About/Projects/Blog and uses the 88rem shell.
- Four area cards and their entry prices are visible without interaction.
- All 27 resolved service records have an explicit area, valid icon, pricing profile, and three numeric prices.
- The maintenance service has canonical Spanish/English routes and paired alternates.
- Every detail page shows intervention, project and monthly support with project marked most common.
- No generated offering inherits an unrelated canonical service price or deliverable list.
- Contact links and modal submissions retain selected service and scope.
- Hub/detail JSON-LD contains numeric EUR starting offers without implying a fixed final quote.
- Existing service URLs remain generated and discoverable through the compact directory.
- Mobile uses vertical stacking, never pricing/area carousels or horizontal comparison.
- Light/dark, Spanish/English, keyboard focus, disclosures, dialogs and long titles pass manual inspection.
- Formatting, Astro checks, lint, conversion CTA, service verification, AI/SEO verification and production build all pass.
