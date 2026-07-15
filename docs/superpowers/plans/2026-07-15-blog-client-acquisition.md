# Blog Client Acquisition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the bilingual blog into a measurable client-acquisition system while preserving useful technical authority articles and avoiding premature deletion.

**Architecture:** Add a required, locale-independent commercial classification to every post. Resolve each post's localized owner page, CTA label, and attributed contact URL through one typed module, then render that context through the existing shared CTA. Add repository verifiers for translation parity, owner mappings, generated pages, and sitemap inclusion. Keep article-specific copy edits limited to posts that currently lack a natural commercial bridge.

**Tech Stack:** Astro 7, TypeScript 5.9, Astro Content Collections, Tailwind CSS 4, Node 24 test runner, repository verification scripts, pnpm.

## Global Constraints

- Work directly on `main`; do not create a worktree unless the user changes that preference.
- Before every task, run `git status -sb`. The repository already contains unrelated user changes, including edits to the four case-study articles and both i18n files. Never stage or overwrite unrelated changes.
- If a planned hunk overlaps a user edit, compare the working copy with `git diff -- <path>`, preserve the user's version, and adapt the smallest possible patch. Stop and ask only if both intentions cannot coexist.
- Use Node 24 with `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"` when the shell does not already resolve the required version.
- Spanish and English posts must carry identical `role`, `audience`, and `cluster` identifiers. Public wording may differ naturally by locale.
- Do not delete, redirect, unpublish, or add `noindex` to any article in this implementation.
- Do not change `astro.config.mjs` unless the generated sitemap verification proves the repository configuration is wrong. Current local output already contains all 54 article URLs and excludes pagination.
- Deployment, Search Console submission, and URL inspection are external-state actions and require a separate user instruction after repository validation.
- Each task ends with a focused commit. Stage only the paths listed in that task.

## Target File Structure

### New files

- `src/lib/blog-commercial.ts` — commercial roles, audiences, cluster CTA configuration, and localized CTA resolver.
- `tests/blog-commercial.test.ts` — unit coverage for owner selection and attributed contact URLs.
- `scripts/verify-blog-commercial.mjs` — source and generated-output contract verifier.
- `docs/seo/blog-publication-runbook.md` — post-deployment measurement and Search Console checklist.

### Modified shared files

- `src/lib/seo-clusters.ts` — derive the cluster union from an exported runtime tuple.
- `src/content.config.ts` — require the `commercial` object on every blog entry.
- `src/layouts/BlogPostLayout.astro` — render the contextual CTA instead of the generic services CTA.
- `src/i18n/es.json` and `src/i18n/en.json` — three role-specific CTA copy variants.
- `package.json` — expose `verify:blog-commercial`.

### Modified content

- All 27 Spanish and 27 English Markdown entries under `src/content/blog/{es,en}/` — add the required classification.
- Only the following bilingual pairs need a new article-body bridge in the current inventory:
  - `ajustar-tamano-pods-kubernetes-requests-limits.md` / `right-sizing-kubernetes-pods-requests-limits.md`
  - `monolito-modular-vs-microservicios.md` / `modular-monolith-vs-microservices.md`
- The CV Studio and Betx pairs already contain project/service bridges in the current working copy. Validate and preserve those edits; do not rewrite them merely to match older repository content.

---

## Task 1: Establish the Commercial Cluster Runtime Contract

**Files:**

- Create: `scripts/verify-blog-commercial.mjs`
- Modify: `package.json`
- Modify: `src/lib/seo-clusters.ts`

- [ ] **Step 1: Inspect the current working tree and protect overlapping edits**

Run:

```bash
git status -sb
git diff -- src/lib/seo-clusters.ts package.json
```

Expected: unrelated changes may exist, but neither target file should contain an unresolved overlapping edit. If one does, preserve it in the later patch.

- [ ] **Step 2: Write the first failing cluster verifier**

Create `scripts/verify-blog-commercial.mjs` using `node:fs/promises`, `node:path`, and `node:url`. In this first version, read `src/lib/seo-clusters.ts` and assert that an exported `commercialSeoClusterKeys` tuple contains exactly these values:

```js
const validClusters = new Set([
	"freelance-developer",
	"wordpress",
	"custom-software",
	"excel-replacement",
	"process-automation",
	"ai-automation",
	"api-integrations",
	"spring-boot-development",
	"spring-boot-maintenance",
	"legacy-modernization",
	"technical-audit",
]);
```

Also reject extra values, print all failures, and set `process.exitCode = 1`; otherwise print `Blog commercial source verification passed.`

