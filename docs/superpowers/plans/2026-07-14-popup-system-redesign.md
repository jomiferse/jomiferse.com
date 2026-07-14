# Popup System Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five unrelated popup treatments with one bilingual, accessible editorial popup system and make exit intent available site-wide without becoming intrusive.

**Architecture:** Add a reusable Astro dialog shell and shared CSS primitives, then keep cookie, contact, exit-intent, and project behavior inside focused components. Mount the global contact and exit-intent components from `BaseLayout`, use pure TypeScript helpers for route context, eligibility, and contact-result parsing, and protect the integration with Node tests plus a generated-output verifier.

**Tech Stack:** Astro 7, TypeScript 5.9, Tailwind CSS 4, native `<dialog>`, Node 24 test runner, existing i18n JSON, Vercel static output.

## Global Constraints

- Work directly on `main`; do not create a worktree unless the user changes the repository preference.
- Preserve the approved **A · Editorial professional** direction and the home page commercial palette.
- Use `var(--home-navy)` for light-theme headings and `var(--action)` only for small signals and the single primary action.
- Do not add runtime dependencies.
- Keep `/contact` as a normal, linkable page; standard CTA links must not all become modal triggers.
- Show global exit intent at most once per session and never on localized `/contact` or `/privacy` routes.
- Do not allow two native dialogs to be open simultaneously.
- Preserve the current cookie storage schema and contact API fallback.
- Required visual checks: 1440 × 900 and 390 × 844, Spanish and English, light and dark themes.
- Required final commands: `pnpm run test`, `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, `pnpm run verify:popup-system -- --phase=dist`, `pnpm run verify:ai-seo`, and `pnpm run build`.

## File Map

- Create `src/components/common/DialogShell.astro`: shared native dialog markup and visual slots.
- Create `src/components/common/GlobalContactDialog.astro`: global modal contact flow and inline submission states.
- Create `src/components/common/GlobalExitIntent.astro`: site-wide exit-intent presentation and browser controller.
- Create `src/lib/exit-intent.ts`: pure route-context and eligibility rules.
- Create `src/lib/contact-submission.ts`: pure redirect-result parser for enhanced modal submissions.
- Create `tests/exit-intent.test.ts`: threshold, exclusion, and context tests.
- Create `tests/contact-submission.test.ts`: success and error result tests.
- Create `scripts/verify-popup-system.mjs`: source and generated-output contract.
- Modify `src/layouts/BaseLayout.astro`: derive popup context and mount global components.
- Modify `src/components/common/CookieConsent.astro`: adopt the shared editorial system without changing consent semantics.
- Modify `src/components/forms/ContactForm.astro`: expose modal-safe hooks and optional compact styling.
- Modify `src/components/common/ConversionCta.astro`: point explicit modal actions at the global contact trigger.
- Modify `src/components/cards/ProjectCard.astro`: semantic trigger and shared detail dialog shell.
- Modify `src/components/services/ServicePricingCard.astro`: point pricing actions at the global contact trigger.
- Modify `src/pages/[locale]/services.astro`: remove service-only exit intent.
- Modify `src/pages/[locale]/services/[service].astro`: remove duplicate contact/exit dialogs and pass service context.
- Modify `src/pages/[locale]/blog/[...slug].astro`: pass article context.
- Modify `src/pages/[locale]/projects/[project].astro`: pass project context.
- Modify `src/i18n/en.json` and `src/i18n/es.json`: global popup copy and localized accessible labels.
- Modify `src/styles/global.css`: shared dialog tokens, shell, responsive states, and dark theme.
- Delete `src/components/common/ServicesExitIntent.astro` after global migration.
- Modify `package.json`: add the test and popup verification scripts.

---

### Task 1: Lock the bilingual popup contract

**Files:**
- Create: `scripts/verify-popup-system.mjs`
- Modify: `package.json`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`

**Interfaces:**
- Produces: `pnpm run test` and `pnpm run verify:popup-system` commands.
- Produces: `translations.popups.contact` and `translations.popups.exitIntent` dictionaries consumed by Tasks 3 and 4.

- [ ] **Step 1: Add the failing copy contract**

Create `scripts/verify-popup-system.mjs` with phased source checks:

