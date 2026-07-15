# Estrategia del blog para captación de clientes

## Objetivo

Convertir el blog bilingüe en un canal de descubrimiento y captación para la nueva posición de consultoría, sin perder la credibilidad que aportan los artículos técnicos. El blog debe servir a dos públicos: responsables de negocio u operaciones y responsables técnicos, CTOs o fundadores con capacidad de contratar.

La estrategia no busca maximizar tráfico genérico. Cada artículo debe ayudar a que una persona adecuada reconozca un problema, entienda el criterio de José Miguel y llegue a un servicio, caso relacionado o contacto coherente con lo que acaba de leer.

## Evidencia de partida

La revisión de Google Search Console realizada el 15 de julio de 2026 cubrió los datos disponibles entre el 8 de diciembre de 2025 y el 13 de julio de 2026:

- El sitio completo registró 540 impresiones, 15 clics, un CTR medio del 2,8 % y una posición media de 18,5.
- Las URLs que contienen `/blog/` registraron 301 impresiones, 3 clics, un CTR medio del 1 % y una posición media de 16,8.
- El blog produjo aproximadamente el 56 % de las impresiones del sitio.
- Los clics visibles del blog llegaron a CV Studio, la migración de un backend legacy a Spring Boot y la comparación entre Kafka, RabbitMQ y una base de datos.
- Arquitectura hexagonal, mensajería y CV Studio concentraron buena parte de las impresiones no ligadas a la marca.
- Las consultas visibles fueron mayoritariamente técnicas, como `when to use rabbitmq`, `arquitectura hexagonal`, `hexagonal architecture` y `kafka vs postgres`.

Estos datos no justifican eliminar el contenido técnico. Al contrario, muestran que actualmente es la principal vía de descubrimiento orgánico del blog, aunque su transición hacia servicios y contacto todavía es débil.

La medición tampoco representa el inventario actual del repositorio:

- La versión pública observada corresponde a `origin/main` del 9 de julio de 2026, mientras la copia local está 106 commits por delante.
- Los artículos comerciales fechados el 11 de julio todavía no aparecen en el sitemap público consultado.
- Search Console procesó `https://jomiferse.com/sitemap-index.xml`, pero su última lectura fue el 29 de mayo y el sitemap hijo `https://www.jomiferse.com/sitemap-0.xml` figura como no obtenido, con cero URLs descubiertas.
- Ambos sitemaps responden públicamente en la actualidad y el índice redirige de la versión sin `www` a la versión canónica con `www`, por lo que se debe conseguir una nueva lectura después del siguiente despliegue antes de evaluar el rendimiento editorial.

## Enfoques considerados

### Eliminar los artículos técnicos

Reduciría la mezcla temática, pero también eliminaría casi toda la visibilidad orgánica no vinculada al nombre de José Miguel. Además, impediría demostrar criterio ante responsables técnicos. Se descarta.

### Mantener el inventario sin cambios

Conservaría la visibilidad existente, pero las búsquedas técnicas seguirían terminando en un CTA genérico y pocos lectores identificarían qué intervención profesional corresponde a su problema. Se descarta como estado final.

### Modelo híbrido seleccionado

Se mantienen los artículos técnicos como activos de autoridad y se orientan hacia problemas comprables. Los artículos comerciales se convierten en las páginas de entrada para búsquedas con intención de evaluar una solución o proveedor. Los casos de construcción muestran experiencia aplicada. Cada pieza conserva su función editorial, pero todas tienen un siguiente paso comercial específico.

## Modelo editorial

Cada pareja de artículos español/inglés pertenecerá a una sola función principal.

### Contenido orientado al comprador

Responde a preguntas que aparecen antes de contratar: coste, señales, alternativas, alcance, riesgos, evaluación de propuestas y momento adecuado para actuar. Su lector principal es un responsable de negocio, operaciones o producto.

Ejemplos actuales:

- Cuánto cuesta automatizar un proceso administrativo.
- Cuánto cuesta crear una herramienta interna.
- Cuándo sustituir Excel por una herramienta interna.
- Cómo evaluar un presupuesto de software a medida.
- Cuándo necesita una empresa mantenimiento Spring Boot.
- Qué revisar antes de reescribir un backend.

### Autoridad técnica aplicada

Responde a una decisión o problema técnico que puede tener consecuencias operativas, de mantenimiento o de riesgo. Mantiene profundidad técnica, pero explica cuándo el tema deja de ser una elección académica y requiere una intervención profesional. Su lector principal es un CTO, responsable técnico o fundador técnico.

Ejemplos actuales:

- Arquitectura hexagonal.
- Kafka, RabbitMQ o base de datos.
- Rendimiento y producción en Spring Boot.
- Idempotencia en APIs.
- Dimensionamiento de Kubernetes.
- Monolito modular frente a microservicios.

