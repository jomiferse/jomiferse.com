# Alineación visual de Education y Privacy con About

## Objetivo

Alinear `/education` y `/privacy` con la filosofía visual de `/about` sin alterar su contenido ni su estructura editorial. Las tres páginas deben compartir ancho útil, jerarquía de color, densidad y comportamiento responsive.

## Alcance aprobado

- Ampliar el contenedor principal de `.education-page` y `.privacy-page` a `88rem`, igual que `.about-page`.
- Usar `var(--home-navy)` para los encabezados principales y secundarios.
- Usar `var(--action)` para eyebrows, iconos, indicadores y estados activos.
- Mantener `var(--surface)`, `var(--bg-band)` y `var(--surface-border)` para fondos, bandas y divisores.
- Conservar la disposición actual de formación, certificaciones, política y tabla de almacenamiento.
- No añadir tarjetas decorativas, gradientes nuevos, sombras adicionales ni el acento cian global.

## Navegación de privacidad

El índice de privacidad reutiliza `SectionToc`, el mismo componente usado por los artículos del blog. En escritorio debe permanecer visible bajo el header mediante `position: sticky`, limitar su altura al viewport y permitir scroll interno. La columna que lo contiene debe alinearse al inicio y no estirarse con el documento.

En móvil se conserva la presentación desplegable del componente compartido. No habrá una barra sticky adicional que reste altura útil a la lectura.

## Responsive y accesibilidad

- Comprobar 1440 × 900 y 390 × 844.
- Evitar desbordamiento horizontal.
- Mantener contraste y jerarquía en tema claro y oscuro.
- Conservar foco visible, navegación por teclado y `aria-current` en el índice.
- La ampliación del contenedor no debe ensanchar en exceso los párrafos: se mantienen sus límites actuales de lectura.

## Validación

- Verificar las fases `privacy-page`, `education-page`, `source` y `dist` del comprobador del rediseño.
- Ejecutar `pnpm run check`, `pnpm run lint`, `pnpm run format:check` y `pnpm run build`.
- Revisar visualmente ambas rutas en español e inglés, escritorio y móvil.