```js
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const phases = ["copy", "shell", "contact", "exit", "cookies", "project", "dist"];
const phaseArg = process.argv.find((value) => value.startsWith("--phase="));
const requested = phaseArg?.split("=")[1] ?? "project";
const requestedIndex = phases.indexOf(requested);
const verifyDist = process.argv.includes("--dist") || requested === "dist";
if (requestedIndex < 0) throw new Error(`Unknown popup phase: ${requested}`);
const includesPhase = (phase) => phases.indexOf(phase) <= requestedIndex;
const readSource = async (...parts) => readFile(join(root, ...parts), "utf8");
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

if (includesPhase("copy")) {
	for (const locale of ["es", "en"]) {
		const dictionary = JSON.parse(await readSource("src", "i18n", `${locale}.json`));
		for (const [group, keys] of Object.entries({
			contact: ["eyebrow", "title", "description", "close", "submit", "submitting", "successTitle", "successText", "validationError", "deliveryError", "whatsapp"],
			exitIntent: ["eyebrow", "genericTitle", "serviceTitle", "projectTitle", "articleTitle", "description", "pointOne", "pointTwo", "primary", "whatsapp", "dismiss", "close"],
		})) {
			for (const key of keys) {
				if (!dictionary.popups?.[group]?.[key]) failures.push(`${locale}: missing popups.${group}.${key}`);
			}
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}
console.warn(`Popup system verification passed through ${requested}.`);
```

Add scripts:

```json
"test": "node --test tests/*.test.ts",
"verify:popup-system": "node scripts/verify-popup-system.mjs"
```

- [ ] **Step 2: Run the copy contract and confirm RED**

Run: `pnpm run verify:popup-system -- --phase=copy`

Expected: FAIL listing missing `es/en popups.contact.*` and `popups.exitIntent.*` keys.

- [ ] **Step 3: Add exact Spanish and English popup dictionaries**

Add a top-level `popups` object beside `cookies` and `footer`. Use equivalent intent, not literal translation. Required shape:

```json
{
  "popups": {
    "contact": {
      "eyebrow": "Primera valoración gratuita",
      "title": "Cuéntame qué necesitas resolver.",
      "description": "Con tres datos es suficiente para entender el contexto y decirte cuál sería el siguiente paso.",
      "close": "Cerrar formulario de contacto",
      "submit": "Enviar consulta",
      "submitting": "Enviando consulta…",
      "successTitle": "He recibido tu consulta.",
      "successText": "La revisaré y te responderé personalmente lo antes posible.",
      "validationError": "Revisa los campos marcados antes de enviar.",
      "deliveryError": "No se ha podido enviar ahora mismo. Puedes escribirme por WhatsApp o email.",
      "whatsapp": "Escribir por WhatsApp"
    },
    "exitIntent": {
      "eyebrow": "Antes de cerrar",
      "genericTitle": "¿Quieres que mire tu caso antes de irte?",
      "serviceTitle": "¿Encaja {title} con lo que necesitas?",
      "projectTitle": "¿Tienes un reto parecido a {title}?",
      "articleTitle": "¿Quieres aplicar lo que has leído a tu caso?",
      "description": "Cuéntame el contexto. Te diré con claridad si puedo ayudarte y cuál sería el siguiente paso razonable.",
      "pointOne": "Sin compromiso",
      "pointTwo": "Respuesta directa",
      "primary": "Cuéntame tu proyecto",
      "whatsapp": "Escribir por WhatsApp",
      "dismiss": "Seguir navegando",
      "close": "Cerrar este aviso"
    }
  }
}
```

Add this English dictionary with equivalent intent:

```json
{
  "popups": {
    "contact": {
      "eyebrow": "Free initial assessment",
      "title": "Tell me what you need to solve.",
      "description": "Three details are enough for me to understand the context and suggest a sensible next step.",
      "close": "Close contact form",
      "submit": "Send enquiry",
      "submitting": "Sending enquiry…",
      "successTitle": "I have received your enquiry.",
      "successText": "I will review it and reply personally as soon as possible.",
      "validationError": "Check the highlighted fields before sending.",
      "deliveryError": "It could not be sent just now. You can reach me by WhatsApp or email.",
      "whatsapp": "Message on WhatsApp"
    },
    "exitIntent": {
      "eyebrow": "Before you close this",
      "genericTitle": "Would you like me to look at your case before you go?",
      "serviceTitle": "Does {title} fit what you need?",
      "projectTitle": "Do you have a challenge similar to {title}?",
      "articleTitle": "Would you like to apply this to your own case?",
      "description": "Share the context. I will tell you clearly whether I can help and what the most sensible next step would be.",
      "pointOne": "No commitment",
      "pointTwo": "Direct reply",
      "primary": "Tell me about your project",
      "whatsapp": "Message on WhatsApp",
      "dismiss": "Keep browsing",
      "close": "Close this prompt"
    }
  }
}
```

