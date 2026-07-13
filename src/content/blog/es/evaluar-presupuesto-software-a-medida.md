---
title: "Cómo evaluar un presupuesto de software a medida"
description: "Qué comparar en un presupuesto de software a medida: alcance, riesgos, supuestos, entregables, propiedad, pruebas, despliegue y mantenimiento."
date: 2026-07-11
dateModified: 2026-07-12
author: "José Miguel Fernández"
readingTime: "11 min"
translationSlug: "evaluate-custom-software-proposal"
cover:
  src: "/images/blog/covers/evaluate-custom-software-proposal.avif"
  alt: "Ilustración editorial sobre Cómo evaluar un presupuesto de software a medida"
tags: [software-a-medida, presupuesto, pymes, consultoria]
---

Un presupuesto de software a medida no es una predicción exacta del futuro. Es una hipótesis sobre qué se va a construir, qué puede salir mal y quién asume cada incertidumbre.

Eso explica por qué dos presupuestos pueden tener importes muy distintos aunque ambos hablen de "una aplicación de gestión", "un panel" o "una integración con el CRM". Puede que uno incluya descubrimiento, diseño, pruebas, despliegue y soporte. El otro quizá solo cubre el desarrollo del recorrido más visible. Los dos pueden ser honestos. No están ofreciendo lo mismo.

La pregunta importante no es "¿cuál es más barato?". Es: ¿qué resultado estoy comprando, qué supuestos contiene el precio y qué tendré que aportar o pagar después para que el sistema funcione de verdad?

Para un proyecto nuevo, yo elegiría por defecto una primera entrega pequeña, comprobable y fácil de ampliar. Un presupuesto que intenta cerrar todos los detalles de una plataforma que nadie ha usado todavía suele trasladar el riesgo a una larga lista de cambios. Es mejor definir un problema concreto, probar una primera solución y decidir el siguiente paso con información real.

La página de [software a medida para pymes](/es/software-a-medida-pymes/) explica el tipo de primera versión que suelo considerar razonable. Este artículo sirve para leer y comparar propuestas antes de contratar.

## Qué debe resolver antes de pedir precio

No necesitas diseñar la aplicación ni elegir la tecnología para solicitar una propuesta. Sí necesitas explicar el contexto suficiente para que otra persona pueda hacer preguntas útiles.

Empieza por el trabajo que hoy resulta lento, propenso a errores o difícil de controlar. Indica quién lo hace, con qué información, qué herramientas intervienen y qué ocurre cuando falta un dato o algo falla. Si esperas que el sistema genere ingresos, reduzca tiempo o evite errores, explica cómo sabrás que lo ha conseguido.

"Necesitamos un panel de gestión" es una etiqueta, no un alcance. "El equipo recibe pedidos por email, copia los datos a tres hojas, no sabe quién ha respondido y tarda una hora al día en conciliarlos" ya describe un problema sobre el que se puede trabajar.

Antes de comparar propuestas, intenta responder a estas preguntas:

| Pregunta                                           | Si no está clara                                                  |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| ¿Quién usará el sistema y qué necesita hacer?      | La primera fase debería incluir descubrimiento o prototipos.      |
| ¿Cuál es el recorrido más valioso?                 | El alcance puede crecer alrededor de funciones secundarias.       |
| ¿Qué datos existen y quién es su fuente de verdad? | La migración y las integraciones tendrán sorpresas.               |
| ¿Qué sistemas deben conectarse?                    | No se puede estimar una integración solo por nombrar el producto. |
| ¿Qué decisiones o acciones son sensibles?          | Harán falta permisos, validaciones o revisión humana.             |
| ¿Qué debe ocurrir para aceptar la entrega?         | El final del proyecto quedará abierto a interpretación.           |
| ¿Qué puede esperar para una fase posterior?        | El presupuesto tendrá que financiar incertidumbre innecesaria.    |

No pasa nada si varias respuestas son "no lo sabemos todavía". Eso no obliga a cancelar el proyecto. Obliga a presupuestar esa incertidumbre como una fase de descubrimiento, no a esconderla detrás de una cifra cerrada.

