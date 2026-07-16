# DataForSEO lead generation implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic freelance landing with a bilingual Granada web-design landing, consolidate legacy URLs, remove obsolete keyword metadata, and make the commercial SEO map reflect DataForSEO-backed buyer intent.

**Architecture:** Keep the existing typed commercial-landing and SEO-cluster systems. Add one pure legacy-route resolver shared by Astro configuration, the localized catch-all, and artifact verification; keep content and route ownership in existing typed modules. Tests establish redirect, ownership, metadata, sitemap, hreflang, and content contracts before production changes.

**Tech Stack:** Astro 7, TypeScript 5.9, Node 24 test runner, Tailwind CSS 4, Vercel static adapter, pnpm 11.

## Global constraints

- Work directly on `main`; repository instructions explicitly prefer it unless the user requests isolation.
- Use Node `>=24.0.0` and `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"` for every pnpm command.
- Preserve Spanish and English equivalents with matching intent, not literal translations.
- Do not invent an office, street address, team, testimonials, clients, outcomes, rankings, or local business presence.
- Create one Granada landing only; do not generate city or neighborhood variants.
- Keep the established commercial visual design and CTA hierarchy.
- Write public copy in a natural first-person voice and apply the humanizer review before completion.
- Write a failing test before every behavior change.
- Do not deploy or mutate Search Console without separate authorization.

---

### Task 1: Resolve every approved legacy route

**Files:**
- Create: `src/lib/legacy-redirects.ts`
- Create: `tests/legacy-redirects.test.ts`
- Modify: `src/pages/[locale]/[...notFound].astro`
- Modify: `astro.config.mjs`
- Modify: `tests/build/support/build-artifact.ts`

**Interfaces:**
- Consumes: `serviceAliasRedirects` from `src/lib/service-aliases.ts`.
- Produces: `legacyRedirects: Readonly<Record<string, string>>` and `getLegacyRedirect(pathname: string): string | undefined`.

- [ ] **Step 1: Write the failing resolver tests**

Create `tests/legacy-redirects.test.ts` with assertions that:

```ts
assert.equal(
	getLegacyRedirect("/es/services/api-integrations/"),
	"/es/services/integraciones-api/",
);
assert.equal(
	getLegacyRedirect("/es/services/api-integrations"),
	"/es/services/integraciones-api/",
);
assert.equal(
	getLegacyRedirect(
		"/en/blog/cuando-deberia-una-empresa-migrar-un-backend-legacy-a-java-spring-boot/",
	),
	"/en/blog/when-should-a-company-migrate-a-legacy-backend-to-java-spring-boot/",
);
assert.equal(
	getLegacyRedirect("/es/blog/building-cv-studio/"),
	"/es/blog/creando-cv-studio/",
);
assert.equal(
	getLegacyRedirect("/es/desarrollador-freelance-espana/"),
	"/es/diseno-web-granada/",
);
assert.equal(getLegacyRedirect("/es/una-ruta-desconocida/"), undefined);
```

- [ ] **Step 2: Run the resolver test and verify RED**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/legacy-redirects.test.ts`

Expected: failure because `src/lib/legacy-redirects.ts` does not exist.

- [ ] **Step 3: Implement the pure resolver**

Create `src/lib/legacy-redirects.ts` by combining `serviceAliasRedirects` with the two wrong-locale blog routes and the two replaced freelance landings. Normalize a requested pathname to a leading slash and one trailing slash before lookup. Return `undefined` for canonical destinations and unknown paths.

```ts
const normalizeLegacyPath = (pathname: string) =>
	`/${pathname.replace(/^\/+|\/+$/g, "")}/`;

export const getLegacyRedirect = (pathname: string) =>
	legacyRedirects[
		normalizeLegacyPath(pathname) as keyof typeof legacyRedirects
	];
```

- [ ] **Step 4: Run the resolver test and verify GREEN**

Run the command from Step 2.

Expected: all legacy redirect tests pass.

- [ ] **Step 5: Write failing integration assertions**

Extend artifact verification so every key in `legacyRedirects` is excluded from the sitemap and internal links, and has a permanent Vercel redirect when the platform emits one. Extend `tests/not-found-page.test.ts` to assert the localized catch-all imports and calls `getLegacyRedirect` before assigning status 404.

- [ ] **Step 6: Run targeted tests and verify RED**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/not-found-page.test.ts tests/routing-config.test.ts`

Expected: the catch-all resolver assertion fails.

- [ ] **Step 7: Wire the resolver into Astro**

In `[...notFound].astro`, resolve `Astro.url.pathname` and immediately `return Astro.redirect(destination, 301)` when present. Spread `legacyRedirects` into `astro.config.mjs` so no-slash platform redirects remain fast. Update the build artifact verifier to use all legacy routes while retaining its existing service-alias assertions.

