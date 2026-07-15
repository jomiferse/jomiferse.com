# Plan de preparación para publicación

Auditoría realizada el 2026-07-15 sobre `main` en el commit `24590a6`.

## Resultado de la revisión

La base es sólida: las 30 pruebas pasan, `astro check` informa 0 errores, ESLint termina sin avisos, las rutas representativas mantienen un solo `h1`, `lang`, canonical y `hreflang`, no se detectó desbordamiento horizontal a 390 px y el diseño de inicio y servicios se mantiene coherente en claro y oscuro.

Antes de publicar quedan siete bloques de trabajo. El orden de esta tabla es también el orden recomendado de ejecución.

| Orden | Plan                                                                                              | Prioridad | Motivo                                                                                        |
| ----- | ------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------- |
| 1     | [001 — Proteger el endpoint de contacto](./001-harden-contact-endpoint.md)                        | P0        | Evitar abuso del envío de correo, costes y entradas sin límites.                              |
| 2     | [002 — Corregir dependencias vulnerables y limpiar dependencias](./002-remediate-dependencies.md) | P0        | `pnpm audit --prod` detectó 15 avisos, 5 de severidad alta.                                   |
| 3     | [003 — Resolver privacidad y accesibilidad](./003-fix-privacy-accessibility.md)                   | P0        | El opt-in analítico aparece marcado por defecto y hay fallos de foco/objetivos táctiles.      |
| 4     | [004 — Consolidar rutas y señales SEO](./004-consolidate-routing-seo.md)                          | P0        | Hay borradores publicables, aliases con HTML 200, una 404 híbrida y JSON-LD inconsistente.    |
| 5     | [005 — Reducir HTML y optimizar medios](./005-improve-delivery-media.md)                          | P1        | El CSS global se duplica en cada página y algunos recursos se cargan sin necesidad.           |
| 6     | [006 — Alinear las landings comerciales](./006-align-commercial-landings.md)                      | P1        | Las landings conservan un lenguaje visual anterior al de la home actual.                      |
| 7     | [007 — Sustituir los scripts de validación](./007-replace-validation-scripts.md)                  | P0        | Retirar los 18 `verify-*.mjs` sin perder invariantes ni una puerta de calidad de publicación. |

## Comprobaciones realizadas

- `pnpm test`: 30/30 pruebas superadas.
- `pnpm run check`: 110 archivos, 0 errores, 0 avisos y 0 hints.
- `pnpm run lint`: correcto.
- `pnpm audit --prod`: 15 avisos (5 high, 6 moderate, 4 low); necesitan validación tras actualizar el lockfile.
- Auditoría visual a 1440 px y 390 px en inicio, servicios, proyectos, blog, contacto y páginas informativas, en ambos idiomas y con tema oscuro.
- Inspección del build: 171 HTML, unos 30 MB; `/es/` pesa unos 223 KB y `/es/services/` unos 249 KB antes de compresión.
- Rastreo representativo de 14 rutas: sin imágenes sin `alt`, IDs duplicados ni desbordamiento horizontal.

## Criterio de publicación

No publicar hasta completar 001, 002, 003, 004 y 007. Completar 005 antes de publicar si las mediciones de preview confirman que el CSS inline o las imágenes perjudican LCP/transferencia. Completar 006 para que toda página comercial tenga la misma jerarquía de conversión que la home.

## Hallazgos aplazados o descartados

- Dividir `src/lib/commercial-landings.ts` (3.188 líneas): deuda real, pero no bloquea publicación si los datos siguen tipados y verificados; abordar después de estabilizar las páginas.
- Tipar todas las claves de i18n: mejora de DX, no un defecto observable con el chequeo actual.
- Añadir nuevas funcionalidades de recomendación de artículos o buscador: producto posterior al lanzamiento.
- Reescribir todo el diseño: descartado; la home, servicios y modo oscuro ya ofrecen una base consistente. El problema está acotado a landings y tokens concretos.

## Mantenimiento del plan

Al terminar cada bloque, marcar su estado, registrar el commit de implementación y volver a ejecutar la puerta de calidad definida en el plan 007. Si un cambio de un plan invalida otro, actualizar ambos archivos en el mismo commit.
