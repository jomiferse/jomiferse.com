---
title: "Rediseñar una web sin perder SEO: checklist de migración"
description: "Qué revisar antes y después de un rediseño web: inventario de URLs, redirecciones, contenidos, formularios y seguimiento en Search Console."
date: 2026-09-22
author: "José Miguel Fernández"
readingTime: "9 min"
translationSlug: "website-redesign-seo-checklist"
commercial:
  role: buyer-led
  audience: business
  cluster: website-redesign
cover:
  src: "/images/blog/covers/website-redesign-seo-checklist.avif"
  alt: "Ilustración editorial de una web antigua cuyas páginas se revisan y conectan con una versión nueva"
tags: [rediseno-web, migracion-web, seo, redirecciones, pymes]
---

Para **rediseñar una web sin perder SEO**, empieza por saber qué páginas atraen visitas y contactos, conserva las URLs que siguen teniendo sentido y prueba cualquier cambio de dirección antes de publicarlo. El diseño nuevo debe mantener las respuestas que ya encuentran tus clientes y facilitar el siguiente paso: pedir información, reservar o comprar.

No existe una garantía de conservar todas las posiciones. Una migración puede producir fluctuaciones mientras Google procesa los cambios. La [documentación de Google sobre migraciones](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) explica ese comportamiento. El trabajo consiste en reducir fallos evitables y tener datos para detectar problemas.

Esta guía parte de una decisión ya tomada: vas a renovar la web. Si todavía estás valorando el alcance, empieza por [rediseñar una web o hacerla de nuevo](/es/blog/redisenar-web-o-hacerla-de-nuevo/). Aquí el objetivo es preparar la entrega y comprobar que funciona.

## Qué pedir antes de aprobar el rediseño

Pide un inventario de páginas, un mapa de cambios y un responsable del seguimiento. Una captura del diseño no permite saber qué ocurrirá con un artículo enlazado desde otra web o con una página de servicio que recibe pocas visitas, pero buenos contactos.

El presupuesto debería aclarar quién revisa las direcciones antiguas, quién configura las redirecciones y cuánto tiempo se dedica a comprobar el resultado. Si nadie tiene asignadas esas tareas, todavía falta parte del proyecto. Puedes usar estos criterios para [evaluar un presupuesto de desarrollo](/es/blog/evaluar-presupuesto-software-a-medida/) y concretar qué significa que la web esté entregada.

Mi propuesta de documento de trabajo es sencilla:

| Entregable             | Qué permite comprobar                    | Quién debería validarlo                |
| ---------------------- | ---------------------------------------- | -------------------------------------- |
| Inventario de URLs     | Qué existe y qué debe conservarse        | Negocio y desarrollo                   |
| Mapa de destinos       | Dónde terminará cada página que cambia   | Desarrollo y responsable del contenido |
| Pruebas de aceptación  | Qué debe funcionar el día de publicación | Negocio                                |
| Registro de resultados | Qué cambió respecto al punto de partida  | Responsable de medición                |

No hace falta convertir una web pequeña en un proyecto burocrático. Una hoja compartida con decisiones y evidencias puede bastar.

## 1. Guarda un punto de partida que puedas comparar

Exporta los datos disponibles de Search Console por página y consulta. Para un negocio con poco tráfico, conviene mirar varios meses además de las últimas semanas: una página útil puede pasar días sin recibir un clic. Anota el intervalo, el país y los filtros para repetir después la comparación.

Separa las búsquedas de marca de las búsquedas de servicios. Si crecen las consultas con el nombre de tu empresa y caen las que describen tu trabajo, el total puede ocultarlo. También conviene distinguir español e inglés cuando la web tiene ambos idiomas.

Guarda una copia de los textos principales, títulos y descripciones. Añade capturas del formulario y del mensaje de confirmación. Sirven para comparar comportamientos cuando alguien diga que antes se pedía otro dato o que las solicitudes llegaban a un buzón distinto.

Relaciona las páginas con resultados de negocio cuando tengas esa información. Una visita no equivale a una oportunidad comercial. Si no sabes qué páginas generan contactos, registra esa limitación en vez de rellenarla con estimaciones presentadas como hechos.

## 2. Decide qué URLs se conservan y cuáles cambian

Cambiar colores, tipografía o distribución no exige cambiar las direcciones. Si `/servicios/reformas/` sigue representando el mismo servicio, conservarla elimina una parte del trabajo de migración.