- [ ] **Step 8: Run targeted tests and verify GREEN**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/legacy-redirects.test.ts tests/not-found-page.test.ts tests/routing-config.test.ts`

Expected: all targeted tests pass.

- [ ] **Step 9: Commit the redirect fix**

```bash
git add src/lib/legacy-redirects.ts tests/legacy-redirects.test.ts src/pages/[locale]/[...notFound].astro astro.config.mjs tests/not-found-page.test.ts tests/build/support/build-artifact.ts
git commit -m "fix(seo): consolidate legacy route redirects"
```

### Task 2: Replace the freelance landing with Diseño web Granada

**Files:**
- Create: `tests/commercial-landings.test.ts`
- Modify: `src/lib/commercial-landings.ts`
- Modify: `src/lib/seo-clusters.ts`
- Modify: `src/lib/blog-commercial.ts`
- Modify: `src/content/blog/es/contratar-desarrollador-freelance-web.md`
- Modify: `src/content/blog/en/hire-freelance-web-developer-business.md`
- Modify: `public/llms.txt`

**Interfaces:**
- Produces Spanish slug `diseno-web-granada`, English slug `web-design-granada`, translation key `local-web-design`, and cluster key `local-web-design`.
- Keeps `getCommercialLandingAlternatePaths(locale, page)` as the hreflang source.

- [ ] **Step 1: Write failing landing and cluster tests**

Create `tests/commercial-landings.test.ts` to assert:

```ts
const spanish = getCommercialLanding("es", "diseno-web-granada");
assert.ok(spanish);
assert.equal(spanish.title, "Diseño web en Granada para captar clientes");
assert.equal(spanish.schema.areaServed, "Granada, España y remoto");
assert.equal(
	getCommercialLandingAlternatePaths("es", spanish).en,
	"/en/web-design-granada/",
);
assert.equal(
	getCommercialLanding("es", "desarrollador-freelance-espana"),
	undefined,
);
```

Add SEO-cluster assertions that `local-web-design` owns the two new routes, has priority 1, and uses `diseño web Granada` as the Spanish primary query. Update blog-commercial tests to require the renamed cluster in both localized articles.

- [ ] **Step 2: Run targeted tests and verify RED**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/commercial-landings.test.ts tests/blog-commercial.test.ts`

Expected: failure because the new landing and cluster do not exist.

- [ ] **Step 3: Replace the Spanish landing copy**

Replace the `freelance-developer-spain` entry with `local-web-design`. Use:

- meta title: `Diseño web Granada para captar clientes | José Miguel Fernández`;
- meta description: `Diseño y desarrollo páginas web para negocios de Granada. Webs rápidas, claras y preparadas para convertir visitas en contactos.`;
- eyebrow: `Diseño y desarrollo web en Granada`;
- H1: `Diseño web en Granada para captar clientes`;
- direct first-person copy explaining business websites, WordPress or Astro selection, redesigns, performance, maintenance, ownership, realistic pricing factors, local or remote collaboration, and a direct project-assessment CTA.

Keep the existing landing data shape and its commercial sections. Set `schema.serviceType` to `Diseño y desarrollo web` and `schema.areaServed` to `Granada, España y remoto`.

- [ ] **Step 4: Replace the English equivalent**

Use slug `web-design-granada`, the same translation key, title `Web design in Granada for businesses`, and `areaServed: "Granada, Spain and remote"`. Preserve equivalent buyer intent without claiming measured English demand.

- [ ] **Step 5: Update the typed cluster and article contract**

Rename `freelance-developer` to `local-web-design` in cluster keys, CTA configuration, both article frontmatters, and their internal commercial links. Add typed target metadata described in Task 3. Replace old routes in `public/llms.txt` and remove its duplicate Spanish about link.

- [ ] **Step 6: Run targeted tests and verify GREEN**

Run the command from Step 2.

Expected: all landing and blog-commercial tests pass.

- [ ] **Step 7: Run the humanizer review on the two landing entries**

Scan for hype, generic triples, repetitive negative parallelisms, em/en dashes, vague claims, chatbot framing, and promises that cannot be proved. Revise the source copy until none remain while preserving the query, scope, and conversion intent.

- [ ] **Step 8: Commit the landing migration**

```bash
git add src/lib/commercial-landings.ts src/lib/seo-clusters.ts src/lib/blog-commercial.ts src/content/blog/es/contratar-desarrollador-freelance-web.md src/content/blog/en/hire-freelance-web-developer-business.md public/llms.txt tests/commercial-landings.test.ts tests/blog-commercial.test.ts
git commit -m "feat(seo): target web design clients in Granada"
```

### Task 3: Encode DataForSEO ownership and intent

**Files:**
- Modify: `src/lib/seo-clusters.ts`
- Create: `tests/seo-clusters.test.ts`

