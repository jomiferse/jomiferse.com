# Shared Technology Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el carrusel de tecnologías de `/contact` en un componente común, ampliar su título y mostrarlo también en la home después de los servicios especializados.

**Architecture:** La lista, animación y estilos vivirán en `TechnologyMarquee.astro`, con contenido e identificadores recibidos por propiedades. Contacto y home serán consumidores independientes; los diccionarios localizados seguirán siendo la fuente del texto público.

**Tech Stack:** Astro 7, TypeScript 5.9, Tailwind CSS 4, Astro Icon y CSS encapsulado en componentes.

## Global Constraints

- Trabajar directamente sobre `main`; no crear rama ni worktree.
- Preservar sin preparar `scripts/verify-popup-system.mjs` y `src/components/common/GlobalExitIntent.astro`.
- Colocar el carrusel de la home entre `HomeSpecializedServices` y `HomeProcess`.
- Mantener las diez tecnologías, la pausa por hover/foco y la alternativa `prefers-reduced-motion`.
- Usar `var(--home-navy)`, `var(--action)`, `var(--surface)` y `var(--surface-border)`; no introducir el acento cian.
- Usar un ancho máximo de `min(52rem, 100%)` para el título y `42rem` para la descripción opcional.
- Comprobar 1440 × 900 y 390 × 844, ES/EN y tema claro/oscuro.

---

### Task 1: Extraer el carrusel común y conservar Contact

**Files:**
- Create: `src/components/common/TechnologyMarquee.astro`
- Delete: `src/components/contact/ContactTechnologyMarquee.astro`
- Modify: `src/pages/[locale]/contact.astro:1-140`
- Modify: `scripts/verify-contact-redesign.mjs:133-178`

**Interfaces:**
- Consumes: `{ eyebrow: string; title: string; description?: string; pauseLabel: string; headingId: string }`.
- Produces: una sección `data-technology-marquee` reutilizable, etiquetada por un `headingId` único.

- [ ] **Step 1: Cambiar el contrato del verificador para que falle**

En la fase `marquee` de `scripts/verify-contact-redesign.mjs`, leer el componente común y exigir el nuevo API:

```js
const marquee = await readSource(
	"src",
	"components",
	"common",
	"TechnologyMarquee.astro",
);
requireMarkers("contact page marquee", page, [
	"TechnologyMarquee",
	'headingId="contact-technologies-title"',
	"page.technologiesTitle",
	"page.technologiesPauseLabel",
]);
requireMarkers("technology marquee", marquee, [
	"data-technology-marquee",
	"description?: string",
	"headingId: string",
	"min(52rem, 100%)",
	"max-width: 42rem",
	'tabindex="0"',
	'aria-hidden="true"',
	"technology-marquee__track",
	"animation-play-state: paused",
	"@media (prefers-reduced-motion: reduce)",
	"Java",
	"Spring Boot",
	"Docker",
	"Kubernetes",
	"React",
	"Astro",
	"PostgreSQL",
	"Redis",
	"Apache Kafka",
	"WordPress",
]);
rejectMarkers("contact page marquee", page, ["ContactTechnologyMarquee"]);
```

- [ ] **Step 2: Ejecutar la fase y confirmar el fallo**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:contact-redesign -- --phase=marquee
```

Expected: FAIL porque `TechnologyMarquee.astro` no existe y contacto todavía usa el componente anterior.

- [ ] **Step 3: Crear `TechnologyMarquee.astro` con el API común**

Copiar la lista y la animación existentes y sustituir el frontmatter y cabecera de la sección por:

```astro
---
import { Icon } from "astro-icon/components";

interface Props {
	eyebrow: string;
	title: string;
	description?: string;
	pauseLabel: string;
	headingId: string;
}

const { eyebrow, title, description, pauseLabel, headingId } =
	Astro.props as Props;
const technologies = [
	{ label: "Java", icon: "java" },
	{ label: "Spring Boot", icon: "springboot" },
	{ label: "Docker", icon: "docker" },
	{ label: "Kubernetes", icon: "kubernetes" },
	{ label: "React", icon: "react" },
	{ label: "Astro", icon: "astro" },
	{ label: "PostgreSQL", icon: "postgresql" },
	{ label: "Redis", icon: "redis" },
	{ label: "Apache Kafka", icon: "apachekafka" },
	{ label: "WordPress", icon: "wordpress" },
] as const;
---

<section
	data-technology-marquee
	class="technology-marquee section-reveal"
	aria-labelledby={headingId}
>
	<p class="eyebrow">{eyebrow}</p>
	<h2 id={headingId}>{title}</h2>
	{description ? <p class="technology-marquee__description">{description}</p> : null}
	<div class="technology-marquee__viewport" tabindex="0" role="region" aria-label={pauseLabel}>
		<div class="technology-marquee__track">
			<ul class="technology-marquee__list">
				{technologies.map((technology) => <li><Icon name={technology.icon} aria-hidden="true" /><span>{technology.label}</span></li>)}
			</ul>
			<ul class="technology-marquee__list" aria-hidden="true">
				{technologies.map((technology) => <li><Icon name={technology.icon} aria-hidden="true" /><span>{technology.label}</span></li>)}
			</ul>
		</div>
	</div>
</section>
```

Renombrar las clases CSS `contact-technologies` y `contact-marquee*` a `technology-marquee*`. Mantener los valores actuales, salvo estos cambios exactos:

```css
.technology-marquee h2 {
	max-width: min(52rem, 100%);
}

