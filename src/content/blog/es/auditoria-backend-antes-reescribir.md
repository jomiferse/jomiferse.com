---
title: "Qué revisar en un backend antes de decidir una reescritura"
description: "Una auditoría práctica antes de reescribir: comportamiento, incidencias, dependencias, datos, contratos, entrega y coste de transición."
date: 2026-07-11
dateModified: 2026-07-12
author: "José Miguel Fernández"
readingTime: "11 min"
translationSlug: "backend-audit-before-rewrite"
tags: [backend, auditoria, arquitectura, legacy, reescritura]
---

Reescribir un backend parece una solución clara cuando el código es difícil de cambiar, las incidencias se repiten o la tecnología ha quedado atrás. Sin embargo, una reescritura no elimina automáticamente la complejidad: obliga a descubrir de nuevo reglas de negocio, reproducir contratos, migrar datos y operar dos sistemas durante una transición. La pregunta útil no es «¿es feo el código?», sino «¿qué obstáculo de negocio queremos retirar y cuál es la forma menos arriesgada de hacerlo?».

Una auditoría previa convierte impresiones en evidencia. Permite separar problemas del producto, la arquitectura, la operación y la organización; comparar una sustitución completa con alternativas incrementales; y producir una decisión que dirección y equipo técnico puedan defender. También puede concluir que reescribir sí es lo correcto. Su valor no está en evitar esa respuesta, sino en evitar que se adopte sin conocer el coste total.

## 1. Definir el problema antes de evaluar la solución

Empieza por los resultados que el sistema impide. Quizá una funcionalidad tarda seis semanas cuando debería tardar dos, un cierre mensual exige correcciones manuales, los despliegues provocan interrupciones o una versión sin soporte expone a la empresa. Cada motivo necesita una métrica inicial: tiempo desde petición hasta producción, incidencias por mes, horas de recuperación, porcentaje de operaciones manuales o coste de infraestructura por transacción.

Conviene entrevistar a negocio, soporte, operaciones y desarrollo por separado. Un equipo puede describir acoplamiento técnico mientras atención al cliente revela que el verdadero coste está en una integración inestable. Documenta además qué no se intenta resolver. Si el objetivo es reducir fallos de facturación, rediseñar autenticación o cambiar toda la interfaz puede quedar fuera del primer alcance.

El entregable de esta fase es breve: problemas priorizados, impacto observable, restricciones y condición de éxito. Sin él, cualquier arquitectura nueva parecerá mejor porque se comparará contra todos los defectos acumulados del sistema actual y no contra un objetivo delimitado.

## 2. Reconstruir el comportamiento real

En sistemas veteranos, la especificación está repartida entre código, procedimientos almacenados, tareas programadas, hojas de cálculo, configuración y conocimiento de personas. Haz un inventario de recorridos críticos —crear un pedido, liquidar una factura, renovar una suscripción— y sigue cada uno desde la entrada hasta sus efectos secundarios. Registra validaciones, estados, permisos, notificaciones y excepciones.

