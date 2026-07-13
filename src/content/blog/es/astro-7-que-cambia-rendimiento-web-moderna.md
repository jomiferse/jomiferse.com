---
title: "Astro 7: qué cambia, rendimiento y por qué importa para la web moderna"
description: "Una guía técnica y práctica sobre Astro 7: Vite 8, compilador en Rust, Sätteri, Advanced Routing, DX, rendimiento y cuándo conviene migrar."
date: 2026-06-23
language: "es"
author: "José Miguel Fernández"
readingTime: "12 min"
translationSlug: "astro-7-what-changed-performance-modern-web"
cover:
  src: "/images/blog/covers/astro-7-what-changed-performance-modern-web.avif"
  alt: "Ilustración editorial sobre Astro 7: qué cambia, rendimiento y por qué importa para la web moderna"
tags: [astro, frontend, performance, javascript, web-development]
---

Astro 7 no cambia la idea de fondo de Astro. La refuerza.

La apuesta sigue siendo la misma: generar HTML rápido, enviar poco JavaScript al navegador y reservar la interactividad para las partes que realmente la necesitan. Lo nuevo está más abajo en la pila: compilador en Rust, Vite 8, una nueva canalización de Markdown, mejor routing para aplicaciones con backend y herramientas más cómodas para trabajar con agentes de código.

[![Ilustración técnica de Astro 7 con compilador en Rust, páginas de contenido, islands architecture y pipeline de build](/images/blog/astro-7-hero.svg)](/images/blog/astro-7-hero.svg)

Eso importa si mantienes un blog, un portfolio, una landing page, una documentación o una web de contenido que tiene que cargar rápido y ser fácil de editar. También importa si usas Astro para algo más parecido a una aplicación: rutas con lógica de servidor, APIs, middleware, cache y despliegue en Vercel, Netlify o Cloudflare.

> **Idea corta:** Astro 7 no es una excusa para rehacer una web. Es una buena razón para revisar el build, la canalización de Markdown, el HTML generado y las integraciones antes de actualizar.

## Astro sigue apostando por menos JavaScript

Astro sigue siendo especialmente fuerte en webs donde el contenido manda: blogs técnicos, portfolios, webs profesionales, landing pages, documentación, sitios editoriales y páginas de servicios.

La diferencia frente a una SPA tradicional no es solo "Astro es rápido". La diferencia es arquitectónica. Astro genera HTML por defecto y solo hidrata los componentes interactivos que se declaran como islands. El resto de la página puede ser contenido estático, CSS y enlaces normales.

[![Diagrama conceptual de Astro Islands: una página envía HTML y solo hidrata los componentes interactivos que necesitan JavaScript](/images/blog/astro-islands-architecture.svg)](/images/blog/astro-islands-architecture.svg)

Para un portfolio como este, esa decisión encaja bien: las páginas de servicio, los artículos y los proyectos deben ser indexables, rápidos y fáciles de leer. Para un cliente que necesita una [web de negocio](/es/services/diseno-web-wordpress/) o un [rediseño web](/es/services/website-redesign/), el valor está en que el usuario entienda la oferta sin esperar a que una app completa se hidrate.

Astro 7 no cambia ese modelo. Lo que hace es mejorar varias piezas internas que se notan cuando el proyecto crece: más Markdown, más páginas, más integraciones, más lógica de servidor y builds más frecuentes.

## Novedades principales de Astro 7

La versión 7.0 se publicó el 22 de junio de 2026. Según el anuncio oficial, el foco principal está en rendimiento de build, compilación y DX. Las piezas más relevantes son estas:

- **Vite 8:** Astro 7 actualiza su base de tooling a Vite 8. Para proyectos normales, la promesa práctica es builds más rápidos sin reconfigurar todo el proyecto.
- **Compilador de `.astro` en Rust:** el compilador anterior en Go desaparece y el compilador en Rust pasa a ser el predeterminado.
- **Sätteri como procesador Markdown por defecto:** Astro 7 cambia la canalización estándar de Markdown y MDX hacia un procesador nativo en Rust.
- **Rendering por cola estabilizado:** la estrategia de renderizado que venía como experimental queda estabilizada.
- **Advanced Routing por defecto:** se estabiliza el control avanzado del flujo de request con `src/fetch.ts` y soporte cómodo para Hono.
- **Route caching estable:** `cache` y `routeRules` pasan a opciones de configuración de primer nivel.
- **Servidor de desarrollo en background:** útil para agentes de código y flujos automatizados.
- **Logging estructurado:** se estabiliza la API de logger, incluyendo salida JSON.
- **Breaking changes:** cambian reglas de whitespace, desaparecen APIs de transiciones internas y se elimina `@astrojs/db`.

No todas esas novedades pesan igual para todos. En un blog estático, Sätteri y el compilador son más importantes. En una app con SSR, middleware y APIs, Advanced Routing, cache y logging empiezan a tener más valor.

## Astro 6 vs Astro 7

| Area                    | Astro 6                                                      | Astro 7                                                                 | Impacto práctico                                                                                           |
| ----------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Bundler base            | Vite 7 en la rama 6.x                                        | Vite 8                                                                  | Mejoras de build asociadas al nuevo stack de Vite. Revisa plugins personalizados antes de darlo por hecho. |
| Compilador `.astro`     | Compilador anterior en Go, con Rust como opción experimental | Compilador en Rust por defecto                                          | Builds e iteraciones más rápidas en proyectos grandes, y errores más claros cuando el HTML es inválido.    |
| Corrección de HTML      | El compilador podía corregir o reordenar markup inválido     | El compilador deja el HTML tal como está y falla ante sintaxis inválida | Conviene ejecutar build y revisar plantillas antiguas con tags sin cerrar.                                 |
| Markdown y MDX          | Pipeline basado en remark/rehype por defecto                 | Sätteri por defecto                                                     | Los sitios con mucho Markdown pueden ganar en build, pero los plugins remark/rehype necesitan revisión.    |
| Whitespace HTML         | `compressHTML: true` por defecto                             | `compressHTML: "jsx"` por defecto                                       | Puede cambiar espacios visibles entre elementos inline. Hay que revisar la UI.                             |
| Advanced Routing        | Experimental desde Astro 6.3                                 | Estable y activado por defecto                                          | Más control sobre auth, APIs, middleware, logging y composición con Hono.                                  |
| Route caching           | Experimental                                                 | Estable, con `cache` y `routeRules` en la raíz de la config             | Más útil para contenido on-demand y sitios con CMS o datos vivos.                                          |
| Dev server para agentes | Flujo clásico de `astro dev`                                 | `astro dev --background`, `status`, `logs` y `stop`                     | Menos fricción cuando se trabaja con asistentes de código o automatización.                                |
| Logging                 | Logger experimental en 6.2                                   | Logger estable con JSON y composición                                   | Mejor integración con observabilidad en SSR y despliegues de producción.                                   |
| APIs eliminadas         | Algunas APIs estaban deprecadas                              | `@astrojs/db` e internos de `astro:transitions` se eliminan             | Si el proyecto los usaba, hay migración obligatoria.                                                       |

## Rendimiento: qué deberías medir de verdad

El anuncio oficial de Astro habla de mejoras de build importantes en su conjunto de benchmarks. Eso no significa que todos los proyectos vayan a ver el mismo porcentaje.

El rendimiento real depende de varias cosas:

- cuántas páginas estáticas generas
- cuánto Markdown o MDX procesas
- si usas plugins remark, rehype o recma
- cuántos componentes `.astro` compila el proyecto
- qué integraciones oficiales tienes instaladas
- si el sitio es estático o usa SSR
- qué trabajo hace Vite durante el bundle

En una landing pequeña, quizá apenas lo notes. En documentación, blogs grandes o webs con cientos de páginas de contenido, el cambio puede ser más visible.

También conviene distinguir entre cuatro métricas:

