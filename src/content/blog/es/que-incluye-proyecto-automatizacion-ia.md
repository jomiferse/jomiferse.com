---
title: "Qué debería incluir un proyecto de automatización con IA"
description: "Alcance práctico de una automatización con IA: ejemplos, evaluación, datos, revisión humana, integración, costes y observabilidad."
date: 2026-07-11
dateModified: 2026-07-12
author: "José Miguel Fernández"
readingTime: "11 min"
translationSlug: "what-ai-automation-project-should-include"
commercial:
  role: buyer-led
  audience: business
  cluster: ai-automation
cover:
  src: "/images/blog/covers/what-ai-automation-project-should-include.avif"
  alt: "Ilustración editorial sobre Qué debería incluir un proyecto de automatización con IA"
tags: [ia, automatizacion, evaluacion, operaciones, documentos]
---

Un proyecto de automatización con IA no debería empezar eligiendo modelo. Debería empezar definiendo la tarea, el error aceptable y quién decide cuando la salida no es fiable. Una demostración que clasifica cinco documentos es fácil; un flujo que trabaja cada día con datos reales, deja rastro y falla de forma segura es el producto que la empresa necesita comprar.

La propuesta debería explicar tanto la parte probabilística como la integración convencional que la rodea. Recibir archivos, validar campos, aplicar permisos, guardar estados, avisar y permitir correcciones suele ocupar tanto espacio como la llamada al modelo. Esta guía sirve como lista de comprobación para pedir, comparar y gobernar ese alcance.

## 1. Un problema delimitado y una línea base

“Usar IA para documentos” no es un objetivo verificable. “Extraer número, fecha, proveedor y total de facturas recibidas para preparar la revisión contable” sí empieza a serlo. Define qué entra, qué salida necesita el siguiente sistema, cuánto volumen existe y qué hace hoy una persona.

Registra una línea base: tiempo por caso, errores, espera, coste y porcentaje de entradas que requieren criterio. Sin ella no podrás saber si el proyecto mejora la operación o solo cambia su interfaz. Incluye también las acciones que la IA nunca debe ejecutar, como aprobar un pago o rechazar definitivamente una solicitud.

Antes de introducir un modelo, comprueba si bastan reglas, búsqueda o una integración. La IA aporta cuando hay lenguaje, imágenes o variabilidad difícil de describir con reglas. Para mover datos estructurados entre sistemas, una [automatización de procesos convencional](/es/blog/automatizar-procesos-empresa-cuando-merece-la-pena/) suele ser más predecible.

## 2. Ejemplos reales y un conjunto de evaluación

El proyecto necesita casos normales, difíciles y claramente inválidos. No sirven únicamente documentos limpios elegidos para la demo. Reúne formatos frecuentes, escaneos deficientes, campos ausentes, idiomas y excepciones reales, anonimizados cuando corresponda.

Separa un conjunto para desarrollar y otro para evaluar. Define la respuesta correcta por campo o categoría y cómo se puntúan respuestas parciales. En extracción, mide por campo; en clasificación, revisa falsos positivos y falsos negativos por clase; en resúmenes, usa una rúbrica que penalice omisiones y afirmaciones sin apoyo.

