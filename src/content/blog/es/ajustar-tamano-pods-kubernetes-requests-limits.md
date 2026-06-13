---
title: "Cómo ajustar el tamaño de los pods en Kubernetes sin ir a ciegas"
description: "Guía práctica para dimensionar pods en Kubernetes con datos reales: requests, limits, HPA y VPA sin adivinar."
date: "2026-05-21"
language: "es"
author: "José Miguel Fernández"
readingTime: "7 min"
translationSlug: "right-sizing-kubernetes-pods-requests-limits"
tags: [kubernetes, devops, cloud-native, rendimiento, platform-engineering]
---

Si alguna vez has copiado el bloque `resources:` de otro servicio y has cruzado los dedos, este artículo es para ti.

Ajustar el tamaño de los pods en Kubernetes parece un detalle menor, pero en la práctica decide si tu plataforma va fina o si acabas pagando de más, viendo _throttling_ en CPU, `OOMKilled` y latencias raras que nadie entiende del todo.

No necesitas una fórmula mágica. Necesitas un método razonable para leer tu carga real y entender qué hacen de verdad los `requests` y los `limits`.

## La idea corta

Kubernetes trata _requests_ y _limits_ como cosas distintas:

- **Requests**: le dicen al scheduler dónde puede colocar el Pod.
- **Limits**: marcan el tope que un contenedor no debería superar.

Eso significa que ajustar un Pod no va solo de ahorrar recursos. Va de encajar la forma de tu servicio con la forma en que Kubernetes lo agenda y lo protege.

> **Regla práctica:** parte del uso real, no de una convención del equipo.
>
> Los peores valores suelen salir de copiar un YAML anterior sin mirar tráfico, memoria en uso o _throttling_.

## Qué hacen realmente requests y limits

Gran parte de la confusión con Kubernetes viene de mezclar estas dos ideas.

| Ajuste             | Qué afecta                           | Qué pasa si lo pones mal                                                          |
| ------------------ | ------------------------------------ | --------------------------------------------------------------------------------- |
| **CPU request**    | Scheduling y capacidad garantizada   | Demasiado alto: los Pods tardan más en arrancar o desperdicias capacidad del nodo |
| **CPU limit**      | _Throttling_ en ejecución            | Demasiado bajo: el contenedor se estrangula en picos                              |
| **Memory request** | Scheduling y encaje en el nodo       | Demasiado alto: mala utilización del nodo                                         |
| **Memory limit**   | Protección frente a memoria excesiva | Demasiado bajo: el contenedor acaba en `OOMKilled`                                |

Para CPU, Kubernetes puede limitar el contenedor mediante _throttling_ cuando llega al límite. Para memoria, el fallo suele ser más brusco: si te pasas del límite, el contenedor puede morir con `OOMKilled`.

Así que si solo te quedas con una idea, que sea esta:

- **CPU limit** = control de rendimiento.
- **Memory limit** = control de seguridad.

No son la misma cosa, y tratarlos igual suele salir caro.

## El ciclo de ajuste que sí me fío de usar

Yo no me fío de las intuiciones. Me fío de un ciclo:

1. **Mide el uso real** con tráfico parecido al de producción.
2. **Mira el estado estable**, no el pico más extremo.
3. **Añade margen** para los picos normales.
4. **Cambia una sola cosa cada vez**.
5. **Observa throttling, OOMKills y latencia**.
6. **Repite cuando cambie el tráfico o el código**.

Parece obvio, pero muchísimos equipos se saltan el paso 1 y van directos al YAML.

### Las métricas que de verdad importan

Si quieres dimensionar bien un servicio, no te quedes con la media del gráfico de CPU:

- Uso de CPU en el tiempo, sobre todo p95 y picos cortos
- _Working set_ de memoria, no solo el tamaño residente
- Tiempo de CPU _throttled_
- Eventos `OOMKilled` y reinicios
- Latencia a nivel de petición
- Comportamiento del HPA si ya hay autoscaling

Si tu observabilidad solo enseña promedios, te está enseñando demasiado poco.

## Un punto de partida sensato

Una forma razonable de pensar en esto es:

- **CPU request**: empieza cerca del p95 estable del servicio con carga real.
- **CPU limit**: ponlo por encima de los picos normales, o déjalo sin definir si tu política de plataforma lo permite y el servicio es sensible a latencia.
- **Memory request**: usa el _working set_ observado con algo de margen.
- **Memory limit**: pon un techo realista, pero no tan apretado que un pico corto o un GC te manden el contenedor a reiniciarse.

No pretende ser exacto para todos los casos. Sirve para dejar de inventarte los números.

```yaml
resources:
  requests:
    cpu: 250m
    memory: 512Mi
  limits:
    cpu: 500m
    memory: 768Mi
```

Esto no es una respuesta universal. Es solo un arranque razonable. No merece los mismos valores un API público, un worker batch y una app de renderizado.

## Errores que veo todo el rato

### 1. Dejar requests y limits iguales “porque queda limpio”

Visualmente queda bonito. En operación, muchas veces es demasiado rígido.

Si el `request` y el `limit` de CPU son iguales, el contenedor tiene muy poco margen para picos cortos. Y eso acaba pareciendo lentitud aleatoria.

