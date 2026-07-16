# SEO de captación guiado por DataForSEO

## Objetivo

Convertir `jomiferse.com` en un canal de captación orgánica para servicios de diseño web, WordPress, software a medida, automatización, integraciones y backend. La prioridad comercial inicial será posicionar una landing local para `diseño web Granada`, sin perder las páginas nacionales y técnicas que demuestran capacidad o responden a otras intenciones de contratación.

DataForSEO será la fuente principal para decidir consultas objetivo. Search Console servirá para validar impresiones, consultas reales, indexación y canibalización después del despliegue. El volumen por sí solo no justificará una página: cada decisión debe ponderar intención, dificultad, CPC, encaje con la oferta y capacidad de demostrar el servicio sin inventar pruebas.

## Relación con diseños anteriores

Esta especificación conserva el modelo de propietarios de clúster, contenido bilingüe, enlaces comerciales tipados y atribución aprobado en `2026-07-11-qualified-lead-seo-design.md` y `2026-07-15-blog-client-acquisition-design.md`.

Sustituye únicamente estas decisiones anteriores:

- la landing genérica `desarrollador freelance en España` deja de ser una prioridad y se migra a una landing de `diseño web Granada`;
- se autoriza una única landing local para Granada, porque el usuario ha confirmado ese mercado prioritario y DataForSEO muestra demanda comercial;
- se permiten redirecciones adicionales cuando resuelvan variantes históricas que actualmente terminan en 404 o consoliden la landing reemplazada;
- el mapa de propietarios incorporará métricas e intención de búsqueda para que todas las decisiones comerciales sigan el mismo criterio.

No se creará una red de páginas por ciudades.

## Evidencia de partida

### DataForSEO

La investigación realizada el 16 de julio de 2026 para España y español muestra estas oportunidades principales:

| Consulta | Volumen mensual estimado | CPC | Intención | Dificultad | Decisión |
| --- | ---: | ---: | --- | ---: | --- |
| diseño web WordPress | 1.000 | 6,61 € | comercial | 18 | prioridad nacional |
| diseño web Granada | 480 | 4,29 € | comercial | 12 | prioridad local principal |
| software a medida | 390 | 11,38 € | comercial | sin dato | prioridad nacional |
| chatbots para empresas | 140 | 14,50 € | comercial | sin dato | prioridad secundaria |
| empresa mantenimiento WordPress | 140 | 14,03 € | navegacional/comercial | 15 | página de servicio transaccional |
| mantenimiento WordPress precio | 140 | sin dato | comercial | sin dato | apoyar decisión de compra |
| desarrollo web Granada | 110 | 6,77 € | comercial | 18 | secundaria de la landing local |
| agentes de IA para empresas | 70 | 11,77 € | comercial | sin dato | prioridad secundaria en crecimiento |
| software a medida para empresas | 50 | 8,21 € | comercial | sin dato | secundaria del clúster de software |
| aplicaciones web a medida | 30 | 4,96 € | comercial | sin dato | secundaria del clúster de software |
| integración API | 30 | 13,29 € | principalmente informativa | sin dato | servicio especializado apoyado por casos |
| integración CRM | 20 | sin dato | comercial | sin dato | long tail de integraciones |
| integración ERP | 20 | sin dato | comercial | sin dato | long tail de integraciones |

Las variantes `diseño web en Granada` y `diseño web Granada` pertenecen al mismo clúster. `Diseño páginas web Granada` añade unas 50 búsquedas estimadas y también se tratará como variante secundaria, no como URL independiente.

Hay consultas con volumen alto que no deben convertirse automáticamente en propietarias de una página comercial:

- `consultoría informática` registra unas 1.300 búsquedas e intención clasificada como comercial, pero la SERP mezcla infraestructura, hardware, redes y soporte generalista que no describen la oferta real;
- `landing page` y `WooCommerce` tienen 6.600 búsquedas, pero intención informativa o navegacional demasiado amplia;
- `mantenimiento WordPress` registra unas 590 búsquedas, pero la SERP está dominada por tutoriales sobre el modo mantenimiento;
- `automatización de procesos` registra unas 720 búsquedas y `IA para empresas` unas 320, ambas principalmente informativas.