El resultado no debe ser “parece bastante bueno”. Debe poder decir, por ejemplo, cuántos casos pasan automáticamente, cuántos llegan a revisión y cuántos incumplen el umbral. El [marco de gestión de riesgos de IA de NIST](https://www.nist.gov/itl/ai-risk-management-framework) recomienda medir y gestionar riesgos durante el ciclo de vida, no solo antes del lanzamiento.

## 3. Criterios de aceptación ligados al riesgo

No existe un porcentaje universal de precisión suficiente. Depende del campo, de la acción posterior y de la facilidad para detectar el error. Una categoría que solo ordena una cola tolera más incertidumbre que un importe que alimenta un pago.

Define criterios por resultado. Los campos críticos pueden exigir validaciones deterministas y revisión humana; los secundarios pueden aceptar un umbral menor. Establece un presupuesto de error, un máximo de latencia y un coste por caso compatible con el negocio.

Incluye una condición para no seguir. Si el piloto no alcanza la calidad con datos representativos o requiere tanta revisión como el proceso manual, la decisión correcta puede ser reformular o cancelar. Esa salida protege más que prometer que cambiar de modelo resolverá cualquier problema.

## 4. Datos, privacidad y permisos

La propuesta debe inventariar qué información se envía, dónde se procesa, cuánto tiempo se conserva y quién puede verla. Minimiza datos: si una tarea no necesita el nombre completo o un adjunto entero, no lo envíes. Separa entornos y evita usar documentos reales sensibles en pruebas informales.

Revisa condiciones del proveedor, región de procesamiento, subencargados y opciones de retención con la persona responsable de privacidad. La [guía de la AEPD sobre IA y protección de datos](https://www.aepd.es/guias/adecuacion-rgpd-ia.pdf) aporta criterios para analizar tratamiento y riesgos; no sustituye asesoramiento específico.

Los permisos no terminan en la API. La cola de revisión, los logs y las exportaciones también contienen información. Define roles, autenticación, acceso mínimo y registro de cambios. Las credenciales deben almacenarse fuera del código y poder rotarse sin rehacer el flujo.

## 5. Diseño del control humano

“Habrá una persona revisando” es insuficiente. Hay que describir qué ve, qué puede corregir, cuánto contexto recibe y qué pasa después. Una buena pantalla muestra documento original, resultado propuesto, confianza o motivo de alerta y validaciones que fallaron.

Usa tres posibles rutas: aceptación automática para casos que superan criterios estrictos, revisión para incertidumbre y rechazo controlado para entradas inválidas. No conviertas la puntuación de confianza del modelo en una garantía: calibra el umbral con datos propios y combínalo con reglas.

Registra las correcciones como señales operativas, no como datos de entrenamiento automáticos. Antes de reutilizarlas hay que comprobar su calidad, permisos y representatividad. Define asimismo quién puede revertir una acción y cómo se atiende una reclamación.

## 6. Arquitectura e integración con el trabajo real

La salida debe entrar en CRM, ERP, panel o cola con una estructura validada, estado, fuente y versión. Utiliza esquemas para rechazar respuestas incompletas. Asigna un identificador a cada caso y conserva la relación entre entrada, salida, revisión y acción posterior.

El flujo debe soportar reintentos sin duplicar efectos. Si el proveedor está caído, el caso queda pendiente y alguien recibe un aviso; no desaparece. Añade límites de concurrencia, tamaño y coste, además de un mecanismo para pausar el procesamiento.

Si el valor principal está en conectar sistemas, revisa desde el principio las APIs disponibles. Mi servicio de [automatización con IA para operaciones y documentos](/es/automatizacion-ia-operaciones-documentos/) combina esa integración con evaluación y supervisión, en lugar de entregar un prototipo aislado.

## 7. Seguridad frente a entradas y salidas problemáticas

Los documentos y mensajes son entrada no confiable. Pueden contener instrucciones maliciosas, datos inesperados o archivos corruptos. Limita tipos y tamaños, analiza adjuntos cuando proceda y no permitas que el contenido otorgue herramientas o permisos al modelo.

Valida las salidas antes de actuar. Una respuesta con formato correcto todavía puede contener un dato incorrecto. Aplica listas permitidas, rangos, comprobaciones cruzadas y separación de funciones. Para acciones externas, utiliza permisos mínimos y confirmación humana si el impacto lo exige.

El [OWASP Top 10 para aplicaciones con modelos de lenguaje](https://owasp.org/www-project-top-10-for-large-language-model-applications/) ofrece un mapa práctico de riesgos como prompt injection, divulgación de información y exceso de autonomía. La propuesta debería mencionar cuáles aplican y qué control los reduce.

## 8. Observabilidad, coste y calidad en producción

En producción, registra volumen, latencia, errores técnicos, uso, coste, casos revisados y correcciones. No guardes contenido sensible por defecto bajo la excusa de depuración. Usa identificadores, métricas agregadas y una política de retención proporcionada.

Define alertas accionables: cola envejecida, subida de errores, coste anómalo o caída del porcentaje de aceptación. Diferencia un fallo de proveedor de un resultado que no supera validación. Cada tipo requiere una respuesta distinta.

Controla coste por documento o tarea y fija límites diarios. El precio del modelo no es el coste completo: incluye OCR, almacenamiento, infraestructura, revisión y mantenimiento. La guía sobre [cuánto cuesta automatizar un proceso administrativo](/es/blog/cuanto-cuesta-automatizar-proceso-administrativo/) ayuda a comparar inversión y operación.

## 9. Despliegue gradual y plan de reversión

Empieza con modo sombra: el sistema produce resultados sin actuar y se comparan con decisiones humanas. Después pasa a modo asistido, donde prepara y una persona confirma. Solo los casos de riesgo bajo y rendimiento demostrado deberían ganar autonomía.

Define porcentajes y fechas de revisión, no una transición abierta. Conserva el proceso anterior mientras se valida recuperación y forma a quienes supervisan. La documentación debe explicar límites conocidos, escalado y cómo pausar o volver atrás.

Un cambio de modelo, prompt, esquema o fuente de datos es un cambio de producto. Versiona esas piezas, ejecuta de nuevo el conjunto de evaluación y despliega gradualmente. “El proveedor actualizó el modelo” no puede equivaler a aceptar comportamiento nuevo sin comprobar.

## 10. Entregables, propiedad y mantenimiento

Al finalizar, la empresa debería recibir código o configuración acordada, documentación de arquitectura, inventario de servicios, conjunto de evaluación, resultados, instrucciones de operación y lista de riesgos pendientes. Deben quedar claras la propiedad intelectual y la posibilidad de exportar datos.

El plan de mantenimiento indica quién revisa alertas, con qué frecuencia se ejecutan evaluaciones, cómo se gestionan cambios y qué soporte está incluido. También conviene acordar un pequeño presupuesto para reevaluar cuando cambian documentos, negocio o proveedor.

Una propuesta seria separa piloto de producción. El piloto responde si la tarea es viable; producción añade seguridad, integración, recuperación, formación y operación. Mezclarlos dificulta entender qué se está comprando.

## Cómo comparar propuestas de proveedores

Entrega los mismos ejemplos y criterios a cada proveedor. Pide resultados sobre un conjunto reservado y una demostración del flujo de error, no solo del recorrido feliz. Compara porcentaje automatizado, carga de revisión, coste total, latencia y capacidad de abandonar el proveedor.

Desconfía de promesas de precisión sin definición, propuestas que no mencionan datos o soluciones que conceden acciones amplias al modelo. Una buena respuesta reconoce incertidumbre y muestra cómo se contiene.

## Preguntas frecuentes

### ¿Un prototipo es suficiente?

Sirve para validar viabilidad y calidad inicial. Producción necesita además permisos, integración, recuperación, límites de coste, monitorización y responsables de supervisión.

### ¿Qué tamaño debe tener el conjunto de evaluación?

No hay una cifra universal. Debe cubrir clases, formatos y excepciones con suficiente representación para detectar fallos relevantes. Amplíalo cuando aparecen casos nuevos, conservando un subconjunto estable para comparar versiones.

### ¿Puede funcionar sin revisión humana?

Solo en recorridos de riesgo bajo, con resultados medidos y validaciones fuertes. La autonomía se gana por tipo de caso; no se concede a todo el flujo porque una media parezca buena.

### ¿Cómo se calcula el retorno?

Compara tiempo y errores actuales con el ahorro neto después de revisión, licencias, consumo y mantenimiento. Incluye mejora de plazo cuando sea medible, sin inventar beneficios comerciales.

### ¿Qué ocurre si cambia el modelo?

Se ejecuta de nuevo la evaluación, se comparan calidad, coste y latencia, y se despliega gradualmente. Debe existir una versión anterior o un modo manual al que volver si el resultado empeora.

### ¿Quién es responsable de una decisión errónea?

La organización debe definir responsabilidad y escalado antes del lanzamiento; no puede delegarlos en el modelo. En decisiones sensibles, consulta además a las personas responsables de cumplimiento y del proceso.