Prepara una fila para cada URL que pueda importar: páginas de servicio, artículos, campañas vigentes y documentos que compartes con clientes. En una web pequeña revisaría todas las páginas publicadas; en una grande empezaría por las que tienen tráfico, enlaces o una función comercial conocida, sin olvidar después el resto.

Este ejemplo es ficticio:

| URL actual               | Decisión                               | Destino esperado     |
| ------------------------ | -------------------------------------- | -------------------- |
| `/servicios/reformas/`   | Mantener dirección y revisar contenido | La misma página      |
| `/empresa/contacta.html` | Cambiar dirección                      | `/contacto/`         |
| `/blog/reforma-cocina/`  | Mantener artículo                      | La misma página      |
| `/promocion-2019/`       | Revisar si existe una alternativa útil | Decisión documentada |

<picture>
  <source media="(max-width: 40rem)" srcset="/images/blog/website-redesign-url-map-es-mobile.svg" width="640" height="1030" />
  <img src="/images/blog/website-redesign-url-map-es.svg" width="1600" height="640" sizes="(max-width: 52rem) calc(100vw - 2rem), 50rem" alt="Esquema de inventario, redirección 301 y destino útil para una URL de una web rediseñada" loading="lazy" decoding="async" />
</picture>

Evita decidir por intuición que todo lo antiguo sobra. Una página poco vistosa puede resolver una pregunta que el diseño nuevo ha olvidado. Tampoco hay que conservar promociones vencidas como si siguieran activas: explica qué se retira y por qué.

## 3. Prueba las redirecciones fuera del editor