- [ ] **Step 4: Run the copy contract and confirm GREEN**

Run: `pnpm run verify:popup-system -- --phase=copy`

Expected: `Popup system verification passed through copy.`

- [ ] **Step 5: Commit the contract and copy**

```bash
git add package.json scripts/verify-popup-system.mjs src/i18n/es.json src/i18n/en.json
git commit -m "test(popups): define unified popup contract"
```

---

### Task 2: Build the shared editorial dialog shell

**Files:**
- Create: `src/components/common/DialogShell.astro`
- Modify: `src/styles/global.css`
- Modify: `scripts/verify-popup-system.mjs`

**Interfaces:**
- Produces: `DialogShell` props `{ id, labelledBy, describedBy?, size?, className? }`.
- Produces: named `header`, default body, and `footer` slots.
- Produces: global `.dialog-shell*` classes consumed by Tasks 3–6.

- [ ] **Step 1: Extend the verifier with failing shell requirements**

Under `includesPhase("shell")`, require:

```js
const shell = await readSource("src", "components", "common", "DialogShell.astro");
const styles = await readSource("src", "styles", "global.css");
requireMarkers("dialog shell", shell, [
	"<dialog",
	"aria-labelledby={labelledBy}",
	"aria-describedby={describedBy}",
	"data-dialog-shell",
	'<slot name="header"',
	'<slot name="footer"',
]);
requireMarkers("dialog styles", styles, [
	"--dialog-max-width",
	".dialog-shell::backdrop",
	".dialog-shell__surface",
	".dialog-shell__close",
	".dialog-shell[open]",
	"@media (prefers-reduced-motion: reduce)",
]);
```

- [ ] **Step 2: Run the shell phase and confirm RED**

Run: `pnpm run verify:popup-system -- --phase=shell`

Expected: FAIL because `DialogShell.astro` and shared dialog markers do not exist.

- [ ] **Step 3: Create the reusable Astro shell**

Create `DialogShell.astro` with this public structure:

```astro
---
interface Props {
	id: string;
	labelledBy: string;
	describedBy?: string;
	size?: "compact" | "standard" | "form" | "detail";
	className?: string;
}
const { id, labelledBy, describedBy, size = "standard", className = "" } = Astro.props;
---

<dialog
	id={id}
	class:list={["dialog-shell", `dialog-shell--${size}`, className]}
	aria-labelledby={labelledBy}
	aria-describedby={describedBy}
	data-dialog-shell
>
	<div class="dialog-shell__surface">
		<header class="dialog-shell__header"><slot name="header" /></header>
		<div class="dialog-shell__body"><slot /></div>
		<footer class="dialog-shell__footer"><slot name="footer" /></footer>
	</div>
</dialog>
```

The footer slot must render only when supplied; use `Astro.slots.has("footer")` to avoid an empty divider.

- [ ] **Step 4: Add shared editorial styles**

Add global rules with exact width tokens:

```css
.dialog-shell {
	--dialog-max-width: 38rem;
	width: min(var(--dialog-max-width), calc(100vw - 2rem));
	max-height: calc(100dvh - 2rem);
	margin: auto;
	border: 0;
	background: transparent;
	padding: 0;
	color: var(--text);
}
.dialog-shell--compact { --dialog-max-width: 32.5rem; }
.dialog-shell--form { --dialog-max-width: 45rem; }
.dialog-shell--detail { --dialog-max-width: 47.5rem; }
.dialog-shell::backdrop {
	background: rgba(5, 12, 22, 0.64);
	backdrop-filter: blur(8px);
}
.dialog-shell__surface {
	position: relative;
	display: flex;
	max-height: calc(100dvh - 2rem);
	flex-direction: column;
	overflow: hidden;
	border: 1px solid var(--surface-border);
	border-top: 4px solid var(--action);
	border-radius: 1.125rem;
	background: var(--surface);
	box-shadow: 0 28px 80px rgba(5, 12, 22, 0.28);
}
.dialog-shell__body { overflow-y: auto; overscroll-behavior: contain; }
.dialog-shell[open] { animation: dialog-enter 180ms ease-out; }
@media (prefers-reduced-motion: reduce) {
	.dialog-shell[open] { animation: none; }
}
```