Add to `package.json`:

```json
"verify:blog-commercial": "node scripts/verify-blog-commercial.mjs"
```

- [ ] **Step 3: Run the verifier and confirm the expected failure**

Run:

```bash
pnpm run verify:blog-commercial
```

Expected: FAIL because `commercialSeoClusterKeys` does not yet exist.

- [ ] **Step 4: Make the SEO cluster keys available at runtime**

Replace the hand-written union at the top of `src/lib/seo-clusters.ts` with:

```ts
export const commercialSeoClusterKeys = [
	"freelance-developer",
	"wordpress",
	"custom-software",
	"excel-replacement",
	"process-automation",
	"ai-automation",
	"api-integrations",
	"spring-boot-development",
	"spring-boot-maintenance",
	"legacy-modernization",
	"technical-audit",
] as const;

export type CommercialSeoClusterKey =
	(typeof commercialSeoClusterKeys)[number];
```

Do not change the existing cluster objects or their owner/supporting paths.

- [ ] **Step 5: Confirm the cluster verifier is green**

Run:

```bash
pnpm run verify:blog-commercial
pnpm run check
```

Expected: both commands PASS. The source verifier does not inspect article frontmatter until Task 2.

- [ ] **Step 6: Commit the verifier foundation**

```bash
git add package.json scripts/verify-blog-commercial.mjs src/lib/seo-clusters.ts
git commit -m "test(blog): add commercial content contract"
```

---

## Task 2: Classify All 27 Translation Pairs and Require the Contract

**Files:**

- Create: `src/lib/blog-commercial.ts`
- Modify: `src/content.config.ts`
- Modify: `scripts/verify-blog-commercial.mjs`
- Modify: every `.md` file in `src/content/blog/es/` and `src/content/blog/en/`

- [ ] **Step 1: Extend the verifier and add the required schema before changing content**

First extend `scripts/verify-blog-commercial.mjs` so it:

1. Reads every `.md` file in `src/content/blog/es` and `src/content/blog/en`.
2. Asserts exactly 54 entries and 27 entries per locale.
3. Parses top-level `translationSlug` and the nested block:

```yaml
commercial:
  role: buyer-led
  audience: business
  cluster: custom-software
```

4. Accepts only these roles and audiences; clusters continue to use the Task 1 set:

```js
const validRoles = new Set([
	"buyer-led",
	"technical-authority",
	"case-study",
]);
const validAudiences = new Set(["business", "technical"]);
```

5. Matches each Spanish `translationSlug` to its English file and asserts exact parity for all three commercial fields.

Import the runtime constants in `src/content.config.ts`:

```ts
import {
	blogAudienceValues,
	blogEditorialRoleValues,
} from "./lib/blog-commercial";
import { commercialSeoClusterKeys } from "./lib/seo-clusters";
```

Temporarily create `src/lib/blog-commercial.ts` with only these exports:

```ts
export const blogEditorialRoleValues = [
	"buyer-led",
	"technical-authority",
	"case-study",
] as const;

export type BlogEditorialRole = (typeof blogEditorialRoleValues)[number];

export const blogAudienceValues = ["business", "technical"] as const;

export type BlogAudience = (typeof blogAudienceValues)[number];
```

Add this required field after `translationSlug` in the blog schema:

```ts
commercial: z.object({
	role: z.enum(blogEditorialRoleValues),
	audience: z.enum(blogAudienceValues),
	cluster: z.enum(commercialSeoClusterKeys),
}),
```

- [ ] **Step 2: Run Astro validation and confirm the contract fails**

Run:

```bash
pnpm run verify:blog-commercial
pnpm run check
```

Expected: `pnpm run verify:blog-commercial` and `pnpm run check` both FAIL with missing `commercial` fields.

- [ ] **Step 3: Add the exact classification to each translation pair**

Add the nested `commercial` block immediately after `translationSlug` in both files of each row. Use this complete matrix:

| Spanish slug | English slug | role | audience | cluster |
|---|---|---|---|---|
| `ajustar-tamano-pods-kubernetes-requests-limits` | `right-sizing-kubernetes-pods-requests-limits` | `technical-authority` | `technical` | `spring-boot-maintenance` |
| `alternativas-excel-procesos-operativos` | `excel-alternatives-operational-workflows` | `buyer-led` | `business` | `excel-replacement` |
| `apis-idempotentes-que-sobreviven-a-reintentos` | `idempotent-apis-that-survive-retries` | `technical-authority` | `technical` | `api-integrations` |
| `arquitectura-hexagonal-que-es-como-aplicarla-proyectos-backend` | `hexagonal-architecture-what-it-is-how-to-apply-backend-projects` | `technical-authority` | `technical` | `technical-audit` |
| `astro-7-que-cambia-rendimiento-web-moderna` | `astro-7-what-changed-performance-modern-web` | `technical-authority` | `technical` | `wordpress` |
| `auditoria-backend-antes-reescribir` | `backend-audit-before-rewrite` | `buyer-led` | `technical` | `technical-audit` |
| `automatizar-procesos-empresa-cuando-merece-la-pena` | `when-business-process-automation-is-worth-it` | `buyer-led` | `business` | `process-automation` |
| `como-construi-un-sistema-automatizado-de-apuestas-en-java` | `how-i-built-an-automated-betting-system-in-java` | `case-study` | `technical` | `custom-software` |
| `contratar-desarrollador-freelance-web` | `hire-freelance-web-developer-business` | `buyer-led` | `business` | `freelance-developer` |
| `creando-cv-studio` | `building-cv-studio` | `case-study` | `business` | `custom-software` |
| `cuando-construir-herramienta-interna-en-vez-de-usar-excel` | `when-to-build-an-internal-tool-instead-of-using-excel` | `buyer-led` | `business` | `excel-replacement` |
| `cuando-deberia-una-empresa-migrar-un-backend-legacy-a-java-spring-boot` | `when-should-a-company-migrate-a-legacy-backend-to-java-spring-boot` | `buyer-led` | `technical` | `legacy-modernization` |
| `cuando-deberias-usar-kafka-rabbitmq-o-simplemente-una-base-de-datos` | `when-should-you-use-kafka-rabbitmq-or-just-a-database` | `technical-authority` | `technical` | `api-integrations` |
| `cuando-necesita-empresa-mantenimiento-spring-boot` | `when-company-needs-spring-boot-maintenance` | `buyer-led` | `technical` | `spring-boot-maintenance` |
| `cuanto-cuesta-automatizar-proceso-administrativo` | `cost-to-automate-administrative-process` | `buyer-led` | `business` | `process-automation` |
| `cuanto-cuesta-crear-herramienta-interna-a-medida` | `how-much-does-a-custom-internal-tool-cost` | `buyer-led` | `business` | `custom-software` |
| `ejemplos-automatizacion-pymes` | `automation-examples-small-businesses` | `buyer-led` | `business` | `process-automation` |
| `evaluar-presupuesto-software-a-medida` | `evaluate-custom-software-proposal` | `buyer-led` | `business` | `custom-software` |
| `integrar-crm-formularios-pagos` | `integrate-crm-forms-payments` | `buyer-led` | `business` | `api-integrations` |
| `mcp-para-desarrolladores-protocolo-herramientas-ia` | `mcp-for-developers-ai-coding-tools-protocol` | `technical-authority` | `technical` | `api-integrations` |
| `modernizar-backend-legacy-coste-riesgos-fases` | `legacy-backend-modernization-cost-risks-phases` | `buyer-led` | `technical` | `legacy-modernization` |
| `monolito-modular-vs-microservicios` | `modular-monolith-vs-microservices` | `technical-authority` | `technical` | `technical-audit` |
| `que-debe-tener-web-profesional-para-captar-clientes` | `what-a-professional-website-needs-to-get-clients` | `buyer-led` | `business` | `wordpress` |
| `que-incluye-proyecto-automatizacion-ia` | `what-ai-automation-project-should-include` | `buyer-led` | `business` | `ai-automation` |
| `rendimiento-spring-boot-cambios-que-de-verdad-se-notan` | `spring-boot-performance-tuning` | `technical-authority` | `technical` | `spring-boot-maintenance` |
| `spring-boot-produccion-checklist-devops` | `spring-boot-production-devops-checklist` | `technical-authority` | `technical` | `spring-boot-development` |
| `usar-ia-en-tu-producto-sin-humo` | `using-ai-in-your-product-without-hype` | `buyer-led` | `technical` | `ai-automation` |

- [ ] **Step 4: Verify all source contracts pass**

Run:

```bash
pnpm run verify:blog-commercial
pnpm run check
```

Expected: both PASS; the verifier reports 54 classified posts and 27 matching pairs.

- [ ] **Step 5: Format and commit only the taxonomy/content paths**

