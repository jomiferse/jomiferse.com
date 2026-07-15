# Sustituir los scripts de validación por una puerta de calidad

**Estado:** TODO  
**Prioridad:** P0 — requisito explícito antes de publicación  
**Planificado sobre:** `24590a6` (2026-07-15)

## Por qué

El repositorio contiene 18 `scripts/verify-*.mjs` con 4.273 líneas. Once tienen comandos en `package.json`; el resto están huérfanos o se ejecutan manualmente. Muchos validan fragmentos exactos de Astro/CSS, por lo que rompen ante refactors válidos y duplican lint, type-check y build. Deben eliminarse sin perder las invariantes útiles.

## Inventario

Eliminar:

`verify-about-merge`, `verify-ai-seo`, `verify-blog-commercial`, `verify-blog-redesign`, `verify-brand-assets`, `verify-contact-redesign`, `verify-conversion-cta`, `verify-footer-redesign`, `verify-global-background`, `verify-header-redesign`, `verify-home-conversion`, `verify-popup-system`, `verify-privacy-education-redesign`, `verify-project-data`, `verify-project-pages`, `verify-project-redesign`, `verify-service-redesign` y `verify-theme-default`.

Conservar `scripts/generate-brand-assets.mjs`: genera artefactos y no es una validación.

## Estado actual y evidencia

- `package.json:19-29` expone once comandos `verify:*`.
- `scripts/verify-*.mjs` suma 4.273 líneas frente a 71 del generador.
- La suite actual ya usa `node --test tests/*.test.ts`, con 30 pruebas verdes.
- Las invariantes críticas descubiertas en los planes 001–005 necesitan pruebas semánticas sobre funciones y HTML generado, no marcadores fuente.

## Alcance

Los 18 scripts, `package.json`, tests, crawler del build, README/AGENTS y configuración CI/Vercel. Fuera de alcance: mantener compatibilidad con nombres `verify:*` obsoletos.

## Pasos de implementación

1. Clasificar cada assertion existente como: cubierta por type-check/lint/build; comportamiento puro; contrato del HTML; regresión visual; o histórica sin valor. Registrar el destino antes de borrar.
2. Migrar comportamiento puro a `node:test`: consentimiento, contacto, servicios/aliases, proyectos, traducciones, metadata y builders schema.
3. Crear un único test de artefacto tras build que recorra `dist/`: enlaces internos, canonical/hreflang, un H1, JSON-LD parseable, drafts ausentes, aliases redirigidos, sitemap/robots/llms y assets referenciados. No afirmar clases o textos exactos salvo que sean contrato público.
4. Mantener la validación visual como checklist corta de preview a 390/1440, claro/oscuro y EN/ES; automatizar screenshots solo si se incorpora una herramienta con baseline y revisión intencional.
5. Añadir scripts claros:

```json
{
  "test": "node --test tests/*.test.ts",
  "test:build": "node --test tests/build/*.test.ts",
  "quality": "pnpm run format:check && pnpm run lint && pnpm test && pnpm run check && pnpm run build && pnpm run test:build"
}
```

6. Eliminar los 18 archivos y los once comandos `verify:*`. Confirmar que no quedan referencias con `rg 'verify:|scripts/verify-'`.
7. Actualizar README y guía del repositorio para Node 24, `pnpm run quality`, variables del contacto y checklist manual. Añadir CI o configurar Vercel para ejecutar `pnpm run quality` antes de publicar.
8. Ejecutar la puerta completa dos veces: una limpia y otra tras invalidar temporalmente una fixture para demostrar que el crawler falla por comportamiento. Revertir la mutación de prueba antes del commit.

## Orden y dependencias

Ejecutar después de 001, 003 y 004 para migrar sus contratos definitivos. El plan puede empezar inventariando assertions, pero los scripts solo se borran cuando cada invariantes útil tenga destino o una decisión explícita de descarte.

## Verificación

```bash
pnpm run quality
rg -n 'verify:|scripts/verify-' package.json README.md AGENTS.md .github vercel.json 2>/dev/null
git status --short
```

El segundo comando debe devolver cero referencias activas. Revisar que `scripts/generate-brand-assets.mjs` sigue presente y reproducible.

## Criterios de finalización

- No existe ningún `scripts/verify-*.mjs` ni comando `verify:*`.
- Las invariantes de usuario/SEO/seguridad viven en tests semánticos.
- `pnpm run quality` es el único gate documentado y se ejecuta antes del deploy.
- El crawler falla ante una regresión real y tolera refactors de markup equivalentes.
- README y guía ya no describen comandos eliminados.

## STOP

No borrar un script si contiene una invariantes útil sin equivalente ni decisión de descarte registrada. No convertir búsquedas de strings en tests nuevos bajo otro nombre.

## Mantenimiento

Toda regresión nueva debe probar la API o el artefacto observable más cercano. Evitar scripts ad hoc; ampliar `node:test`, ESLint o el crawler según el tipo de contrato.
