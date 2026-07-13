# Project Service Sidebar Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain technology sidebar on localized project detail pages with a service-first conversion card that uses technology icons as supporting proof.

**Architecture:** Extract the sidebar markup into `ProjectServiceCard.astro`. The dynamic project page passes existing project and localized values; the component owns icon selection and conditional service/external actions. Extend the existing source verifier before implementation so the new contract is checked without introducing a new test runner.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS 4, `astro-icon`, JSON localization, Node verification scripts.

## Global Constraints

- Work directly on `main`; do not create a worktree.
- Preserve all unrelated uncommitted changes.
- Keep Spanish and English copy equivalent in intent.
- Reuse `button-action`, `--action`, `--home-navy`, theme variables, and existing repository icons.
- Do not change routes, project structured data, archive cards, the final assessment CTA, the shared header, or the shared footer.
- Unknown technologies must render the `code` icon.
- The card must work without client-side JavaScript.

---

### Task 1: Define the service-card verification contract

**Files:**

- Modify: `scripts/verify-project-redesign.mjs`
- Test: `scripts/verify-project-redesign.mjs`

**Interfaces:**

- Consumes: project detail source, `ProjectServiceCard.astro`, localized dictionaries.
- Produces: failures when the service-first card, icon mapping, or localized copy is absent.

- [ ] **Step 1: Read the extracted component as a verifier source**

Add:

```js
const serviceCard = await readSource(
	"src",
	"components",
	"projects",
	"ProjectServiceCard.astro",
);
```

- [ ] **Step 2: Require the component contract and localized copy**

Require `ProjectServiceCard`, `button-action`, `arrow-right`, `move-up-right`, brand icon names, semantic fallback icon names, `getTechnologyIcon`, and `projects.detail.serviceCard.eyebrow` plus `projects.detail.serviceCard.body`. Reject the old inline `<aside` in the detail page.

- [ ] **Step 3: Run the verifier and confirm the expected failure**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-project-redesign.mjs
```

Expected: failure reporting the missing `ProjectServiceCard.astro`, component marker, and localized service-card copy.

---

### Task 2: Implement the reusable service-first sidebar card

**Files:**

- Create: `src/components/projects/ProjectServiceCard.astro`
- Modify: `src/pages/[locale]/projects/[project].astro`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Test: `scripts/verify-project-redesign.mjs`

**Interfaces:**

- Consumes props:

```ts
interface Props {
	technologies: string[];
	serviceHref?: string;
	serviceLabel?: string;
	externalHref?: string;
	copy: {
		eyebrow: string;
		body: string;
		technologies: string;
		externalLink: string;
	};
}
```

- Produces: a semantic `<aside>` with a conditional service block, full-width `button-action`, icon technology labels, and optional external link.

- [ ] **Step 1: Add localized service-card copy**

Add under `projects.detail`:

```json
"serviceCard": {
  "eyebrow": "Servicio relacionado",
  "body": "La experiencia aplicada en este proyecto también está disponible para necesidades similares."
}
```

and:

```json
"serviceCard": {
  "eyebrow": "Related service",
  "body": "The experience applied in this project is also available for similar needs."
}
```

- [ ] **Step 2: Create deterministic technology icon selection**

In `ProjectServiceCard.astro`, normalize labels with `technology.toLowerCase()` and map repository brand icons first. Map HTTP/WebSocket to `globe`, communication tooling to `git-branch`, deployment tooling to `cloud`, data tooling to `layers`, and everything else to `code`.

- [ ] **Step 3: Build the service-first markup**

Render the service icon tile, eyebrow, supporting body, and related-service `button-action` before the technology divider. Render every technology in a compact wrapping label with its chosen icon. Keep the external URL as a quieter final action. Use conditional blocks so missing service or external data leaves no blank section.

- [ ] **Step 4: Replace the inline sidebar**

Import `ProjectServiceCard` into `[project].astro` and pass:

```astro
<ProjectServiceCard
	technologies={project.technologies}
	serviceHref={caseStudy?.serviceHref}
	serviceLabel={caseStudy?.serviceLabel || copy.relatedService}
	externalHref={project.link}
	copy={{
		...copy.serviceCard,
		technologies: copy.technologies,
		externalLink: copy.externalLink,
	}}
/>
```

- [ ] **Step 5: Run the focused verifier**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-project-redesign.mjs
```

Expected: `Project redesign verification passed.`

---

### Task 3: Validate generated output and responsive presentation

**Files:**

- Verify: `src/components/projects/ProjectServiceCard.astro`
- Verify: generated Spanish and English project routes under `dist/client/`

**Interfaces:**

- Consumes: the completed Astro component and localized project data.
- Produces: validated source, generated HTML, and responsive visual evidence.

- [ ] **Step 1: Format the repository**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format
```

- [ ] **Step 2: Run static validation**

Run `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, `pnpm run verify:project-pages`, and `node scripts/verify-project-redesign.mjs` with Node 24.15.0. Expected: zero errors and passing verifier output.

- [ ] **Step 3: Build and verify generated pages**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-project-redesign.mjs --dist
git diff --check
```

Expected: successful build, passing generated-output verifier, and no whitespace errors.

- [ ] **Step 4: Inspect responsive routes**

Inspect BetX and Real-Time WebSocket Gateway in Spanish and English at 390 × 844 and 1440 × 900. Check light and dark themes, icon visibility, CTA hierarchy, long technology wrapping, optional external-link behavior, and absence of horizontal overflow.