## El alcance: donde empieza casi todo el coste

Un buen presupuesto nombra el comportamiento que se va a entregar. No basta con listar pantallas o tecnologías.

Para cada recorrido importante, busca que aclare:

- qué persona o rol lo inicia;
- qué datos introduce o consulta;
- qué validaciones se aplican;
- qué sistema guarda o usa cada dato;
- qué ocurre cuando el caso normal no se cumple;
- qué resultado ve la persona usuaria;
- qué queda fuera de la primera entrega.

Por ejemplo, "gestión de clientes" puede significar consultar una lista, crear contactos, importar datos existentes, asignar permisos, evitar duplicados, registrar cambios, enviar avisos y sincronizar con un CRM. Cada una de esas decisiones cambia trabajo, riesgo y coste.

No hace falta detallar cada botón al principio. Pero sí distinguir el recorrido principal de las ideas que todavía son hipótesis. Cuando todo parece igual de prioritario, el presupuesto termina siendo una apuesta cara.

## Supuestos y exclusiones: la parte que conviene leer dos veces

Los supuestos ocultos son una causa frecuente de retrasos y sobrecostes. Una propuesta debería hacerlos visibles.

Busca respuestas a preguntas como estas:

- ¿quién proporciona acceso a APIs, cuentas y entornos de prueba?;
- ¿quién prepara, limpia o migra los datos existentes?;
- ¿quién escribe y aprueba textos, reglas de negocio y diseños?;
- ¿qué navegadores, dispositivos e idiomas se cubren?;
- ¿qué ocurre si una integración externa no tiene la capacidad esperada?;
- ¿cuántas rondas de revisión están incluidas?;
- ¿qué formación, documentación o soporte se entregan?;
- ¿qué no se hará en esta fase?

Una exclusión no es una mala señal. Puede ser una muestra de que el profesional ha delimitado el problema. Es preferible leer "la migración de datos históricos no está incluida" antes de firmar que descubrirlo cuando hay que publicar.

También revisa cómo se tratan los cambios. Los cambios son normales en software. Lo importante es que exista una forma sencilla de decir: "esto es nuevo alcance, veamos su impacto en precio y fecha antes de construirlo".

## Precio cerrado, tiempo y materiales o fase de descubrimiento

No hay un modelo de precio correcto para todos los casos. La elección debería seguir el nivel de incertidumbre.

Un precio cerrado encaja cuando el resultado, los recorridos y las dependencias son bastante estables. Aporta previsibilidad al cliente, pero el proveedor necesita incluir margen para riesgos que no puede controlar. Si el proyecto es muy ambiguo, ese margen sube o aparece más tarde como cambio.

Un modelo por tiempo y materiales encaja mejor cuando el equipo necesita investigar, probar una integración o aprender de usuarios reales. Da flexibilidad, pero exige priorización frecuente y visibilidad del trabajo realizado. Sin una persona que decida qué se hace después, puede convertirse en una lista sin final.

Una fase de descubrimiento con presupuesto limitado suele ser una buena primera opción cuando el problema es importante pero el alcance todavía no está maduro. Puede incluir entrevistas, mapa del proceso, revisión de datos y sistemas, prototipo o especificación de una primera entrega. Su objetivo no es producir documentación por producirla. Es reducir incertidumbre antes de comprometer un presupuesto mayor.

| Modelo                 | Encaja cuando                               | Riesgo que debes vigilar                                           |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| Precio cerrado         | El alcance y las dependencias son estables  | Pagar margen por incertidumbre o forzar cambios fuera del contrato |
| Tiempo y materiales    | Hay decisiones que dependen de aprendizaje  | Avanzar sin prioridades ni límite de inversión                     |
| Descubrimiento acotado | El problema está claro, pero la solución no | Alargar el análisis sin decidir una primera entrega                |

## Cómo comparar dos presupuestos

