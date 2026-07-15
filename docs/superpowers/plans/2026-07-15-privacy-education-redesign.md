# Privacy and Education Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the localized privacy and education routes as wide, editorial, accessible pages that accurately document the site's data processing and connect technical learning to client outcomes.

**Architecture:** Keep legal and education copy in the parallel locale dictionaries, continue deriving qualifications and certifications from the CV data, and build both routes with Astro components. Extract the blog table-of-contents behavior into a generic `SectionToc` component, retain `BlogArticleToc` as a compatibility wrapper, and add a source/dist verifier that supports a separate red-green cycle for every implementation task.

**Tech Stack:** Astro 7, TypeScript 5.9, Tailwind CSS 4, Astro Icon, Node's built-in assertions and the repository's existing source-verifier pattern.

## Global Constraints

- Work directly on `main`; do not create a worktree or feature branch.
- Preserve the unrelated pending edits in `scripts/verify-popup-system.mjs` and `src/components/common/GlobalExitIntent.astro`; never stage them in this plan's commits.
- Use Node `>=24.0.0` through `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"` when needed.
- Keep Spanish and English public copy structurally equivalent but naturally written, not literal translations.
- Use `var(--home-navy)` for primary headings and `var(--action)` for actions, icons, eyebrows and navigation state.
- Do not add `var(--accent*)` references to the redesigned routes or education cards.
- Keep privacy `noindex,follow` and excluded from the global contact and exit-intent dialogs.
- Retain one clear primary action per section and no sales CTA on the privacy page.
- Required visual checks are 390 px and 1440 px, light and dark themes, with no horizontal overflow.
- Do not claim legal certification. The owner must verify the 12-month enquiry-retention period and active provider configurations before publication.
- Use only the site's actual providers and behavior: Vercel, Resend, consent-gated Google Analytics, local theme/consent storage and the session exit-intent flag.

---

## File Map

- `scripts/verify-privacy-education-redesign.mjs`: phase-based source and generated-output contract for this redesign.
- `package.json`: exposes `verify:privacy-education-redesign`.
- `src/components/common/SectionToc.astro`: generic section-aware navigation with desktop sticky and mobile disclosure presentations.
- `src/components/common/BlogArticleToc.astro`: compatibility wrapper that preserves the blog layout API.
- `src/i18n/es.json`, `src/i18n/en.json`: all localized privacy and education presentation copy.
- `src/pages/[locale]/privacy.astro`: complete privacy and cookie second layer.
- `src/components/cards/CertificationCard.astro`: compact certification record.
- `src/components/cards/EducationCard.astro`: formal-education timeline record.
- `src/pages/[locale]/education.astro`: applied-learning and evidence page.

---

### Task 1: Add the Redesign Verification Contract

**Files:**
- Create: `scripts/verify-privacy-education-redesign.mjs`
- Modify: `package.json:9-25`

**Interfaces:**
- Consumes: repository source files and optional `dist/client` output.
- Produces: `pnpm run verify:privacy-education-redesign -- --phase=<phase>` where phase is `nav`, `privacy-copy`, `privacy-page`, `education-copy`, `education-cards`, `education-page`, `source` or `dist`.

- [ ] **Step 1: Create the failing phase-based verifier**

Create `scripts/verify-privacy-education-redesign.mjs` with the following implementation:

```js
import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const phaseArg = process.argv.find((argument) => argument.startsWith("--phase="));
const requestedPhase = phaseArg?.split("=")[1] ?? "source";
const sourcePhases = [
	"nav",
	"privacy-copy",
	"privacy-page",
	"education-copy",
	"education-cards",
	"education-page",
];
const allowedPhases = [...sourcePhases, "source", "dist"];
if (!allowedPhases.includes(requestedPhase)) {
	throw new Error(`Unknown privacy/education phase: ${requestedPhase}`);
}

const failures = [];
const readSource = (...parts) => readFile(join(root, ...parts), "utf8");
const includesPhase = (phase) =>
	requestedPhase === phase || requestedPhase === "source" || requestedPhase === "dist";
const requireMarkers = (label, source, markers) => {
	for (const marker of markers) {
		if (!source.includes(marker)) failures.push(`${label}: missing ${marker}`);
	}
};
const rejectMarkers = (label, source, markers) => {
	for (const marker of markers) {
		if (source.includes(marker)) failures.push(`${label}: contains ${marker}`);
	}
};

if (includesPhase("nav")) {
	const sectionToc = await readSource("src", "components", "common", "SectionToc.astro").catch(() => "");
	const blogToc = await readSource("src", "components", "common", "BlogArticleToc.astro");
	const blogLayout = await readSource("src", "layouts", "BlogPostLayout.astro");
	requireMarkers("generic section navigation", sectionToc, [
		"data-section-toc",
		'setAttribute("aria-current", "location")',
		"IntersectionObserver",
		"prefers-reduced-motion",
		"max-h-[calc(100svh-7.5rem)]",
	]);
	requireMarkers("blog navigation wrapper", blogToc, ["SectionToc", "headings", "currentLabel"]);
	requireMarkers("blog layout navigation", blogLayout, ["BlogArticleToc"]);
}

for (const locale of ["es", "en"]) {
	const dictionary = JSON.parse(await readSource("src", "i18n", `${locale}.json`));
	if (includesPhase("privacy-copy")) {
		for (const key of ["updated", "summary", "navigation", "sections", "storageTable", "actions"]) {
			if (!dictionary.privacy?.[key]) failures.push(`${locale}: missing privacy.${key}`);
		}
		for (const key of ["controller", "data", "purposes", "retention", "providers", "transfers", "rights", "cookies", "withdraw"]) {
			if (!dictionary.privacy?.sections?.[key]) failures.push(`${locale}: missing privacy.sections.${key}`);
		}
	}
	if (includesPhase("education-copy")) {
		for (const key of ["summary", "applied", "certifications", "education", "cta"]) {
			if (!dictionary.education?.page?.[key]) failures.push(`${locale}: missing education.page.${key}`);
		}
		if (dictionary.education.page.applied.items.length !== 3) {
			failures.push(`${locale}: education applied section must contain three items`);
		}
	}
}

if (includesPhase("privacy-page")) {
	const privacy = await readSource("src", "pages", "[locale]", "privacy.astro");
	requireMarkers("privacy page", privacy, [
		"SectionToc",
		"data-privacy-page",
		"data-privacy-summary",
		"data-privacy-storage-table",
		"data-cookie-settings-trigger",
		"cv.email",
		"noindex",
		'jomiferse.exit-intent.v2',
		'_ga_<container-id>',
	]);
	rejectMarkers("privacy commercial palette", privacy, ["var(--accent"]);
}

if (includesPhase("education-cards")) {
	const certification = await readSource("src", "components", "cards", "CertificationCard.astro");
	const education = await readSource("src", "components", "cards", "EducationCard.astro");
	requireMarkers("certification record", certification, ["data-certification-record", "button-secondary", "opensNewWindow"]);
	requireMarkers("education record", education, ["data-education-record", "data-education-period"]);
	rejectMarkers("certification commercial palette", certification, ["dark-card", "hover-card", "var(--accent"]);
	rejectMarkers("education commercial palette", education, ["dark-card", "hover-card", "var(--accent"]);
}

if (includesPhase("education-page")) {
	const education = await readSource("src", "pages", "[locale]", "education.astro");
	requireMarkers("education page", education, [
		"data-education-page",
		"certifications.length",
		"education.length",
		"data-applied-learning",
		"CertificationCard",
		"EducationCard",
		'href: `/${locale}/projects`',
		'href: `/${locale}/about`',
	]);
	rejectMarkers("education commercial palette", education, ["var(--accent"]);
}

if (requestedPhase === "dist") {
	for (const locale of ["es", "en"]) {
		for (const route of ["privacy", "education"]) {
			const output = join(root, "dist", "client", locale, route, "index.html");
			try {
				await access(output);
				const html = await readFile(output, "utf8");
				if (!html.includes(`data-${route}-page`)) failures.push(`/${locale}/${route}: missing page marker`);
				if (route === "privacy" && !html.includes('content="noindex,follow"')) failures.push(`/${locale}/privacy: missing noindex`);
			} catch {
				failures.push(`/${locale}/${route}: generated route missing`);
			}
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.log(`Privacy and education redesign verification passed through ${requestedPhase}.`);
```

