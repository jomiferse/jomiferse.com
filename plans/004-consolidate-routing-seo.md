# Consolidar rutas, contenido y señales SEO

**Estado:** TODO  
**Prioridad:** P0 — bloquea publicación  
**Planificado sobre:** `24590a6` (2026-07-15)

## Por qué

La cobertura SEO básica es buena, pero varias inconsistencias crean páginas duplicadas o señales contradictorias: los borradores tienen ruta pública, los aliases de servicios generan HTML 200, la 404 mezcla idioma inicial y cliente, y el JSON-LD de artículos no recibe su portada.

## Estado actual y evidencia

- `src/pages/[locale]/blog/[...slug].astro:9-26` genera rutas con toda la colección; `src/lib/blog.ts:9-15` sí filtra drafts en listados.
- `src/lib/services.ts:226-241` define aliases canónicos; el sitemap los filtra en `astro.config.mjs:80-92`, pero las páginas siguen existiendo y hay enlaces internos hacia aliases.
- `src/pages/404.astro:10-13` renderiza inglés sin pasar locale; el script `:122-140` cambia solo parte del DOM después de cargar.
- `src/pages/index.astro:51-53` redirige con JavaScript a `/es/`.
- `src/pages/[locale]/blog/[...slug].astro:47-59` no pasa `post.data.cover.src`; `src/lib/seo.ts:187-216` cae al OG genérico.
- `astro.config.mjs:34-60` añade `nofollow` a todos los enlaces externos Markdown, incluso fuentes editoriales.
- En el build auditado: 33 títulos superan 65 caracteres y algunas descriptions 165; el OG genérico aún posiciona “Backend Software Engineer” frente a la oferta full-stack actual.

## Alcance

Rutas raíz/404/blog/servicios, enlaces internos, sitemap, metadata, `src/lib/seo.ts`, BaseLayout y activo OG por defecto. Fuera de alcance: reescribir el contenido completo del blog.

## Pasos de implementación

1. Centralizar `getPublishedBlogPosts` para listados y `getStaticPaths`; ningún `draft: true` debe generar HTML, sitemap, feed ni alternate.
2. Convertir cada alias de servicio en redirect permanente al slug canónico localizado y dejar de generar contenido duplicado. Derivar redirects, sitemap y enlaces desde una única tabla; reemplazar enlaces internos a aliases.
3. Sustituir el redirect JS de `/` por redirect de Astro/Vercel a `/es/`, conservando una ruta de selección solo si se decide ofrecerla explícitamente.
4. Resolver la 404 en servidor con locale coherente para contenido, `<html lang>`, header, footer, canonical/noindex y metadata; eliminar la traducción parcial post-hidratación.
5. Pasar la portada real a `buildBlogPosting`. Añadir `@id` estables para Website/Person y referencias desde ProfilePage, ProfessionalService, Offer y BlogPosting; localizar nombres de servicios/ofertas.
6. Indexar páginas de paginación útiles o garantizar rastreo completo por otra colección indexable. Si se indexan, canonical propio, title/description únicos y sitemap; no ocultar artículos únicamente tras páginas `noindex`.
7. Cambiar la política de enlaces externos: `noopener noreferrer` para seguridad y `nofollow` solo para contenido patrocinado/no confiable.
8. Actualizar el OG por defecto a la propuesta full-stack actual, preferiblemente PNG/WebP social compatible, y emitir tipo/dimensiones. Ajustar metadata larga o duplicada con criterio editorial en EN/ES.
9. Añadir pruebas de grafo SEO sobre el HTML construido: canonical único, alternates recíprocos, drafts ausentes, redirects de aliases, schema parseable, imagen de artículo y enlaces internos canónicos.

## Verificación

```bash
pnpm test
pnpm run check
pnpm run lint
pnpm run build
```

Tras el build, rastrear `dist/` y validar sitemap, redirects y JSON-LD. Probar una URL inexistente bajo `/en/` y `/es/` con JavaScript desactivado.

## Criterios de finalización

- Borradores y aliases no publican HTML duplicado.
- `/`, 404, canonical y `hreflang` responden de forma coherente sin depender de JS.
- Artículos usan su portada en Open Graph y JSON-LD.
- Entidades schema tienen IDs estables y contenido localizado.
- Todos los artículos publicados son rastreables desde páginas indexables.
- El OG por defecto representa la oferta comercial actual.

## STOP

Detener si cambiar un slug público rompe una URL con tráfico real sin redirect permanente. Exportar la lista vieja→nueva y comprobarla antes del deploy.

## Mantenimiento

La prueba de grafo SEO sustituirá comprobaciones textuales. Mantener aliases históricos solo como redirects y añadir nuevas rutas desde la misma fuente tipada.