No compares solo el total ni el número de semanas. Compara qué reduce cada propuesta y qué deja para después.

| Dimensión        | Qué conviene comprobar                                              |
| ---------------- | ------------------------------------------------------------------- |
| Problema         | ¿Describe el caso real o reutiliza lenguaje genérico?               |
| Alcance          | ¿Nombra recorridos, datos, integraciones y exclusiones?             |
| Supuestos        | ¿Aclara lo que debe aportar el cliente y las dependencias externas? |
| Proceso          | ¿Hay entregas y revisiones antes del final?                         |
| Calidad          | ¿Explica cómo se probarán los casos críticos y los errores?         |
| Entrega          | ¿Incluye entornos, despliegue, accesos y documentación?             |
| Propiedad        | ¿El negocio podrá controlar código, datos y cuentas?                |
| Continuidad      | ¿Se puede mantener o continuar con otro proveedor?                  |
| Coste recurrente | ¿Aparecen hosting, licencias, APIs, monitorización y soporte?       |

Un presupuesto más alto puede incluir trabajo que evita meses de problemas: una integración bien definida, una migración segura, pruebas de un flujo de pagos o una puesta en producción que no depende de copiar archivos a mano. Un presupuesto más bajo puede ser la mejor opción cuando honestamente deja esas partes fuera porque la primera entrega no las necesita.

La comparación útil no busca una cifra mágica. Busca que el precio, el alcance y el riesgo cuenten la misma historia.

## Entregables y criterios de aceptación

Cada fase debería acabar con algo que se pueda revisar. Puede ser un mapa de proceso, un prototipo, una versión desplegada en pruebas o una funcionalidad lista para usar. "Avance del 80 %" no es un criterio especialmente útil si nadie puede comprobar qué está terminado.

Los criterios de aceptación deben poder leerlos quienes conocen el negocio. Por ejemplo:

- un usuario con permiso de operaciones puede crear un pedido con los campos obligatorios;
- el sistema evita guardar dos veces una referencia ya existente;
- si la API de pagos no responde, el pedido queda pendiente y el equipo ve la incidencia;
- una persona administradora puede exportar los datos necesarios;
- el recorrido funciona en móvil para la versión de navegador acordada.

No necesitas convertir cada frase en un contrato legal. Necesitas evitar que "hecho" signifique una cosa para quien compra y otra para quien desarrolla.

## Calidad proporcional al riesgo

Todos los proyectos necesitan calidad, pero no todos necesitan la misma inversión en controles. Una página informativa y una aplicación que procesa pagos no tienen el mismo perfil de riesgo.

El presupuesto debería explicar de forma proporcionada cómo se cubren los recorridos críticos, los permisos, la validación de datos, los errores esperables, las copias de seguridad y la recuperación. Si hay datos personales, pagos, operaciones irreversibles o dependencia de una API externa, esa conversación tiene que ser más concreta.

Desconfía tanto del "no hace falta probarlo" como de una lista de herramientas de calidad sin relación con el caso. La pregunta es: ¿qué fallo sería caro para este negocio y cómo evitamos que llegue a producción sin detectarlo?

## Propiedad, despliegue y continuidad

El software no termina en el repositorio. También existen dominios, hosting, bases de datos, cuentas de nube, registros de errores, proveedores de correo, analítica y APIs de terceros.

Aclara quién es titular de cada cuenta importante y quién puede acceder. El negocio no necesita operar la infraestructura cada día, pero no debería depender de una única persona para recuperar el código, los datos o el dominio.

Pregunta además:

- dónde se desplegará el sistema y cómo se volverá a desplegar;
- qué entornos existen antes de producción;
- cómo se gestionan secretos y accesos;
- qué documentación se entrega;
- qué ocurre ante una incidencia;
- qué mantenimiento, actualización y coste recurrente habrá;
- cómo podría continuar otro equipo o proveedor.

Un plan de continuidad no significa que esperes una mala relación. Significa que el proyecto seguirá siendo propiedad del negocio aunque cambien las personas.