- [ ] **Step 2: Expose the verifier in `package.json`**

Add this script alongside the existing redesign verifiers:

```json
"verify:privacy-education-redesign": "node scripts/verify-privacy-education-redesign.mjs"
```

- [ ] **Step 3: Run the navigation phase and confirm the expected failure**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=nav
```

Expected: FAIL because `src/components/common/SectionToc.astro` does not exist.

- [ ] **Step 4: Commit only the verifier contract**

```bash
git add package.json scripts/verify-privacy-education-redesign.mjs
git commit -m "test(pages): define privacy and education contract"
```

---

### Task 2: Extract Generic Section-Aware Navigation

**Files:**
- Create: `src/components/common/SectionToc.astro`
- Modify: `src/components/common/BlogArticleToc.astro`

**Interfaces:**
- Consumes: `items: Array<{ slug: string; text: string }>` plus localized `label`, `currentLabel` and optional `icon`.
- Produces: a desktop sticky navigation and mobile disclosure with `data-section-toc`, active-section tracking and unchanged `BlogArticleToc` props.

- [ ] **Step 1: Move the existing navigation implementation into the generic component**

Copy the full markup, script and styles from `BlogArticleToc.astro` into `SectionToc.astro`, then use this exact frontmatter API:

```astro
---
import { Icon } from "astro-icon/components";

export interface SectionTocItem {
	slug: string;
	text: string;
}

interface Props {
	items: SectionTocItem[];
	label: string;
	currentLabel: string;
	icon?: string;
}

const { items, label, currentLabel, icon = "book-open" } = Astro.props as Props;
---
```

Make these exact mechanical substitutions throughout the copied implementation:

```text
sectionHeadings -> items
data-article-toc -> data-section-toc
setupArticleToc -> setupSectionToc
headings -> sections (inside the client script only)
```

Keep the established behavior unchanged: sticky maximum height, progress indicator, automatic scrolling of the active link, mobile disclosure closure, `aria-current="location"`, reduced-motion handling and `scroll`/`hashchange` listeners.

- [ ] **Step 2: Replace `BlogArticleToc.astro` with a compatibility wrapper**

Use this complete wrapper:

```astro
---
import SectionToc from "@/components/common/SectionToc.astro";

interface Heading {
	depth: number;
	slug: string;
	text: string;
}

interface Props {
	headings: Heading[];
	label: string;
	currentLabel: string;
}

const { headings, label, currentLabel } = Astro.props as Props;
const items = headings
	.filter((heading) => heading.depth === 2)
	.map(({ slug, text }) => ({ slug, text }));
---

<SectionToc items={items} label={label} currentLabel={currentLabel} />
```

- [ ] **Step 3: Run the focused verifier and Astro check**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=nav
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: both PASS with zero diagnostics.

- [ ] **Step 4: Commit the reusable navigation**

```bash
git add src/components/common/SectionToc.astro src/components/common/BlogArticleToc.astro
git commit -m "refactor(navigation): extract reusable section toc"
```

---

### Task 3: Add Complete Localized Privacy Copy

**Files:**
- Modify: `src/i18n/es.json:761-793`
- Modify: `src/i18n/en.json:761-793`

**Interfaces:**
- Consumes: the existing `privacy` dictionary key.
- Produces: matching `privacy.updated`, `summary`, `navigation`, `sections`, `storageTable` and `actions` structures for both locales.

- [ ] **Step 1: Run the privacy-copy phase and confirm it fails**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=privacy-copy
```

Expected: FAIL listing the missing privacy keys.

- [ ] **Step 2: Replace the Spanish privacy copy**

Keep the existing `meta` object, then replace the remaining Spanish `privacy` content with this structure and wording:

```json
{
  "eyebrow": "Privacidad y cookies",
  "title": "Tus datos, explicados con claridad.",
  "intro": "Esta página explica qué información trata la web, para qué se utiliza y qué decisiones puedes tomar. No uso tus datos para publicidad ni creo perfiles comerciales.",
  "updated": "Última actualización: 15 de julio de 2026",
  "summary": {
    "controller": "Responsable",
    "contact": "Contacto de privacidad",
    "analytics": "Analítica opcional",
    "analyticsValue": "Solo después de aceptarla",
    "profiles": "Publicidad y perfiles",
    "profilesValue": "No se utilizan"
  },
  "navigation": {
    "label": "Contenido de privacidad",
    "currentLabel": "Sección actual"
  },
  "actions": {
    "manageCookies": "Configurar cookies",
    "email": "Escribir sobre privacidad"
  },
  "sections": {
    "controller": {
      "title": "Responsable del tratamiento",
      "body": "José Miguel Fernández es responsable de los datos que envías mediante esta web. Puedes plantear cualquier consulta o ejercer tus derechos escribiendo al correo indicado en esta sección."
    },
    "data": {
      "title": "Qué datos trato",
      "intro": "La web solo trata la información necesaria para responder consultas, funcionar correctamente y medir visitas cuando lo autorizas.",
      "items": [
        "Formulario: nombre, correo electrónico, mensaje, servicio o alcance seleccionado, idioma y página de procedencia.",
        "Analítica: datos de uso y dispositivo recogidos por Google Analytics únicamente después de aceptar la analítica.",
        "Preferencias locales: tema visual, decisión de cookies y un indicador temporal para no repetir el aviso de salida durante la misma sesión."
      ]
    },
    "purposes": {
      "title": "Finalidades y base jurídica",
      "items": [
        { "title": "Responder a tu consulta", "body": "Uso los datos del formulario para entender la necesidad, responderte y valorar una posible prestación de servicios. La base es aplicar medidas precontractuales solicitadas por ti." },
        { "title": "Medir y mejorar la web", "body": "Google Analytics se activa con tu consentimiento. Puedes rechazarlo o retirarlo sin que eso limite el acceso a la web." },
        { "title": "Mantener la web segura", "body": "El hosting puede generar registros técnicos necesarios para servir, diagnosticar y proteger la web. La base es el interés legítimo en mantener un servicio seguro y estable." }
      ]
    },
    "retention": {
      "title": "Cuánto tiempo conservo los datos",
      "body": "Las consultas se conservan mientras se gestionan y hasta 12 meses después de la última comunicación. Si la consulta da lugar a una relación profesional o existe una obligación legal, se conservarán durante los plazos aplicables. Las preferencias permanecen en tu navegador hasta que las eliminas o cambia la versión de la política."
    },
    "providers": {
      "title": "Proveedores que intervienen",
      "intro": "Uso proveedores técnicos para alojar la web, entregar los mensajes y medir visitas consentidas.",
      "items": [
        { "name": "Vercel", "purpose": "Alojamiento, entrega de la web y ejecución del formulario.", "href": "https://vercel.com/legal/privacy-policy" },
        { "name": "Resend", "purpose": "Entrega por correo electrónico de las consultas enviadas.", "href": "https://resend.com/legal/privacy-policy" },
        { "name": "Google Analytics", "purpose": "Analítica agregada solo cuando la aceptas.", "href": "https://policies.google.com/privacy" }
      ],
      "linkLabel": "Consultar privacidad de {name}"
    },
    "transfers": {
      "title": "Transferencias internacionales",
      "body": "Algunos proveedores pueden tratar información fuera del Espacio Económico Europeo. En esos casos, el tratamiento queda sujeto a las garantías que el proveedor declare en sus condiciones vigentes. Los enlaces anteriores permiten consultar esa información directamente."
    },
    "rights": {
      "title": "Tus derechos",
      "intro": "Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad, y retirar un consentimiento en cualquier momento.",
      "instruction": "Para ejercerlos, escribe desde el correo relacionado con la consulta e indica qué derecho quieres ejercer. También puedes reclamar ante la Agencia Española de Protección de Datos.",
      "aepd": "Ir a la Agencia Española de Protección de Datos"
    },
    "cookies": {
      "title": "Cookies y almacenamiento del navegador",
      "intro": "Las preferencias necesarias se guardan localmente. Las cookies de Google Analytics solo aparecen si aceptas la categoría de analítica.",
      "gaSource": "Consultar la documentación de cookies de Google Analytics"
    },
    "withdraw": {
      "title": "Cambiar o retirar tu consentimiento",
      "body": "Puedes reabrir el panel de preferencias desde esta página o desde el pie de cualquier página. Rechazar la analítica no afecta a las funciones principales de la web."
    }
  },
  "storageTable": {
    "caption": "Almacenamiento utilizado por jomiferse.com",
    "headers": { "name": "Nombre", "type": "Tipo", "provider": "Proveedor", "purpose": "Finalidad", "duration": "Duración", "consent": "Base" },
    "rows": [
      { "name": "theme", "type": "Almacenamiento local", "provider": "jomiferse.com", "purpose": "Recordar el tema claro u oscuro.", "duration": "Hasta que lo elimines.", "consent": "Preferencia necesaria" },
      { "name": "jomiferse.cookie-consent.v1", "type": "Almacenamiento local", "provider": "jomiferse.com", "purpose": "Recordar tu decisión sobre cookies.", "duration": "Hasta que lo elimines o cambie la versión.", "consent": "Preferencia necesaria" },
      { "name": "jomiferse.exit-intent.v2", "type": "Almacenamiento de sesión", "provider": "jomiferse.com", "purpose": "No repetir el aviso de salida en una sesión.", "duration": "Sesión del navegador.", "consent": "Estado necesario de interfaz" },
      { "name": "_ga", "type": "Cookie analítica propia", "provider": "Google Analytics", "purpose": "Distinguir usuarios para analítica agregada.", "duration": "Hasta 2 años por defecto.", "consent": "Consentimiento de analítica" },
      { "name": "_ga_<container-id>", "type": "Cookie analítica propia", "provider": "Google Analytics", "purpose": "Conservar el estado de la sesión.", "duration": "Hasta 2 años por defecto.", "consent": "Consentimiento de analítica" }
    ]
  }
}
```

- [ ] **Step 3: Replace the English privacy copy**

Keep the existing English `meta` object and use this complete content object:

```json
{
  "eyebrow": "Privacy and cookies",
  "title": "Your data, explained clearly.",
  "intro": "This page explains what information the website processes, why it is used and which choices you can make. I do not use your data for advertising or build commercial profiles.",
  "updated": "Last updated: July 15, 2026",
  "summary": {
    "controller": "Controller",
    "contact": "Privacy contact",
    "analytics": "Optional analytics",
    "analyticsValue": "Only after you accept it",
    "profiles": "Advertising and profiling",
    "profilesValue": "Not used"
  },
  "navigation": {
    "label": "Privacy contents",
    "currentLabel": "Current section"
  },
  "actions": {
    "manageCookies": "Configure cookies",
    "email": "Ask about privacy"
  },
  "sections": {
    "controller": {
      "title": "Data controller",
      "body": "José Miguel Fernández is responsible for the data you send through this website. You can ask a question or exercise your rights by writing to the email address shown in this section."
    },
    "data": {
      "title": "What data I process",
      "intro": "The website only processes information needed to answer enquiries, operate correctly and measure visits when you allow it.",
      "items": [
        "Form: name, email address, message, selected service or scope, language and source page.",
        "Analytics: usage and device data collected by Google Analytics only after analytics has been accepted.",
        "Local preferences: visual theme, cookie decision and a temporary flag that prevents the exit prompt from repeating during the same session."
      ]
    },
    "purposes": {
      "title": "Purposes and legal bases",
      "items": [
        { "title": "Reply to your enquiry", "body": "I use form data to understand the need, reply and assess a possible service. The legal basis is taking pre-contractual steps at your request." },
        { "title": "Measure and improve the website", "body": "Google Analytics is enabled with your consent. You can reject or withdraw it without losing access to the website." },
        { "title": "Keep the website secure", "body": "The hosting service may generate technical logs needed to serve, diagnose and protect the website. The legal basis is the legitimate interest in maintaining a secure and stable service." }
      ]
    },
    "retention": {
      "title": "How long I keep data",
      "body": "Enquiries are retained while they are handled and for up to 12 months after the last communication. If an enquiry leads to a professional relationship or a legal obligation applies, data is retained for the applicable periods. Preferences remain in your browser until you remove them or the policy version changes."
    },
    "providers": {
      "title": "Providers involved",
      "intro": "I use technical providers to host the website, deliver messages and measure consented visits.",
      "items": [
        { "name": "Vercel", "purpose": "Website hosting, delivery and form execution.", "href": "https://vercel.com/legal/privacy-policy" },
        { "name": "Resend", "purpose": "Email delivery for submitted enquiries.", "href": "https://resend.com/legal/privacy-policy" },
        { "name": "Google Analytics", "purpose": "Aggregate analytics only when you accept it.", "href": "https://policies.google.com/privacy" }
      ],
      "linkLabel": "View {name} privacy information"
    },
    "transfers": {
      "title": "International transfers",
      "body": "Some providers may process information outside the European Economic Area. In those cases, processing is subject to the safeguards stated in the provider's current terms. The links above let you consult that information directly."
    },
    "rights": {
      "title": "Your rights",
      "intro": "You can request access, rectification, erasure, objection, restriction or portability, and withdraw consent at any time.",
      "instruction": "To exercise a right, write from the email address connected with the enquiry and state which right you want to exercise. You may also complain to the Spanish Data Protection Agency.",
      "aepd": "Visit the Spanish Data Protection Agency"
    },
    "cookies": {
      "title": "Cookies and browser storage",
      "intro": "Necessary preferences are stored locally. Google Analytics cookies only appear if you accept the analytics category.",
      "gaSource": "View Google Analytics cookie documentation"
    },
    "withdraw": {
      "title": "Change or withdraw consent",
      "body": "You can reopen the preferences panel from this page or the footer of any page. Rejecting analytics does not affect the website's main functions."
    }
  },
  "storageTable": {
    "caption": "Storage used by jomiferse.com",
    "headers": { "name": "Name", "type": "Type", "provider": "Provider", "purpose": "Purpose", "duration": "Duration", "consent": "Basis" },
    "rows": [
      { "name": "theme", "type": "Local storage", "provider": "jomiferse.com", "purpose": "Remember the light or dark theme.", "duration": "Until you remove it.", "consent": "Necessary preference" },
      { "name": "jomiferse.cookie-consent.v1", "type": "Local storage", "provider": "jomiferse.com", "purpose": "Remember your cookie decision.", "duration": "Until you remove it or the version changes.", "consent": "Necessary preference" },
      { "name": "jomiferse.exit-intent.v2", "type": "Session storage", "provider": "jomiferse.com", "purpose": "Avoid repeating the exit prompt in one session.", "duration": "Browser session.", "consent": "Necessary interface state" },
      { "name": "_ga", "type": "First-party analytics cookie", "provider": "Google Analytics", "purpose": "Distinguish users for aggregate analytics.", "duration": "Up to 2 years by default.", "consent": "Analytics consent" },
      { "name": "_ga_<container-id>", "type": "First-party analytics cookie", "provider": "Google Analytics", "purpose": "Preserve session state.", "duration": "Up to 2 years by default.", "consent": "Analytics consent" }
    ]
  }
}
```

- [ ] **Step 4: Format and verify locale parity**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier src/i18n/es.json src/i18n/en.json --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=privacy-copy
```

Expected: PASS.

- [ ] **Step 5: Commit the localized privacy content**

```bash
git add src/i18n/es.json src/i18n/en.json
git commit -m "feat(privacy): add complete localized policy copy"
```

---

### Task 4: Build the Editorial Privacy Page

**Files:**
- Modify: `src/pages/[locale]/privacy.astro`

**Interfaces:**
- Consumes: `getTranslations(locale).privacy`, `getCv(locale)`, `SectionToc` and the existing cookie-settings event contract.
- Produces: a `noindex` page with `data-privacy-page`, anchored sections, semantic storage table and three cookie-settings triggers.

- [ ] **Step 1: Run the privacy-page verifier and confirm it fails**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=privacy-page
```

Expected: FAIL on the new page markers and storage entries.

- [ ] **Step 2: Add the page data and navigation model**

At the top of `privacy.astro`, add these imports and derived values:

```astro
import { Icon } from "astro-icon/components";
import SectionToc from "@/components/common/SectionToc.astro";
import { getCv } from "@cv";

const cv = getCv(locale);
const sectionEntries = Object.entries(page.sections).map(([slug, section]) => ({
	slug: `privacy-${slug}`,
	text: section.title,
}));
const privacyEmailHref = `mailto:${cv.email}?subject=${encodeURIComponent(locale === "es" ? "Consulta sobre privacidad" : "Privacy enquiry")}`;
const summaryItems = [
	{ icon: "user", label: page.summary.controller, value: cv.name },
	{ icon: "mail", label: page.summary.contact, value: cv.email },
	{ icon: "globe", label: page.summary.analytics, value: page.summary.analyticsValue },
	{ icon: "badge-check", label: page.summary.profiles, value: page.summary.profilesValue },
];
```

- [ ] **Step 3: Replace the old two-section layout**

Build the page with this exact semantic outline:

```astro
<div data-privacy-page class="privacy-page">
	<section class="section-reveal pt-6 pb-12 md:pt-10 md:pb-16">
		<p class="eyebrow text-[var(--action)]">{page.eyebrow}</p>
		<div class="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
			<div class="max-w-4xl">
				<h1 class="text-5xl leading-[0.98] font-black text-[var(--home-navy)] sm:text-6xl md:text-7xl">{page.title}</h1>
				<p class="muted-copy mt-6 max-w-3xl text-lg leading-8 md:text-xl">{page.intro}</p>
				<p class="mt-4 text-sm font-bold text-[var(--text-muted)]">{page.updated}</p>
			</div>
			<button type="button" data-cookie-settings-trigger class="button-action w-full lg:w-auto">
				{page.actions.manageCookies}<Icon name="layers" class="h-4 w-4" aria-hidden="true" />
			</button>
		</div>
	</section>

	<section data-privacy-summary class="privacy-summary border-y border-[var(--surface-border)]" aria-label={page.eyebrow}>
		{summaryItems.map((item) => (
			<div class="privacy-summary__item">
				<Icon name={item.icon} class="h-5 w-5 text-[var(--action)]" aria-hidden="true" />
				<p class="eyebrow mt-4 text-[var(--action)]">{item.label}</p>
				<p class="mt-2 font-black text-[var(--home-navy)]">{item.value}</p>
			</div>
		))}
	</section>

	<div class="section-reveal grid gap-10 py-14 lg:grid-cols-[minmax(15rem,0.28fr)_minmax(0,0.72fr)] lg:gap-16 lg:py-18">
		<SectionToc items={sectionEntries} label={page.navigation.label} currentLabel={page.navigation.currentLabel} icon="badge-check" />
		<article class="privacy-document min-w-0"></article>
	</div>
</div>
```

Insert the following nine sections inside `privacy-document`; keep the storage table from Step 4 inside `privacy-cookies` after its introductory paragraph:

```astro
<section id="privacy-controller" class="scroll-mt-28">
	<p class="eyebrow text-[var(--action)]">01</p>
	<h2>{page.sections.controller.title}</h2>
	<p>{page.sections.controller.body}</p>
	<dl class="privacy-facts mt-6">
		<div><dt>{page.summary.controller}</dt><dd>{cv.name}</dd></div>
		<div><dt>{page.summary.contact}</dt><dd><a href={privacyEmailHref}>{cv.email}</a></dd></div>
	</dl>
</section>
<section id="privacy-data" class="scroll-mt-28">
	<p class="eyebrow text-[var(--action)]">02</p><h2>{page.sections.data.title}</h2><p>{page.sections.data.intro}</p>
	<ul>{page.sections.data.items.map((item) => <li><Icon name="check" class="h-4 w-4" aria-hidden="true" />{item}</li>)}</ul>
</section>
<section id="privacy-purposes" class="scroll-mt-28">
	<p class="eyebrow text-[var(--action)]">03</p><h2>{page.sections.purposes.title}</h2>
	<div class="privacy-editorial-list">{page.sections.purposes.items.map((item) => <div><h3>{item.title}</h3><p>{item.body}</p></div>)}</div>
</section>
<section id="privacy-retention" class="scroll-mt-28">
	<p class="eyebrow text-[var(--action)]">04</p><h2>{page.sections.retention.title}</h2><p>{page.sections.retention.body}</p>
</section>
<section id="privacy-providers" class="scroll-mt-28">
	<p class="eyebrow text-[var(--action)]">05</p><h2>{page.sections.providers.title}</h2><p>{page.sections.providers.intro}</p>
	<div class="privacy-editorial-list">{page.sections.providers.items.map((provider) => <div><h3>{provider.name}</h3><p>{provider.purpose}</p><a href={provider.href} target="_blank" rel="noopener noreferrer nofollow">{page.sections.providers.linkLabel.replace("{name}", provider.name)}<Icon name="move-up-right" class="h-4 w-4" aria-hidden="true" /></a></div>)}</div>
</section>
<section id="privacy-transfers" class="scroll-mt-28">
	<p class="eyebrow text-[var(--action)]">06</p><h2>{page.sections.transfers.title}</h2><p>{page.sections.transfers.body}</p>
</section>
<section id="privacy-rights" class="scroll-mt-28">
	<p class="eyebrow text-[var(--action)]">07</p><h2>{page.sections.rights.title}</h2><p>{page.sections.rights.intro}</p><p>{page.sections.rights.instruction}</p>
	<div class="mt-6 flex flex-col gap-3 sm:flex-row"><a href={privacyEmailHref} class="button-secondary">{page.actions.email}</a><a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer nofollow" class="button-secondary">{page.sections.rights.aepd}<Icon name="move-up-right" class="h-4 w-4" aria-hidden="true" /></a></div>
</section>
<section id="privacy-cookies" class="scroll-mt-28">
	<p class="eyebrow text-[var(--action)]">08</p><h2>{page.sections.cookies.title}</h2><p>{page.sections.cookies.intro}</p>
	<a class="privacy-source-link" href="https://support.google.com/analytics/answer/11397207?hl=en-GB" target="_blank" rel="noopener noreferrer nofollow">{page.sections.cookies.gaSource}<Icon name="move-up-right" class="h-4 w-4" aria-hidden="true" /></a>
</section>
<section id="privacy-withdraw" class="scroll-mt-28">
	<p class="eyebrow text-[var(--action)]">09</p><h2>{page.sections.withdraw.title}</h2><p>{page.sections.withdraw.body}</p>
	<button type="button" data-cookie-settings-trigger class="button-action mt-6">{page.actions.manageCookies}<Icon name="layers" class="h-4 w-4" aria-hidden="true" /></button>
</section>
```

- [ ] **Step 4: Render an accessible responsive storage table**

Use one semantic table, not duplicated desktop/mobile content:

```astro
<div data-privacy-storage-table class="privacy-storage-table mt-7 overflow-x-auto">
	<table>
		<caption class="sr-only">{page.storageTable.caption}</caption>
		<thead>
			<tr>{Object.values(page.storageTable.headers).map((header) => <th scope="col">{header}</th>)}</tr>
		</thead>
		<tbody>
			{page.storageTable.rows.map((row) => (
				<tr>
					<th scope="row"><code>{row.name}</code></th>
					<td data-label={page.storageTable.headers.type}>{row.type}</td>
					<td data-label={page.storageTable.headers.provider}>{row.provider}</td>
					<td data-label={page.storageTable.headers.purpose}>{row.purpose}</td>
					<td data-label={page.storageTable.headers.duration}>{row.duration}</td>
					<td data-label={page.storageTable.headers.consent}>{row.consent}</td>
				</tr>
			))}
		</tbody>
	</table>
</div>
```