Add these shared structure and interaction rules:

```css
.dialog-shell__header,
.dialog-shell__body,
.dialog-shell__footer { padding: 1.25rem; }
.dialog-shell__header { border-bottom: 1px solid var(--surface-border); }
.dialog-shell__footer {
	display: flex;
	justify-content: flex-end;
	gap: 0.75rem;
	border-top: 1px solid var(--surface-border);
}
.dialog-shell__close {
	display: inline-grid;
	width: 2.75rem;
	height: 2.75rem;
	place-items: center;
	border: 1px solid var(--surface-border);
	border-radius: 999px;
	background: var(--surface-strong);
	color: var(--text);
}
.dialog-shell__close:focus-visible {
	outline: 2px solid var(--action);
	outline-offset: 3px;
}
@keyframes dialog-enter {
	from { opacity: 0; transform: translateY(10px) scale(0.985); }
	to { opacity: 1; transform: translateY(0) scale(1); }
}
@media (min-width: 40rem) {
	.dialog-shell__header,
	.dialog-shell__body,
	.dialog-shell__footer { padding: 1.5rem; }
}
.dark .dialog-shell__surface { box-shadow: 0 30px 90px rgba(0, 0, 0, 0.58); }
```

- [ ] **Step 5: Run shell verification and project checks**

Run:

```bash
pnpm run verify:popup-system -- --phase=shell
pnpm run check
pnpm run lint
```

Expected: all exit 0.

- [ ] **Step 6: Commit the shared shell**

```bash
git add src/components/common/DialogShell.astro src/styles/global.css scripts/verify-popup-system.mjs
git commit -m "feat(popups): add editorial dialog shell"
```

---

### Task 3: Add the global contact dialog and inline submission states

**Files:**
- Create: `src/lib/contact-submission.ts`
- Create: `tests/contact-submission.test.ts`
- Create: `src/components/common/GlobalContactDialog.astro`
- Modify: `src/components/forms/ContactForm.astro`
- Modify: `src/components/common/ConversionCta.astro`
- Modify: `src/components/services/ServicePricingCard.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/[locale]/services/[service].astro`
- Modify: `scripts/verify-popup-system.mjs`

**Interfaces:**
- Produces: `type ContactSubmissionResult = "success" | "validation" | "delivery"`.
- Produces: `parseContactSubmissionResult(responseUrl: string): ContactSubmissionResult`.
- Produces: triggers `[data-contact-dialog-open]` with optional `data-service-selection`, `data-scope-selection`, `data-source-category`, and `data-source-path`.
- Consumes: `DialogShell` from Task 2 and `ContactForm` existing hidden fields.

- [ ] **Step 1: Write failing result-parser tests**

Create `tests/contact-submission.test.ts`:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseContactSubmissionResult } from "../src/lib/contact-submission.ts";

