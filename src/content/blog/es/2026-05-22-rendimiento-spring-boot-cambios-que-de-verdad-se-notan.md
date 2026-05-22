---
title: "Rendimiento en Spring Boot: los cambios que de verdad se notan"
description: "Guía práctica para mejorar el rendimiento en Spring Boot con medición, caché, async, pool de base de datos y observabilidad."
date: "2026-05-22"
language: "es"
tags: [spring-boot, java, rendimiento, backend, observabilidad]
---

Cuando una app Spring Boot va lenta, casi nunca se arregla “echándole más framework”. Normalmente se arregla encontrando el cuello de botella real y tocando solo lo que de verdad mueve la aguja.

Y eso, aunque suene básico, se hace mal muchísimo. Se detectan peticiones lentas, alguien sube el tamaño del pool, otro cambia una anotación, y al final el sistema acaba más complejo sin ir realmente mejor.

Este artículo es la versión que me gustaría haber leído antes de empezar a tunear a ciegas.

## La idea corta

Mejorar el rendimiento en Spring Boot no va de exprimir cada milisegundo del JVM. Va de quitar trabajo innecesario y hacer más visible lo caro de la aplicación.

Normalmente, las palancas que más impacto tienen son:

- cachear trabajo repetido
- usar procesos asíncronos cuando el bloqueo es el problema real
- ajustar bien el pool de conexiones de la base de datos en vez de adivinar
- sacar métricas útiles para ver qué cambió de verdad

Si haces bien esas cuatro cosas, suele salir mucho mejor que intentando trucos raros.

> **Regla práctica:** optimiza el camino que está caliente en producción, no el que queda bonito en una revisión de código.

## Empieza midiendo, no tocando código

Antes de cambiar nada, yo me haría tres preguntas:

1. ¿Dónde se está yendo el tiempo?
2. ¿El cuello de botella es CPU, memoria, IO, base de datos o falta de hilos?
3. ¿El problema apareció tras un cambio de código, crecimiento de tráfico o cambio de infraestructura?

Si todavía no sabes responderlas, no adivines la solución.

Spring Boot trae buenas piezas de observabilidad de serie, sobre todo con Actuator y las métricas basadas en Micrometer. Por ahí empezaría yo.

Lo primero que miro:

- percentiles de latencia, no solo medias
- tasa de errores
- tiempo de espera para conexiones de base de datos
- saturación de pools de hilos
- pausas de GC si la app genera mucha basura
- endpoints lentos que se repiten bajo carga real

Si tu dashboard solo enseña medias, te está escondiendo el problema.

## 1. Cachea lo caro y repetido

La caché es una de las mejoras más limpias cuando el mismo trabajo caro se repite una y otra vez.

Puede ser:

- una consulta de catálogo que cambia poco
- una lectura de configuración casi estática
- un cálculo de permisos
- una respuesta de una API externa que no hace falta pedir en cada request

Spring Boot soporta caché muy bien, pero lo importante no es la anotación. Lo importante es elegir bien el borde donde tiene sentido.

Las reglas que me parecen sensatas son estas:

- cachea resultados caros y suficientemente estables
- usa claves predecibles
- define la invalidación antes de ponerlo en producción
- no caches todo solo porque se pueda

La documentación oficial de Spring Boot lo deja bastante claro: se activa de forma deliberada y conviene mantener el diseño simple.

```java
@Configuration
@EnableCaching
class CacheConfig {
}
```

Yo no pondría `@EnableCaching` en la clase principal salvo que de verdad quieras que forme parte del arranque central de la app.

> **Error típico:** usar la caché como parche para una query mala o un problema de N+1 sin límite. La caché puede tapar el dolor. No lo elimina.

## 2. Usa async solo cuando bloquear sea el problema

Async sirve cuando un trabajo puede ir en segundo plano y la petición no necesita esperar a que termine.

Buenos candidatos:

- enviar emails
- escribir eventos de auditoría
- llamar a servicios lentos que no son críticos para responder
- generar informes que pueden acabar más tarde

Malos candidatos:

- lógica que debe quedar consistente antes de devolver respuesta
- código que depende de estado mutable compartido sin estrategia
- usar async solo porque “queda moderno”

El soporte de `@Async` en Spring Framework es bastante directo, pero necesita una estrategia real de executor, no fe.

```java
@Configuration
@EnableAsync
class AsyncConfig {
}

@Service
class NotificationService {
  @Async
  public CompletableFuture<Void> sendWelcomeEmail(Long userId) {
    // trabajo en segundo plano
    return CompletableFuture.completedFuture(null);
  }
}
```

La pregunta de verdad no es “¿puedo hacerlo async?”. La pregunta buena es: “¿debe salir este trabajo del hilo de la request?”

Si la respuesta es sí, async puede ayudar bastante.

Si la respuesta es no, puedes complicarte la vida sin ganar nada.

## 3. Ajusta el pool de base de datos con cabeza

Una cantidad sorprendente de problemas de rendimiento en Spring Boot en realidad son problemas de base de datos.

