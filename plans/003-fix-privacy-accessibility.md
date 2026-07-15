# Resolver privacidad y accesibilidad antes de publicar

**Estado:** TODO  
**Prioridad:** P0 — bloquea publicación  
**Planificado sobre:** `24590a6` (2026-07-15)

## Por qué

La analítica no se carga sin consentimiento, pero la opción aparece marcada por defecto cuando no existen preferencias. También hay un foco global cian con contraste insuficiente sobre fondos claros, un botón de cookies de unos 19 px de alto y capas que permiten al banner tapar el menú móvil.

## Estado actual y evidencia

- `src/lib/cookie-consent.ts:53-56` devuelve `preferences?.analytics ?? true`.
- `src/styles/global.css:131-146` usa `--accent` para foco y elimina el outline nativo de controles.
- `src/styles/global.css:1353-1355` deja el foco del formulario en un halo translúcido de bajo contraste.
- `src/components/common/Footer.astro:185-195` contiene un botón de ajustes sin tamaño táctil; `global.css:1111-1116` elimina todo padding.
- En revisión visual, el banner tiene una capa superior a la del menú móvil y puede cubrir controles.
- El rojo `--action` queda cerca o por debajo de 4.5:1 sobre fondos claros cuando se usa como texto pequeño.

## Alcance

Consentimiento y sus pruebas, tokens de color/foco, formulario, footer, banner, menú móvil y componentes interactivos repetidos. Fuera de alcance: certificación legal o auditoría WCAG formal de un tercero.

## Pasos de implementación

1. Cambiar la preferencia inicial de analítica a `false`; mantener Consent Mode en `denied` hasta acción afirmativa y actualizar las pruebas.
2. Crear tokens separados `--focus-ring` y `--action-text` para claro/oscuro. El foco debe alcanzar 3:1 contra superficies adyacentes y el texto pequeño 4.5:1. Conservar `--action` para fondos de CTA si ya cumple con su texto.
3. No eliminar el outline de inputs salvo que `:focus-within` produzca un indicador equivalente, visible y de 2 px o más. Probar teclado en todos los tipos de control.
4. Dar al botón de ajustes de cookies un área interactiva mínima de 44 × 44 px sin alterar la densidad visual; revisar todos los botones icon-only equivalentes.
5. Definir una escala única de capas. Al abrir el menú, ocultar/inertizar el fondo y evitar que el banner intercepte sus controles; al cerrar, restaurar foco al disparador.
6. Revisar carruseles/filas horizontales: nombre accesible, controles prev/next cuando el contenido no sea evidente y respeto a `prefers-reduced-motion`.
7. En errores del contacto, asociar mensajes a campos mediante `aria-describedby`, mover foco al resumen/campo inválido y usar `aria-live` para resultado de envío.

## Verificación

```bash
pnpm test
pnpm run check
pnpm run lint
pnpm run build
```

Pruebas manuales: 390 × 844 y 1440 × 900, claro/oscuro, zoom 200 %, solo teclado, VoiceOver en menú/cookies/contacto y simulación de `prefers-reduced-motion`. Medir contraste con los colores computados, no solo con los tokens fuente.

## Criterios de finalización

- Analítica desmarcada y denegada hasta consentimiento explícito.
- Foco visible con contraste suficiente en todos los fondos.
- Objetivos táctiles de controles no inline de al menos 44 × 44 px.
- Menú, banner y modal no se solapan ni dejan foco fuera del diálogo.
- Errores y éxito del formulario se anuncian y se relacionan con sus campos.

## STOP

Detener si un cambio de consentimiento contradice la política publicada o la configuración real de Google Tag; actualizar política, implementación y pruebas como una sola unidad.

## Mantenimiento

Incluir una pasada teclado/móvil/oscuro en cada cambio de componente global y conservar pruebas puras para el estado de consentimiento.