## Señales de alerta

Hay presupuestos que merece la pena cuestionar más:

- un precio definitivo sin preguntas sobre usuarios, datos o sistemas existentes;
- una lista de tecnologías como sustituto de alcance;
- frases amplias como "panel completo" o "integración total" sin ejemplos de comportamiento;
- ninguna exclusión ni mención a cambios;
- promesas de entrega rápida que omiten pruebas, despliegue o accesos;
- dependencia de cuentas personales del proveedor;
- falta de información sobre costes recurrentes;
- soporte indefinido sin condiciones ni límites;
- garantía de resultados comerciales que dependen de factores fuera del software.

También vigilaría el exceso de detalle prematuro. Si aún no sabes cómo trabajan los usuarios, pagar por definir cada pantalla puede bloquear mejores decisiones. El objetivo es hacer visibles los límites que ya conoces y aprender los demás de la forma más barata posible.

## Una forma de avanzar sin apostar todo al principio

La ruta que más confianza me da es: entender, acotar, construir, comprobar y ampliar después.

1. Describe el problema actual y el resultado que buscas.
2. Aclara usuarios, datos, sistemas y riesgos del recorrido principal.
3. Encarga una fase de descubrimiento si esas respuestas siguen siendo inciertas.
4. Define una primera entrega pequeña con exclusiones explícitas.
5. Revisa una versión funcional antes de financiar mejoras secundarias.
6. Prueba los recorridos críticos y corrige lo que aparece en el uso real.
7. Publica con accesos, documentación y una responsabilidad de mantenimiento clara.
8. Decide las siguientes mejoras con datos y feedback, no con una lista de deseos antigua.

Esta secuencia no elimina las decisiones difíciles. Las toma antes y con menos trabajo acumulado detrás. Si una integración resulta más frágil de lo esperado o una función no se usa, puedes ajustar el plan sin convertir todo el proyecto en una renegociación.

## Recomendación final

Para evaluar un presupuesto de software a medida, busca claridad antes que precisión aparente. El mejor presupuesto no es el más largo ni el más barato. Es el que permite entender qué problema resuelve, qué se entregará primero, qué queda fuera, qué riesgos existen y cómo el negocio podrá mantener lo construido.

Empieza con el alcance más pequeño que pueda demostrar valor. Después amplía cuando el sistema y las necesidades de los usuarios ya te hayan dado motivos concretos para hacerlo.

## Preguntas frecuentes

### ¿El presupuesto más detallado siempre es mejor?

No. Debe ser suficientemente detallado para entender alcance, exclusiones, supuestos y aceptación. Un documento largo que intenta fijar decisiones todavía desconocidas puede crear una falsa seguridad.

### ¿Por qué dos presupuestos para la misma aplicación son tan diferentes?

Porque probablemente no incluyen el mismo trabajo ni asumen el mismo riesgo. Compara recorridos, integraciones, datos, pruebas, despliegue, soporte y propiedad de cuentas, no solo el total.

### ¿Es mala señal que un proveedor proponga una fase de descubrimiento?

No. Es razonable cuando el problema es importante pero no hay información suficiente para estimar una solución completa con honestidad. Debe tener un objetivo, un límite de coste y una salida clara hacia una primera entrega.

### ¿Qué debería recibir al terminar una fase?

Algo revisable y útil: una versión funcional, un prototipo validado, documentación de decisiones o un entorno desplegado. También deben estar claros los accesos, el código y los datos que se entregan.

### ¿Cómo evito que el presupuesto se dispare?

Prioriza un recorrido principal, deja exclusiones por escrito y confirma el impacto de cada cambio antes de desarrollarlo. Los proyectos se encarecen cuando nuevas ideas entran sin decidir qué sustituyen o qué retrasan.

### ¿Debo incluir mantenimiento en el presupuesto inicial?

Al menos debes entender qué mantenimiento hará falta y qué coste tendrá. Puede contratarse después, pero no debería ser una sorpresa cuando llegue la primera actualización o incidencia.