Si tu app tarda porque está esperando conexiones, la solución no siempre es subir el pool. A veces el problema real es:

- queries lentas
- demasiada concurrencia
- transacciones demasiado largas
- fugas de conexiones
- un pool que no encaja con la carga real

Spring Boot suele preferir HikariCP por rendimiento y concurrencia, y eso tiene bastante sentido. Pero que sea el default no significa que sea el valor correcto para tu caso.

Yo miraría esto:

- tiempo medio y p95 de espera de conexión
- conexiones activas frente a idle
- si el pool se satura bajo carga real
- si el cuello está realmente en la query y no en el pool

Un ejemplo simple:

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 1000
```

Eso no es una configuración mágica. Es solo un punto de partida para medir.

> **Error típico:** subir el tamaño del pool cada vez que la app va lenta. Si la base de datos ya es el cuello de botella, un pool más grande puede empeorarlo.

## 4. Usa Actuator para ver lo que la app está haciendo de verdad

Optimizar rendimiento sin observabilidad es, básicamente, adivinar con mejor vocabulario.

Spring Boot Actuator es útil porque hace la app más fácil de inspeccionar en entornos parecidos a producción. Junto con las métricas, ayuda a responder preguntas como:

- ¿Las peticiones van lentas por CPU o por IO?
- ¿La memoria está generando presión de GC?
- ¿Los pools de hilos están saturados?
- ¿La base de datos está esperando conexiones?

Yo veo Actuator como la capa de instrumentación que mantiene honesto el proceso de tuning.

Si cambias algo, verifica el efecto con métricas antes y después. Si no, lo único que haces es decorar código.

## Un ejemplo práctico

Imagina una API sencilla que carga el perfil de usuario, trae preferencias y manda un evento de auditoría.

Un ajuste razonable podría ser:

1. cachear las preferencias si cambian poco
2. mover el evento de auditoría a async
3. revisar el pool de base de datos para ver si hay espera de conexiones
4. exponer tiempos con Actuator y mirar cómo cambian los percentiles

No es mucho trabajo. Y justo por eso suele dar mejoras reales.

## Lo que yo no haría primero

No empezaría por:

- meter más hilos
- reescribir todo con reactive porque “parece más rápido”
- subir el pool de base de datos a ciegas
- meter caché distribuida antes de entender el cuello local
- micro-optimizar controladores que ni siquiera están calientes

Muchos regresos de rendimiento vienen de resolver muy bien el problema equivocado.

## Mi lectura práctica

El buen tuning en Spring Boot suele ser aburrido en el buen sentido.

Primero mides.
Quitas trabajo repetido.
Sacas del hilo principal lo que bloquea y no hace falta.
Mantienes la base de datos bajo control.
Sacas métricas para que el siguiente cambio sea más fácil.

Ese es el trabajo de verdad: no hacer que la app parezca optimizada, sino que se comporte mejor bajo carga.

Si además te interesa cómo encaja esto con una stack backend práctica, este artículo combina muy bien con el de [ajustar el tamaño de los pods en Kubernetes](/es/blog/ajustar-tamano-pods-kubernetes-requests-limits/) y el de [MCP para desarrolladores](/es/blog/2026-05-21-mcp-para-desarrolladores-protocolo-herramientas-ia/).

## Conclusión

Mejorar el rendimiento en Spring Boot funciona mejor cuando lo tratas como debugging, no como decoración.

Mide el cuello de botella.
Elimina el trabajo repetido caro.
Usa async donde de verdad aporta.
Alinea el pool de base de datos con la realidad.

Si haces eso bien, la app va más rápido sin convertir el código en un experimento raro.

## FAQ

**¿Conviene activar caché por defecto?**  
Solo si la app tiene lecturas repetidas y caras que se puedan reutilizar de forma segura. La caché funciona muy bien cuando la estrategia de invalidación está clara.

**¿`@Async` mejora siempre el rendimiento?**  
No. Ayuda cuando puedes sacar trabajo bloqueante no crítico del camino de la request. También puede complicar el debug si abusas.

**¿Qué ajusto primero: el pool de base de datos o el JVM?**  
Normalmente primero la parte de base de datos, porque la espera de conexiones y las queries lentas suelen ser cuellos habituales. El tuning del JVM importa, pero rara vez es mi primera palanca.

**¿Necesito Actuator en producción?**  
Si quieres diagnosticar rendimiento con menos adivinanzas, sí. No hace falta exponer todos los endpoints, pero sí tener observabilidad.

## Fuentes y verificación

- Spring Boot caching docs — https://docs.spring.io/spring-boot/reference/io/caching.html
- Spring Boot production-ready features / Actuator — https://docs.spring.io/spring-boot/reference/actuator/index.html
- Spring Boot SQL / selección de pool de datasource — https://docs.spring.io/spring-boot/reference/data/sql.html
- `@Async` en Spring Framework — https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html
- Modelo de programación asíncrona en Spring MVC — https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-async.html