Estas consultas amplias podrán alimentar artículos, hubs y variantes semánticas, pero las páginas de contratación deben usar un encuadre explícito para empresas, servicio, alcance o precio.

DataForSEO no devolvió volumen para las variantes inglesas `web design Granada`, `web designer Granada`, `website design Granada` o `web development Granada` en España. La versión inglesa se conservará como equivalente de idioma y para usuarios internacionales, pero no será una prioridad de posicionamiento hasta que exista evidencia.

### Search Console

La ventana de tres meses revisada, del 14 de abril al 13 de julio de 2026, muestra 4 clics, 469 impresiones, un CTR del 0,9 % y una posición media de 18,5. La home española concentra 107 impresiones y el blog aporta buena parte de la visibilidad no vinculada a marca.

También se observaron:

- variantes históricas de servicio que reciben impresiones pero fallan cuando llevan barra final;
- una URL de artículo español bajo `/en/` que termina en 404;
- una variante inglesa de CV Studio bajo `/es/` rastreada pero no indexada;
- 10 URLs clasificadas como rastreadas pero no indexadas;
- un sitemap enviado con host no canónico y un sitemap hijo que Search Console no pudo obtener en su última lectura.

La nueva medición no comenzará hasta desplegar estos cambios, comprobar las URLs públicas y solicitar con autorización una nueva lectura del sitemap canónico.

### Auditoría técnica del repositorio y producción

- La validación completa actual pasa: formato, lint, 75 pruebas unitarias, Astro check y build.
- La home obtiene puntuaciones Lighthouse de 1 en rendimiento, accesibilidad, buenas prácticas y SEO en la medición ejecutada.
- DataForSEO puntúa las páginas comerciales analizadas entre 94 y 98, por lo que el problema principal no es una carencia básica de etiquetas.
- 158 de 159 documentos generados emiten `meta keywords`, etiqueta obsoleta que DataForSEO marca como irrelevante.
- Los índices de blog español e inglés comparten el mismo título y sus descripciones son poco específicas.
- Las redirecciones de aliases funcionan sin barra final, pero sus variantes con `/` terminan en 404 en producción.
- El sitio tiene dos backlinks detectados desde dos dominios de referencia; la autoridad externa es todavía limitada.

## Principios de decisión

1. Cada intención comercial tendrá una sola URL propietaria por idioma.
2. Una consulta solo será objetivo principal cuando encaje con un servicio que José Miguel presta realmente.
3. Las métricas de DataForSEO son una fotografía orientativa, no una promesa de tráfico ni ventas.
4. Las consultas informativas se resolverán principalmente desde el blog y enlazarán a la página comercial correspondiente.
5. Las páginas con poco volumen podrán mantenerse si atienden una intención diferenciada, una necesidad de cliente real o una prueba de especialización.
6. No se crearán páginas casi idénticas para variantes ortográficas, sinónimos o municipios cercanos.
7. No se inventarán dirección, oficina, equipo, testimonios, clientes, métricas ni resultados locales.
8. La copy debe sonar natural y específica; no se repetirá la palabra clave de forma mecánica.

## Propiedad de consultas y prioridades

### Nivel 1: captación prioritaria

#### Diseño web local

- Propietaria española: `/es/diseno-web-granada/`.
- Equivalente inglesa: `/en/web-design-granada/`.
- Principal: `diseño web Granada`.
- Secundarias: `diseño web en Granada`, `desarrollo web Granada`, `diseño páginas web Granada`, `diseñador web Granada`.
- Promesa: diseño y desarrollo de webs de servicios rápidas, claras y orientadas a generar contactos para negocios de Granada.

La página debe competir desde la posición honesta de profesional independiente: trato directo, criterio full-stack, rendimiento, SEO técnico, WordPress o Astro según el caso y acompañamiento después de la entrega. No usará `agencia` como identidad ni incluirá una dirección no demostrada.

#### Diseño web WordPress nacional

- Propietaria: `/es/services/diseno-web-wordpress/`.
- Principal: `diseño web WordPress`.
- Secundarias: `diseño web con WordPress`, `diseño web WordPress precio` y `agencia diseño web WordPress` solo como vocabulario comparativo, sin presentarse como agencia.

