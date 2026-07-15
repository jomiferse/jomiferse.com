# Corregir dependencias vulnerables y limpiar el árbol

**Estado:** TODO  
**Prioridad:** P0 — bloquea publicación  
**Planificado sobre:** `24590a6` (2026-07-15)

## Por qué

El audit de producción detecta 15 avisos: 5 high, 6 moderate y 4 low. Los high proceden de `path-to-regexp` a través del adaptador de Vercel y de `undici` a través de Astro/unstorage y tooling de iconos. El informe no demuestra explotación en esta web estática, pero el árbol de build y el endpoint SSR deben salir sin avisos high conocidos o con una excepción documentada.

## Estado actual y evidencia

- `package.json:31-53` declara Astro 7, `@astrojs/vercel` 11, `astro-icon`, Resend y Vercel.
- `@vercel/analytics` está declarado, pero la analítica implementada usa el componente propio de Google; no hay importaciones localizadas durante la auditoría.
- `pnpm audit --prod` en 2026-07-15: 15 avisos, incluidos `path-to-regexp <6.3.0` y ramas de `undici` vulnerables.

## Alcance

`package.json`, `pnpm-lock.yaml`, configuración Astro/Vercel y pruebas/build afectadas por actualizaciones. Fuera de alcance: saltos de framework no necesarios para resolver los avisos.

## Pasos de implementación

1. Guardar el árbol exacto con `pnpm why path-to-regexp undici yaml tar js-yaml` y asociar cada aviso a una dependencia directa y a su uso en build o runtime.
2. Actualizar primero versiones compatibles de Astro, adaptador Vercel, `astro-icon`, Resend y tooling. Evitar `overrides` que oculten incompatibilidades; usarlos solo con prueba de integración y comentario de retirada.
3. Eliminar `@vercel/analytics` si sigue sin importarse ni estar activado por configuración externa. Ejecutar `pnpm install` para regenerar el lockfile.
4. Ejecutar el audit de nuevo. Para cualquier aviso restante, documentar advisory, ruta, superficie alcanzable, versión fijada por upstream y fecha de revisión.
5. Probar el build estático y el endpoint de contacto con la versión de Node fijada por el repositorio.

## Verificación

```bash
pnpm audit --prod
pnpm test
pnpm run check
pnpm run lint
pnpm run build
```

## Criterios de finalización

- No quedan avisos high alcanzables en runtime/build, o existe una excepción breve, trazable y con fecha.
- El lockfile procede de `pnpm install`, sin ediciones manuales.
- No quedan dependencias directas sin uso.
- Build, tests y contacto funcionan con Node 24.

## STOP

Detener si la solución requiere bajar una dependencia, forzar una versión fuera del rango soportado o cambiar el adaptador de despliegue. Evaluar la ruta oficial del proveedor antes de continuar.

## Mantenimiento

Añadir `pnpm audit --prod` a la revisión periódica, no como bloqueo ciego: los advisories deben evaluarse por ruta y alcance.