**Interfaces:**
- Add `CommercialSeoIntent = "commercial" | "informational" | "mixed"`.
- Add `CommercialSeoTarget { primary: string | null; secondary: string[]; intent: CommercialSeoIntent }`.
- Extend each cluster with `priority: 1 | 2 | 3` and `targets: Record<Locale, CommercialSeoTarget>`.

- [ ] **Step 1: Write the failing ownership tests**

Assert that all owner URLs are globally unique per locale, every cluster has targets for both locales, Spanish priority-one targets are non-empty, and the validated priority-one owners are Granada, WordPress, and custom software. Assert no supporting URL equals its cluster owner.

- [ ] **Step 2: Run the ownership test and verify RED**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/seo-clusters.test.ts`

Expected: type or assertion failure because priorities and targets are absent.

- [ ] **Step 3: Add the target metadata**

Populate the Spanish map from the approved specification:

- local web design: `diseño web Granada`, priority 1, commercial;
- WordPress: `diseño web WordPress`, priority 1, commercial;
- custom software: `software a medida`, priority 1, commercial;
- process automation: `automatización de procesos para empresas`, priority 2, mixed;
- AI automation: `automatización con IA para empresas`, priority 2, mixed;
- API integrations: `integración API`, priority 2, mixed;
- Excel replacement, Spring Boot development, Spring Boot maintenance, legacy modernization, and technical audit: priority 3 with their precise current service phrases.

Use evidence-backed English phrases where the current page targets them; use `primary: null` only for the local English landing because DataForSEO returned no data for English Granada queries in Spain.

- [ ] **Step 4: Run the ownership test and verify GREEN**

Run the command from Step 2.

Expected: all SEO-cluster tests pass.

- [ ] **Step 5: Commit the ownership map**

```bash
git add src/lib/seo-clusters.ts tests/seo-clusters.test.ts
git commit -m "feat(seo): encode commercial keyword ownership"
```

### Task 4: Remove obsolete meta keywords globally

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: every `src/pages/**/*.astro` caller that passes `keywords`
- Modify: `tests/build/support/build-artifact.ts`
- Modify: `tests/seo.test.ts`

**Interfaces:**
- Remove `keywords?: string[]` from `LayoutProps` and all `<BaseLayout keywords={...}>` usage.
- Preserve content tags, technologies, and JSON-LD fields unrelated to the obsolete HTML tag.

- [ ] **Step 1: Write failing source and artifact tests**

In `tests/seo.test.ts`, read `BaseLayout.astro` and assert it contains neither `name="keywords"` nor a `keywords?:` layout prop. In the artifact verifier, fail any built page containing `<meta name="keywords"`.

- [ ] **Step 2: Run the source test and verify RED**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/seo.test.ts`

Expected: failure because BaseLayout still emits the tag.

- [ ] **Step 3: Remove the HTML contract and callers**

Delete the layout prop, destructured default, and conditional meta element. Remove every `keywords={...}` attribute and any local `const keywords` used only for that prop from pages. Do not remove `CommercialLandingPage.keywords`, blog tags, or project technology data because they still describe content internally.

- [ ] **Step 4: Run unit tests and verify GREEN**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/seo.test.ts`

Expected: all SEO unit tests pass.

- [ ] **Step 5: Commit metadata cleanup**

```bash
git add src/layouts/BaseLayout.astro src/pages tests/seo.test.ts tests/build/support/build-artifact.ts
git commit -m "fix(seo): remove obsolete keyword metadata"
```

### Task 5: Align priority service metadata with buyer intent

**Files:**
- Modify: `src/lib/services.ts`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Create: `tests/service-metadata.test.ts`

**Interfaces:**
- Keep `ServiceItem.metaTitle` and `ServiceItem.metaDescription` as the page metadata source.
- Do not change canonical service slugs.

- [ ] **Step 1: Write failing priority metadata tests**

Assert exact Spanish outcomes for the four highest-value service pages:

```ts
assert.match(wordpress.metaTitle, /^Diseño web WordPress/);
assert.match(customSoftware.metaTitle, /^Software a medida/);
assert.match(maintenance.metaTitle, /^Servicio de mantenimiento WordPress/);
assert.match(maintenance.metaDescription, /precio|plan|mensual/i);
```

Also assert chatbots and AI agents mention `para empresas`, automation distinguishes business service intent, and descriptions remain between 100 and 160 characters.

- [ ] **Step 2: Run the metadata test and verify RED**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node --test tests/service-metadata.test.ts`

Expected: at least the maintenance or AI assertions fail against current metadata.

- [ ] **Step 3: Update metadata and the minimum supporting copy**

Edit `offeringMeta` and localized service copy so titles and descriptions use the approved query intent naturally. Include scope and buyer language, but do not repeat keywords or rewrite unrelated pages. Keep titles under 65 characters after BaseLayout normalization and descriptions between 100 and 160 characters.