At widths below 48rem, hide the table header and display each row as a bordered block. Use `td::before { content: attr(data-label) }`, while the row heading remains the first visible item. Keep all values and header associations in the same DOM.

- [ ] **Step 5: Add restrained page-scoped styling**

Add page styles for:

```css
.privacy-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.privacy-summary__item { padding: 1.25rem 1rem; border-inline-end: 1px solid var(--surface-border); }
.privacy-document { max-width: 58rem; }
.privacy-document > section { padding-block: 2.25rem; border-bottom: 1px solid var(--surface-border); }
.privacy-storage-table table { width: 100%; min-width: 54rem; border-collapse: collapse; }
.privacy-storage-table th, .privacy-storage-table td { padding: 1rem; border-bottom: 1px solid var(--surface-border); text-align: left; vertical-align: top; }
@media (max-width: 47.99rem) {
	.privacy-summary { grid-template-columns: 1fr 1fr; }
	.privacy-storage-table { overflow: visible; }
	.privacy-storage-table table, .privacy-storage-table tbody, .privacy-storage-table tr, .privacy-storage-table th, .privacy-storage-table td { display: block; min-width: 0; width: 100%; }
	.privacy-storage-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
	.privacy-storage-table tr { margin-top: 1rem; border: 1px solid var(--surface-border); border-radius: 1rem; background: var(--surface); padding: 1rem; }
	.privacy-storage-table th, .privacy-storage-table td { border: 0; padding: 0.45rem 0; }
	.privacy-storage-table td::before { content: attr(data-label); display: block; color: var(--action); font-size: 0.68rem; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; }
}
@media (max-width: 31rem) { .privacy-summary { grid-template-columns: 1fr; } }
```

Use `var(--action)` for icons, links and code accents; use `var(--home-navy)` for H1/H2. Do not introduce decorative gradients or card shadows.

- [ ] **Step 6: Verify and commit the privacy page**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier 'src/pages/[locale]/privacy.astro' --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=privacy-page
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
git add 'src/pages/[locale]/privacy.astro'
git commit -m "feat(privacy): build editorial privacy and cookie page"
```

Expected: all checks PASS and the commit contains only the privacy route.

---

### Task 5: Add Client-Oriented Education Copy

**Files:**
- Modify: `src/i18n/es.json:576-625`
- Modify: `src/i18n/en.json:576-625`

**Interfaces:**
- Consumes: the existing `education.page` locale key.
- Produces: matching summary labels, three applied-learning items, compact section intros and project/about CTA copy.

- [ ] **Step 1: Confirm the education-copy contract fails**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=education-copy
```

Expected: FAIL because `education.page.summary` and `education.page.applied` do not exist.

- [ ] **Step 2: Replace the Spanish presentation copy**

Use this `education.page` shape while preserving its current `meta` object:

```json
{
  "eyebrow": "Formación aplicada",
  "title": "Aprender para resolver mejor.",
  "intro": "La formación tiene valor cuando mejora las decisiones, reduce errores y ayuda a entregar software que puede mantenerse después.",
  "summary": {
    "courses": "Cursos técnicos",
    "qualifications": "Titulaciones",
    "focus": "Foco actual",
    "focusValue": "Backend, calidad y operación"
  },
  "applied": {
    "eyebrow": "Lo que aplico hoy",
    "title": "Conocimiento que llega al proyecto.",
    "intro": "Elijo qué estudiar según los problemas que necesito resolver en sistemas reales.",
    "items": [
      { "icon": "code", "title": "Backend fiable", "body": "Diseño APIs y servicios pensando en fallos, rendimiento, integraciones y evolución, no solo en que funcionen el primer día." },
      { "icon": "badge-check", "title": "Calidad y testing", "body": "Uso pruebas y límites claros para reducir regresiones y poder cambiar el software con más seguridad." },
      { "icon": "cloud", "title": "Despliegue y operación", "body": "Docker, Kubernetes y observabilidad me ayudan a entregar sistemas que también pueden operarse y diagnosticarse." }
    ]
  },
  "certifications": {
    "eyebrow": "Aprendizaje continuo",
    "title": "Cursos técnicos recientes",
    "text": "Una selección cronológica centrada en Spring Boot, testing, microservicios, infraestructura y sistemas de producción."
  },
  "education": {
    "eyebrow": "Formación reglada",
    "title": "Base académica",
    "text": "La formación estructurada que sostiene mi rango full-stack y mi forma de abordar un producto de principio a fin."
  },
  "cta": {
    "eyebrow": "Trabajo real",
    "title": "La formación se demuestra construyendo.",
    "text": "Mira cómo este criterio se traduce en plataformas, backends, integraciones y productos que ya han estado en producción.",
    "primary": "Ver proyectos",
    "secondary": "Conocer mi experiencia"
  }
}
```

- [ ] **Step 3: Replace the English education presentation copy**

Keep the existing English `meta` object and use this complete `education.page` content:

```json
{
  "eyebrow": "Applied learning",
  "title": "Learning to solve better.",
  "intro": "Training matters when it improves decisions, reduces mistakes and helps deliver software that can still be maintained afterwards.",
  "summary": {
    "courses": "Technical courses",
    "qualifications": "Qualifications",
    "focus": "Current focus",
    "focusValue": "Backend, quality and operations"
  },
  "applied": {
    "eyebrow": "What I apply today",
    "title": "Knowledge that reaches the project.",
    "intro": "I choose what to study according to the problems I need to solve in real systems.",
    "items": [
      { "icon": "code", "title": "Reliable backend", "body": "I design APIs and services around failure, performance, integrations and evolution, not only around making them work on day one." },
      { "icon": "badge-check", "title": "Quality and testing", "body": "I use tests and clear boundaries to reduce regressions and change software with greater confidence." },
      { "icon": "cloud", "title": "Deployment and operations", "body": "Docker, Kubernetes and observability help me deliver systems that can also be operated and diagnosed." }
    ]
  },
  "certifications": {
    "eyebrow": "Continuous learning",
    "title": "Recent technical courses",
    "text": "A chronological selection focused on Spring Boot, testing, microservices, infrastructure and production systems."
  },
  "education": {
    "eyebrow": "Formal education",
    "title": "Academic foundation",
    "text": "The structured training behind my full-stack range and my ability to approach a product from beginning to end."
  },
  "cta": {
    "eyebrow": "Real work",
    "title": "Learning is proven by building.",
    "text": "See how this judgment translates into platforms, backends, integrations and products that have already run in production.",
    "primary": "View projects",
    "secondary": "See my experience"
  }
}
```

