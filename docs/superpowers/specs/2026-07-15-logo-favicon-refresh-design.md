# Renovación del logo y favicon

## Objetivo

Unificar la identidad visible de `jomiferse.com` con un símbolo que responda al rediseño comercial actual. El nuevo sistema sustituirá tanto el favicon “JF” blanco y cian sobre negro como el texto “JMF” dentro de un círculo que aparece en la cabecera.

La dirección aprobada es **Firma editorial**: un monograma geométrico “JF” en azul marino, contenido en una superficie clara suavemente redondeada y rematado por un pequeño cuadrado coral. La reducción a dos iniciales prioriza la legibilidad a 16 px; el nombre completo que acompaña al símbolo en la cabecera conserva la identificación inequívoca de José Miguel Fernández.

## Lenguaje visual

- El azul marino comunica oficio, confianza y continuidad con los títulos de las páginas comerciales.
- El coral se reserva para el pequeño cuadrado final, que actúa como firma y enlaza con las llamadas a la acción.
- El contenedor tiene una geometría compacta y redondeada, alineada con las superficies del sitio sin convertirse en una tarjeta decorativa.
- El monograma evita recursos genéricos de desarrollo como corchetes, terminales o símbolos de código.
- Las formas deben conservar contraformas abiertas y bordes nítidos a 16, 32, 40 y 64 px.

La fuente de verdad será un dibujo vectorial con `viewBox="0 0 64 64"`. Los trazados de la “J”, la “F” y el cuadrado coral serán compartidos conceptualmente entre el componente de cabecera y los activos públicos, aunque cada soporte podrá adaptar color y zona segura.

## Cabecera

Se creará `src/components/common/BrandMark.astro` para encapsular únicamente el SVG del monograma. `Header.astro` lo usará dentro del enlace de marca y conservará al lado el nombre completo y el rol localizado que ya existen.

El componente será decorativo dentro de un enlace que ya tiene nombre accesible, por lo que su SVG llevará `aria-hidden="true"`. La marca medirá 40 × 40 px en la cabecera y mantendrá dimensiones estables durante el estado compacto.

Los colores se resolverán con las variables del sitio:

- fondo: `var(--surface)` o `var(--surface-strong)`;
- monograma: `var(--home-navy)`;
- detalle: `var(--action)`;
- borde: mezcla discreta de `var(--action)` y `var(--surface-border)`.

Así, el símbolo se invierte de forma natural en modo oscuro y no queda encerrado en una pastilla blanca. Se retirará del CSS la presentación tipográfica actual de `.header-brand__mark`; el nombre, rol, espaciado general y navegación no cambiarán.

## Favicon e iconos instalables

Se sustituirá el paquete público completo:

- `public/favicon.svg`;
- `public/favicon.ico`, con representaciones de 16, 32 y 48 px;
- `public/favicon-16x16.png`;
- `public/favicon-32x32.png`;
- `public/favicon-96x96.png`;
- `public/apple-touch-icon.png`, de 180 × 180 px;
- `public/web-app-manifest-192x192.png`;
- `public/web-app-manifest-512x512.png`.

`favicon.svg` incluirá una paleta clara y otra oscura mediante `prefers-color-scheme`. La variante clara usará fondo marfil, monograma azul marino y detalle coral. La variante oscura usará fondo azul marino, monograma marfil y un coral más luminoso. Los PNG e ICO de respaldo usarán la variante clara de alto contraste para mantener un resultado estable en clientes sin soporte de tema.

Los iconos instalables conservarán el monograma dentro de la zona segura central para soportar recortes circulares, redondeados o con forma libre. El manifest declarará los iconos como `"purpose": "any maskable"`.

## Manifest y metadatos

`public/site.webmanifest` dejará de usar los valores genéricos actuales:

- `name`: `José Miguel Fernández`;
- `short_name`: `JMF`;
- `theme_color`: `#102d4f`;
- `background_color`: `#eef3f8`;
- `display`: `standalone`.

Los enlaces de favicon existentes en `BaseLayout.astro` ya cubren SVG, ICO, PNG, Apple Touch Icon y manifest. Solo se modificarán si la generación final revela una referencia redundante o un formato ausente; no se ampliará el alcance de los metadatos sociales.

## Generación y mantenimiento

El SVG será el activo maestro. Los formatos raster y el ICO se generarán desde ese vector con una herramienta reproducible disponible en el proyecto o mediante un script pequeño y enfocado si la cadena actual no ofrece una conversión fiable. No se incorporará una dependencia de producción para generar favicons en tiempo de ejecución.

La implementación no cambiará tipografía, navegación, textos comerciales ni otros componentes. Tampoco añadirá una versión horizontal independiente del logo: la cabecera seguirá componiendo el símbolo con el nombre y el rol existentes.

## Validación

- Confirmar que todos los PNG tienen las dimensiones declaradas y que el ICO contiene 16, 32 y 48 px.
- Inspeccionar el favicon a 16 y 32 px para comprobar que la “J”, la “F” y el detalle coral siguen siendo distinguibles.
- Revisar la cabecera en `/es` y `/en` a 1440 px y 390 px, en tema claro y oscuro, con sus estados normal y compacto.
- Confirmar que el nombre accesible del enlace de marca no cambia y que el SVG decorativo no añade contenido duplicado al lector de pantalla.
- Comprobar que los iconos `maskable` conservan el símbolo completo bajo recortes habituales.
- Ejecutar `pnpm run format:check`, `pnpm run check`, `pnpm run lint`, `pnpm run verify:ai-seo` y `pnpm run build`.

## Criterios de aceptación

El cambio estará terminado cuando la cabecera y todos los puntos de entrada del navegador utilicen el mismo lenguaje de marca, el favicon sea reconocible a 16 px, el resultado funcione en ambos temas y los activos instalables tengan nombres, dimensiones y zonas seguras correctos.
