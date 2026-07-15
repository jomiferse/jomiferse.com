# Carrusel compartido de tecnologías

## Objetivo

Reutilizar en la home la sección de tecnologías de `/contact`, colocándola después de “Nuestros servicios especializados”, y ampliar el título del bloque para que no quede excesivamente escalonado.

## Arquitectura

El carrusel dejará de ser un componente específico de contacto y pasará a ser un componente común. `/contact` y la home renderizarán la misma lista de tecnologías, iconos, animación, pausa mediante hover o foco y alternativa sin movimiento.

El componente recibirá contenido localizado mediante propiedades:

- `eyebrow`: etiqueta breve, actualmente “Stack”.
- `title`: título de la sección.
- `description`: texto opcional; se mostrará en la home y podrá omitirse en contacto.
- `pauseLabel`: descripción accesible de la región animada.
- `headingId`: identificador único del título para `aria-labelledby`.

## Diseño visual

- Mantener la filosofía comercial actual: títulos en `var(--home-navy)`, eyebrow en `var(--action)` y superficies neutras.
- Aumentar el ancho máximo del título de `18ch` a `min(52rem, 100%)`.
- Mantener el tamaño actual del título y el carrusel de iconos; no añadir logos nuevos ni tarjetas adicionales.
- El texto opcional tendrá un ancho máximo de `42rem` y usará `var(--text-muted)`.
- En la home, la sección se insertará inmediatamente después de `HomeSpecializedServices` y antes de `HomeProcess`.
- En contacto se conservará su posición actual, después del formulario.

## Contenido

En `/contact` se conserva el título localizado “Tecnologías y plataformas con las que trabajo” y su equivalente inglés.

En la home se reutiliza `home.page.skills`:

- Eyebrow: “Stack”.
- Título: “Tecnologías con las que trabajo”.
- Texto: “Backend es mi base, pero puedo moverme por todo el stack cuando el proyecto lo necesita.”

La versión inglesa mantendrá la intención equivalente ya existente en el diccionario.

## Accesibilidad y movimiento

- La región seguirá siendo enfocada mediante teclado y pausará la animación al recibir foco.
- `prefers-reduced-motion: reduce` seguirá eliminando la animación, ocultando la copia duplicada y mostrando una lista estable.
- Cada instancia tendrá un `headingId` diferente para evitar identificadores duplicados.
- La lista duplicada continuará marcada con `aria-hidden="true"`.

## Responsive y validación

- Comprobar 1440 × 900 y 390 × 844 en home y contacto.
- Verificar ambos idiomas y temas.
- Confirmar que el nuevo ancho reduce los saltos del título sin provocar overflow.
- Añadir verificación de que home y contacto usan el componente compartido y de que no queda el componente específico anterior.
- Ejecutar tests, Astro check, lint, formato, build y los verificadores específicos de home y contacto.