Esta página explicará cuándo conviene WordPress, alcance, edición, rendimiento, mantenimiento y factores de precio. Enlazará a la landing de Granada como opción local, sin duplicar su enfoque geográfico.

#### Software a medida

- Propietaria: `/es/services/software-a-medida/`.
- Principal: `software a medida`.
- Secundarias: `desarrollo de software a medida`, `software a medida para empresas` y `aplicaciones web a medida`.
- Apoyo: `/es/software-a-medida-pymes/`, `/es/sustituir-excel-software/` y artículos del clúster.

La propietaria cubre la categoría comercial. Las landings de pymes y sustitución de Excel solo resolverán problemas más específicos y enlazarán a la propietaria.

#### Mantenimiento WordPress

- Propietaria: `/es/services/mantenimiento-wordpress/`.
- Principal de compra: `empresa mantenimiento WordPress` o formulación equivalente de servicio profesional.
- Secundarias: `mantenimiento WordPress precio`, `precio mantenimiento web WordPress` y `mantenimiento mensual WordPress`.

La página no intentará ganar la intención tutorial de `modo mantenimiento WordPress`. Debe mostrar qué se mantiene, qué queda fuera, frecuencia, respuesta, seguridad, actualizaciones y factores de precio.

### Nivel 2: oportunidades comerciales específicas

- `/es/services/chatbots-y-asistentes/`: `chatbots para empresas`.
- `/es/services/agentes-de-ia/`: `agentes de IA para empresas`.
- `/es/services/integraciones-api/`: `integración API`, apoyada por CRM, ERP, formularios, pagos y casos concretos.
- `/es/services/automatizacion-de-procesos/`: formulación comercial `automatización de procesos para empresas`; el blog cubrirá la consulta genérica informativa.
- `/es/services/automatizaciones-con-ia/`: `automatización con IA para empresas`; `IA para empresas` funcionará como hub informativo.
- `/es/services/optimizacion-wordpress/`: `optimización WordPress`, con el caso de velocidad y Core Web Vitals como encuadre de compra.
- `/es/services/website-redesign/`: `rediseño web`, aclarando señales, alcance y migración en vez de repetir la página de diseño nuevo.

### Nivel 3: autoridad y demanda limitada

Spring Boot, auditoría técnica, modernización legacy, herramientas internas, dashboards, migración a WordPress, formación, segunda opinión y gestión de proyectos se conservarán cuando representen servicios reales o refuercen autoridad. No recibirán contenido de relleno ni prioridad equivalente a las páginas de niveles 1 y 2.

Después de la indexación y una ventana mínima de medición, las páginas que compartan intención y no aporten demanda, enlaces, impresiones, leads o diferenciación se propondrán para consolidación. No se eliminarán en esta primera implementación únicamente por tener poco volumen.

## Migración de la landing local

La definición bilingüe `freelance-developer-spain` se reemplazará por una landing de diseño web en Granada:

- `/es/desarrollador-freelance-espana/` redirigirá con 301 a `/es/diseno-web-granada/`;
- `/en/freelance-developer-spain/` redirigirá con 301 a `/en/web-design-granada/`;
- ambas nuevas URLs tendrán canonical propio y hreflang recíproco;
- el sitemap solo incluirá las URLs nuevas;
- enlaces internos, `llms.txt`, datos estructurados, propietarios de clúster y CTA de artículos se actualizarán al nuevo destino;
- cualquier enlace existente hacia la URL antigua se sustituirá por el canónico nuevo, aunque la redirección permanezca como red de seguridad.

El clúster tipado `freelance-developer` se renombrará a `local-web-design`. La pareja de artículos sobre contratar un desarrollador web freelance se revisará para que enlace a la landing local solo donde resulte natural y no prometa disponibilidad nacional como intención prioritaria.

## Arquitectura técnica

### Mapa SEO tipado

`src/lib/seo-clusters.ts` seguirá siendo la fuente de verdad. Cada clúster comercial incorporará, como mínimo:

- URL propietaria por idioma;
- consulta principal por idioma cuando exista evidencia;
- consultas secundarias;
- intención observada;
- nivel de prioridad;
- páginas de apoyo.

Las métricas numéricas se documentarán con fecha de captura, pero no se usarán para generar copy visible ni se tratarán como constantes permanentes. Un verificador impedirá propietarios duplicados y rutas inexistentes.

