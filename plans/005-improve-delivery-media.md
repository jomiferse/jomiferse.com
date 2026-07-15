# Reducir HTML y optimizar la entrega de medios

**Estado:** TODO  
**Prioridad:** P1 — completar antes de publicación si impacta Core Web Vitals  
**Planificado sobre:** `24590a6` (2026-07-15)

## Por qué

`inlineStylesheets: "always"` incrusta el CSS global completo en cada HTML. El build auditado contiene 171 HTML y unos 30 MB: `/es/` ronda 223 KB y `/es/services/` 249 KB sin comprimir. Las portadas hover de proyectos suman unos 790 KB y se descargan aunque un dispositivo táctil no pueda usarlas; imágenes Markdown carecen de dimensiones y lazy loading uniformes.

## Estado actual y evidencia

- `astro.config.mjs:96-98` fuerza todos los estilos inline.
- `src/styles/global.css` tiene 1.464 líneas y se repite entre páginas.
- `public/images/projects/educash-preview.avif` pesa 438 KB; `euroinnova-preview` 246 KB y `cv-studio-preview` 106 KB.
- `src/components/cards/WorkCard.astro` y `src/components/projects/ProjectArchiveCard.astro` renderizan estática y hover juntas.
- El contenido del blog incluye imágenes sin una política común de `width`, `height`, `loading` y `decoding`.

## Alcance

Configuración de estilos, componentes de imágenes de proyectos/blog, procesamiento Markdown y medición de rutas clave. Fuera de alcance: rediseñar imágenes originales o adoptar un CDN distinto.

## Pasos de implementación

1. Cambiar a extracción de CSS (`auto` o `never`) y comparar HTML, CSS compartido, caché y render blocking. Mantener inline solo CSS crítico si una medición real lo justifica.
2. Crear un componente/pipeline de imagen editorial que emita dimensiones, `srcset`, `sizes`, `decoding="async"` y `loading="lazy"`; la imagen LCP de cada página debe usar prioridad alta y no lazy.
3. Generar variantes responsive de previews y cargarlas solo para dispositivos con hover o bajo interacción. En táctil, servir únicamente la portada estática.
4. Aplicar el mismo contrato a portadas de blog, cards y detalle de proyecto para evitar CLS y descarga sobredimensionada.
5. Medir home, servicios, blog, artículo, proyectos y contacto en preview de producción a 390 y 1440. Registrar LCP, CLS, JS/CSS transferido y tamaño HTML antes/después.
6. Añadir presupuestos tolerantes al crawler de build: ningún HTML por encima de un umbral acordado y ninguna imagen de card mayor que el tamaño necesario para su viewport.

## Verificación

```bash
pnpm run build
pnpm test
pnpm run check
pnpm run lint
```

Usar Lighthouse/DevTools en preview, con caché fría y throttling móvil. Confirmar ausencia de saltos al cargar imágenes y que dark mode no duplica hojas de estilo.

## Criterios de finalización

- El CSS compartido se cachea entre páginas y el HTML baja de forma material.
- Todas las imágenes de contenido tienen dimensiones y estrategia de carga.
- Los previews hover no se descargan por defecto en táctil.
- No empeoran LCP, CLS ni la primera pintura en las rutas medidas.
- Los presupuestos se comprueban en el test del build, no mediante búsquedas de texto fuente.

## STOP

Revertir la estrategia de extracción si una medición repetible muestra regresión significativa de primera pintura; conservar la evidencia y probar CSS crítico acotado.

## Mantenimiento

Revisar presupuestos al añadir una plantilla o medio nuevo. Guardar variantes generadas de forma reproducible, no manual.