- [ ] **Step 4: Humanize both localized variants**

Review changed strings for promotional filler, formulaic triples, repetitive contrasts, fake certainty, em/en dashes, and generic conclusions. Keep concrete scope, limitations, and direct first-person phrasing.

- [ ] **Step 5: Run metadata tests and verify GREEN**

Run the command from Step 2.

Expected: all service metadata tests pass.

- [ ] **Step 6: Commit intent-aligned metadata**

```bash
git add src/lib/services.ts src/i18n/es.json src/i18n/en.json tests/service-metadata.test.ts
git commit -m "feat(seo): align service pages with buyer intent"
```

### Task 6: Make blog hubs unique and reinforce internal discovery

**Files:**
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Modify: `src/lib/commercial-landings.ts`
- Modify: `src/pages/[locale]/services.astro`
- Modify: `public/llms.txt`
- Modify: `tests/build/support/build-artifact.ts`

**Interfaces:**
- Spanish blog title must be distinct from English.
- Priority pages must be reachable through localized internal links and listed in `llms.txt`.

- [ ] **Step 1: Write failing artifact assertions**

Require the built Spanish blog title to contain `Blog sobre desarrollo web y software` and the English title to contain `Web development and software blog`. Require `llms.txt` to include both Granada landing routes exactly once and exclude both old freelance routes. Require the Spanish home and service hub to link directly to `/es/diseno-web-granada/`, and require the landing JSON-LD to contain Granada in `areaServed`.

- [ ] **Step 2: Build and verify RED**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build && PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run test:build`

Expected: artifact test fails on blog metadata or Granada discovery signals.

- [ ] **Step 3: Update localized blog metadata and discovery files**

Use localized blog titles and descriptions that identify the practical topics and audience. Change the localized home web-design specialty link to the Granada landing. Change the services-hub secondary hero CTA from the projects archive to the localized Granada landing, with natural Spanish and English labels. Ensure the Granada landing links to WordPress, projects, and the buyer-led web article; ensure those relevant destinations link back through existing typed CTA or related-service mechanisms. Update `llms.txt` with one canonical entry per new route and remove duplicate entries.

- [ ] **Step 4: Build and verify GREEN**

Run the command from Step 2.

Expected: build and artifact tests pass.

- [ ] **Step 5: Commit discovery improvements**

```bash
git add src/i18n/es.json src/i18n/en.json src/lib/commercial-landings.ts src/pages/[locale]/services.astro public/llms.txt tests/build/support/build-artifact.ts
git commit -m "feat(seo): strengthen commercial discovery paths"
```

### Task 7: Final verification and visual review

**Files:**
- Modify only files needed to fix failures found by this task.

**Interfaces:**
- Production output must satisfy every automated, HTTP, content, and visual acceptance check.

- [ ] **Step 1: Format the repository**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format`

Expected: Prettier completes without errors.

- [ ] **Step 2: Run fresh full verification**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run quality`

Expected: format, lint, all unit tests, Astro check, build, and artifact tests pass with zero errors and zero warnings.

- [ ] **Step 3: Check the final diff**

Run: `git diff 22dc09c..HEAD --check` and `git status -sb`.

Expected: no whitespace errors and only intentional commits/files.

- [ ] **Step 4: Start the production preview**

Run: `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run preview -- --host 127.0.0.1`.

Expected: preview server starts and prints a local URL.

- [ ] **Step 5: Verify HTTP behavior**

Check Spanish and English Granada pages return 200, old freelance URLs return 301 to the new canonical routes, trailing-slash service aliases return 301, and a random localized path returns 404 with `noindex,follow`.

- [ ] **Step 6: Verify the UI in the browser**

Review both Granada routes at 1440 px and 390 px, light and dark mode. Confirm one H1, one clear primary CTA, readable sections, language switching, visible focus states, stable layout, and no horizontal overflow.

- [ ] **Step 7: Run the final humanizer scan**

Scan all changed public copy for em/en dashes, inflated promises, repetitive triples, generic conclusions, and chatbot artifacts. Make only meaning-preserving corrections, then repeat Steps 1 and 2 if any source changes.

- [ ] **Step 8: Commit verification fixes if needed**

If verification required source changes, stage the bounded SEO implementation paths and commit them:

```bash
git add astro.config.mjs public/llms.txt src/layouts/BaseLayout.astro src/lib/blog-commercial.ts src/lib/commercial-landings.ts src/lib/legacy-redirects.ts src/lib/seo-clusters.ts src/lib/services.ts src/pages src/i18n tests
git commit -m "fix(seo): address final audit findings"
```

- [ ] **Step 9: Record external follow-up without executing it**

The handoff must state that deployment and Search Console sitemap resubmission remain pending explicit authorization. Do not claim rankings or production corrections before those actions.