### Resolución de URLs históricas

Se creará un resolvedor central de rutas legacy. La ruta localizada `[...notFound].astro` lo consultará antes de devolver el 404:

1. normaliza host lógico, idioma y barra final;
2. busca aliases de servicios, landings reemplazadas y variantes de artículos conocidas;
3. devuelve 301 al destino canónico cuando existe coincidencia;
4. mantiene el 404 localizado y `noindex` para cualquier ruta desconocida.

Las redirecciones rápidas actuales de Astro se mantendrán para las variantes sin barra que ya funcionan. El resolvedor cubrirá las variantes con barra final y las rutas históricas que caen en el catch-all, sin crear bucles ni cadenas.

Se incluirán al menos estas correcciones observadas:

- aliases históricos de servicios con y sin barra final;
- `/en/blog/cuando-deberia-una-empresa-migrar-un-backend-legacy-a-java-spring-boot/` hacia el artículo inglés equivalente;
- `/es/blog/building-cv-studio/` hacia el artículo español equivalente;
- las dos URLs antiguas de la landing freelance hacia las nuevas páginas locales.

### Metadatos

- Se eliminará el prop y la salida HTML de `meta keywords` de `BaseLayout` y de todos sus consumidores.
- Las etiquetas o tecnologías podrán seguir existiendo en el contenido y en JSON-LD cuando tengan sentido semántico.
- Los títulos, descripciones y H1 se revisarán primero en las páginas propietarias de niveles 1 y 2.
- Los índices del blog tendrán títulos y descripciones localizados, únicos y descriptivos.
- Las páginas paginadas conservarán metadatos únicos por idioma y número de página.
- No se alargarán títulos únicamente para incluir varias variantes de consulta.

### Datos estructurados locales

La landing local utilizará `ProfessionalService` o `Service` dentro del grafo existente y declarará Granada como `areaServed`. La entidad seguirá siendo José Miguel Fernández, profesional independiente. Solo se añadirán datos de contacto, dirección o perfiles que ya sean públicos y verificables.

No se añadirá `LocalBusiness` con una dirección inventada ni se prometerán rich results.

## Contenido y conversión de la landing Granada

La landing conservará la composición visual comercial existente y deberá incluir:

- H1 claro con diseño web y Granada;
- explicación breve del tipo de negocio y problema que resuelve;
- servicios concretos: web de servicios, landing, rediseño, WordPress, Astro, rendimiento y mantenimiento;
- diferencias entre web nueva, rediseño y mantenimiento;
- proceso, alcance, factores de precio y tiempos sin promesas rígidas;
- pruebas enlazadas a proyectos y artículos reales;
- preguntas de compradores sobre plataforma, edición, SEO, propiedad, soporte y trabajo presencial/remoto;
- CTA prioritario de valoración del proyecto y CTA secundario hacia trabajos o servicios;
- referencias locales naturales, sin bloques repetitivos de palabras clave.

El copy español se redactará para captar empresas y profesionales de Granada. La versión inglesa tendrá intención equivalente para clientes internacionales de la zona, aunque no exista volumen registrado. No será una traducción literal ni intentará forzar consultas sin demanda.

## Enlazado interno y blog

- La home española y el hub de servicios enlazarán de forma contextual a la landing de Granada y a las principales páginas de servicio.
- La página de diseño web WordPress y la landing local se enlazarán de forma recíproca explicando la diferencia de intención.
- Cada artículo seguirá teniendo un solo clúster comercial propietario.
- Los artículos informativos de automatización, IA, mantenimiento, integración o diseño conducirán a su página comercial, no a una lista genérica de servicios.
- Los anchors describirán el destino con lenguaje natural y no repetirán siempre la consulta exacta.
- `public/llms.txt` se actualizará para reflejar la landing local, eliminar duplicados y conservar las URLs comerciales canónicas.

## Pruebas y verificación

La implementación seguirá pruebas primero para cambios de comportamiento.

### Pruebas unitarias

- resolución de aliases con y sin barra final;
- redirecciones de artículos en idioma incorrecto;
- migración de ambas URLs freelance;
- desconocidos que siguen devolviendo 404;
- ausencia de bucles o destinos no canónicos;
- unicidad de propietarios y existencia de rutas del mapa SEO.

