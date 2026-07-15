---
title: "APIs idempotentes que sobreviven a reintentos: guía práctica para backend developers"
metaTitle: "APIs idempotentes: patrones seguros ante reintentos"
description: "Aprende a diseñar APIs idempotentes que sobreviven a reintentos sin crear pagos, pedidos o jobs duplicados. Patrones prácticos, ejemplos y trade-offs."
date: 2026-05-23
language: "es"
author: "José Miguel Fernández"
readingTime: "6 min"
translationSlug: "idempotent-apis-that-survive-retries"
commercial:
  role: technical-authority
  audience: technical
  cluster: api-integrations
cover:
  src: "/images/blog/covers/idempotent-apis-that-survive-retries.avif"
  alt: "Ilustración editorial sobre APIs idempotentes que sobreviven a reintentos: guía práctica para backend developers"
tags: [api-design, backend, reintentos, idempotencia, rest, webhooks, pagos]
---

Si tu API recibe reintentos, tus decisiones de diseño importan bastante más que en un demo feliz donde todo sale a la primera.

Una petición que llega una vez es fácil. Una petición que llega dos veces porque el cliente ha hecho timeout, la red ha parpadeado o un worker ha petado ya es otra cosa. Ahí un endpoint aparentemente inocente puede crear pagos duplicados, pedidos duplicados, emails duplicados o jobs duplicados.

La idempotencia existe para ese hueco.

La versión corta: una API idempotente le da al cliente una forma segura de repetir una petición sin cambiar el resultado más de una vez.

## Qué significa idempotencia de verdad

En lenguaje normal, idempotencia significa esto:

- enviar la misma petición varias veces lleva al mismo resultado final
- los reintentos no crean efectos secundarios duplicados
- el servidor puede reconocer que ya ha procesado esa operación

Eso **no** significa que todas las respuestas sean idénticas, ni que todos los métodos HTTP sean automáticamente seguros para repetir de la forma que tu negocio necesita.

El problema aparece sobre todo con `POST`, porque `POST` suele crear algo o disparar trabajo. Si el cliente reintenta esa petición después de un timeout, el servidor puede no saber si el primer intento llegó a completarse.

Ahí entra la _idempotency key_.

[![Un flujo que muestra cómo un reintento idempotente devuelve el mismo resultado en vez de crear un duplicado](/images/blog/idempotency-flow.svg)](/images/blog/idempotency-flow.svg)

## Por qué esto importa en sistemas reales

Los fallos típicos son aburridos y caros:

- un pago se cobra dos veces
- un pedido se crea dos veces
- un handler de webhook se ejecuta dos veces
- un job en background se agenda dos veces
- un usuario recibe dos emails de confirmación

Ninguno de esos bugs parece dramático en una revisión de código. Aparece después, cuando la red se porta mal o un cliente upstream reintenta con demasiada alegría.

Yo me lo imagino así:

```text
el cliente envía la petición
       ↓
el servidor empieza a trabajar
       ↓
hay timeout en la red
       ↓
el cliente reintenta
       ↓
el servidor tiene que decidir:
  - procesar otra vez
  - o devolver el resultado anterior
```

Si tu API no sabe responder bien la segunda vez, en realidad no es fiable. Es una apuesta.

## Un patrón práctico que sí funciona

El patrón más limpio es este:

1. el cliente genera una clave de idempotencia
2. el cliente la envía con la petición
3. el servidor guarda la clave junto al resultado de la operación
4. si vuelve a llegar la misma clave, el servidor devuelve el resultado original

La clave no es un header random más. Forma parte del contrato entre cliente y servidor.

Un flujo mínimo sería algo así:

```text
POST /payments
Idempotency-Key: 9f1b2c...

1ª petición:
- validar entrada
- crear el pago
- guardar la respuesta bajo esa clave
- devolver éxito

2ª petición con la misma clave:
- detectar duplicado
- devolver el resultado guardado
- no cobrar otra vez
```

Lo importante no es el header en sí. Lo importante es que el servidor controle el deduplicado.

## Qué deberías guardar

Como mínimo, guarda suficiente información para contestar al retry de forma segura.

Normalmente eso significa:

