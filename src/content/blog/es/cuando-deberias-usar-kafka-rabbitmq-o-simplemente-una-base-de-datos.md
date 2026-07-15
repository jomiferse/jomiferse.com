---
title: "¿Cuándo deberías usar Kafka, RabbitMQ o simplemente una base de datos?"
description: "Guía para elegir entre Kafka, RabbitMQ y workflows con base de datos para procesos asíncronos."
date: 2026-06-13
language: "es"
author: "José Miguel Fernández"
readingTime: "9 min"
translationSlug: "when-should-you-use-kafka-rabbitmq-or-just-a-database"
commercial:
  role: technical-authority
  audience: technical
  cluster: api-integrations
cover:
  src: "/images/blog/covers/when-should-you-use-kafka-rabbitmq-or-just-a-database.avif"
  alt: "Ilustración editorial sobre ¿Cuándo deberías usar Kafka, RabbitMQ o simplemente una base de datos?"
tags:
  [backend, kafka, rabbitmq, mensajeria, spring-boot, postgresql, arquitectura]
---

Los sistemas de mensajería son útiles, pero entran demasiado pronto en muchos proyectos.

Equipos añaden Kafka o RabbitMQ porque "asíncrono" suena más escalable, más enterprise o más serio que una tabla en PostgreSQL. A veces sí. Otras, la mejor primera versión es una tabla con estado, un job programado y transacciones claras.

La idea es usar la herramienta más pequeña que cubra fiabilidad, escala y visibilidad.

[![Rutas de decisión de arquitectura backend para base de datos, RabbitMQ y Kafka](/images/blog/kafka-rabbitmq-database-decision.webp)](/images/blog/kafka-rabbitmq-database-decision.webp)

## La pregunta real

Antes de elegir Kafka, RabbitMQ o una cola en base de datos:

- ¿Necesitas procesamiento asíncrono o la petición puede terminar en línea?
- ¿Necesitas entrega fiable después de una caída o despliegue?
- ¿Necesitas historial de eventos o solo trabajo pendiente?
- ¿Varios consumidores deben reaccionar de forma independiente al mismo hecho?
- ¿Necesitas orden por usuario, cuenta, pago o agregado?
- ¿Necesitas reintentos y una dead-letter queue?
- ¿Esto es un workflow, un comando o un problema de event streaming?

Las respuestas deciden la herramienta. Kafka, RabbitMQ y una base de datos pueden sacar trabajo del request HTTP, pero no resuelven el mismo problema.

## Cuándo basta con una base de datos

Una base de datos suele bastar cuando el flujo es pequeño, interno y cercano a sus datos.

Por ejemplo, una API en Spring Boot crea un usuario y debe enviar un email de bienvenida. Guarda el usuario y una fila en `email_jobs` en la misma transacción. Un worker programado busca pendientes, envía el email, marca completado y reintenta si falla.

Ese patrón no es de juguete. Es observable y fácil de depurar. Puedes mirar la fila, cambiar un estado y razonar sobre la transacción sin otra pieza.

El mismo enfoque puede servir para:

- jobs pequeños y workflows internos de bajo volumen
- reintentos manuales de pagos fallidos
- trabajo dentro del mismo bounded context
- publicar después con el patrón transactional outbox

El transactional outbox merece mención aparte. Si un cambio en base de datos y la publicación de un evento deben ser consistentes, guarda el cambio de negocio y una fila de outbox en la misma transacción. Otro proceso publica esa fila a RabbitMQ, Kafka u otra integración. Así evitas que la base de datos confirme y el broker falle.

Las ventajas son reales: menos piezas, desarrollo local más fácil, transacciones claras y depuración directa.

También hay riesgos. El polling puede ser ineficiente. La concurrencia necesita bloqueos, leases o patrones tipo `SKIP LOCKED`. Una tabla compartida no debería convertirse en falsa integración entre servicios. Si muchos sistemas necesitan el mismo stream de eventos, una tabla empieza a ser mala señal.

## Cuándo usar RabbitMQ

RabbitMQ encaja con tareas, comandos y workflows: una parte del sistema pide a otra que haga algo, pero no quiere esperar en la petición HTTP.

Ejemplos razonables: emails, imágenes, workers en background, pasos de pagos, documentos en workflow y tareas fallidas con dead-letter queue.

RabbitMQ tiene un modelo mental centrado en colas. Un productor envía un mensaje. Un worker lo consume, lo confirma o lo falla. El routing puede variar, pero la idea base sigue clara.

Eso hace que RabbitMQ sea fácil de razonar en sistemas de tareas. Puedes escalar workers, usar acknowledgements, configurar reintentos y mandar mensajes problemáticos a una dead-letter queue. Si la pregunta es "¿cómo proceso este trabajo de forma fiable?", RabbitMQ suele encajar.

Sus límites vienen de esa forma. RabbitMQ no está pensado como log de eventos a largo plazo. Cuando los mensajes se consumen y confirman, normalmente desaparecen. No lo elegiría si nuevos consumidores deben reprocesar eventos históricos.

RabbitMQ escala, pero su modelo es distinto al de Kafka. Piensas en colas, consumidores, routing y confirmaciones, no tanto en particiones.

Usa RabbitMQ cuando el trabajo se parezca a procesamiento fiable de tareas.

## Cuándo usar Kafka

