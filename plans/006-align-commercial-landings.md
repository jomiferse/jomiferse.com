# Alinear las landings comerciales con la home

**Estado:** TODO  
**Prioridad:** P1 — coherencia comercial antes de publicación  
**Planificado sobre:** `24590a6` (2026-07-15)

## Por qué

La home y los servicios ya tienen una jerarquía editorial clara, navy + rojo de acción. Las páginas `/{locale}/{landing}/` conservan el tratamiento anterior: títulos con `--text`, checks cian y grupos de cards repetidos. No es un problema de contenido, sino de consistencia y prioridad de conversión.

## Estado actual y evidencia

- `src/pages/[locale]/[landing].astro:71-89` usa `--text` en el H1 y `button-primary` como CTA.
- `src/pages/[locale]/[landing].astro:108-155` presenta checks cian y cards donde la home usa filas, divisores y superficies más contenidas.
- La auditoría a 1440/390 confirma que no hay overflow y que el contenido es legible; se debe preservar esa estabilidad.
- La guía del repositorio exige `--home-navy` para títulos comerciales y `--action` para CTA/señales pequeñas.

## Alcance

Plantilla de landing, componentes comerciales compartidos y estilos asociados; todas las variantes EN/ES. Fuera de alcance: cambiar oferta, precios o crear nuevas landings.

## Pasos de implementación

1. Inventariar secciones de la landing y mapearlas a patrones ya presentes en home/servicios: hero, prueba, problema, casos, alcance, FAQ y CTA final.
2. Cambiar H1/H2 a la jerarquía `--home-navy`; reservar `--action` para eyebrow, numeración, iconos y CTA principal. Usar `--action-text` cuando sea texto pequeño sobre fondo claro.
3. Reducir cards decorativas: convertir listas de casos/alcance en filas editoriales con divisores y superficies `--surface*`; mantener cards solo cuando agrupen una unidad interactiva o comparable.
4. Garantizar una sola prioridad CTA por viewport. El secundario debe ser enlace/botón visualmente subordinado y el CTA final debe conservar el contexto de origen.
5. Unificar anchos, ritmo vertical y escalado tipográfico con la home, sin duplicar CSS por landing.
6. Revisar todas las landings en EN/ES a 390 y 1440, claro/oscuro, foco teclado y zoom 200 %. Capturar home + una landing representativa para comparación.

## Verificación

```bash
pnpm run format
pnpm run check
pnpm run lint
pnpm run build
```

Prueba visual: sin overflow, sin solapamientos, CTA visible, headings navy en claro y equivalentes en oscuro, foco visible y contenido idéntico en intención entre idiomas.

## Criterios de finalización

- Todas las landings siguen la jerarquía visual de la home.
- El cian deja de funcionar como paleta comercial alternativa.
- Hay una CTA principal inequívoca por sección decisiva.
- Se conserva legibilidad y estabilidad a 390/1440 y dark mode.
- No se introducen cards sin función ni estilos específicos por slug.

## STOP

Detener si la alineación visual exige cambiar copy, precios o posicionamiento: separar esa decisión comercial de este refactor de plantilla.

## Mantenimiento

Documentar los patrones comerciales compartidos con ejemplos de componentes; una nueva landing debe componerse con ellos y probar ambos idiomas.