### Pruebas de artefactos

- nuevas URLs en sitemap y antiguas excluidas;
- canonical y hreflang recíprocos;
- ausencia global de `meta[name="keywords"]`;
- títulos, descripciones y H1 únicos en páginas prioritarias;
- JSON-LD válido y `areaServed` para Granada;
- enlaces internos sin destinos históricos;
- redirecciones generadas y respuesta correcta del catch-all.

### Validación final

Se ejecutará la validación real configurada en el repositorio:

- `pnpm run quality`;
- cualquier verificador SEO específico que se añada;
- `git diff --check`;
- revisión manual de `/es/diseno-web-granada/` y `/en/web-design-granada/` en 1440 px y 390 px;
- comprobación de modo oscuro, navegación de idioma y ausencia de overflow;
- comprobación HTTP local de URLs canónicas, aliases y 404.

No se afirmará que la producción está corregida hasta desplegar y comprobar las respuestas públicas.

## Medición posterior al despliegue

Con autorización separada se enviará en Search Console `https://www.jomiferse.com/sitemap-index.xml` y se solicitará la validación o inspección de una muestra pequeña de URLs prioritarias.

Se registrará una línea base por página y clúster para medir:

- impresiones y clics no vinculados a marca;
- consultas de entrada y posición;
- CTR de páginas comerciales;
- URLs que compiten por la misma consulta;
- clics a contacto y leads atribuidos por `sourcePath` y servicio;
- indexación de las nuevas URLs y desaparición gradual de las antiguas;
- backlinks y dominios de referencia como indicador secundario.

Ventanas de revisión:

- comprobación técnica inmediatamente después del despliegue;
- primera revisión de indexación y consultas a las 4–6 semanas;
- evaluación de títulos, contenido, canibalización y consolidaciones a las 8–12 semanas;
- ninguna poda basada solo en ausencia de resultados antes de disponer de una ventana suficiente desde la lectura correcta del sitemap.

## Fases de implementación

1. Añadir pruebas para rutas legacy, propietarios, metadatos y sitemap.
2. Implementar el resolvedor de redirecciones históricas.
3. Migrar la landing freelance a diseño web Granada y actualizar hreflang, sitemap y enlaces.
4. Eliminar `meta keywords` y corregir metadatos duplicados o genéricos.
5. Incorporar métricas, consultas y prioridades al mapa SEO tipado.
6. Optimizar copy y enlazado de las páginas comerciales de nivel 1.
7. Ajustar páginas de nivel 2 según intención y evitar solapamientos con el blog.
8. Actualizar `llms.txt` y señales estructuradas.
9. Ejecutar validación automática, visual y HTTP.
10. Tras despliegue autorizado, renovar sitemap y línea base en Search Console.

Cada fase debe dejar el repositorio compilable y no incluir cambios ajenos.

## Fuera de alcance

- Crear páginas para otras ciudades o barrios.
- Inventar presencia física, dirección o Google Business Profile.
- Comprar enlaces, reseñas, menciones o contenido masivo.
- Añadir un proveedor de analítica nuevo.
- Reescribir los 54 artículos sin una necesidad demostrada.
- Eliminar páginas o artículos por bajo volumen durante esta primera implementación.
- Prometer posiciones, tráfico, contactos o ventas.
- Desplegar, modificar Search Console o actuar sobre perfiles externos sin autorización específica.

## Criterio de aceptación

La implementación estará lista para revisión cuando:

- `diseño web Granada` tenga una única landing propietaria, bilingüe y enlazada desde los puntos comerciales relevantes;
- las URLs freelance antiguas y los aliases observados redirijan con 301 sin cadenas;
- ninguna página generada emita `meta keywords`;
- el mapa SEO impida canibalización estructural y refleje las prioridades de DataForSEO;
- las páginas de nivel 1 respondan a intención de compra con copy natural, alcance y CTA claro;
- canonical, hreflang, sitemap y JSON-LD sean coherentes;
- todas las validaciones automáticas y revisiones manuales acordadas pasen;
- el informe final diferencie con claridad cambios de repositorio, acciones externas pendientes y métricas que solo podrán evaluarse después del despliegue.