```bash
pnpm exec prettier scripts/verify-blog-commercial.mjs src/content.config.ts src/lib/blog-commercial.ts --write
pnpm exec prettier src/content/blog/es src/content/blog/en --check
git add scripts/verify-blog-commercial.mjs src/content.config.ts src/lib/blog-commercial.ts
git add -p src/content/blog/es src/content/blog/en
git commit -m "feat(blog): classify posts by commercial intent"
```

In the interactive staging step, accept every new `commercial` frontmatter hunk and reject pre-existing body-copy hunks in CV Studio and Betx. Before committing, inspect `git diff --cached --stat` and `git diff --cached`; the commit must contain the 54 classifications but no unrelated user copy edits.

---

## Task 3: Resolve Localized Owner CTAs and Attributed Contact URLs

**Files:**

- Modify: `src/lib/blog-commercial.ts`
- Create: `tests/blog-commercial.test.ts`

- [ ] **Step 1: Write failing unit tests for the resolver**

Create `tests/blog-commercial.test.ts` with Node's `test` and strict assertions. Cover these exact cases:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";

import { resolveBlogCommercialCta } from "../src/lib/blog-commercial.ts";

const copy = {
	eyebrow: "Context",
	title: "Title",
	text: "Text",
	contact: "Contact",
};

test("resolves the Spanish owner and attributed contact URL", () => {
	const result = resolveBlogCommercialCta(
		"es",
		{ role: "buyer-led", audience: "business", cluster: "custom-software" },
		"/es/blog/evaluar-presupuesto-software-a-medida/",
		copy,
	);

	assert.equal(result.primary.href, "/es/services/software-a-medida/");
	assert.equal(result.primary.label, "Ver software a medida");
	assert.equal(
		result.secondary.href,
		"/es/contact/?service=software-a-medida&sourceCategory=article&sourcePath=%2Fes%2Fblog%2Fevaluar-presupuesto-software-a-medida%2F",
	);
});

test("resolves a non-service owner with a valid contact service", () => {
	const result = resolveBlogCommercialCta(
		"en",
		{ role: "technical-authority", audience: "technical", cluster: "technical-audit" },
		"/en/blog/modular-monolith-vs-microservices/",
		copy,
	);

	assert.equal(result.primary.href, "/en/backend-api-architecture-audit/");
	assert.match(result.secondary.href, /service=technology-second-opinion/);
});

test("rejects an article path from another locale", () => {
	assert.throws(
		() =>
			resolveBlogCommercialCta(
				"es",
				{ role: "case-study", audience: "technical", cluster: "custom-software" },
				"/en/blog/example/",
				copy,
			),
		/article path must start with \/es\/blog\//,
	);
});
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run:

```bash
node --test tests/blog-commercial.test.ts
```

Expected: FAIL because `resolveBlogCommercialCta` is not exported.

- [ ] **Step 3: Implement the typed cluster CTA map**

Extend `src/lib/blog-commercial.ts` with:

```ts
import type { Locale } from "../i18n/index.ts";
import {
	commercialSeoClusters,
	type CommercialSeoClusterKey,
} from "./seo-clusters.ts";

export interface BlogCommercialContext {
	role: BlogEditorialRole;
	audience: BlogAudience;
	cluster: CommercialSeoClusterKey;
}

export interface BlogCommercialCtaCopy {
	eyebrow: string;
	title: string;
	text: string;
	contact: string;
}

interface ClusterCtaConfiguration {
	label: Record<Locale, string>;
	contactService: Record<Locale, string>;
}

export interface ResolvedBlogCommercialCta extends BlogCommercialCtaCopy {
	primary: { label: string; href: string };
	secondary: { label: string; href: string };
}
```

Define `clusterCtaConfiguration` as a `Record<CommercialSeoClusterKey, ClusterCtaConfiguration>` with these exact values:

| cluster | Spanish label / service | English label / service |
|---|---|---|
| `freelance-developer` | `Ver cómo trabajo` / `assessment` | `See how I work` / `assessment` |
| `wordpress` | `Ver diseño web para negocios` / `diseno-web-wordpress` | `Explore business web design` / `wordpress-web-design` |
| `custom-software` | `Ver software a medida` / `software-a-medida` | `Explore custom software` / `custom-software` |
| `excel-replacement` | `Ver alternativas a Excel` / `internal-tools` | `Explore Excel replacement` / `internal-tools` |
| `process-automation` | `Ver automatización de procesos` / `automatizacion-de-procesos` | `Explore process automation` / `process-automation` |
| `ai-automation` | `Ver automatizaciones con IA` / `automatizaciones-con-ia` | `Explore AI automation` / `ai-automations` |
| `api-integrations` | `Ver integraciones API` / `integraciones-api` | `Explore API integrations` / `api-integrations` |
| `spring-boot-development` | `Ver backend con Spring Boot` / `backend-spring-boot` | `Explore Spring Boot backend` / `backend-spring-boot` |
| `spring-boot-maintenance` | `Ver mantenimiento Spring Boot` / `backend-spring-boot` | `Explore Spring Boot maintenance` / `backend-spring-boot` |
| `legacy-modernization` | `Ver modernización de backend` / `backend-spring-boot` | `Explore backend modernization` / `backend-spring-boot` |
| `technical-audit` | `Ver auditoría técnica` / `segunda-opinion-tecnologica` | `Explore technical audit` / `technology-second-opinion` |