test("maps the contact redirect to an inline success state", () => {
	assert.equal(parseContactSubmissionResult("https://site.test/es/contact?sent=1"), "success");
});
test("maps validation and delivery redirects", () => {
	assert.equal(parseContactSubmissionResult("https://site.test/es/contact?error=missing"), "validation");
	assert.equal(parseContactSubmissionResult("https://site.test/es/contact?error=send"), "delivery");
});
test("treats an unknown response as a delivery error", () => {
	assert.equal(parseContactSubmissionResult("https://site.test/es/contact"), "delivery");
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test tests/contact-submission.test.ts`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/contact-submission.ts`.

- [ ] **Step 3: Implement the pure parser**

Create `src/lib/contact-submission.ts`:

```ts
export type ContactSubmissionResult = "success" | "validation" | "delivery";

export function parseContactSubmissionResult(responseUrl: string): ContactSubmissionResult {
	const params = new URL(responseUrl, "https://www.jomiferse.com").searchParams;
	if (params.get("sent") === "1") return "success";
	if (params.get("error") === "missing") return "validation";
	return "delivery";
}
```

- [ ] **Step 4: Confirm the parser GREEN**

Run: `node --test tests/contact-submission.test.ts`

Expected: 3 tests pass.

- [ ] **Step 5: Add modal hooks to the existing form**

Add optional props:

```ts
variant?: "page" | "modal";
```

Render `data-contact-form-variant={variant}`, keep the same three visible fields, and add named status targets that the global dialog can update. Do not add selects, attachments, phone fields, or project-type fields.

- [ ] **Step 6: Build `GlobalContactDialog.astro`**

Use `DialogShell size="form"`, localized header copy, `<ContactForm variant="modal" ... />`, WhatsApp fallback, and status panels with `role="status"` or `role="alert"`.

The controller must:

```ts
const openContactDialog = (trigger: HTMLElement) => {
	if (document.querySelector("dialog[open]")) return;
	lastContactTrigger = trigger;
	syncHiddenContext(trigger);
	contactDialog.showModal();
	requestAnimationFrame(() => nameInput?.focus());
};
```

Intercept only the modal form. Call `form.reportValidity()` before `fetch`, submit `new FormData(form)`, parse `response.url`, preserve values on error, replace the form with success content on success, and fall back to the existing server redirect when JavaScript is unavailable.

- [ ] **Step 7: Mount globally and remove the service duplicate**

In `BaseLayout.astro`, mount `<GlobalContactDialog>` on every localized page except `/contact` and `/privacy`, passing `locale`, `Astro.url.pathname`, and the WhatsApp href.

In the service detail page:

- Remove the local `<dialog id="service-contact-dialog">` block.
- Remove its script and unused `ContactForm` import.
- Rename `data-contact-modal-open` to `data-contact-dialog-open` while retaining service/scope data attributes and normal `href` fallbacks.

Apply the same attribute rename in `ConversionCta.astro` and `ServicePricingCard.astro`; the verifier must reject every remaining `data-contact-modal-open` marker under `src/`.

- [ ] **Step 8: Extend verifier and confirm GREEN**

Require `GlobalContactDialog`, `DialogShell`, inline states, `fetch(form.action`, focus restoration, and the absence of `id="service-contact-dialog"` in the service page.

Run:

```bash
pnpm run test
pnpm run verify:popup-system -- --phase=contact
pnpm run check
```

Expected: all pass.

- [ ] **Step 9: Commit contact integration**

```bash
git add src/lib/contact-submission.ts tests/contact-submission.test.ts src/components/common/GlobalContactDialog.astro src/components/forms/ContactForm.astro src/components/common/ConversionCta.astro src/components/services/ServicePricingCard.astro src/layouts/BaseLayout.astro src/pages/[locale]/services/[service].astro scripts/verify-popup-system.mjs
git commit -m "feat(popups): add global contact dialog"
```

---

### Task 4: Generalise exit intent across the site

**Files:**
- Create: `src/lib/exit-intent.ts`
- Create: `tests/exit-intent.test.ts`
- Create: `src/components/common/GlobalExitIntent.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/[locale]/services.astro`
- Modify: `src/pages/[locale]/services/[service].astro`
- Modify: `src/pages/[locale]/blog/[...slug].astro`
- Modify: `src/pages/[locale]/projects/[project].astro`
- Modify: `scripts/verify-popup-system.mjs`
- Delete: `src/components/common/ServicesExitIntent.astro`

**Interfaces:**
- Produces: `EXIT_INTENT_SESSION_KEY = "jomiferse.exit-intent.v2"`.
- Produces: `type ExitIntentContext = "generic" | "service" | "project" | "article"`.
- Produces: `getExitIntentContext(pathname: string): ExitIntentContext`.
- Produces: `isExitIntentRouteExcluded(pathname: string): boolean`.
- Produces: `canShowExitIntent(input: ExitIntentEligibility): boolean`.
- Consumes: `[data-contact-dialog-open]` from Task 3.

- [ ] **Step 1: Write failing pure behavior tests**

Create tests for exact routes and thresholds:

```ts
assert.equal(isExitIntentRouteExcluded("/es/contact"), true);
assert.equal(isExitIntentRouteExcluded("/en/privacy/"), true);
assert.equal(isExitIntentRouteExcluded("/es/services"), false);
assert.equal(getExitIntentContext("/es/services/business-website"), "service");
assert.equal(getExitIntentContext("/es/projects/betx"), "project");
assert.equal(getExitIntentContext("/es/blog/usar-ia-en-tu-producto-sin-humo"), "article");
assert.equal(getExitIntentContext("/es/about"), "generic");
```

Test `canShowExitIntent` with a base object and these failures: session already shown, open dialog, cookie banner visible, hidden document, fine pointer below both engagement thresholds, and coarse pointer missing either 25 seconds or 50% scroll.

- [ ] **Step 2: Run tests and confirm RED**

Run: `node --test tests/exit-intent.test.ts`

Expected: FAIL because `src/lib/exit-intent.ts` is missing.

- [ ] **Step 3: Implement pure eligibility rules**

Use this exact type:

```ts
export type ExitIntentEligibility = {
	pointerCoarse: boolean;
	elapsedMs: number;
	scrollRatio: number;
	sessionShown: boolean;
	hasOpenDialog: boolean;
	cookieBannerVisible: boolean;
	documentHidden: boolean;
};
```

Return false for any blocking flag. For coarse pointers require `elapsedMs >= 25_000 && scrollRatio >= 0.5`. For fine pointers require `elapsedMs >= 15_000 || scrollRatio >= 0.25`; the browser controller additionally requires a top-edge mouseout event.

- [ ] **Step 4: Confirm unit tests GREEN**

Run: `node --test tests/exit-intent.test.ts`

Expected: all exit-intent tests pass.

- [ ] **Step 5: Create `GlobalExitIntent.astro`**

Use `DialogShell size="compact"`. Resolve title from context and replace `{title}` only when a localized detail title exists. Render one primary `[data-contact-dialog-open]` button, WhatsApp secondary action, and quiet dismiss action.

The controller must calculate elapsed time and scroll ratio, check `CONSENT_STORAGE_KEY` or visible cookie banner state, and call the pure eligibility function before `showModal()`. Store `EXIT_INTENT_SESSION_KEY` at open time. Remove `autofocus` from the primary CTA.

- [ ] **Step 6: Mount global exit context**

Extend `BaseLayout` with:

```ts
type PopupContext = {
	kind?: ExitIntentContext;
	title?: string;
	service?: string;
	scope?: PricingKey;
};
popupContext?: PopupContext;
```

Merge explicit context with `getExitIntentContext(Astro.url.pathname)`. Do not render global exit or contact dialogs on excluded routes.

Pass explicit detail context from:

```astro
popupContext={{ kind: "service", title: service.title, service: service.slug }}
popupContext={{ kind: "article", title: post.data.title }}
popupContext={{ kind: "project", title: project.title }}
```

- [ ] **Step 7: Remove service-only exit intent**

Delete imports and component instances from both service routes. Delete `ServicesExitIntent.astro`. Remove the obsolete `services.exitIntent` dictionary after all callers use `popups.exitIntent`.

- [ ] **Step 8: Extend verifier and confirm GREEN**

Require the new global component in `BaseLayout`, the v2 session key, 15/25 second thresholds, 0.25/0.5 scroll ratios, route exclusions, cookie suppression, contextual props, and absence of `ServicesExitIntent` imports.

Run:

```bash
pnpm run test
pnpm run verify:popup-system -- --phase=exit
pnpm run check
```

Expected: all pass.

- [ ] **Step 9: Commit global exit intent**

```bash
git add src/lib/exit-intent.ts tests/exit-intent.test.ts src/components/common/GlobalExitIntent.astro src/layouts/BaseLayout.astro src/pages/[locale]/services.astro src/pages/[locale]/services/[service].astro src/pages/[locale]/blog/[...slug].astro src/pages/[locale]/projects/[project].astro src/i18n/es.json src/i18n/en.json scripts/verify-popup-system.mjs
git add -u src/components/common/ServicesExitIntent.astro
git commit -m "feat(popups): make exit intent global"
```

---

### Task 5: Redesign cookie consent and settings

**Files:**
- Modify: `src/components/common/CookieConsent.astro`
- Modify: `tests/cookie-consent.test.ts`
- Modify: `scripts/verify-popup-system.mjs`

**Interfaces:**
- Consumes: `DialogShell` from Task 2.
- Preserves: `CONSENT_STORAGE_KEY`, `CookieConsentPreferences`, consent mode state, and analytics loading behavior.
- Produces: visible banner marker `[data-cookie-banner]` used by global exit suppression.

- [ ] **Step 1: Extend cookie behavior and source contracts**

Add tests asserting the storage key remains `jomiferse.cookie-consent.v1` and default analytics preference behavior remains unchanged. Extend the verifier to require `DialogShell`, `data-cookie-banner`, equal action wrappers, native checkbox, safe close label, backdrop close, and focus restoration; reject cyan accent variables inside CookieConsent styles.

- [ ] **Step 2: Run cookie tests and verifier for RED**

Run:

```bash
node --test tests/cookie-consent.test.ts
pnpm run verify:popup-system -- --phase=cookies
```

Expected: unit tests stay green; verifier fails because new structural markers are absent.

- [ ] **Step 3: Redesign the non-modal banner**

Keep `role="region"` and `aria-live="polite"`. Add a compact label/icon, concise copy, privacy link, and three actions. On desktop render text and actions in two columns; on 390 px stack full-width 44 px buttons without covering the full viewport.

Use `button-secondary` for Reject and Configure and a restrained `button-action` for Accept, while keeping Reject and Accept equal in dimensions and DOM visibility.

- [ ] **Step 4: Move settings into the shared shell**

Replace the bespoke dialog wrapper with `DialogShell size="standard"`. Keep required and analytics rows, native checkbox, privacy link, Close, and Save. Add a localized close icon button, backdrop close, Escape support, and explicit opener restoration.

- [ ] **Step 5: Confirm cookie behavior and contract GREEN**

Run:

```bash
pnpm run test
pnpm run verify:popup-system -- --phase=cookies
pnpm run check
```

Expected: all pass and consent unit tests are unchanged semantically.

- [ ] **Step 6: Commit cookie redesign**

```bash
git add src/components/common/CookieConsent.astro tests/cookie-consent.test.ts scripts/verify-popup-system.mjs
git commit -m "refactor(popups): unify cookie consent surfaces"
```

---

### Task 6: Redesign project detail dialogs and semantic triggers

**Files:**
- Modify: `src/components/cards/ProjectCard.astro`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Modify: `scripts/verify-popup-system.mjs`

**Interfaces:**
- Consumes: `DialogShell size="detail"`.
- Produces: project triggers `[data-project-dialog-open][aria-controls]` implemented as a real overlay `button type="button"` inside each card article.

- [ ] **Step 1: Add failing project-dialog contract**

Require `DialogShell`, semantic button trigger, `aria-haspopup="dialog"`, delegated click behavior, backdrop close, and focus restoration. Reject:

```js
["role=\"button\"", "onclick=", "onkeydown=", "glass-panel m-auto", "rounded-[2rem]"]
```

- [ ] **Step 2: Run project phase and confirm RED**

Run: `pnpm run verify:popup-system -- --phase=project`

Expected: FAIL on the old simulated-button trigger and bespoke glass dialog.

- [ ] **Step 3: Replace the simulated opener with a semantic overlay button**

Use:

```astro
<article class="project-dialog-card group relative">
	<!-- Existing image and visible project content stay here. -->
	<button
		type="button"
		class="project-dialog-trigger absolute inset-0 z-10 rounded-[inherit]"
		aria-label={t(locale, "projectCard.openDialog").replace("{title}", project.title)}
		aria-haspopup="dialog"
		aria-controls={dialogId}
		data-project-dialog-open={dialogId}
	>
		<span class="sr-only">{project.title}</span>
	</button>
</article>
```

Reset the overlay button background and border. Apply the visible ring to `.project-dialog-card:has(.project-dialog-trigger:focus-visible)` so keyboard focus surrounds the complete card. The card contains no other interactive descendant, so the overlay does not hide another control.

Add `projectCard.openDialog` as `Abrir detalles de {title}` and `Open {title} details` in the two dictionaries.

- [ ] **Step 4: Move project content into the shared detail shell**

Use editorial sections separated by borders for context, summary, highlights, technologies, and external action. Keep optional fields conditional and preserve all existing translations and data. Do not add roles, organisation, or technologies back to the archive card surface; they remain only inside the requested detail dialog.

- [ ] **Step 5: Add one delegated controller**

Replace inline handlers with a document-level listener guarded by a dataset flag. Before opening, return when `document.querySelector("dialog[open]")` is non-null. Record the opener, call `showModal()`, close on backdrop, and restore the opener after the dialog `close` event.

- [ ] **Step 6: Confirm project phase GREEN**

Run:

```bash
pnpm run verify:popup-system -- --phase=project
pnpm run check
pnpm run lint
```

Expected: all pass.

- [ ] **Step 7: Commit project-dialog redesign**

```bash
git add src/components/cards/ProjectCard.astro src/i18n/es.json src/i18n/en.json scripts/verify-popup-system.mjs
git commit -m "refactor(popups): unify project detail dialog"
```

---

### Task 7: Generated-output verification and visual QA

**Files:**
- Modify: `scripts/verify-popup-system.mjs`
- Modify: `docs/superpowers/specs/2026-07-14-popup-system-redesign-design.md` only if implementation reveals an approved clarification; do not silently change scope.

**Interfaces:**
- Produces: `pnpm run verify:popup-system -- --phase=dist` as the final integration gate.

- [ ] **Step 1: Add generated-output assertions**

For built Spanish and English home, service detail, blog detail, project listing, contact, and privacy HTML, verify:

```js
const requiredGlobalRoutes = [
	["es", "index.html"],
	["en", "index.html"],
	["es", "services", "business-website", "index.html"],
	["en", "services", "business-website", "index.html"],
	["es", "blog", "usar-ia-en-tu-producto-sin-humo", "index.html"],
	["en", "blog", "using-ai-in-your-product-without-hype", "index.html"],
	["es", "projects", "index.html"],
	["en", "projects", "index.html"],
];
const excludedExitRoutes = [
	["es", "contact", "index.html"],
	["en", "contact", "index.html"],
	["es", "privacy", "index.html"],
	["en", "privacy", "index.html"],
];
```

Global routes must include exactly one `data-global-contact-dialog`, one `data-global-exit-dialog`, and shared dialog markers. Contact/privacy routes must not include `data-global-exit-dialog`. Generated service pages must not include `service-contact-dialog` or `services-exit-intent`. Generated popup copy must exist in both locales.

- [ ] **Step 2: Run the dist verifier before rebuilding and confirm RED**

Run: `pnpm run verify:popup-system -- --phase=dist`

Expected: FAIL if `dist` is stale or any generated contract is missing.

- [ ] **Step 3: Format and run the complete automated suite**

Run in order:

```bash
pnpm run format
pnpm run test
pnpm run check
pnpm run lint
pnpm run format:check
pnpm run verify:popup-system -- --phase=project
pnpm run verify:contact-redesign
pnpm run verify:service-redesign
pnpm run verify:ai-seo
pnpm run build
pnpm run verify:popup-system -- --phase=dist
git diff --check
```

Expected: every command exits 0; Astro reports zero errors, warnings, and hints.

- [ ] **Step 4: Run desktop browser QA at 1440 × 900**

Check Spanish home, English service detail, blog detail, projects, contact, and privacy:

- Cookie banner does not cover primary content or the whole viewport.
- Configure opens settings, Escape/backdrop close it, and focus returns.
- Exit intent appears only after its threshold and only once per session.
- Exit primary closes exit before opening contact.
- Contact sends to inline success/error state without navigating.
- Project card opens the detail dialog by mouse, Enter, and Space.
- Contact/privacy never mount exit intent.
- Light and dark surfaces use the approved navy/action hierarchy.

- [ ] **Step 5: Run mobile browser QA at 390 × 844**

Repeat the flows with coarse-pointer emulation. Confirm no horizontal overflow, at least 16 px dialog viewport margin, reachable close control, internal scrolling, 44 px targets, and exit intent only after 25 seconds plus 50% scroll.

- [ ] **Step 6: Commit final integration checks**

```bash
git add scripts/verify-popup-system.mjs
git commit -m "test(popups): verify global integration"
```

- [ ] **Step 7: Confirm clean repository state**

Run:

```bash
git status -sb
git log -8 --oneline
```

Expected: `main` has no uncommitted files and the popup commits are listed in task order.