Cuando una dirección cambia de forma definitiva, configura una redirección permanente en el servidor, normalmente `301` o `308`. Google documenta la diferencia entre [redirecciones permanentes y temporales](https://developers.google.com/search/docs/crawling-indexing/301-redirects). No basta con que un enlace del menú apunte al sitio correcto.

Abre la URL antigua directamente. Comprueba la respuesta HTTP y el destino final. Después confirma que la página de destino presenta el contenido esperado. Un resultado técnicamente correcto puede llevar a una página que ya no responde a la necesidad original.

Incluye en las pruebas las variantes que realmente usaba la web: rutas con extensión, barras finales y enlaces de campañas relevantes. Un parámetro comercial puede cambiar el comportamiento de un formulario; decide si debe conservarse en lugar de borrarlo por comodidad.

Para aceptar esta parte del trabajo, pide un listado con URL de origen, destino esperado, destino observado y resultado. Eso permite corregir errores concretos y repetir la comprobación tras publicar. La configuración escrita en un archivo es una intención; la respuesta del servidor es la evidencia.

## 4. Conserva la información que ayuda a elegirte

Un rediseño puede eliminar contenido útil sin cambiar una sola URL. Ocurre cuando una página que explicaba alcance, plazos y condiciones se sustituye por una fotografía grande y un texto breve.

Revisa cada servicio con una pregunta: ¿puede una persona decidir si esto encaja con su caso? Mantén las respuestas necesarias, aunque cambies su orden o su forma. Las preguntas frecuentes deben salir de dudas reales. No hace falta repetir el mismo bloque genérico en todas las páginas.

También revisaría las pruebas de trabajo: capturas, ejemplos, enlaces a proyectos y resultados que puedas sostener. Si una referencia ha quedado obsoleta, actualízala o explica su contexto. Inventar una cifra de conversión para que el nuevo diseño parezca convincente empeora la credibilidad.

La guía sobre [qué debe tener una web profesional para captar clientes](/es/blog/que-debe-tener-web-profesional-para-captar-clientes/) ayuda a revisar esta parte. Un título más corto o una sección más limpia solo sirven si siguen explicando bien el servicio.

## 5. Revisa indexación, canonical e idiomas

En el entorno de pruebas puedes restringir el acceso. Antes de publicar, verifica que las páginas destinadas a aparecer en buscadores no conservan un `noindex` accidental. Bloquear el rastreo en `robots.txt` no equivale a impedir la indexación; Google explica cómo funciona la [directiva noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

Comprueba también el `canonical`: es una señal que indica la URL preferida entre versiones duplicadas o muy similares. No debe apuntar al dominio de pruebas. La [guía de canonicalización](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) detalla su uso.

Si tienes versiones en español e inglés, revisa que el selector de idioma lleve al artículo equivalente. Los enlaces `hreflang` deben reflejar esas relaciones y ser recíprocos, como describe Google para [páginas localizadas](https://developers.google.com/search/docs/specialty/international/localized-versions). Traducir el menú no demuestra que esas relaciones estén bien configuradas.

Por último, revisa que el sitemap incluya las URLs canónicas que quieres mostrar en buscadores. Es una ayuda para descubrir páginas, no una garantía de indexación; consulta las [indicaciones para crear un sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## 6. Comprueba el recorrido hasta el contacto

Haz las pruebas con un móvil y con un ordenador. Recorre una página de servicio desde el primer texto hasta el formulario, cambia de idioma y comprueba que puedes leer y pulsar los controles sin ampliar la pantalla.

Envía una solicitud de prueba identificada como tal y verifica su recepción en el destino acordado. Comprueba campos obligatorios, mensajes de error y confirmación. Repite una prueba cuando falle la conexión: el usuario necesita saber si debe volver a intentarlo.

Si existe un CRM, confirma que la solicitud llega con los campos correctos. Una página de agradecimiento no demuestra que el equipo comercial haya recibido nada. En la guía de [integración de formularios, CRM y pagos](/es/blog/integrar-crm-formularios-pagos/) explico los estados y errores que conviene contemplar.

Anota también qué ocurre con la medición según las preferencias de consentimiento. Una caída de eventos puede ser un fallo de configuración; no la interpretes automáticamente como una caída de solicitudes reales.

## 7. Publica con una lista de aceptación y un plan de vuelta

Para una pyme propondría esta lista de salida:

- Las páginas prioritarias responden y muestran el contenido aprobado.
- Las URLs que cambian llegan al destino acordado.
- Las páginas públicas no heredan bloqueos del entorno de pruebas.
- Los enlaces, imágenes y archivos relevantes funcionan.
- Una solicitud de prueba llega al buzón o sistema previsto.
- Hay una copia recuperable y una persona disponible para resolver incidencias.

Define qué justifica volver atrás: formularios inutilizables, errores generalizados o pérdida de información comercial importante, por ejemplo. Una oscilación diaria de posiciones no tiene la misma urgencia.

Si la web recibe pedidos o solicitudes persistentes, volver al código anterior no debe borrar los datos recibidos después del cambio. El plan de recuperación necesita contemplar ambas cosas. Acordarlo antes evita improvisar cuando el equipo está bajo presión.

## 8. Mide por páginas y consultas después del lanzamiento

Comprueba pronto los errores funcionales y deja un periodo de observación para las tendencias de búsqueda. En Search Console, compara intervalos equivalentes y revisa páginas, consultas y dispositivos, no solo el total. El [informe de rendimiento](https://support.google.com/webmasters/answer/7576553) permite desglosar esas dimensiones.

Si cambiaste URLs, agrupa la dirección antigua y la nueva en tu seguimiento. De otro modo puedes interpretar una transferencia de visibilidad como una pérdida completa.

Mantén un registro con fecha, síntoma, hipótesis y comprobación. Por ejemplo: una página pierde impresiones, se detecta que su contenido principal desapareció y se revisa esa decisión. Cambiar títulos, textos y redirecciones a la vez hace más difícil entender qué ha ocurrido.

## Preguntas frecuentes

### ¿Cambiar de WordPress a otra tecnología hace perder SEO?

La tecnología por sí sola no permite predecir el resultado. La revisión debe centrarse en las páginas publicadas, su contenido y su funcionamiento. Pide pruebas sobre esas salidas concretas en el [proyecto de rediseño web](/es/services/website-redesign/).

### ¿Se puede garantizar que no baje ninguna posición?

No. Se puede comprometer un proceso de revisión y corrección, pero no controlar todas las decisiones del buscador ni lo que publican los competidores. Desconfía de una garantía que no distinga esas responsabilidades.

### ¿Qué debo entregar al desarrollador?

Acceso adecuado al sitio y a la medición, un inventario del contenido, las páginas comerciales prioritarias y los recorridos que deben seguir funcionando. Comparte los accesos por un canal seguro y acuerda quién los revoca al terminar.

### ¿Cuándo está terminado el trabajo?

Cuando se han comprobado los entregables y existe un responsable del seguimiento acordado. La fecha de publicación es un hito; la aceptación debería incluir pruebas y un registro de incidencias resueltas o pendientes.