Implement:

```ts
export const resolveBlogCommercialCta = (
	locale: Locale,
	context: BlogCommercialContext,
	articlePath: string,
	copy: BlogCommercialCtaCopy,
): ResolvedBlogCommercialCta => {
	const expectedPrefix = `/${locale}/blog/`;
	if (!articlePath.startsWith(expectedPrefix)) {
		throw new Error(`Article path must start with ${expectedPrefix}`);
	}

	const cluster = commercialSeoClusters.find(
		(candidate) => candidate.key === context.cluster,
	);
	if (!cluster) throw new Error(`Unknown commercial cluster: ${context.cluster}`);

	const configuration = clusterCtaConfiguration[context.cluster];
	const params = new URLSearchParams({
		service: configuration.contactService[locale],
		sourceCategory: "article",
		sourcePath: articlePath,
	});

	return {
		...copy,
		primary: {
			label: configuration.label[locale],
			href: cluster.owner[locale],
		},
		secondary: {
			label: copy.contact,
			href: `/${locale}/contact/?${params.toString()}`,
		},
	};
};
```

- [ ] **Step 4: Run focused and full tests**

```bash
node --test tests/blog-commercial.test.ts
pnpm test
pnpm run check
```

Expected: all PASS.

- [ ] **Step 5: Commit the resolver**

```bash
git add src/lib/blog-commercial.ts tests/blog-commercial.test.ts
git commit -m "feat(blog): resolve contextual commercial CTAs"
```

---

## Task 4: Render Role-Specific CTA Copy in the Blog Layout

**Files:**

- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Modify: `src/layouts/BlogPostLayout.astro`
- Modify: `scripts/verify-blog-commercial.mjs`

- [ ] **Step 1: Extend the verifier with failing layout/i18n assertions**

Add checks to `scripts/verify-blog-commercial.mjs` that:

- `src/layouts/BlogPostLayout.astro` contains `resolveBlogCommercialCta`, `frontmatter.commercial`, `postCopy.commercialCta`, `primary={commercialCta.primary}`, and `secondary={commercialCta.secondary}`.
- The layout no longer contains ``primary={{ label: postCta.services, href: `/${locale}/services` }}``.
- Both i18n files contain `blog.post.commercialCta` with keys `buyer-led`, `technical-authority`, and `case-study`; every key has non-empty `eyebrow`, `title`, `text`, and `contact` strings.

Use `JSON.parse` for i18n checks instead of string matching.

- [ ] **Step 2: Run the verifier and confirm failure**

```bash
pnpm run verify:blog-commercial
```

Expected: FAIL for the missing role copy and contextual layout integration.

- [ ] **Step 3: Add exact Spanish role copy without disturbing other i18n edits**

Under `blog.post`, add:

```json
"commercialCta": {
  "buyer-led": {
    "eyebrow": "Decisión y siguiente paso",
    "title": "¿Quieres aterrizar esta decisión en tu caso?",
    "text": "Puedo ayudarte a revisar el contexto, reducir el alcance inicial y elegir una solución proporcionada al problema.",
    "contact": "Contar mi caso"
  },
  "technical-authority": {
    "eyebrow": "Aplicación en un sistema real",
    "title": "¿Necesitas revisar este problema en producción?",
    "text": "Puedo analizar la arquitectura, los riesgos y el siguiente cambio útil sin convertir la solución en un proyecto más grande de lo necesario.",
    "contact": "Revisar mi caso"
  },
  "case-study": {
    "eyebrow": "Un proyecto con restricciones reales",
    "title": "¿Tienes un problema parecido que resolver?",
    "text": "Podemos partir del proceso, los límites y el resultado que necesitas para definir una primera entrega verificable.",
    "contact": "Contar mi proyecto"
  }
}
```