Los logs de producción, tickets y consultas frecuentes ayudan a encontrar variantes que nadie recuerda. Las pruebas de caracterización son especialmente valiosas: no afirman que el comportamiento actual sea ideal, pero capturan lo que ocurre antes de cambiarlo. Martin Fowler describe la [aplicación estranguladora](https://martinfowler.com/bliki/StranglerFigApplication.html) como una sustitución gradual alrededor del sistema existente; para emplearla hace falta saber qué comportamiento proteger y dónde existe una frontera.

Clasifica las reglas como obligatorias, accidentales o pendientes de decisión. Copiar cada anomalía perpetuaría deuda; ignorarlas todas rompería casos legítimos. La persona responsable del producto debe resolver las ambiguas, dejando ejemplos aceptados que puedan convertirse en pruebas.

## 3. Medir incidencias y coste de cambio

La edad del repositorio dice poco por sí sola. Revisa doce meses de incidencias: frecuencia, severidad, tiempo de detección y recuperación, componente causante y recurrencia. Distingue defectos del código de problemas de configuración, datos, infraestructura o proveedores. Una reescritura no arreglará un proceso de despliegue sin controles ni un origen que envía información inconsistente.

Analiza también una muestra de cambios recientes. ¿Cuánto tiempo se dedicó a entender, implementar, probar, aprobar y desplegar? ¿Qué módulos concentran modificaciones? ¿Los fallos aparecen por acoplamiento, por ausencia de pruebas o por requisitos inestables? Las métricas DORA —frecuencia de despliegue, tiempo de entrega, tasa de fallos y tiempo de recuperación— ofrecen un lenguaje útil; Google mantiene una [guía oficial de capacidades y métricas DORA](https://dora.dev/guides/dora-metrics-four-keys/).

El objetivo no es puntuar al equipo. Es localizar el cuello de botella y crear una línea base. Si mejorar el pipeline reduce a la mitad el tiempo de entrega, esa evidencia cambia el caso económico de la reescritura.

## 4. Inventariar arquitectura, dependencias y soporte

Dibuja módulos, procesos, almacenes de datos, colas, servicios externos y mecanismos de autenticación. Para cada elemento registra propietario, versión, soporte, criticidad y facilidad de sustitución. Ejecuta análisis de dependencias y vulnerabilidades, pero revisa los resultados: una biblioteca antigua aislada no tiene el mismo riesgo que un componente expuesto a Internet.

La política de soporte importa más que la novedad. Consulta las fuentes del fabricante, como la [política de soporte de Spring Boot](https://spring.io/projects/spring-boot#support), y relaciona cada fin de soporte con el despliegue real. Revisa licencias, runtimes, imágenes base y servicios gestionados. Si el sistema no puede actualizarse porque una dependencia abandonada atraviesa todo el dominio, existe un argumento de modernización; si está encapsulada detrás de una interfaz estable, quizá baste sustituirla.

Busca dependencias organizativas además de técnicas: una única persona que puede desplegar, credenciales compartidas o aprobaciones informales. Una arquitectura nueva conservará esos riesgos si el proyecto no cambia también la forma de operar.

## 5. Mapear datos, contratos y consumidores

La base de datos suele ser la parte más difícil de reemplazar. Cataloga tablas, volumen, crecimiento, calidad, retención, datos personales, migraciones y responsables. Identifica escrituras fuera de la aplicación, informes que consultan tablas directamente y procesos nocturnos. Mide valores nulos inesperados, duplicados y relaciones rotas antes de estimar una migración.

Después inventaría contratos: APIs, eventos, archivos, webhooks y exportaciones. Para cada consumidor registra versión, autenticación, expectativas de latencia, gestión de reintentos y contacto. El tráfico y los logs revelan consumidores desconocidos mejor que la documentación. Un contrato aparentemente sin uso puede alimentar una conciliación mensual crítica.

Diseña cómo comprobar equivalencia: reconciliación de recuentos e importes, ejecución en sombra, lecturas comparadas o doble escritura cuidadosamente controlada. En APIs con reintentos, los efectos duplicados son un riesgo específico; la guía sobre [APIs idempotentes](/es/blog/apis-idempotentes-que-sobreviven-a-reintentos/) explica cómo proteger operaciones durante una convivencia.

## 6. Evaluar pruebas, seguridad y operación

Cuenta recorridos protegidos, no solo porcentaje de cobertura. Verifica si las pruebas detectan cambios en reglas relevantes, si son deterministas y si pueden ejecutarse en el pipeline. Añade pruebas de contrato para integraciones y una pequeña suite de extremo a extremo para los flujos de mayor impacto. Esta red será útil tanto si se refactoriza como si se reescribe.

Revisa autenticación, autorización, gestión de secretos, cifrado, auditoría, dependencias y tratamiento de datos. OWASP publica el [Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/) como referencia verificable para controles de aplicaciones. La auditoría no necesita certificar todo el sistema, pero sí señalar exposiciones que cambian la prioridad o el diseño de transición.

En operación, comprueba build reproducible, configuración por entorno, observabilidad, alertas accionables, copias, restauración y rollback. Pide una demostración real de despliegue y recuperación. Una solución moderna que el equipo no puede diagnosticar a las tres de la mañana no representa una mejora.

## 7. Calcular el coste completo de transición

No compares «mantener código viejo» con «programar código nuevo». La estimación debe incluir descubrimiento, pruebas de caracterización, diseño, implementación, migración y limpieza de datos, compatibilidad, infraestructura temporal, seguridad, documentación, formación y retirada del sistema anterior. Añade el tiempo de expertos de negocio y del equipo actual, además del coste de oportunidad de las funcionalidades pospuestas.

Modela al menos tres escenarios: intervención mínima para reducir riesgo inmediato, modernización incremental por fronteras y reescritura amplia. Expresa rangos y supuestos, no una cifra falsa de precisión. Incluye duración de doble operación y coste de mantener sincronía. Cuanto más tarde llegue valor verificable, mayor es la exposición a cambios de mercado, equipo o prioridades.

Para presentar la inversión, relaciona cada tramo con resultados: eliminar una plataforma sin soporte, reducir fallos, acelerar una familia de cambios o retirar un proceso manual. Así puede detenerse el programa si el beneficio no aparece.

## 8. Comparar alternativas con los mismos criterios

Las opciones habituales incluyen actualizar dependencias, modularizar dentro del monolito, encapsular una integración, extraer un servicio, sustituir un producto concreto o reconstruir el sistema. Puntúa cada una por impacto, tiempo hasta valor, riesgo, reversibilidad, coste de transición y capacidad interna. Documenta incertidumbre y evidencia necesaria para reducirla.

Un experimento acotado puede resolver una duda más barato que otra ronda de estimaciones: actualizar un módulo representativo, capturar contratos de una API o migrar una pequeña familia de datos. La [arquitectura hexagonal aplicada a backend](/es/blog/arquitectura-hexagonal-que-es-como-aplicarla-proyectos-backend/) ofrece ideas para crear fronteras sin exigir microservicios.

La reescritura gana cuando el sistema bloquea objetivos importantes, sus límites actuales impiden una transición razonable y la organización puede financiar convivencia y migración. Pierde cuando el principal problema está fuera del código, cuando no se conocen las reglas o cuando no existe capacidad para operar el destino.

## 9. Convertir la auditoría en una decisión ejecutable

El informe final debe ser comprensible sin leer todo el repositorio. Incluye mapa del sistema, riesgos priorizados con evidencia, línea base de métricas, opciones comparadas, recomendación, supuestos y preguntas abiertas. Propón un primer bloque de cuatro a ocho semanas con propietario, alcance, criterio de aceptación, rollback y decisión al finalizar.

Un resultado válido puede ser «no reescribir todavía»: corregir observabilidad, asegurar copias, actualizar una dependencia crítica y medir tres meses. Otro puede ser iniciar una sustitución por la frontera de menor acoplamiento. En ambos casos debe existir una fecha para revisar evidencia, no una hoja de ruta irrevocable.

Si necesitas convertir estas preguntas en un diagnóstico independiente, mi servicio de [auditoría de backend, API y arquitectura](/es/auditoria-backend-api-arquitectura/) entrega riesgos priorizados y un primer alcance verificable. Para ejecutar una transición ya justificada, la [modernización de backend legacy](/es/modernizacion-backend-legacy/) se centra en convivencia, métricas y retirada segura.

## Preguntas frecuentes

### ¿Cuándo sí tiene sentido reescribir un backend?

Cuando impide objetivos importantes, las alternativas incrementales no eliminan la restricción y existen recursos para migrar datos, mantener compatibilidad y operar la transición. La decisión debería apoyarse en métricas y una frontera inicial, no solo en preferencias tecnológicas.

### ¿Cuánto tarda una auditoría previa?

Depende del tamaño y del acceso a personas y producción. En un sistema pequeño, dos o tres semanas pueden bastar para una decisión inicial; uno con varios dominios e integraciones puede requerir más. Conviene fijar un tiempo máximo y declarar incertidumbres.

### ¿Hace falta detener el desarrollo durante la auditoría?

Normalmente no. Se coordinan entrevistas, acceso a métricas y revisión de cambios. Sí puede ser útil congelar modificaciones en una frontera durante un experimento o capturar una línea base antes de alterar el comportamiento.

### ¿Quién debe participar en la decisión?

La persona responsable del producto, ingeniería, operaciones, seguridad y representantes de procesos críticos. Finanzas o dirección deben validar coste y oportunidad. Dejar la decisión solo al equipo técnico oculta impacto y reglas de negocio.

### ¿Qué entregable permite contratar después con menos riesgo?

Un mapa verificable, riesgos priorizados, contratos y datos inventariados, opciones comparables y un primer bloque con aceptación y rollback. Ese material permite pedir propuestas sobre el mismo alcance y evita pagar por redescubrir el problema.
