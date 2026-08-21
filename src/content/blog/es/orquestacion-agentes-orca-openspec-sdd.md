---
title: "Orquestación de agentes con Orca y OpenSpec: un flujo SDD completo"
metaTitle: "Orca + OpenSpec: guía SDD para agentes de IA"
description: "Tutorial práctico para convertir una especificación en tareas paralelas con OpenSpec y Orca, revisar resultados y cerrar el cambio sin perder trazabilidad."
metaDescription: "Guía práctica de SDD con OpenSpec y Orca: especificaciones, tareas, worktrees, revisión multiagente, validación y límites reales."
date: "2026-08-21"
language: "es"
author: "José Miguel Fernández"
readingTime: "15 min"
translationSlug: "orchestrating-coding-agents-orca-openspec-sdd"
commercial:
  role: technical-authority
  audience: technical
  cluster: ai-automation
cover:
  src: "/images/blog/covers/orca-openspec-agent-orchestration.avif"
  alt: "Una especificación técnica pasa por una validación, se reparte entre worktrees aislados y converge en una revisión"
tags:
  [
    orca,
    openspec,
    spec-driven-development,
    agentes-ia,
    orquestacion-multiagente,
  ]
---

Poner tres agentes a programar en paralelo es fácil. Conseguir que implementen la misma feature, respeten los mismos permisos y entreguen cambios que se puedan integrar es otra cosa.

El problema rara vez es la velocidad de escritura. Suele estar antes: nadie ha fijado qué significa “terminado”, dos tareas comparten archivos sin saberlo o una decisión importante solo existe en el historial de un chat. Más agentes amplifican esas grietas.