- [ ] **Step 4: Add exact English role copy without disturbing other i18n edits**

Under `blog.post`, add:

```json
"commercialCta": {
  "buyer-led": {
    "eyebrow": "Decision and next step",
    "title": "Would you like to apply this decision to your case?",
    "text": "I can help you review the context, reduce the initial scope and choose a solution proportionate to the problem.",
    "contact": "Share my case"
  },
  "technical-authority": {
    "eyebrow": "Applying this to a real system",
    "title": "Do you need to review this problem in production?",
    "text": "I can assess the architecture, risks and next useful change without turning the solution into a larger project than necessary.",
    "contact": "Review my case"
  },
  "case-study": {
    "eyebrow": "A project with real constraints",
    "title": "Do you have a similar problem to solve?",
    "text": "We can start from the workflow, constraints and outcome you need to define a verifiable first delivery.",
    "contact": "Share my project"
  }
}
```

- [ ] **Step 5: Replace the generic CTA in the layout**

In `src/layouts/BlogPostLayout.astro`:

1. Import `resolveBlogCommercialCta` and `type BlogCommercialContext`.
2. Add `commercial: BlogCommercialContext` to `Frontmatter`.
3. Remove the manually built `contactPath` and `const postCta = postCopy.cta`.
4. Resolve:

```ts
const commercialCta = resolveBlogCommercialCta(
	locale,
	frontmatter.commercial,
	articlePath,
	postCopy.commercialCta[frontmatter.commercial.role],
);
```

5. Render:

```astro
<ConversionCta
	eyebrow={commercialCta.eyebrow}
	title={commercialCta.title}
	text={commercialCta.text}
	primary={commercialCta.primary}
	secondary={commercialCta.secondary}
	headingId="article-conversion-title"
/>
```

- [ ] **Step 6: Verify the integration**

```bash
pnpm run verify:blog-commercial
pnpm run check
pnpm test
```

Expected: all PASS.

- [ ] **Step 7: Format and commit only the integration paths**

```bash
pnpm exec prettier src/i18n/es.json src/i18n/en.json src/layouts/BlogPostLayout.astro scripts/verify-blog-commercial.mjs --write
git add src/layouts/BlogPostLayout.astro scripts/verify-blog-commercial.mjs
git add -p src/i18n/es.json src/i18n/en.json
git commit -m "feat(blog): tailor article CTAs to commercial intent"
```

In the interactive staging step, accept only the new `commercialCta` objects. Leave every pre-existing translation change unstaged.

---

## Task 5: Add the Two Missing Editorial Bridges

**Files:**

- Modify: `src/content/blog/es/ajustar-tamano-pods-kubernetes-requests-limits.md`
- Modify: `src/content/blog/en/right-sizing-kubernetes-pods-requests-limits.md`
- Modify: `src/content/blog/es/monolito-modular-vs-microservicios.md`
- Modify: `src/content/blog/en/modular-monolith-vs-microservices.md`
- Modify: `scripts/verify-blog-commercial.mjs`

- [ ] **Step 1: Add exact failing body-link assertions**

Extend `scripts/verify-blog-commercial.mjs` with an `expectedBodyLinks` map for these four files:

```js
const expectedBodyLinks = new Map([
	["es/ajustar-tamano-pods-kubernetes-requests-limits.md", "/es/mantenimiento-spring-boot/"],
	["en/right-sizing-kubernetes-pods-requests-limits.md", "/en/spring-boot-maintenance/"],
	["es/monolito-modular-vs-microservicios.md", "/es/auditoria-backend-api-arquitectura/"],
	["en/modular-monolith-vs-microservices.md", "/en/backend-api-architecture-audit/"],
]);
```

Fail if the exact localized link is absent from the Markdown body.

- [ ] **Step 2: Confirm the four expected failures**

```bash
pnpm run verify:blog-commercial
```

Expected: FAIL only for the four missing owner links.

- [ ] **Step 3: Add the Kubernetes bridge in both languages**

After the existing final paragraph that links the Spring Boot production checklist, add:

Spanish:

```md
Si el problema incluye latencia, reinicios o consumo difícil de explicar en una aplicación Java, una revisión de [mantenimiento y evolución de Spring Boot](/es/mantenimiento-spring-boot/) puede unir métricas de aplicación, JVM y Kubernetes antes de cambiar capacidad.
```

English:

```md
If the problem includes latency, restarts or unexplained resource use in a Java application, a [Spring Boot maintenance and evolution review](/en/spring-boot-maintenance/) can connect application, JVM and Kubernetes metrics before changing capacity.
```