### Caso de trabajo

Explica un problema real, restricciones, decisiones, capacidades entregadas y lecciones sin inventar resultados. Debe demostrar cómo se trabaja, no funcionar como diario de desarrollo.

Ejemplos actuales:

- CV Studio.
- Betx.

## Contrato comercial de cada artículo

Cada artículo tendrá un único contexto comercial principal compartido por sus dos idiomas:

- una función editorial;
- un público principal;
- un problema empresarial o técnico comprable;
- un clúster comercial propietario;
- un servicio o landing principal;
- uno o dos artículos relacionados;
- un CTA final adaptado al problema;
- una ruta de contacto que conserve el origen del artículo.

El contexto debe apoyarse en los clústeres y servicios tipados existentes. No se crearán rutas nuevas únicamente para acomodar un artículo ni se añadirán varios servicios competidores al mismo CTA.

El frontmatter será la fuente de verdad editorial. El esquema de contenido incorporará un objeto comercial obligatorio con tres identificadores tipados: función editorial, público principal y clúster comercial. El clúster resolverá mediante código compartido el servicio localizado, el CTA y el contexto de contacto; el Markdown no duplicará URLs canónicas ni configuración de servicios. Las dos traducciones de una pareja deberán declarar los mismos identificadores y un verificador comprobará su equivalencia.

## Cambios de contenido

La revisión de cada artículo seguirá una pauta proporcional. No se reescribirá texto útil solo para hacerlo más comercial.

### Apertura

Los artículos orientados al comprador abrirán con el síntoma, coste operativo o decisión que llevó a la búsqueda. Los artículos técnicos podrán conservar una entrada técnica, pero deberán identificar pronto el tipo de sistema, equipo o riesgo para el que la decisión importa.

### Puente entre técnica y negocio

Cuando no exista, se añadirá una sección breve que explique:

- qué consecuencias tiene la decisión en operación, mantenimiento, entrega o coste;
- cuándo la complejidad está justificada;
- qué señales indican que hace falta diagnóstico o implementación;
- qué alternativa más sencilla conviene cuando el problema todavía no lo requiere.

Este puente debe ser concreto y diferente en cada artículo. No se repetirá un bloque promocional estándar dentro del cuerpo.

### Prueba y límites

Los artículos podrán enlazar a casos y experiencia factual. No se inventarán métricas, clientes, testimonios, ahorros ni resultados. También indicarán cuándo José Miguel no recomendaría el servicio o la arquitectura descrita.

### Siguiente paso

El CTA principal llevará al servicio o landing propietario del clúster. El contacto será secundario y conservará `sourceCategory=article` y `sourcePath`. Se sustituirá el CTA global genérico cuando exista contexto suficiente para uno específico, sin insertar varios botones a mitad del artículo.

## Enlazado y distribución

- Cada artículo enlazará de forma natural a una sola página comercial propietaria.
- Los artículos técnicos enlazarán a una pieza orientada al comprador cuando ayude a avanzar desde el aprendizaje hacia una decisión.
- Las páginas de servicio mantendrán enlaces inversos hacia los artículos que resuelven objeciones o demuestran criterio.
- Los casos de trabajo enlazarán al servicio correspondiente y a su página de proyecto cuando exista.
- Se evitarán enlaces repetitivos, anchors forzados y listados genéricos de todos los servicios.
- Los enlaces y destinos serán equivalentes en español e inglés, respetando las rutas canónicas de cada idioma.

## Tratamiento inicial del inventario

### Conservar y priorizar

Se priorizarán los clústeres con relación directa con la oferta: herramientas internas, Excel, automatización, integraciones API, auditoría técnica, mantenimiento y modernización de Spring Boot, software a medida y web orientada a conversión.

### Conservar y reencuadrar

Arquitectura hexagonal, mensajería, idempotencia, rendimiento, Kubernetes, Astro y monolito frente a microservicios se conservarán como autoridad técnica. Se revisarán su encuadre, puente comercial, enlaces y CTA, pero no se rebajará su precisión para atraer lectores de negocio.

### Convertir en caso

CV Studio y Betx se ajustarán para que el problema, las restricciones, las decisiones y lo entregado sean más visibles que el relato de construcción. Mantendrán los detalles técnicos que demuestran experiencia.

### Evaluar más adelante

MCP y cualquier pieza que no apoye claramente un servicio quedarán en observación. No se retirarán antes de que el contenido actual esté publicado, indexado y medido durante un periodo suficiente.

## Regla de poda

No se eliminará, desindexará ni redirigirá un artículo durante la primera implementación editorial.