En este tutorial voy a recorrer un flujo de **spec driven development** (SDD) con [OpenSpec](https://github.com/Fission-AI/OpenSpec) y orquestación de agentes con [Orca](https://github.com/stablyai/orca). El ejemplo es una feature corriente de un SaaS: exportar facturas a CSV, con filtros, permisos para administración y finanzas, backend, interfaz y pruebas.

No es una historia de producción. Reproduje la parte de planificación y coordinación en un repositorio temporal, validé la especificación y pedí dos revisiones independientes mediante un Run real de Orca. Al final detallo versiones, alcance y límites.

## Qué resuelve cada herramienta

OpenSpec y Orca se complementan porque trabajan en capas distintas.

**OpenSpec conserva el contrato del cambio.** La propuesta explica el porqué; los requisitos y escenarios describen el comportamiento; el diseño registra decisiones; las tareas convierten todo eso en trabajo verificable. Esos artefactos viven en el repositorio y se pueden revisar antes de tocar código.

**Orca coordina la ejecución.** Un Run agrupa el objetivo. Las Tasks separan el trabajo y sus dependencias. Los workers operan con límites explícitos, normalmente en worktrees aislados. Preguntas, bloqueos y finalizaciones regresan al coordinador, que revisa e integra.

Una forma sencilla de recordarlo es esta:

| Pregunta                                              | Responsable principal |
| ----------------------------------------------------- | --------------------- |
| ¿Qué comportamiento debe existir y cómo se comprueba? | OpenSpec              |
| ¿Qué decisiones técnicas aceptamos para este cambio?  | OpenSpec              |
| ¿Quién hace cada parte y en qué orden puede empezar?  | Orca                  |
| ¿Dónde trabaja cada agente sin pisar a los demás?     | Orca                  |
| ¿La entrega cumple los escenarios que se aprobaron?   | Ambos                 |

![Flujo desde la especificación y su validación hasta worktrees paralelos, revisión y archivo](/images/blog/orca-openspec-sdd-workflow.svg)

## El caso: exportar facturas sin abrir una fuga de datos

La petición inicial parece pequeña:

> Añadir un botón para exportar facturas a CSV, aplicando los filtros actuales.

Antes de repartirla conviene convertirla en decisiones comprobables:

- solo `admin` y `finance` pueden exportar;
- el servidor vuelve a comprobar permisos y tenant, aunque la UI oculte el botón;
- el CSV usa UTF-8 y un orden de columnas estable;
- los filtros de fecha, estado y cliente tienen la misma semántica en UI y API;
- el sistema neutraliza celdas que una hoja de cálculo pueda interpretar como fórmulas;
- una exportación correcta deja una entrada de auditoría con actor, filtros y número de filas, nunca con el contenido completo;
- la interfaz muestra progreso y errores recuperables;
- existe un límite de filas y una respuesta definida cuando se supera.

Esta lista ya revela por qué “backend” y “frontend” no son dos tareas independientes desde el primer minuto. Ambas dependen del contrato de filtros, permisos, respuesta y errores.

## 1. Inicializar OpenSpec

Para hacer el ejemplo reproducible usé OpenSpec 1.9.0. En un repositorio existente:

```bash
openspec init --tools codex --profile core
openspec new change export-invoices
```

La integración con cada agente puede ofrecer atajos propios. En Codex 1.9, por ejemplo, la inicialización instala skills como `$openspec-propose`. Para un tutorial y para CI prefiero mostrar la CLI: deja claro qué artefacto se crea y no depende de la sintaxis de un cliente.

OpenSpec separa dos estados:

```text
openspec/
├── specs/                         # comportamiento vigente
└── changes/
    └── export-invoices/           # cambio propuesto
        ├── proposal.md
        ├── specs/
        │   └── invoice-export/
        │       └── spec.md
        ├── design.md
        └── tasks.md
```

La distinción es útil en un proyecto brownfield. `specs/` cuenta qué hace el sistema hoy. `changes/` mantiene aparte lo que todavía se está discutiendo o implementando.

Puedes consultar el estado y las instrucciones del siguiente artefacto:

```bash
openspec status --change export-invoices --json
openspec instructions proposal --change export-invoices
```

En la prueba, OpenSpec marcó primero `proposal` como listo. `specs` y `design` quedaron bloqueados hasta que existió la propuesta; `tasks` no se habilitó hasta completar los dos anteriores. Esa dependencia evita redactar una lista de tareas antes de acordar el comportamiento.

## 2. Escribir propuesta, requisitos, diseño y tareas

La propuesta cabe en pocas líneas si responde a cuatro preguntas: qué duele, qué cambia, qué capacidades aparecen y qué partes del sistema se ven afectadas.

```md
## Why

El equipo financiero prepara cierres mensuales copiando datos del panel.
El proceso es lento y puede omitir los filtros aplicados.

## What Changes

- Añadir una exportación CSV con los filtros actuales.
- Autorizar solo a los roles admin y finance.
- Registrar cada exportación completada sin guardar el CSV.

## Impact

- API de facturas y consulta de datos.
- Panel de administración.
- Auditoría, pruebas y documentación operativa.
```

La especificación debe bajar de intención a escenarios. Un fragmento posible:

```md
## ADDED Requirements

### Requirement: Authorized invoice export

The system SHALL allow an authenticated admin or finance user to export
invoices from their current tenant using the active filters.

#### Scenario: Finance user exports a filtered result

- **WHEN** a finance user requests an export with a valid date range
- **THEN** the response contains only matching invoices from their tenant
- **AND** columns follow the documented order

#### Scenario: Unauthorized role calls the endpoint directly

- **WHEN** an authenticated user without admin or finance role requests an export
- **THEN** the system rejects the request before querying invoice rows
- **AND** no export file is produced
```

Aunque el artículo esté en español, mantengo el ejemplo en el formato normativo que genera OpenSpec: `SHALL`, `WHEN`, `THEN` y `AND`. Lo importante no es el idioma, sino que cada requisito tenga al menos un escenario observable.

En `design.md` registraría las decisiones que podrían sorprender a quien implemente después:

- endpoint dedicado para no mezclar JSON paginado y descarga;
- autorización y tenant antes de consultar filas;
- streaming para no cargar todo el CSV en memoria;
- escape de comas, comillas, saltos de línea y prefijos `=`, `+`, `-` y `@`;
- auditoría solo después de completar la respuesta y conocer el recuento;
- umbral síncrono explícito, con error estable al superarlo.

`tasks.md` traduce el diseño a unidades comprobables. En este punto todavía no asignaría agentes:

```md
## 1. Shared contract

- [ ] 1.1 Freeze request filters, CSV headers and value formats
- [ ] 1.2 Define authorization, error and row-limit behavior

## 2. Backend

- [ ] 2.1 Enforce tenant-scoped roles before querying rows
- [ ] 2.2 Stream and escape the CSV using the frozen contract
- [ ] 2.3 Record a privacy-safe audit event after completion

## 3. Frontend

- [ ] 3.1 Show export only to authorized roles
- [ ] 3.2 Send active filters and expose progress and recoverable errors

## 4. Verification

- [ ] 4.1 Run backend, UI and integration tests
- [ ] 4.2 Check every acceptance scenario against the implementation
```

## 3. Validar antes de paralelizar

El comando que debe pasar antes de crear workers es:

```bash
openspec validate export-invoices --strict --json
```

En el laboratorio devolvió un cambio validado, cero errores y todos los artefactos de planificación completos. Eso prueba la forma de la especificación, no la calidad de cada decisión. De hecho, uno de los revisores detectó que faltaban formatos exactos, semántica de zona horaria, límites de tenant, cabeceras de descarga y escenarios para CSV vacío, cancelación y fallos a mitad del streaming.

La validación estricta es una puerta, no una revisión de producto o seguridad.

Cuando el equipo aprueba el cambio, conviene versionar estos archivos antes de crear worktrees:

```bash
git add openspec/changes/export-invoices
git commit -m "docs(spec): define invoice export change"
```

No es una ceremonia inútil. Un worktree nuevo nace de un commit. Si la versión aprobada solo está en archivos sin confirmar o en el chat del coordinador, cada worker puede recibir un contrato distinto.

## 4. Convertir la especificación en un DAG de Orca

Dentro de una terminal gestionada por Orca, los comandos usan `orca`. En Linux, desde fuera de esas terminales, la misma CLI pública puede aparecer como `orca-ide`. Comprueba tu instalación antes de automatizar nombres o rutas.

Creamos un Run para el objetivo completo:

```bash
orca orchestration run-create \
  --objective "Implement the approved invoice CSV export" \
  --json
```

Después creamos tareas. El DAG debería reflejar dependencias reales, no el organigrama:

```text
Contrato compartido
├── Backend
├── Frontend
└── Revisión de seguridad
        └── Integración y verificación final
```

Ejemplo de una Task:

```bash
orca orchestration task-create \
  --task-title "Implement invoice export backend" \
  --spec "Own the export endpoint, authorization, CSV streaming, audit event and backend tests. Do not edit frontend files. Follow openspec/changes/export-invoices exactly." \
  --json
```

Repite el comando para frontend y revisión. Conserva los identificadores devueltos, porque worker, mensajes y finalización se enlazan a ellos.

Una tarea útil especifica:

- resultado y criterios de aceptación;
- archivos o módulos bajo propiedad del worker;
- archivos que no debe tocar;
- dependencia que debe estar cerrada;
- comandos de prueba y salida esperada;
- protocolo para preguntas y finalización.

“Haz el frontend” no alcanza. El worker podría cambiar tipos compartidos, mocks o el cliente API que otro agente está modificando.

## 5. Lanzar workers en worktrees aislados

Después de cerrar el contrato común, backend y frontend sí pueden avanzar en paralelo:

```bash
orca orchestration worker-start \
  --task "$BACKEND_TASK_ID" \
  --worktree new-child \
  --name invoice-export-backend \
  --agent codex \
  --setup run \
  --json

orca orchestration worker-start \
  --task "$FRONTEND_TASK_ID" \
  --worktree new-child \
  --name invoice-export-frontend \
  --agent codex \
  --setup run \
  --json
```

Un worktree por worker aísla el checkout, no el diseño. Si ambos tienen autorización para editar `invoiceFilters.ts`, el conflicto solo aparecerá más tarde. Por eso la propiedad de archivos importa tanto como la separación física.

Tampoco hay premio por ocupar todos los workers. Si una tarea necesita el endpoint final o una migración todavía inestable, debe esperar. El paralelismo rentable es el camino crítico que realmente se puede separar.

## 6. Preguntas, bloqueos y finalizaciones

El coordinador no debería consultar terminales en un bucle agresivo. Orca permite esperar eventos relevantes:

```bash
orca orchestration check \
  --wait \
  --types worker_done,escalation,question \
  --timeout-ms 900000 \
  --json
```

Una pregunta debe volver al worker que la formuló con una decisión que pueda aplicar. Si afecta al contrato, actualiza OpenSpec y comparte el commit; no dejes una excepción enterrada en un mensaje.

Cuando llega `worker_done`, el coordinador aún tiene trabajo:

1. leer el resumen y comprobar el diff;
2. ejecutar las pruebas declaradas;
3. contrastar resultados con los escenarios;
4. aceptar, devolver o abrir una tarea correctiva;
5. liberar el dispatch.

```bash
orca orchestration worker-release --dispatch "$DISPATCH_ID" --json
```

Una finalización es una señal de entrega, no evidencia de corrección. En la prueba, ambos revisores enviaron `worker_done`; solo después de leer sus observaciones liberé cada worker y confirmé la entrega al Run.

Si un worker falla, conserva el contexto del fallo. Decide si el problema es local, si la Task era ambigua o si la especificación cambió. Reiniciar el mismo prompt sin corregir la causa suele producir otra variante del mismo problema.

## 7. Integrar y verificar contra la especificación

La integración puede ser mediante commits seleccionados, merge o una tarea dedicada, según el repositorio. El orden razonable es:

1. integrar el contrato compartido;
2. integrar backend y ejecutar sus pruebas;
3. integrar frontend y ejecutar sus pruebas;
4. ejecutar la suite completa;
5. revisar manualmente permisos, descarga y errores;
6. recorrer cada escenario de OpenSpec.

Para esta feature, la puerta final debería cubrir al menos:

```text
[ ] admin y finance pueden exportar
[ ] otros roles reciben rechazo antes de consultar datos
[ ] nunca aparecen facturas de otro tenant
[ ] filtros y zona horaria coinciden entre UI y API
[ ] cabeceras y formatos del CSV son estables
[ ] comas, comillas, saltos y fórmulas quedan neutralizados
[ ] exportaciones vacías, grandes y fallidas tienen respuesta definida
[ ] la auditoría no guarda contenido sensible
[ ] la UI informa progreso, éxito y error recuperable
```

Vuelve a validar el cambio:

```bash
openspec validate export-invoices --strict --json
```

Cuando la implementación cumple la especificación y las tareas están marcadas, archiva el cambio:

```bash
openspec archive export-invoices --yes
```

El archivo no borra el razonamiento. Integra la nueva verdad en las especificaciones vigentes y conserva el historial del cambio.

## OpenSpec frente a Spec Kit y Kiro

Las tres opciones practican specification driven development, pero no organizan el trabajo igual. La elección depende más del entorno y del ciclo de vida del repositorio que de una lista de funciones.

| Opción                                                 | Enfoque principal                                     | Portabilidad                                      | Brownfield / greenfield                                                      | Organización de artefactos                                   |
| ------------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec)     | Cambios propuestos frente a especificaciones vigentes | CLI y archivos Markdown, poco acoplado al agente  | Especialmente claro en brownfield; también sirve en proyectos nuevos         | `specs/` para verdad actual y `changes/` para propuestas     |
| [GitHub Spec Kit](https://github.github.com/spec-kit/) | Flujo Specify, Plan, Tasks e Implement                | CLI, plantillas y extensiones para varios agentes | Muy cómodo para iniciar una feature o producto; adaptable a repos existentes | Artefactos por feature y fases explícitas                    |
| [Kiro Specs](https://kiro.dev/docs/web/specs/)         | Especificaciones integradas en el entorno Kiro        | Más ligado a la experiencia Kiro                  | Admite Feature, Bug y Quick Spec en proyectos nuevos o existentes            | Requirements, design y tasks dentro de sesiones del producto |

OpenSpec encaja bien cuando quieres que el delta entre sistema actual y cambio propuesto sea visible. Spec Kit ofrece un proceso más guiado desde la constitución del proyecto hasta la implementación. Kiro reduce fricción si el equipo ya trabaja dentro de su entorno. Ninguna herramienta evita tener que resolver requisitos ambiguos.

## Cuatro formas de repartir el trabajo

| Modelo                              | Aislamiento                   | Coordinación                                 | Cuándo encaja                                     | Riesgo principal                                  |
| ----------------------------------- | ----------------------------- | -------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| Agente único                        | Un checkout                   | Conversación lineal                          | Cambios pequeños o muy acoplados                  | Contexto largo y verificación superficial         |
| Varios agentes en el mismo checkout | Ninguno                       | Acuerdos informales                          | Revisiones de solo lectura                        | Ediciones simultáneas y estado impredecible       |
| Worktrees manuales                  | Checkout y rama por tarea     | El desarrollador mantiene dependencias       | Pocas ramas independientes                        | Integración y seguimiento artesanales             |
| Orquestación supervisada con Orca   | Worktrees, Tasks y dispatches | Run, DAG, mensajes, preguntas y finalización | Features con varias rutas de trabajo comprobables | Coste de coordinación si se divide demasiado fino |

En el laboratorio usé dos revisores de solo lectura sobre el mismo repositorio temporal. No había riesgo de edición y así pude observar Run, Tasks, dispatches y `worker_done`. Para implementar backend y frontend, los worktrees aislados serían la opción prudente.

## Límites que conviene asumir desde el principio

**Una especificación válida puede seguir siendo ambigua.** El validador comprueba estructura y reglas; una persona debe cuestionar privacidad, producto y casos límite.

**Los archivos compartidos reducen el paralelismo.** Tipos, contratos API, fixtures y mocks suelen convertirse en puntos de colisión. Fíjalos primero o asigna un único propietario.

**Más workers también añaden esperas.** Cada división exige contexto, revisión e integración. Dos tareas sólidas pueden ganar a seis fragmentos diminutos.

**El contexto sin versionar se pierde.** Una decisión en un chat no llega por arte de magia a un worktree nuevo ni a quien mantenga el sistema dentro de seis meses.

**`worker_done` puede ser una falsa finalización.** El agente puede haber terminado su interpretación de la Task y aun así fallar una condición de aceptación.

**La coordinación tiene coste.** Crear DAG, responder preguntas y reconciliar cambios merece la pena cuando reduce el camino crítico. Para un cambio de un archivo, probablemente no.

## Nota metodológica del laboratorio

La comprobación se ejecutó el 21 de agosto de 2026 con OpenSpec 1.9.0 y Orca 1.4.186, en un repositorio Git temporal fuera de este sitio.

Creé los cuatro artefactos del cambio `export-invoices`, observé sus dependencias, ejecuté `openspec validate --strict` con resultado correcto y confirmé la especificación en el repositorio temporal. Después creé un Run de Orca con dos Tasks de revisión: requisitos y seguridad por un lado; diseño y paralelización por otro. Dos workers independientes revisaron los archivos sin editarlos, emitieron `worker_done` y fueron liberados tras procesar sus respuestas.

La prueba verificó el flujo de planificación y coordinación. No implementó la feature, no midió productividad y no reprodujo carga, despliegue ni datos de producción. Las observaciones de seguridad y diseño son resultados de revisión sobre un caso representativo, no conclusiones estadísticas.

## Checklist para aplicar el flujo

- [ ] La propuesta explica problema, alcance e impacto.
- [ ] Cada requisito tiene escenarios observables.
- [ ] Diseño y tareas fijan permisos, errores y límites relevantes.
- [ ] `openspec validate --strict` pasa antes de repartir trabajo.
- [ ] La especificación aprobada está versionada.
- [ ] El DAG refleja dependencias técnicas reales.
- [ ] Cada worker conoce propiedad de archivos y zonas prohibidas.
- [ ] Las preguntas que cambian el contrato vuelven a OpenSpec.
- [ ] Cada `worker_done` se revisa antes de liberar el worker.
- [ ] Integración, tests y escenarios pasan en un checkout conjunto.
- [ ] El cambio se archiva solo cuando la implementación coincide con la especificación.

## Preguntas frecuentes

### ¿Qué es OpenSpec?

OpenSpec es una herramienta de SDD que mantiene especificaciones vigentes y cambios propuestos como archivos versionables. Su valor está en conservar intención, escenarios, diseño y tareas junto al código, sin depender de un agente concreto.

### ¿Qué es SDD en IA?

Spec driven development o specification driven development es un flujo en el que se acuerda primero el comportamiento verificable y después se implementa. Con agentes de IA, la especificación actúa como contrato compartido y reduce interpretaciones incompatibles.

### ¿Cómo orquestar agentes de IA sin que se pisen?

Primero fija el contrato, después crea tareas con dependencias y propiedad explícita de archivos. Usa worktrees para aislar ediciones, centraliza preguntas y revisa cada entrega contra los mismos criterios de aceptación.

### ¿Orca sustituye a OpenSpec?

No. Orca coordina actores y ejecución; OpenSpec conserva qué hay que construir y por qué. Puedes usar cada uno por separado, pero juntos cubren contrato y coordinación.

### ¿Cuándo no merece la pena paralelizar?

Cuando el cambio es pequeño, toca los mismos archivos o depende de decisiones todavía abiertas. En esos casos, un agente con una buena especificación suele ser más rápido y más fácil de revisar.

## Fuentes y siguiente lectura

Los comandos y conceptos de este tutorial parten de la [documentación de OpenSpec](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md), la [guía de orquestación de Orca](https://github.com/stablyai/orca/blob/main/skill-guides/orchestration.md), [GitHub Spec Kit](https://github.github.com/spec-kit/) y [Kiro Specs](https://kiro.dev/docs/web/specs/). Para el enfoque editorial, sigo la recomendación de Google de crear [contenido útil y pensado para personas](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), independientemente de las herramientas usadas para prepararlo.

Si quieres ampliar el contexto técnico, sigue con [MCP para desarrolladores](/es/blog/mcp-para-desarrolladores-protocolo-herramientas-ia/), [usar IA en un producto sin humo](/es/blog/usar-ia-en-tu-producto-sin-humo/) e [idempotencia en APIs](/es/blog/apis-idempotentes-que-sobreviven-a-reintentos/). El diseño de una feature como esta también se parece a una [automatización de procesos bien acotada](/es/blog/automatizar-procesos-empresa-cuando-merece-la-pena/). Si necesitas convertir un flujo operativo en software mantenible, consulta el servicio de [automatizaciones con IA](/es/services/automatizaciones-con-ia/).