- [ ] **Step 4: Format, verify and commit**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier src/i18n/es.json src/i18n/en.json --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=education-copy
git add src/i18n/es.json src/i18n/en.json
git commit -m "feat(education): add client-oriented localized copy"
```

Expected: verifier PASS.

---

### Task 6: Redesign Education Records as Compact Editorial Rows

**Files:**
- Modify: `src/components/cards/CertificationCard.astro`
- Modify: `src/components/cards/EducationCard.astro`
- Modify: `src/i18n/es.json:794-799`
- Modify: `src/i18n/en.json:794-799`

**Interfaces:**
- Consumes: unchanged certification and education CV object shapes.
- Produces: `data-certification-record` and `data-education-record` rows with action-palette metadata and accessible external-link context.

- [ ] **Step 1: Confirm the card phase fails**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=education-cards
```

Expected: FAIL because the records still use `dark-card`, `hover-card` and the cyan accent.

- [ ] **Step 2: Add localized new-window copy**

Add `opensNewWindow` to both `certificationCard` dictionaries:

```json
"opensNewWindow": "se abre en una pestaña nueva"
```

```json
"opensNewWindow": "opens in a new tab"
```

- [ ] **Step 3: Replace `CertificationCard.astro` markup**

Keep the existing interface and use this structure:

```astro
<article data-certification-record class="certification-record grid gap-5 border-t border-[var(--surface-border)] py-6 md:grid-cols-[9rem_minmax(0,1fr)_auto] md:items-start md:gap-8 md:py-7">
	<div>
		<p class="eyebrow text-[var(--action)]">{certification.year}</p>
		<p class="mt-2 text-sm font-black text-[var(--text)]">{certification.provider}</p>
	</div>
	<div class="min-w-0">
		<h3 class="text-xl leading-tight font-black text-[var(--home-navy)] md:text-2xl">{certification.name}</h3>
		<div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[var(--text-muted)]">
			{certification.skills?.slice(0, 4).map((skill) => <span>{skill}</span>)}
		</div>
		{certification.credentialId && <p class="mt-4 break-all text-xs text-[var(--text-muted)]">{t(locale, "certificationCard.idLabel")} {certification.credentialId}</p>}
	</div>
	{certification.url && (
		<a href={certification.url} target="_blank" rel="noopener noreferrer nofollow" class="button-secondary w-full md:w-auto" aria-label={`${t(locale, "certificationCard.viewCredential")}: ${certification.name}, ${t(locale, "certificationCard.opensNewWindow")}`}>
			{t(locale, "certificationCard.viewCredential")}<Icon name="move-up-right" class="h-4 w-4" aria-hidden="true" />
		</a>
	)}
</article>
```

- [ ] **Step 4: Replace `EducationCard.astro` markup**

Keep the existing interface and use:

```astro
<article data-education-record class="education-record relative grid gap-5 border-t border-[var(--surface-border)] py-7 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10 md:py-8">
	<div data-education-period>
		<p class="eyebrow text-[var(--action)]">{dateLabel}</p>
		<p class="mt-3 text-sm font-black text-[var(--text)]">{education.institution}</p>
		<p class="muted-copy mt-1 text-sm">{education.location}</p>
	</div>
	<div class="min-w-0">
		<h3 class="text-2xl leading-tight font-black text-[var(--home-navy)] md:text-3xl">{education.degree}</h3>
		<p class="muted-copy mt-4 max-w-3xl leading-7">{education.description}</p>
		<div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--text-muted)]">
			{education.notes && <p><strong class="text-[var(--text)]">{t(locale, "educationCard.gradeLabel")}</strong> {education.notes}</p>}
			{education.skills?.slice(0, 4).map((skill) => <span class="font-semibold">{skill}</span>)}
		</div>
	</div>
</article>
```

- [ ] **Step 5: Format, verify and commit the record redesign**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier src/components/cards/CertificationCard.astro src/components/cards/EducationCard.astro src/i18n/es.json src/i18n/en.json --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=education-cards
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
git add src/components/cards/CertificationCard.astro src/components/cards/EducationCard.astro src/i18n/es.json src/i18n/en.json
git commit -m "refactor(education): compact qualification records"
```

Expected: verifier and Astro check PASS.

---

### Task 7: Build the Client-Oriented Education Page

**Files:**
- Modify: `src/pages/[locale]/education.astro`

**Interfaces:**
- Consumes: localized `education.page`, `cv.certifications`, `cv.education`, compact record components and `ConversionCta`.
- Produces: a data-driven hero summary, three applied-learning rows, compact evidence sections and project/about conversion paths.

- [ ] **Step 1: Confirm the education-page phase fails**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=education-page
```

Expected: FAIL on page markers, data-driven counts and CTA paths.

- [ ] **Step 2: Add icons and data-driven summary values**

Add the icon import and derive these values after the CV arrays:

```astro
import { Icon } from "astro-icon/components";

const summaryItems = [
	{ value: String(certifications.length), label: page.summary.courses },
	{ value: String(education.length), label: page.summary.qualifications },
	{ value: page.summary.focusValue, label: page.summary.focus },
];
```

- [ ] **Step 3: Replace the page body**

Use this top-level structure:

```astro
<div data-education-page class="education-page">
	<section class="section-reveal pt-6 pb-14 md:pt-10 md:pb-18">
		<p class="eyebrow text-[var(--action)]">{page.eyebrow}</p>
		<h1 class="mt-5 max-w-5xl text-5xl leading-[0.98] font-black text-[var(--home-navy)] sm:text-6xl md:text-7xl">{page.title}</h1>
		<p class="muted-copy mt-7 max-w-3xl text-lg leading-8 md:text-xl">{page.intro}</p>
	</section>

	<section class="education-summary border-y border-[var(--surface-border)]" aria-label={page.eyebrow}>
		{summaryItems.map((item) => <div class="education-summary__item"><p class="text-2xl font-black text-[var(--home-navy)]">{item.value}</p><p class="muted-copy mt-1 text-sm">{item.label}</p></div>)}
	</section>

	<section data-applied-learning class="section-reveal py-16 md:py-20">
		<header class="grid gap-5 lg:grid-cols-[0.34fr_0.66fr] lg:gap-14">
			<div><p class="eyebrow text-[var(--action)]">{page.applied.eyebrow}</p><h2 class="mt-4 text-4xl font-black text-[var(--home-navy)] md:text-5xl">{page.applied.title}</h2></div>
			<p class="muted-copy max-w-2xl text-lg leading-8">{page.applied.intro}</p>
		</header>
		<div class="mt-10 divide-y divide-[var(--surface-border)] border-y border-[var(--surface-border)]">
			{page.applied.items.map((item, index) => (
				<article class="grid gap-4 py-6 md:grid-cols-[4rem_minmax(0,0.35fr)_minmax(0,0.65fr)] md:items-start md:py-7">
					<span class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--action)_28%,var(--surface-border))] text-[var(--action)]"><Icon name={item.icon} class="h-5 w-5" aria-hidden="true" /></span>
					<h3 class="text-xl font-black text-[var(--home-navy)]">{item.title}</h3>
					<p class="muted-copy max-w-2xl leading-7">{item.body}</p>
				</article>
			))}
		</div>
	</section>

	<section class="section-band section-reveal py-16 md:py-20">
		<div class="grid gap-10 lg:grid-cols-[0.3fr_minmax(0,0.7fr)] lg:gap-16">
			<header><p class="eyebrow text-[var(--action)]">{page.certifications.eyebrow}</p><h2 class="mt-4 text-4xl font-black text-[var(--home-navy)] md:text-5xl">{page.certifications.title}</h2><p class="muted-copy mt-5 leading-7">{page.certifications.text}</p></header>
			<div>{certifications.map((certification) => <CertificationCard certification={certification} locale={locale} />)}</div>
		</div>
	</section>

	<section class="section-reveal py-16 md:py-20">
		<div class="grid gap-10 lg:grid-cols-[0.3fr_minmax(0,0.7fr)] lg:gap-16">
			<header><p class="eyebrow text-[var(--action)]">{page.education.eyebrow}</p><h2 class="mt-4 text-4xl font-black text-[var(--home-navy)] md:text-5xl">{page.education.title}</h2><p class="muted-copy mt-5 leading-7">{page.education.text}</p></header>
			<div>{education.map((item) => <EducationCard education={item} locale={locale} />)}</div>
		</div>
	</section>

	<ConversionCta
		eyebrow={page.cta.eyebrow}
		title={page.cta.title}
		text={page.cta.text}
		primary={{ label: page.cta.primary, href: `/${locale}/projects` }}
		secondary={{ label: page.cta.secondary, href: `/${locale}/about` }}
		headingId="education-conversion-title"
	/>
</div>
```

The two evidence sections use the exact markup above. Do not add wrappers with `dark-card`, `hover-card`, shadows or carousel behavior.

- [ ] **Step 4: Add responsive summary styling**

```css
.education-summary { display: grid; grid-template-columns: minmax(0,0.7fr) minmax(0,0.7fr) minmax(14rem,1.6fr); }
.education-summary__item { padding: 1.25rem 1rem; border-inline-end: 1px solid var(--surface-border); }
.education-summary__item:last-child { border-inline-end: 0; }
@media (max-width: 47.99rem) { .education-summary { grid-template-columns: 1fr 1fr; } .education-summary__item:last-child { grid-column: 1 / -1; border-top: 1px solid var(--surface-border); } }
```

- [ ] **Step 5: Format, verify and commit the page**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier 'src/pages/[locale]/education.astro' --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=education-page
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
git add 'src/pages/[locale]/education.astro'
git commit -m "feat(education): build applied learning page"
```

Expected: verifier and Astro check PASS.

---

### Task 8: Integration, Accessibility and Generated-Output Verification

**Files:**
- Modify if verification finds a scoped defect: only files already listed in Tasks 1–7.

**Interfaces:**
- Consumes: completed source implementation.
- Produces: formatted, lint-clean, buildable localized routes and a clean task diff.

- [ ] **Step 1: Format the complete task scope**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier package.json scripts/verify-privacy-education-redesign.mjs src/components/common/SectionToc.astro src/components/common/BlogArticleToc.astro src/components/cards/CertificationCard.astro src/components/cards/EducationCard.astro src/i18n/es.json src/i18n/en.json 'src/pages/[locale]/privacy.astro' 'src/pages/[locale]/education.astro' --write
```

- [ ] **Step 2: Run the complete source validation set**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run test
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=source
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:ai-seo
```

Expected: every command exits 0 with no warnings or diagnostics.

- [ ] **Step 3: Build and validate generated routes**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=dist
```

Expected: build completes, both locales generate privacy and education pages, privacy contains `noindex,follow`, and the dist verifier passes.

- [ ] **Step 4: Perform manual browser checks**

Check these routes:

```text
http://localhost:4321/es/privacy
http://localhost:4321/en/privacy
http://localhost:4321/es/education
http://localhost:4321/en/education
```

At 390 × 844 and 1440 × 900, verify:

- No horizontal overflow.
- Light and dark themes preserve navy/action hierarchy and readable contrast.
- Section navigation tracks the current privacy H2 and mobile navigation closes after selection.
- Tab order is logical; focus is visible and never obscured by the sticky header.
- The storage table becomes labelled stacked rows on mobile without losing values.
- Every cookie-settings trigger opens the existing preferences dialog and returns focus on close.
- Provider and credential links expose new-window context.
- Language switching stays on the equivalent route.
- Education summary values match CV data and both record types remain compact.

- [ ] **Step 5: Review legal publication facts with the owner**

Confirm these exact facts before treating the copy as publishable:

```text
Controller: José Miguel Fernández
Privacy email: jomiferse@gmail.com
Enquiry follow-up retention: up to 12 months after the last communication
Hosting/API provider: Vercel
Email delivery provider: Resend
Optional analytics provider: Google Analytics 4
```

If any fact differs, update both locale dictionaries, rerun source verification and rebuild.

- [ ] **Step 6: Confirm only intended files remain and commit QA fixes if needed**

```bash
git diff --check
git status -sb
git diff --stat
```

Do not stage `scripts/verify-popup-system.mjs` or `src/components/common/GlobalExitIntent.astro`. If browser QA required scoped fixes, commit only those task files:

```bash
git add package.json scripts/verify-privacy-education-redesign.mjs src/components/common/SectionToc.astro src/components/common/BlogArticleToc.astro src/components/cards/CertificationCard.astro src/components/cards/EducationCard.astro src/i18n/es.json src/i18n/en.json 'src/pages/[locale]/privacy.astro' 'src/pages/[locale]/education.astro'
git commit -m "fix(pages): polish privacy and education responsive layout"
```

If there are no post-implementation fixes, skip this final commit.
