---
title: "CV Studio: construyendo una forma más clara de escribir un CV developer"
description: "Notas sobre la construcción de CV Studio, un generador de CV para developers con vista previa en vivo, datos estructurados y exportación PDF."
date: 2025-12-25
tags:
  - cv
  - developer-tools
  - portfolio
  - pdf
  - web-development
author: "José Miguel Fernández"
readingTime: "5 min"
---

Empecé CV Studio porque escribir un CV developer sigue siendo más difícil de lo que debería.

La mayoría de generadores te dan plantillas rígidas, demasiado ruido visual o PDFs que cambian al descargarlos. Quería algo más limpio: datos estructurados, vista previa en vivo y una salida en la que pudiera confiar.

Ese hueco fue lo que me llevó a crear **CV Studio**.

👉 **Repositorio del proyecto:**  
[https://github.com/jomiferse/cv-studio](https://github.com/jomiferse/cv-studio)

---

## Por qué lo construí

CV Studio es un proyecto personal con un objetivo simple:  
**ayudar a developers a escribir un CV claro sin perder control sobre la estructura ni el PDF final.**

Quería que la experiencia de edición fuese sencilla, pero apoyada en un modelo de datos sólido. El CV debía ser fácil de cambiar, fácil de validar y fiable al exportarlo.

Por eso CV Studio trata el CV como **datos estructurados primero**, y como documento pulido después.

![CV Studio – editor de CV con vista previa en tiempo real](/images/blog/cv-studio-editor.avif)

---

## Principios principales

Desde el principio mantuve unos pocos principios claros:

- **Datos estructurados primero**. Cada CV se apoya en un esquema JSON claro.
- **Feedback en tiempo real**. Los cambios aparecen al instante en la vista previa.
- **Salida fiable**. Los PDFs están optimizados para A4, impresión y lectura ATS.
- **Arquitectura mantenible**. Tipado fuerte, validación y plantillas reutilizables importan.

## Funcionalidades clave

### Editor de CV con vista previa en tiempo real

CV Studio permite editar el CV mientras ves el resultado final al instante. La vista previa no es un mockup. Representa lo que se exportará a PDF.

Eso elimina dudas y hace que cada cambio sea más fácil de validar.

### Exportación PDF de calidad

Los PDFs generados están pensados para mantenerse consistentes entre plataformas, impresoras y dispositivos. El layout sigue expectativas habituales en procesos técnicos de selección.

Sin márgenes rotos. Sin cambios inesperados de fuente. Solo una salida limpia y fiable.

![CV Studio – exportación profesional a PDF](/images/blog/cv-studio-pdf.avif)

### Interfaz limpia y mínima

La interfaz es intencionadamente mínima. El foco está en escribir, editar y revisar el resultado final sin distracciones.

### Validación sólida y escalabilidad

La validación por esquemas y el tipado fuerte mantienen los datos del CV consistentes. Eso facilita añadir secciones, plantillas o formatos de exportación más adelante sin volver frágil la aplicación.

## Para quién es CV Studio

- Software engineers y perfiles técnicos
- Developers que valoran el control sobre sus datos
- Personas que buscan CVs ATS-friendly y listos para imprimir
- Cualquiera que prefiera estructura limpia frente a plantillas recargadas

## Qué viene después

CV Studio sigue evolucionando. Algunas mejoras previstas:

- Varias plantillas profesionales de CV
- Más personalización manteniendo la estructura
- Mejoras en la exportación
- Internacionalización y soporte multiidioma

## Cierre

CV Studio es un producto pequeño, pero refleja cómo me gusta construir: interfaz simple, datos claros, salida fiable y margen para mejorar.

Puedes explorar el proyecto aquí:  
**[CV Studio en GitHub](https://github.com/jomiferse/cv-studio)**

Publicaré más notas conforme el proyecto evolucione.