1. **Tiempo de build:** cuánto tarda `astro build`.
2. **Arranque del dev server:** cuánto tarda `astro dev` en estar listo.
3. **Tamaño de salida:** cuánto pesa `dist`.
4. **Experiencia real de usuario:** Lighthouse, Core Web Vitals, peso de JS y latencia real.

Astro 7 apunta sobre todo al build y a la DX. Si tu web ya enviaba poco JavaScript, el usuario final no va a notar una mejora mágica solo por actualizar. Lo que sí puedes notar tú es que el proyecto se construye antes y falla de forma más estricta ante plantillas incorrectas.

## Benchmark local

Hice un benchmark sintético en `/private/tmp`, fuera de este repo, para no tocar dependencias del proyecto real. El objetivo era comparar Astro 6.4.8 y Astro 7.0.0 con el mismo contenido y la misma versión de Node.

[![Gráfico comparando Astro 6 y Astro 7 en un benchmark local de build, arranque de dev server y tamaño de salida](/images/blog/astro-6-vs-7-build-flow.svg)](/images/blog/astro-6-vs-7-build-flow.svg)

**Metodología:**

- Node: `v24.15.0`
- Proyecto temporal con 80 páginas Markdown.
- Cada página incluía tablas, bloques de código, blockquotes y listas.
- Tres ejecuciones por versión.
- Antes de cada build se eliminaron `dist` y `.astro`.
- Lighthouse no se ejecutó porque el fixture no representa una web real navegable con diseño, assets y comportamiento de usuario.

Comandos usados:

```bash
npm install
npm run --silent build
npm run --silent dev -- --host 127.0.0.1 --port <port>
du -sh dist
```

| Métrica                | Astro 6.4.8     | Astro 7.0.0     | Resultado local                      |
| ---------------------- | --------------- | --------------- | ------------------------------------ |
| Build run 1            | 2671 ms         | 1506 ms         | Astro 7 más rápido                   |
| Build run 2            | 2614 ms         | 1419 ms         | Astro 7 más rápido                   |
| Build run 3            | 3339 ms         | 1287 ms         | Astro 7 más rápido                   |
| Build medio            | 2875 ms         | 1404 ms         | 51% menos tiempo en este fixture     |
| Dev ready medio        | 1198 ms         | 1148 ms         | Diferencia pequeña, alrededor de 4%  |
| Tamaño medio de `dist` | 1,722,736 bytes | 1,722,811 bytes | Prácticamente igual                  |
| `du -sh dist`          | 1.9M            | 1.9M            | Sin diferencia visible a esta escala |

> **Lectura honesta:** este benchmark no demuestra que todas las webs vayan a construir un 51% más rápido. Sí sugiere que, en un fixture pequeño pero cargado de Markdown, Astro 7 reduce claramente el tiempo de build sin cambiar de forma relevante el tamaño generado.

Para un proyecto real, mediría además:

- `pnpm run build` en el repo real antes y después
- peso de JS generado por ruta
- Lighthouse o WebPageTest sobre páginas representativas
- tiempo de despliegue en Vercel o Netlify
- rutas más lentas si hay SSR

## Impacto en DX y backend

La parte más visible para frontend es el build. La parte más interesante para perfiles full-stack está en Advanced Routing, route caching y logging.

Con Astro 7 puedes añadir un `src/fetch.ts` para controlar el flujo de requests de forma más explícita. Eso abre una puerta útil cuando una web deja de ser solo contenido y empieza a necesitar auth, middleware, APIs, proxys, logging o composición con Hono.

Un ejemplo simplificado:

```ts
import { astro, FetchState } from "astro/fetch";

export default {
  async fetch(request: Request) {
    const state = new FetchState(request);

    if (state.url.pathname.startsWith("/api")) {
      return fetch(new URL(state.url.pathname, "https://api.example.com"));
    }

    return astro(state);
  },
};
```

No metería esto en un blog simple solo porque existe. Pero sí lo miraría en una [aplicación web a medida](/es/services/software-a-medida/), una [herramienta interna](/es/services/internal-tools/) o una integración donde Astro convive con APIs y middleware.