- [ ] **Step 4: Add the modular-monolith bridge in both languages**

Place the bridge immediately before the existing related-links footer/list:

Spanish:

```md
Si la decisión afecta a un backend existente, una [auditoría de backend, API y arquitectura](/es/auditoria-backend-api-arquitectura/) puede comparar límites, coste operativo y una primera transición verificable antes de separar servicios.
```

English:

```md
If the decision affects an existing backend, a [backend, API and architecture audit](/en/backend-api-architecture-audit/) can compare boundaries, operating cost and a first verifiable transition before splitting services.
```

- [ ] **Step 5: Verify content without broad rewrites**

```bash
pnpm run verify:blog-commercial
pnpm run check
pnpm exec prettier src/content/blog/es/ajustar-tamano-pods-kubernetes-requests-limits.md src/content/blog/en/right-sizing-kubernetes-pods-requests-limits.md src/content/blog/es/monolito-modular-vs-microservicios.md src/content/blog/en/modular-monolith-vs-microservices.md scripts/verify-blog-commercial.mjs --write
```

Expected: PASS. Review the diff and confirm only the two bilingual bridges and verifier assertions were added.

- [ ] **Step 6: Commit the bridges**

```bash
git add scripts/verify-blog-commercial.mjs src/content/blog/es/ajustar-tamano-pods-kubernetes-requests-limits.md src/content/blog/en/right-sizing-kubernetes-pods-requests-limits.md src/content/blog/es/monolito-modular-vs-microservicios.md src/content/blog/en/modular-monolith-vs-microservices.md
git commit -m "content(blog): connect technical posts to consulting services"
```

---

## Task 6: Verify Generated CTAs, Attribution, and Sitemap Coverage

**Files:**

- Modify: `scripts/verify-blog-commercial.mjs`

- [ ] **Step 1: Add a `--dist` mode that fails before a fresh build**

When `process.argv` contains `--dist`, the verifier must additionally accept an optional `--dist-root <path>` argument, defaulting to `dist/client`, and:

1. Read `dist/client/sitemap-0.xml`.
2. Build the expected canonical URL for every source entry as `https://www.jomiferse.com/{locale}/blog/{filename-without-md}/` and assert all 54 are present.
3. Assert `/blog/page/` is absent from the sitemap.
4. Read these representative built pages:
   - buyer-led: `dist/client/es/blog/evaluar-presupuesto-software-a-medida/index.html`
   - technical authority: `dist/client/en/blog/modular-monolith-vs-microservices/index.html`
   - case study: `dist/client/es/blog/creando-cv-studio/index.html`
5. Decode HTML entities before assertions, then confirm:
   - Buyer-led owner: `/es/services/software-a-medida/`
   - Buyer-led contact query: `service=software-a-medida`, `sourceCategory=article`, and the encoded article path.
   - Technical owner: `/en/backend-api-architecture-audit/`
   - Technical contact service: `technology-second-opinion`.
   - Case owner: `/es/services/software-a-medida/`.
   - None of the three pages uses `href="/es/services"` or `href="/en/services"` as the CTA primary target.

- [ ] **Step 2: Remove stale output and prove dist verification cannot pass accidentally**

Run against a deliberately absent output root:

```bash
pnpm run verify:blog-commercial -- --dist --dist-root /tmp/jomiferse-missing-dist
```

Expected: FAIL because a generated sitemap and representative pages are absent. Do not commit anything from this step.

- [ ] **Step 3: Build and run generated-output verification**

```bash
pnpm run build
pnpm run verify:blog-commercial -- --dist
```

Expected: PASS; build creates 54 canonical article URLs, contextual CTA destinations, and attributed contact URLs.

- [ ] **Step 4: Check the existing shared CTA contract remains intact**

```bash
pnpm run verify:conversion-cta -- --dist
```

Expected: PASS. If this verifier assumes the old generic blog CTA, update only that obsolete assertion and preserve all styling/component checks.

- [ ] **Step 5: Commit generated-output verification**

```bash
git add scripts/verify-blog-commercial.mjs
git commit -m "test(blog): verify generated acquisition paths"
```

---

## Task 7: Add the Publication and Measurement Runbook

**Files:**

- Create: `docs/seo/blog-publication-runbook.md`

- [ ] **Step 1: Write the exact baseline and decision rules**

Create the runbook with these sections and values:

```md
# Blog publication and measurement runbook

## Baseline captured 2026-07-15

- Search Console range: 2025-12-08 to 2026-07-13.
- Whole site: 540 impressions, 15 clicks, 2.8% CTR, average position 18.5.
- Blog: 301 impressions, 3 clicks, 1.0% CTR, average position 16.8.
- Blog share of impressions: about 56%.
- Existing click-producing topics: CV Studio, Spring legacy migration, and Kafka/RabbitMQ.
- Technical query families currently dominate impressions: RabbitMQ, hexagonal architecture, and Kafka versus database.

## Deployment checkpoint

Record the deployed commit SHA and date. Confirm that the production sitemap contains all 54 bilingual blog URLs before requesting a fresh Search Console read.

## Search Console follow-up

1. Open the `https://jomiferse.com/` property.
2. Resubmit or request a new read of `https://jomiferse.com/sitemap-index.xml`.
3. Confirm the redirected `https://www.jomiferse.com/sitemap-0.xml` is fetchable and reports discovered URLs.
4. Inspect one buyer-led article, one technical-authority article, and one case-study article.
5. Record the first date Google reports the updated URL as indexed.

## Article review window

Do not evaluate removal until an article has been published, present in the sitemap, and indexable for at least 12 weeks after the corrected sitemap read.

Consider consolidation or removal only when all conditions are true:

- No non-brand impressions during a continuous 90-day window.
- No organic clicks or attributed leads.
- No external backlinks worth preserving.
- No unique proof or necessary role in its commercial cluster.
- A relevant replacement URL exists for a 301 redirect.

If any condition is false, keep or improve the article instead of deleting it.
```

- [ ] **Step 2: Check the runbook contains no future claims**

Run:

```bash
rg -ni "deployed commit|indexed on|submission complete" docs/seo/blog-publication-runbook.md
```

Expected: only the instruction to record the future deployed commit appears. Read the file once more and confirm there are no unfinished markers or claims that deployment, sitemap resubmission, or indexing has already happened.

- [ ] **Step 3: Commit the runbook despite the ignored docs directory**

```bash
git add -f docs/seo/blog-publication-runbook.md
git commit -m "docs(seo): add blog measurement runbook"
```

---

## Task 8: Run the Full Repository Validation and Review Scope

**Files:** No planned source changes. Fix only failures caused by Tasks 1–7.

- [ ] **Step 1: Run formatting checks**

```bash
pnpm run format:check
```

Expected: PASS. If it fails on files changed by this plan, format only those paths. Do not reformat unrelated dirty files.

- [ ] **Step 2: Run the required validation set**

```bash
pnpm test
pnpm run check
pnpm run lint
pnpm run verify:ai-seo
pnpm run verify:blog-commercial
pnpm run build
pnpm run verify:blog-commercial -- --dist
pnpm run verify:conversion-cta -- --dist
```

Expected: every command PASS with zero lint warnings.

- [ ] **Step 3: Verify representative production HTML manually**

Run a local preview:

```bash
pnpm run preview
```

Check at 1440px and 390px, in light and dark mode:

- `/es/blog/evaluar-presupuesto-software-a-medida/`
- `/en/blog/modular-monolith-vs-microservices/`
- `/es/blog/creando-cv-studio/`

Confirm one clear CTA hierarchy, correct locale, correct owner destination, attributed contact URL, visible keyboard focus, and no horizontal overflow. Stop the preview when complete.

- [ ] **Step 4: Audit the final diff and commit history**

```bash
git status -sb
git diff --stat HEAD~7..HEAD
git log --oneline -8
```

Expected: only planned files were committed; unrelated user changes remain uncommitted and untouched.

- [ ] **Step 5: Stop before external publication**

Report the validation evidence and ask the user whether to publish the commits. Do not push, deploy, resubmit the sitemap, or inspect URLs in Search Console without that follow-up authorization.

## External Follow-Up After Publication Authorization

This is not part of the repository implementation and must happen only after the user explicitly requests publication:

1. Push the validated `main` commits or deploy through the user's chosen workflow.
2. Confirm the deployed commit and compare `https://www.jomiferse.com/sitemap-0.xml` with the 54 expected article URLs.
3. In the already authenticated Chrome Search Console session, request a new read of `https://jomiferse.com/sitemap-index.xml`.
4. Inspect representative URLs from all three editorial roles.
5. Record the corrected sitemap read date in the runbook; start the 12-week observation period from that date, not from the content commit date.
6. Review article-level impressions, clicks, CTR, owner-page visits, and attributed contact submissions after 4, 8, and 12 weeks.