Kafka encaja con otro tipo de problema: event streaming duradero.

En vez de pensar "un worker ejecuta esta tarea", piensa "este evento ocurrió, y varios consumidores pueden necesitarlo ahora o más adelante".

Buenos casos para Kafka: actividad de usuarios, auditoría, analítica, ingesta de alto volumen, integración entre servicios y consumidores que reprocesan eventos pasados.

Kafka guarda eventos en un log append-only. Los consumidores leen a su ritmo. Distintos consumer groups pueden procesar el mismo topic de forma independiente. Un grupo puede actualizar búsqueda, otro alimentar analítica y otro lanzar controles de fraude.

La capacidad de replay es la gran diferencia. Si corriges un bug, quizá puedas reiniciar el offset y reprocesar eventos. Un servicio nuevo puede leer historial, no solo eventos futuros.

Kafka es potente, pero no gratis. El diseño de topics importa. Las particiones afectan al orden y al escalado. La evolución de esquemas exige disciplina. Operativamente, pide más que una tabla o un RabbitMQ pequeño.

Los reintentos y el procesamiento diferido pueden ser menos directos que con RabbitMQ. Kafka puede gestionar fallos, pero un flujo tipo "reintenta este job en 10 minutos y luego envíalo a una dead-letter queue" suele ser más natural en RabbitMQ.

Usa Kafka cuando el historial de eventos y los consumidores independientes sean parte central del diseño.

## Kafka vs RabbitMQ vs base de datos

| Pregunta    | Tabla / outbox              | RabbitMQ                | Kafka                    |
| ----------- | --------------------------- | ----------------------- | ------------------------ |
| Mejor para  | Workflows internos pequeños | Colas de tareas fiables | Event streaming          |
| Historial   | Solo si lo modelas          | No es su foco principal | Función central          |
| Replay      | Manual o a medida           | Limitado                | Fuerte                   |
| Complejidad | Baja                        | Media                   | Alta                     |
| Throughput  | Bueno para cargas modestas  | Bueno para colas        | Muy alto                 |
| Reintentos  | A medida, pero simple       | Encaja muy bien         | Posible, requiere diseño |
| Orden       | Transaccional, por fila     | Depende de la cola      | Por partición            |
| Operación   | Baja                        | Media                   | Más alta                 |
| Caso típico | Email de bienvenida         | Worker de imágenes      | Stream de actividad      |

## Errores comunes

- Usar Kafka como cola simple de jobs. Puede mover trabajo, pero no siempre es lo más claro para reintentos, delays y comandos a workers.
- Usar RabbitMQ cuando una transacción en base de datos bastaba. Si el trabajo vive en un servicio y el volumen es bajo, una tabla puede ser más fácil.
- Compartir tablas entre servicios como falsa integración. Eso suele ser un problema de límites.
- Añadir mensajería antes de entender modos de fallo.
- Ignorar idempotencia, observabilidad y que lo asíncrono suele mover complejidad en vez de eliminarla.

## Checklist práctico de decisión

- Empieza con la base de datos si el flujo es pequeño, interno, de bajo volumen y cercano a una transacción.
- Usa transactional outbox cuando el cambio en base de datos y la publicación de eventos deban ser consistentes.
- Usa RabbitMQ si necesitas tareas fiables, workers, reintentos, acknowledgements y dead-letter queue.
- Usa Kafka si necesitas un log de eventos, replay, alto throughput y varios consumer groups independientes.
- No introduzcas un broker si el equipo no puede monitorizarlo, operarlo y depurarlo.
- Haz que los consumidores sean idempotentes. Los mensajes pueden entregarse dos veces, reintentarse o procesarse después de una caída.
- Añade métricas, logs, trazas y alertas antes de producción.

## Idea final

La mejor arquitectura no es la más avanzada. Es la que tiene menos piezas sin dejar de cumplir fiabilidad, escalabilidad y necesidades reales.

Si una tabla resuelve el flujo, úsala. Si necesitas workers fiables, RabbitMQ sigue siendo sólida. Si necesitas un log duradero y consumidores independientes, Kafka se gana su sitio.

Para decisiones parecidas, lee [APIs idempotentes que sobreviven a reintentos](/es/blog/apis-idempotentes-que-sobreviven-a-reintentos/), [Spring Boot en producción](/es/blog/spring-boot-produccion-checklist-devops/) e [integraciones API](/es/services/integraciones-api/).

## FAQ

**¿Debería usar Kafka para jobs en background?**  
Normalmente no como primera opción. RabbitMQ o una cola en base de datos suelen ser más cómodos para reintentos, delays y workers.

**¿RabbitMQ está obsoleto porque existe Kafka?**  
No. RabbitMQ sigue siendo útil para colas de tareas fiables, routing, acknowledgements y dead-letter queues.

**¿Se puede usar PostgreSQL como cola?**  
Sí, para workflows internos moderados. Usa bloqueos, campos de reintento y limpieza. Evita convertirlo en integración compartida.

**¿Cuándo usar transactional outbox?**  
Cuando una escritura en base de datos y la publicación de un mensaje deban ser consistentes, especialmente en servicios Spring Boot.

**¿Cuál es el mayor riesgo en producción con mensajería?**  
Asumir que la entrega ocurre exactamente una vez. Diseña consumidores idempotentes, reintentos visibles, dead-letter handling y observabilidad suficiente.