El logging estructurado también es buena noticia para SSR:

```js
import { defineConfig, logHandlers } from "astro/config";

export default defineConfig({
  logger: logHandlers.json(),
});
```

Para producción, eso encaja mejor con CloudWatch, Grafana Loki, Kibana o cualquier agregador de logs. Para desarrollo asistido por IA, el servidor en background reduce una fricción real: `astro dev` ya no tiene por qué bloquear una sesión automatizada. Si trabajas con Codex, Claude Code o herramientas parecidas, esto conecta con la misma tendencia que comenté en el artículo sobre [MCP para desarrolladores](/es/blog/mcp-para-desarrolladores-protocolo-herramientas-ia/): menos pegamento manual, más herramientas que se comportan bien dentro del flujo real.

## Cambios importantes antes de migrar

Aquí conviene ir con calma. Astro 7 no es una actualización para hacer a ciegas en viernes por la tarde.

### Markdown: Sätteri por defecto

Astro 7 usa Sätteri como procesador Markdown y MDX por defecto. Si tu proyecto no depende de plugins remark o rehype, puede que no tengas que tocar nada.

Pero si usas plugins, toca revisar. Este sitio, por ejemplo, mantiene `@astrojs/markdown-remark` y configura `unified()` para añadir `nofollow`, `noopener` y `noreferrer` a enlaces externos. En un caso así, no basta con asumir que Sätteri cubrirá el mismo comportamiento.

Configuración para seguir con unified:

```js
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";

export default defineConfig({
  markdown: {
    processor: unified(),
  },
});
```

### Whitespace con `compressHTML: "jsx"`

Astro 7 cambia el comportamiento por defecto de `compressHTML` a reglas tipo JSX. En la práctica, puede desaparecer un espacio visible entre elementos inline si estaba provocado por un salto de línea.

Ejemplo:

```astro
<span>Hola</span>
<em>mundo</em>
```

Si necesitabas un espacio entre ambos, mejor hacerlo explícito:

```astro
<span>Hola</span>{" "}<em>mundo</em>
```

Este repo ya configura `compressHTML: true`, así que conserva el comportamiento anterior. Aun así, en cualquier migración real revisaría cabeceras, botones, links inline, badges y componentes compactos.

### Advanced Routing y `src/fetch.ts`