Un artículo solo podrá proponerse para fusión o retirada cuando se cumplan todas estas condiciones:

- ha estado publicado e indexable durante al menos 12 semanas desde la lectura correcta del sitemap;
- no ha recibido impresiones no vinculadas a la marca en los últimos 90 días;
- no tiene clics, leads atribuidos ni enlaces externos conocidos;
- no aporta una prueba técnica o un caso único;
- no sostiene un clúster comercial ni responde a una objeción útil;
- existe un destino equivalente y relevante para una redirección permanente.

Si dos artículos compiten por la misma intención, se preferirá fusionarlos y redirigir la URL secundaria. Nunca se dejarán enlaces internos rotos ni se eliminará una URL con señales sin revisar consultas, páginas enlazantes y destino.

## Publicación e indexación antes de medir

La evaluación comienza únicamente cuando la versión pública refleje el inventario aprobado.

1. Confirmar qué commits y cambios locales deben formar parte del despliegue, sin incluir modificaciones ajenas por accidente.
2. Publicar las parejas bilingües y comprobar que todas sus rutas responden correctamente.
3. Verificar que `sitemap-index.xml` y `sitemap-0.xml` contienen las URLs canónicas con `www` y barra final coherente.
4. Confirmar redirecciones y canonicalización de variantes sin `www` o sin barra final para evitar señales divididas.
5. Solicitar una nueva lectura del sitemap canónico en Search Console y comprobar que deja de mostrar cero URLs descubiertas.
6. Confirmar la indexación de una muestra representativa de artículos comerciales, técnicos y casos.

Las acciones de despliegue y Search Console requieren una autorización separada en el momento de ejecutarlas.

## Medición

Se conservará una línea base por artículo y clúster. No se añadirá un proveedor de analítica nuevo.

### Search Console

- impresiones y clics no vinculados a la marca;
- CTR;
- posición media;
- consultas de entrada;
- páginas con crecimiento o canibalización;
- diferencias entre español e inglés.

### Recorrido comercial

- clics desde artículos hacia la página comercial propietaria, si la analítica existente permite registrarlos;
- contactos con `sourceCategory=article` y `sourcePath`;
- servicio seleccionado o contexto enviado desde el artículo;
- artículos que participan en una consulta aunque no sean la última página visitada, cuando exista evidencia disponible.

### Ventanas de revisión

- Revisión técnica después del despliegue y nueva lectura del sitemap.
- Primera revisión editorial a las 6–8 semanas para detectar problemas de indexación, títulos o enlazado.
- Decisiones de consolidación o poda a partir de las 12 semanas, aplicando la regla completa anterior.

## Fases de entrega

1. Resolver la publicación pendiente, sitemap, canonicals y línea base.
2. Crear el contexto comercial tipado para las 27 parejas de artículos.
3. Adaptar el CTA final para que use el servicio y contacto correspondientes.
4. Revisar primero los artículos con impresiones actuales y los clústeres comerciales prioritarios.
5. Reencuadrar los casos de trabajo.
6. Completar los artículos restantes en lotes bilingües pequeños.
7. Validar rutas, enlaces, traducciones, tono y SEO.
8. Medir durante las ventanas acordadas antes de proponer fusiones o retiradas.

Cada lote debe ser revisable y dejar el sitio compilable. Los cambios de texto conservarán la intención equivalente entre idiomas sin exigir traducción literal.

## Verificación

La implementación deberá comprobar:

- que las 27 parejas publicadas tienen función, público, clúster y destino comercial;
- que el CTA resuelve a una ruta localizada válida;
- que los contactos conservan un origen validado;
- que los enlaces internos usan rutas canónicas y localizadas;
- que ninguna pareja traducida recibe una intención comercial contradictoria;
- que no se han inventado resultados, clientes o métricas;
- que el sitemap contiene todo el inventario publicado;
- que las variantes de host y barra final redirigen a la URL canónica;
- que no hay enlaces rotos ni URLs retiradas sin redirección.

Antes de completar la implementación se ejecutarán `pnpm run format:check`, `pnpm run lint`, `pnpm run check`, `pnpm run verify:ai-seo`, `pnpm run build` y `git diff --check`, además de cualquier verificador específico que se añada para el contexto comercial del blog.

## Fuera de alcance

- Eliminar artículos durante la primera implementación.
- Inventar testimonios, clientes, cifras o resultados.
- Rebajar artículos técnicos a contenido superficial.
- Crear categorías o páginas de etiquetas sin una necesidad de búsqueda demostrada.
- Añadir un proveedor de analítica nuevo.
- Comprar enlaces, automatizar outreach o crear contenido masivo.
- Cambiar el diseño editorial del blog aprobado en especificaciones anteriores, salvo lo necesario para mostrar un CTA contextual.
