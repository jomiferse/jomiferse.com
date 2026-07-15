---
title: "Betx: una herramienta operativa de apuestas con Java y Spring Boot"
description: "Cómo planteé Betx, una aplicación de terminal para registrar y gestionar apuestas, cuotas, estados y resultados con Java, Spring Boot y SQLite."
date: 2026-06-22
translationSlug: "how-i-built-an-automated-betting-system-in-java"
commercial:
  role: case-study
  audience: technical
  cluster: custom-software
cover:
  src: "/images/blog/covers/how-i-built-an-automated-betting-system-in-java.avif"
  alt: "Ilustración editorial de una herramienta de gestión de apuestas construida con Java"
tags:
  - java
  - spring-boot
  - cli
  - sqlite
  - software-engineering
author: "José Miguel Fernández"
readingTime: "6 min"
---

## El encargo

Betx surgió de una necesidad concreta de un cliente del sector gambling. Quería una herramienta sencilla para registrar apuestas, consultar cuotas, actualizar estados y guardar resultados sin depender de una interfaz web ni de una infraestructura compleja.

La solución fue una aplicación backend de terminal. El flujo principal se opera mediante comandos, la configuración se mantiene fuera del código y los datos se guardan de forma local. Así, el cliente puede trabajar con una herramienta directa sin añadir un frontend como pieza separada.

![Vista técnica del proyecto Betx](/images/projects/betx.avif)

## Por qué una interfaz de terminal

Para este alcance, una interfaz web habría añadido navegación, estado en el navegador y trabajo visual. Una CLI mantenía la entrada y la salida explícitas y reducía las piezas que había que desarrollar y mantener.

Elegí **Picocli** para definir los comandos y sus argumentos de forma explícita. Esto permite separar la entrada del usuario de la lógica que registra o actualiza una apuesta.

El flujo queda dividido en pasos fáciles de seguir:

1. El comando interpreta la acción y valida los argumentos.
2. El caso de uso aplica las reglas necesarias.
3. La capa de persistencia consulta o actualiza SQLite.
4. Los clientes HTTP se encargan de las integraciones externas.
5. La terminal presenta un resultado legible.

Esta separación también facilita probar la lógica sin tener que ejecutar todo el programa desde consola en cada test.

## Configuración fuera del código

Los endpoints, credenciales y ajustes de ejecución no deben quedar repartidos por las clases. Betx utiliza un archivo `betx.yml` como punto de configuración local.

Esta decisión aporta dos ventajas prácticas: cada entorno puede tener sus propios valores y la aplicación puede cambiar de integración sin recompilar por un ajuste operativo. Las credenciales siguen tratándose como configuración privada y no como contenido del repositorio.

## Persistencia local con SQLite

El alcance pedía persistencia local y ligera para conservar apuestas, cuotas, estados y resultados. **SQLite** encajaba mejor que desplegar un servidor de base de datos independiente.

La persistencia está aislada detrás de una capa propia. Los comandos no escriben SQL directamente y la lógica del flujo no depende de cómo se guarden los datos. Si el volumen o la forma de uso cambian, la base puede sustituirse sin rehacer la interfaz de terminal.

## Integraciones HTTP con límites claros

Las llamadas externas se implementan como clientes HTTP separados. Su responsabilidad es traducir una petición del dominio al formato que espera cada servicio y devolver una respuesta controlada.

Mantener estos límites evita que detalles como URLs, cabeceras o formatos JSON se mezclen con el flujo principal. También hace más sencillo simular las respuestas externas durante las pruebas.

## Qué entregué

La primera versión operativa incluye:

- una CLI con Picocli para ejecutar el flujo desde terminal;
- configuración declarativa mediante YAML;
- persistencia local con SQLite;
- clientes HTTP para las integraciones necesarias;
- pruebas con JUnit 5 y AssertJ sobre el comportamiento principal.

El resultado es una herramienta ligera que permite al cliente consultar y actualizar la información de sus apuestas desde un único flujo, con los datos y la configuración separados del código.

## Lo que este proyecto confirma

No todos los encargos necesitan una aplicación web. A veces la mejor solución es una herramienta pequeña que resuelve un flujo operativo bien delimitado.

La decisión importante no fue elegir la interfaz más vistosa, sino reducir piezas: terminal para operar, YAML para configurar, SQLite para persistir y adaptadores claros para comunicarse con servicios externos.

Puedes ver el [caso de Betx](/es/projects/betx/) o consultar cómo trabajo los [backends con Spring Boot](/es/services/backend-spring-boot/).

## FAQ

**¿Por qué no se construyó un panel web?**

La primera versión se planteó como una CLI local para mantener el alcance acotado y reducir el mantenimiento de interfaz.

**¿SQLite limita el proyecto?**

Para el uso actual ofrece persistencia sencilla y suficiente. La separación entre capas permite cambiarla si aparecen otras necesidades.

**¿La configuración incluye secretos?**

Puede referenciar valores sensibles del entorno local, pero esos datos no se publican ni se incluyen en el repositorio.