Si ya tienes un archivo `src/fetch.ts` que no está relacionado con routing avanzado, Astro 7 puede interpretarlo como entrypoint. La guía oficial recomienda renombrarlo o configurar `fetchFile`.

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  fetchFile: "./src/router.ts",
});
```

Si no necesitas Advanced Routing y tienes un conflicto de nombre:

```js
export default defineConfig({
  fetchFile: null,
});
```

### APIs eliminadas o deprecadas

Los puntos más sensibles:

- `@astrojs/db` se elimina.
- Los comandos `astro db`, `astro login`, `astro logout`, `astro link` y `astro init` asociados a Astro DB desaparecen.
- Varias APIs internas de `astro:transitions` ya no están disponibles.
- `getContainerRenderer()` desde la raíz de integraciones oficiales queda deprecado a favor de `@astrojs/react/container-renderer` y equivalentes.
- `experimental.rustCompiler`, `experimental.queuedRendering`, `experimental.cache`, `experimental.routeRules` y configuraciones experimentales relacionadas deben revisarse.

## Checklist de migración

| Revisión                                | Por qué importa                                       | Acción                                                        |
| --------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| Leer la guía oficial de upgrade         | Astro 7 tiene breaking changes reales                 | Repasar la guía antes de tocar versiones                      |
| Actualizar Astro e integraciones juntas | Las integraciones oficiales tienen majors alineados   | Usar `npx @astrojs/upgrade` o actualizar manualmente          |
| Ejecutar build limpio                   | El compilador en Rust es más estricto                 | Borrar caches locales si hace falta y correr `pnpm run build` |
| Revisar Markdown/MDX                    | Sätteri cambia el procesador por defecto              | Auditar plugins remark, rehype y recma                        |
| Revisar whitespace inline               | `compressHTML: "jsx"` puede cambiar espacios visibles | Inspeccionar UI y añadir `{" "}` donde sea necesario          |
| Buscar `src/fetch.ts`                   | Puede convertirse en entrypoint de Advanced Routing   | Renombrar, configurar `fetchFile` o desactivar                |
| Buscar `@astrojs/db`                    | El paquete se eliminó                                 | Migrar a SQLite de Node, Drizzle u otra opción                |
| Buscar APIs de transiciones internas    | Ya no están disponibles                               | Usar nombres de eventos del View Transitions Router           |
| Revisar Container API                   | Cambia el entrypoint recomendado                      | Usar `/container-renderer` en integraciones oficiales         |
| Medir rendimiento                       | Las mejoras dependen del proyecto                     | Comparar build, `dist`, JS y rutas importantes                |

## ¿Deberías actualizar ya?

| Tipo de proyecto                                | Recomendación                              | Por qué                                                                              |
| ----------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------ |
| Blog técnico o documentación con mucho Markdown | Actualizar pronto, con revisión de plugins | Sätteri y el nuevo pipeline pueden reducir builds, pero los plugins mandan.          |
| Portfolio o web profesional estática            | Actualizar con calma                       | Probablemente sea sencillo, pero conviene revisar whitespace y build.                |
| Landing pages pequeñas                          | No hay urgencia si todo funciona           | El usuario quizá no note cambio; el beneficio estará en mantenimiento y tooling.     |
| Web de contenido grande                         | Prioridad alta                             | Muchas páginas y Markdown suelen ser el caso donde el build importa más.             |
| App con SSR, APIs o middleware                  | Actualizar tras una prueba en staging      | Advanced Routing, cache y logging compensan, pero el riesgo de integración es mayor. |
| Proyecto con muchos plugins remark/rehype       | Esperar hasta auditar                      | La migración de Markdown puede ser el punto más delicado.                            |
| Proyecto usando `@astrojs/db`                   | Planificar migración antes de actualizar   | Astro DB se eliminó y necesitas alternativa.                                         |

Mi criterio: si el proyecto está activo y usa Astro 6, merece la pena preparar la migración. Si es una web pequeña que apenas cambia, no correría sin revisar. Si es una web con contenido frecuente, CI lento o mucho Markdown, Astro 7 es más interesante.

## Conclusión

Astro 7 importa porque mejora justo la parte que los usuarios no ven pero los equipos sí sufren: builds, compilación, Markdown, logging, routing y herramientas de desarrollo.

No convierte automáticamente una web lenta en rápida. Si tu problema es exceso de JavaScript de terceros, imágenes mal servidas o una arquitectura confusa, la actualización no lo arregla sola. Pero si ya usas bien Astro, la versión 7 empuja en la dirección correcta: menos coste de build, tooling más moderno y más control cuando el sitio deja de ser puramente estático.

Para blogs, portfolios y webs de servicios, el mensaje práctico es simple: actualiza cuando puedas medir y revisar. Para apps con backend, hazlo en una rama o entorno de staging y presta atención a routing, cache y logs.

La web moderna no necesita más JavaScript por defecto. Necesita mejores decisiones sobre dónde ponerlo. Astro 7 sigue siendo una herramienta muy buena para eso.

## Fuentes

- [Astro 7.0, blog oficial](https://astro.build/blog/astro-7/)
- [Release notes de Astro 7.0.0 en GitHub](https://github.com/withastro/astro/releases/tag/astro%407.0.0)
- [Guía oficial: Upgrade to Astro v7](https://docs.astro.build/en/guides/upgrade-to/v7/)
- [Documentación oficial: Upgrade Astro](https://docs.astro.build/en/upgrade-astro/)
- [Documentación oficial: Advanced Routing](https://docs.astro.build/en/guides/advanced-routing/)
- [Referencia oficial de configuración: logger](https://docs.astro.build/en/reference/configuration-reference/#logger)