### 2. Basarse en medias en vez de percentiles

Las medias esconden el comportamiento irregular.

Un servicio puede tener una CPU media muy tranquila y aun así sufrir picos p95 que disparan la latencia de cola.

### 3. Tratar la memoria como si fuera CPU

La memoria no es un recurso elástico y bonito.

Si la dimensionas demasiado corta, no solo “usas menos”. Puedes provocar presión de GC, churn de caché o un `OOMKilled`.

### 4. Poner los mismos valores a todo

Un webhook, un worker programado y una API pública no tienen el mismo perfil.

Si reutilizas el mismo bloque `resources:` en todos lados, seguramente estás optimizando mal.

## Cómo encajan HPA y VPA

Ajustar bien un Pod es más fácil cuando dejas de tratar el autoscaling como una sola cosa.

- **HPA** cambia el número de Pods.
- **VPA** cambia las recomendaciones de recursos y, en algunos escenarios, también los requests.
- **Node autoscaling** cambia la capacidad del cluster.

O sea:

- Si el servicio se queda corto porque crece el tráfico, HPA ayuda.
- Si el servicio pide demasiado o demasiado poco de forma constante, VPA ayuda.
- Si el cluster se queda pequeño, ayuda el escalado de nodos.

Kubernetes funciona mejor cuando cada pieza hace lo suyo.

Además, en versiones recientes Kubernetes ya soporta **recursos a nivel de Pod**, lo cual viene bien cuando quieres pensar en un presupuesto compartido del Pod y no solo en valores por contenedor. No sustituye el ajuste por contenedor; simplemente te da más flexibilidad.

## Lo que haría en un equipo real

Si tuviera que ajustar un servicio esta semana, haría esto:

1. Sacar los últimos 7–14 días de CPU y memoria.
2. Mirar p95 y p99, no solo promedios.
3. Comparar uso real con `request`, `limit` y `throttling`.
4. Revisar reinicios, `OOMKilled` y saltos de latencia.
5. Cambiar un solo parámetro.
6. Probarlo con tráfico realista.
7. Dejar escrito por qué existen esos números.

Ese último punto importa más de lo que parece. Si nadie sabe por qué se eligieron los valores, volverás al modo “a ojo” dentro de dos meses.

## Checklist rápido

1. Forma real de carga
2. CPU y memoria medidas por separado
3. p95/p99 mirados, no solo medias
4. Sé si es sensible a latencia
5. He comprobado el _throttling_
6. He comprobado `OOMKilled`
7. Tengo una razón para cada `request` y `limit`
8. Revisaré los valores cuando cambie el tráfico

## Mi lectura práctica

Si quieres una regla sencilla, piensa así:

- **Request** = lo que el servicio necesita
- **Limit** = el borde que protege al resto del sistema

El error es usar ambos solo para “dejar contento a Kubernetes”. Kubernetes ya está contento. Los que importan son tus usuarios: quieren que el servicio vaya rápido, estable y sin sorpresas en la factura.

## Conclusión

Ajustar el tamaño de los pods en Kubernetes va menos de encontrar el número perfecto y más de montar un bucle de feedback decente.

Empieza por datos reales.
Mide las señales correctas.
Cambia una cosa cada vez.
Y vuelve a revisar cuando cambien el tráfico, el código o las dependencias.

Este tema encaja especialmente con aplicaciones backend en producción. Si tu servicio es Spring Boot, también revisaría el [checklist DevOps para Spring Boot en producción](/es/blog/spring-boot-produccion-checklist-devops/) antes de tocar valores de CPU y memoria sin datos.

Así mantienes el cluster eficiente sin convertir cada despliegue en una apuesta.

## FAQ

**¿Siempre tengo que definir requests y limits?**  
No necesariamente. Los `requests` son importantes para el scheduling. Los `limits` dependen de la carga y de la política de tu plataforma. En CPU, un límite duro a veces ayuda y a veces solo introduce _throttling_.

**¿Qué optimizo primero: CPU o memoria?**  
Memoria primero si tienes `OOMKilled` o presión de memoria. La CPU suele ser más fácil de observar, pero los fallos de memoria suelen ser más molestos.

**¿Puede VPA sustituir el ajuste manual?**  
Reduce trabajo manual, sí, pero sigues necesitando entender qué recomienda y por qué. La automatización solo ayuda si validas contra comportamiento real.

**¿Con HPA basta?**  
No. HPA escala réplicas. No arregla malos `requests` ni malos límites de memoria.

## Fuentes y verificación

- Kubernetes: Resource Management for Pods and Containers — https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
- Kubernetes: Assign CPU Resources to Containers and Pods — https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/
- Kubernetes: Vertical Pod Autoscaling — https://kubernetes.io/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/
- Kubernetes: Assign Pod-level CPU and memory resources — https://kubernetes.io/docs/tasks/configure-pod-container/assign-pod-level-resources/
- Kubernetes blog: v1.36 in-place vertical scaling for pod-level resources — https://kubernetes.io/blog/2026/04/30/kubernetes-v1-36-inplace-pod-level-resources-beta/