.technology-marquee__description {
	max-width: 42rem;
	margin-top: 1.1rem;
	color: var(--text-muted);
	line-height: 1.7;
}
```

- [ ] **Step 4: Actualizar Contact y eliminar el componente anterior**

Cambiar el import y uso en `contact.astro`:

```astro
import TechnologyMarquee from "@/components/common/TechnologyMarquee.astro";
```

```astro
<TechnologyMarquee
	eyebrow="Stack"
	title={page.technologiesTitle}
	pauseLabel={page.technologiesPauseLabel}
	headingId="contact-technologies-title"
/>
```

Eliminar `src/components/contact/ContactTechnologyMarquee.astro` después de trasladar toda su funcionalidad.

- [ ] **Step 5: Formatear, verificar y hacer commit**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier src/components/common/TechnologyMarquee.astro 'src/pages/[locale]/contact.astro' scripts/verify-contact-redesign.mjs --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:contact-redesign -- --phase=marquee
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: verificador y Astro terminan con código 0.

```bash
git add scripts/verify-contact-redesign.mjs src/components/common/TechnologyMarquee.astro src/components/contact/ContactTechnologyMarquee.astro 'src/pages/[locale]/contact.astro'
git commit -m "refactor(technologies): share marquee component"
```

### Task 2: Incorporar el carrusel a la home

**Files:**
- Modify: `src/pages/[locale]/index.astro:1-70`
- Modify: `src/i18n/es.json:328-364`
- Modify: `src/i18n/en.json:328-364`
- Modify: `scripts/verify-home-conversion.mjs`

**Interfaces:**
- Consumes: `TechnologyMarquee` y `home.page.skills`.
- Produces: una sección localizada entre servicios especializados y proceso.

- [ ] **Step 1: Añadir un contrato de home que falle**

En `scripts/verify-home-conversion.mjs`, añadir `skills.eyebrow`, `skills.title`, `skills.text` y `skills.pauseLabel` a `requiredPaths` y exigir:

```js
for (const marker of [
	'import TechnologyMarquee from "@/components/common/TechnologyMarquee.astro"',
	"<HomeSpecializedServices",
	"<TechnologyMarquee",
	"<HomeProcess",
	'headingId="home-technologies-title"',
	"page.skills.eyebrow",
	"page.skills.title",
	"page.skills.text",
	"page.skills.pauseLabel",
]) {
	if (!homePage.includes(marker)) {
		failures.push(`home technology marquee: missing ${marker}`);
	}
}

const servicesIndex = homePage.indexOf("<HomeSpecializedServices");
const marqueeIndex = homePage.indexOf("<TechnologyMarquee");
const processIndex = homePage.indexOf("<HomeProcess");
if (!(servicesIndex < marqueeIndex && marqueeIndex < processIndex)) {
	failures.push("home technology marquee: incorrect section order");
}
```

- [ ] **Step 2: Ejecutar y confirmar el fallo**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-home-conversion.mjs
```

Expected: FAIL por ausencia del import, el uso en la home y `skills.pauseLabel`.

- [ ] **Step 3: Añadir el texto accesible localizado**

Añadir a `home.page.skills`:

```json
"pauseLabel": "Lista de tecnologías en movimiento. Mantén el foco aquí para pausar la animación."
```

Y en inglés:

```json
"pauseLabel": "Moving technology list. Keep focus here to pause the animation."
```

- [ ] **Step 4: Renderizar la sección en el orden aprobado**

Importar el componente en `index.astro` y colocarlo inmediatamente después de `HomeSpecializedServices`:

```astro
import TechnologyMarquee from "@/components/common/TechnologyMarquee.astro";
```

```astro
<HomeSpecializedServices locale={locale} content={page.specializedServices} />

<TechnologyMarquee
	eyebrow={page.skills.eyebrow}
	title={page.skills.title}
	description={page.skills.text}
	pauseLabel={page.skills.pauseLabel}
	headingId="home-technologies-title"
/>

<HomeProcess content={page.process} />
```

- [ ] **Step 5: Formatear, verificar y hacer commit**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier 'src/pages/[locale]/index.astro' src/i18n/es.json src/i18n/en.json scripts/verify-home-conversion.mjs --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-home-conversion.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:contact-redesign -- --phase=marquee
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: todos los comandos terminan con código 0.

```bash
git add scripts/verify-home-conversion.mjs 'src/pages/[locale]/index.astro' src/i18n/es.json src/i18n/en.json
git commit -m "feat(home): add technology marquee"
```

### Task 3: Validación integrada y visual

**Files:**
- Modify only if a scoped defect is found: files already listed in Tasks 1–2.

**Interfaces:**
- Consumes: las dos instancias del componente compartido.
- Produces: home y contacto bilingües, accesibles y sin regresiones responsive.

- [ ] **Step 1: Ejecutar la validación completa**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run test
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-home-conversion.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:contact-redesign
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-home-conversion.mjs --dist
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:contact-redesign -- --dist
git diff --check
```

Expected: 23 tests pasan, Astro informa 0 diagnósticos, lint y formato terminan sin avisos, build genera las cuatro rutas y ambos verificadores dist terminan correctamente.

- [ ] **Step 2: Revisar navegador**

Comprobar `/es`, `/en`, `/es/contact` y `/en/contact` a 1440 × 900 y 390 × 844:

- La home muestra el carrusel después de servicios especializados y antes del proceso.
- El título de contacto dispone de `52rem` y reduce sus saltos de línea.
- No existe overflow horizontal.
- Los colores se conservan en tema claro y oscuro.
- Hover y foco pausan la pista.
- Con movimiento reducido la pista no se anima y la lista duplicada queda oculta.
- Los identificadores son `home-technologies-title` y `contact-technologies-title`.

- [ ] **Step 3: Revisar el estado del repositorio**

Run:

```bash
git status -sb
git log -4 --oneline
```

Expected: solo continúan sin preparar `scripts/verify-popup-system.mjs` y `src/components/common/GlobalExitIntent.astro`.