- la clave de idempotencia
- la huella de la petición
- el estado de la operación
- el cuerpo de la respuesta o una referencia al recurso creado
- marcas de tiempo para limpiar datos antiguos
- el usuario o tenant, si aplica

No guardes solo la clave y cruces los dedos. Si dos peticiones distintas reutilizan la misma clave, necesitas una forma de detectar el conflicto.

## Los trade-offs que casi nadie cuenta

La idempotencia parece sencilla hasta que llegan los bordes.

### 1. Los replays tienen que estar controlados

Si guardas las claves para siempre, el almacenamiento crece y se llenan de basura histórica. Si las borras demasiado pronto, los reintentos se cuelan.

### 2. Misma clave, payload distinto

Si un cliente reutiliza una clave con un body diferente, necesitas una política clara:

- rechazarlo
- o tratarlo como conflicto

No lo aceptes en silencio.

### 3. Efectos secundarios fuera de la base de datos

Si tu endpoint envía un email, mete algo en una cola o llama a otro servicio, también tienes que pensar en eso. Guardar solo el resultado en BD no basta si el side effect ya ocurrió.

### 4. No todos los reintentos deben ocultarse

Hay reintentos que deberían fallar con ruido. Si la petición está mal formada o no está autorizada, la idempotencia no debería convertir eso en un éxito silencioso.

[![Una comparación entre reintentos inseguros a la izquierda e idempotentes a la derecha](/images/blog/idempotency-compare.svg)](/images/blog/idempotency-compare.svg)

## Qué haría yo en la práctica

Si hoy tuviera que diseñar un endpoint backend, seguiría este checklist:

- hacer la operación explícita y pequeña
- exigir una clave de idempotencia para acciones no repetibles
- persistir la clave y el resultado
- deduplicar antes de ejecutar side effects
- devolver la respuesta original en el retry
- rechazar conflictos entre clave y payload
- expirar claves antiguas con una política razonable
- loguear suficiente contexto para trazar luego la petición

> **Regla práctica:** si una petición duplicada te puede hacer daño, haz que duplicarla sea imposible o inocuo.

## La idempotencia no sustituye un buen diseño HTTP

Esta parte se rompe a menudo.

La idempotencia ayuda con los reintentos. No arregla:

- un modelado pobre de recursos
- códigos de estado confusos
- errores inconsistentes
- contratos vagos
- falta de observabilidad

Sigues necesitando buenos endpoints, respuestas predecibles y documentación clara.

Formatos como RFC 9457 / Problem Details pueden ayudar, porque hacen que los fallos sean más fáciles de parsear para el cliente y más fáciles de depurar para humanos. Pero eso es otro problema. La idempotencia va de evitar side effects duplicados.

## Cierre

La idempotencia es uno de esos temas backend que parecen pequeños hasta que te ahorran un bug muy caro.

Si tu API acepta reintentos, diseña pensando en ellos desde el principio. No hagas como si no fueran a pasar. Van a pasar. Y cuando pasen, tu sistema debería devolver el mismo resultado o fallar de una forma que sea segura de reintentar.

Si estás diseñando un backend que va a producción, este tema conecta con [Spring Boot en producción](/es/blog/spring-boot-produccion-checklist-devops/) y con el servicio de [integraciones API](/es/services/integraciones-api/), donde los reintentos y errores visibles son parte del contrato.

Mejor eso que descubrir cobros duplicados a las 2 de la mañana.

## Fuentes y referencias

- <a href="https://docs.stripe.com/api/idempotent_requests" rel="noopener noreferrer">Stripe: Idempotent requests</a>
- <a href="https://www.ietf.org/archive/id/draft-ietf-httpapi-idempotency-key-header-01.html" rel="noopener noreferrer">Borrador IETF: The Idempotency-Key HTTP Header Field</a>
- <a href="https://datatracker.ietf.org/doc/html/rfc9457" rel="noopener noreferrer">RFC 9457: Problem Details for HTTP APIs</a>
- <a href="https://swagger.io/blog/problem-details-rfc9457-api-error-handling/" rel="noopener noreferrer">Swagger: Problem Details (RFC 9457) API error handling</a>
