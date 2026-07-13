# Diseño: alinear los colores de Sobre mí con la home

## Problema

La home utiliza un sistema comercial claro: azul marino en titulares, naranja en llamadas a la acción y señales pequeñas, superficies claras y bordes neutros. La página `/about` mezcla ese sistema con el cian global en el H1, números, enlaces y cronología. El resultado parece pertenecer a otra dirección visual.

## Objetivo

Alinear `/about` con la identidad cromática de la home sin copiar su composición. La página seguirá siendo personal y editorial, pero empleará la misma jerarquía de color.

## Sistema cromático

- Titulares principales y de sección: `var(--home-navy)`.
- CTA principal, eyebrows, números, marcadores y estados interactivos: `var(--action)`.
- Texto: `var(--text)` y `var(--text-muted)`.
- Superficies y bandas: `var(--surface)`, `var(--surface-strong)` y `var(--bg-band)`.
- Bordes: `var(--surface-border)`.
- El cian (`var(--accent)`, `var(--accent-strong)`, `var(--accent-soft)` y `var(--accent-line)`) no se usará como señal visual dentro de `/about`.
- En tema oscuro se mantendrán las variables equivalentes existentes, incluido el naranja más claro de `var(--action)` y el valor claro de `var(--home-navy)`.

## Cambios visuales

- El H1 completo pasará a azul marino; la segunda línea dejará de ser cian.
- Los `eyebrow`, números de servicios, cifra de experiencia, puntos de cronología, viñetas y enlaces activos pasarán a naranja.
- El marco del retrato y el fondo decorativo del CTA usarán mezclas suaves basadas en naranja.
- Los H2 comerciales adoptarán azul marino como en la home.
- Se conservarán estructura, textos, rutas, responsive y componentes actuales.

## Documentación del repositorio

`AGENTS.md` incorporará una sección de filosofía visual que establezca la home como referencia para páginas comerciales. La regla explicará el papel del azul marino, naranja, fondos, tarjetas, tipografía, temas y responsive para evitar que futuras páginas introduzcan otra paleta sin una decisión explícita.

## Validación

- Añadir al verificador de la unión About/Experience comprobaciones contra usos de variables cian en los componentes y página de About.
- Confirmar que la comprobación falla antes del cambio y pasa después.
- Ejecutar formato, Astro check, lint y build.
- Revisar `/es/about` y `/en/about` en escritorio y móvil, en temas claro y oscuro.
- Confirmar ausencia de desbordamiento horizontal y conservación de un único H1.

## Fuera de alcance

- Cambiar la composición o el contenido de `/about`.
- Rediseñar la home.
- Cambiar la paleta global de páginas no comerciales.
