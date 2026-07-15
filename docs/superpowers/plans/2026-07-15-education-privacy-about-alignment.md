# Education and Privacy About Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Alinear `/education` y `/privacy` con el ancho y la paleta de `/about`, y asegurar que el índice de privacidad permanezca sticky en escritorio.

**Architecture:** El ancho y la jerarquía cromática se centralizan en `global.css` mediante las clases raíz ya presentes en ambas páginas. El comportamiento sticky sigue siendo responsabilidad del componente compartido `SectionToc`; se evita que el elemento se estire dentro del grid para que `position: sticky` pueda actuar tanto en privacidad como en el blog.

**Tech Stack:** Astro 7, TypeScript 5.9, Tailwind CSS 4 y CSS global con variables del sistema visual existente.

## Global Constraints

- Trabajar directamente sobre `main`; no crear rama ni worktree.
- Preservar sin preparar `scripts/verify-popup-system.mjs` y `src/components/common/GlobalExitIntent.astro`.
- Mantener el contenido y la estructura editorial actuales de `/education` y `/privacy`.
- Usar `var(--home-navy)` en títulos y `var(--action)` en eyebrows e indicadores.
- No introducir `var(--accent*)`, tarjetas decorativas, gradientes o sombras nuevas.
- Comprobar 1440 × 900 y 390 × 844, tema claro y oscuro, sin overflow horizontal.

---

### Task 1: Definir el contrato de ancho y color compartido

**Files:**
- Modify: `scripts/verify-privacy-education-redesign.mjs`
- Modify: `src/styles/global.css:218-273`

**Interfaces:**
- Consumes: las clases raíz `.education-page`, `.privacy-page` y `.site-shell` ya renderizadas.
- Produces: contenedor de `88rem` y la misma jerarquía cromática global que `.about-page`.

- [ ] **Step 1: Añadir comprobaciones que fallen antes del cambio**

En `scripts/verify-privacy-education-redesign.mjs`, después del bloque de navegación, leer `src/styles/global.css` y exigir estos marcadores:

```js
if (includesPhase("nav")) {
	const globalStyles = await readSource("src", "styles", "global.css");
	requireMarkers("education and privacy visual alignment", globalStyles, [
		"body:has(.education-page) main.site-shell",
		"body:has(.privacy-page) main.site-shell",
		".education-page .eyebrow",
		".privacy-page .eyebrow",
		".education-page h1",
		".privacy-page h1",
	]);
}
```

- [ ] **Step 2: Ejecutar el verificador y confirmar el fallo esperado**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=nav
```

Expected: FAIL indicando que faltan los selectores de alineación de Education y Privacy.

- [ ] **Step 3: Aplicar el ancho y los colores de About**

En `src/styles/global.css`, ampliar el grupo de páginas comerciales con:

```css
body:has(.education-page) main.site-shell,
body:has(.privacy-page) main.site-shell {
	max-width: 88rem;
}

.education-page .eyebrow,
.privacy-page .eyebrow {
	color: var(--action);
}

.education-page h1,
.education-page h2,
.privacy-page h1,
.privacy-page h2 {
	color: var(--home-navy);
}
```

Mantener los límites `max-w-*` actuales de los textos para que el aumento del contenedor no empeore la legibilidad.

- [ ] **Step 4: Formatear y verificar el contrato visual**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier scripts/verify-privacy-education-redesign.mjs src/styles/global.css --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=nav
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: todos los comandos terminan con código 0 y Astro informa 0 errores.

- [ ] **Step 5: Commit del sistema visual**

```bash
git add scripts/verify-privacy-education-redesign.mjs src/styles/global.css
git commit -m "refactor(pages): align education and privacy width"
```

### Task 2: Asegurar el índice sticky de privacidad

**Files:**
- Modify: `scripts/verify-privacy-education-redesign.mjs`
- Modify: `src/components/common/SectionToc.astro:15-22`

**Interfaces:**
- Consumes: `SectionToc` dentro de una columna CSS Grid en privacidad y blog.
- Produces: una raíz sticky alineada al inicio, con altura limitada y scroll interno ya existentes.

- [ ] **Step 1: Endurecer el contrato del componente sticky**

Añadir `"lg:self-start"` a los marcadores de `generic section navigation` en el verificador:

```js
requireMarkers("generic section navigation", sectionToc, [
	"data-section-toc",
	'setAttribute("aria-current", "location")',
	"IntersectionObserver",
	"prefers-reduced-motion",
	"max-h-[calc(100svh-7.5rem)]",
	"lg:self-start",
]);
```

- [ ] **Step 2: Ejecutar el verificador y comprobar el fallo**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=nav
```

Expected: FAIL con `generic section navigation: missing lg:self-start`.

- [ ] **Step 3: Evitar que la raíz sticky se estire en el grid**

Cambiar la clase de la raíz de `SectionToc.astro` por:

```astro
<div
	data-section-toc
	data-current-label={currentLabel}
	class="lg:sticky lg:top-24 lg:self-start"
>
```

No modificar el máximo de altura, el scroll interior, `aria-current`, el seguimiento de secciones ni la versión desplegable móvil.

- [ ] **Step 4: Formatear y ejecutar las verificaciones enfocadas**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier src/components/common/SectionToc.astro scripts/verify-privacy-education-redesign.mjs --write
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=nav
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=privacy-page
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: todos los comandos terminan con código 0.

- [ ] **Step 5: Commit del comportamiento sticky**

```bash
git add scripts/verify-privacy-education-redesign.mjs src/components/common/SectionToc.astro
git commit -m "fix(navigation): keep privacy contents sticky"
```

### Task 3: Validación integrada y visual

**Files:**
- Modify only if a scoped defect is found: files already listed in Tasks 1–2.

**Interfaces:**
- Consumes: los estilos compartidos y el componente sticky actualizados.
- Produces: páginas bilingües compiladas, sin regresiones visuales ni de accesibilidad.

- [ ] **Step 1: Ejecutar la validación completa**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run test
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=source
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:privacy-education-redesign -- --phase=dist
git diff --check
```

Expected: 23 tests pasan, Astro informa 0 diagnósticos, lint y formato terminan sin avisos, build termina correctamente y el verificador dist encuentra las cuatro rutas.

- [ ] **Step 2: Revisar las cuatro rutas en escritorio y móvil**

Comprobar:

```text
http://localhost:4321/es/education
http://localhost:4321/en/education
http://localhost:4321/es/privacy
http://localhost:4321/en/privacy
```

En 1440 × 900 y 390 × 844, confirmar:

- El ancho útil coincide con `/about` en escritorio.
- No existe overflow horizontal.
- Los H1/H2 usan la jerarquía navy y los eyebrows usan action en ambos temas.
- El índice de privacidad permanece visible al hacer scroll en escritorio.
- El índice tiene scroll interno si supera el alto disponible.
- En móvil se muestra como desplegable y no como barra sticky.
- El enlace activo sigue actualizándose con `aria-current="location"`.

- [ ] **Step 3: Revisar el estado del repositorio**

Run:

```bash
git status -sb
git log -4 --oneline
```

Expected: solo continúan sin preparar `scripts/verify-popup-system.mjs` y `src/components/common/GlobalExitIntent.astro`; los commits del cambio aparecen en `main`.

