# Diseño: unión de Sobre mí y Experiencia

## Objetivo

Convertir `/about` en una página única de presentación y confianza comercial. Debe explicar quién es José Miguel, demostrar experiencia real y orientar al visitante hacia una primera valoración gratuita sin adoptar el formato de un CV tradicional.

La ruta localizada `/experience` dejará de ser una página independiente y redirigirá permanentemente a la ruta `/about` del mismo idioma.

## Audiencia y enfoque

La página se dirige principalmente a pequeños negocios, profesionales y founders. La experiencia técnica se presentará en términos de criterio, fiabilidad e impacto. Recruiters y perfiles técnicos seguirán encontrando empresas, funciones, tecnologías y trayectoria, pero esa información estará subordinada al mensaje comercial.

El tono será directo, profesional y humano. Se evitarán eslóganes genéricos, promesas infladas y listas técnicas sin contexto.

## Arquitectura de la página

### 1. Hero personal

- Retrato existente de José Miguel.
- Mensaje principal centrado en ayudar a convertir problemas de negocio en soluciones digitales útiles.
- Introducción breve que conecte consultoría, web, automatización y backend.
- CTA principal hacia contacto con el servicio de valoración inicial.
- CTA secundario hacia servicios.

### 2. Señales de confianza

Una franja compacta, alineada con la home, mostrará pruebas rápidas:

- Más de cinco años construyendo software.
- Experiencia backend en producción.
- Capacidad de delivery full-stack.
- Trato directo con José Miguel.

Estas señales serán texto breve, no tarjetas independientes con contenido repetitivo.

### 3. En qué puedo ayudarte

Resumen comercial de cuatro áreas: consultoría informática, diseño web, automatización y software a medida. Cada área enlazará a la página de servicio localizada más relevante. El bloque debe ayudar a que un visitante se reconozca en una necesidad concreta.

### 4. Experiencia aplicada

La trayectoria profesional existente se integrará en `/about` desde los datos del CV. Cada puesto mostrará:

- Periodo, puesto, empresa y ubicación.
- Descripción breve.
- Una selección limitada de aportaciones con mayor valor comercial o técnico.
- Tecnologías principales como apoyo, sin dominar visualmente la sección.

La composición será una línea temporal editorial y compacta. No se repetirá la página actual de experiencia completa.

### 5. Cómo es trabajar conmigo

Bloque personal sobre comunicación directa, decisiones proporcionales al problema, entregas comprensibles y software mantenible. Complementará el proceso de la home sin copiarlo literalmente.

### 6. Formación

Una mención breve a la base técnica y al aprendizaje continuo, con enlace a la página de formación. No se duplicará el listado completo de cursos o certificaciones.

### 7. Cierre comercial

CTA final coherente con la home para solicitar una primera valoración gratuita. Debe dejar claro que es una conversación inicial para entender el caso, no una auditoría completa sin coste.

## Dirección visual

- Mantener la página más ancha introducida en la home.
- Jerarquía editorial, grandes titulares y espacios claros.
- Alternar secciones limpias y bandas suaves para dar ritmo.
- Usar el verde de acento y las variables visuales existentes.
- Reducir el número de tarjetas; reservar bordes y superficies para información que necesite agrupación.
- Mantener una composición responsive sin desbordamiento horizontal.
- Respetar los temas claro y oscuro, con el claro como valor inicial para nuevas visitas.

## Navegación y rutas

- Eliminar el enlace independiente “Experiencia” del menú de escritorio y móvil.
- Mantener “Sobre mí” como única entrada.
- `/es/experience` redirigirá permanentemente a `/es/about`.
- `/en/experience` redirigirá permanentemente a `/en/about`.
- Actualizar cualquier enlace interno que aún apunte a `/experience`.
- Actualizar `public/llms.txt` para presentar `/about` como la URL canónica de perfil y experiencia.
- La página `/about` tendrá breadcrumbs y datos estructurados propios; la ruta retirada no generará contenido duplicado.

## Contenido bilingüe

El contenido nuevo se añadirá en español e inglés con intención equivalente, no mediante traducción literal. Los datos profesionales seguirán procediendo de `src/data/cv.es.json` y `src/data/cv.en.json`.

## Componentes y datos

La ruta `/about` seguirá siendo la responsable de componer la página. Las secciones con suficiente entidad visual podrán extraerse a componentes bajo `src/components/about/`. Los textos de interfaz vivirán en `src/i18n/{es,en}.json`; la experiencia y los años trabajados seguirán viniendo de `getCv(locale)`.

No se introducirán nuevas dependencias ni JavaScript de cliente para el rediseño.

## Accesibilidad y comportamiento

- Un único `h1` por página.
- Orden semántico de encabezados.
- Texto alternativo localizado para el retrato.
- Enlaces y CTAs con nombres comprensibles fuera de contexto.
- Contraste suficiente en ambos temas.
- Estados de foco visibles.
- La redirección conservará el idioma.

## Validación

- Añadir una verificación específica que compruebe la estructura esencial de `/about`, los enlaces localizados y la ausencia de “Experiencia” como entrada independiente del menú.
- Comprobar primero que esa verificación falla con la implementación actual.
- Ejecutar `pnpm run format`, `pnpm run check`, `pnpm run lint`, `pnpm run format:check` y `pnpm run build`.
- Verificar visualmente `/es/about` y `/en/about` en escritorio y móvil, en tema claro y oscuro.
- Confirmar el comportamiento de ambas rutas `/experience` y el cambio de idioma.

## Fuera de alcance

- Rediseñar la página de formación.
- Replantear el SEO global o las páginas de servicios.
- Añadir nuevas fotografías, testimonios o métricas no verificables.
- Cambiar el contenido de la experiencia profesional almacenado en el CV más allá de seleccionar y presentar sus datos.
