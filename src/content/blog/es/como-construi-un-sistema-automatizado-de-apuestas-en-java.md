---
title: "Cómo construí un sistema automatizado de apuestas en Java"
description: "Cómo construí BetX, un sistema automatizado de apuestas en Java y Spring Boot con arquitectura hexagonal, backtesting, paper trading y control de riesgo."
date: 2026-06-22
translationSlug: "how-i-built-an-automated-betting-system-in-java"
cover:
  src: "/images/blog/covers/how-i-built-an-automated-betting-system-in-java.avif"
  alt: "Ilustración editorial sobre Cómo construí un sistema automatizado de apuestas en Java"
tags:
  - java
  - spring-boot
  - arquitectura-hexagonal
  - backtesting
  - software-engineering
author: "José Miguel Fernández"
readingTime: "8 min"
---

## Introducción

Construir un sistema automatizado de apuestas es un reto interesante de **Software Engineering** porque desde fuera parece sencillo y, en cuanto lo tratas con seriedad, se vuelve bastante complejo. Recoger cuotas y aplicar una regla es fácil. Construir un sistema que pueda explicar una recomendación, simularla, rechazarla por riesgo y reproducir la decisión más tarde es otro problema.

Por eso construí **BetX**, un proyecto personal centrado en la ingeniería detrás de la automatización de apuestas. No es un proyecto para promocionar el juego ni promete rentabilidad. El objetivo era construir un **sistema automatizado de apuestas** en **Java** capaz de escanear mercados, detectar posible valor, generar recomendaciones, ejecutar **Backtesting**, simular decisiones con paper trading, seguir CLV y mantenerse mantenible al crecer.

[![Diagrama de arquitectura hexagonal de BetX con dominio, capa de aplicación, adaptadores, persistencia, Telegram, testing, Docker e integraciones futuras con exchanges](/images/blog/betx-hexagonal-architecture.svg)](/images/blog/betx-hexagonal-architecture.svg)

## El problema

Lo difícil no es escribir una estrategia. Lo difícil es hacer que esa estrategia funcione en un entorno cambiante sin perder contexto.

| Reto                  | Problema de ingeniería                                                     | Respuesta en BetX                                                       |
| --------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Recogida de datos     | Los mercados pueden venir incompletos, duplicados o con nombres distintos. | Normalizar snapshots antes de evaluar estrategias.                      |
| Cambios en las cuotas | Un precio útil puede desaparecer minutos después.                          | Guardar timestamps y vincular cada recomendación a su snapshot.         |
| Gestión de riesgo     | Una buena señal puede crear mala exposición.                               | Pasar cada candidata por un Risk Manager dedicado.                      |
| Ejecución             | La automatización puede acelerar errores.                                  | Empezar con recomendaciones y paper trading, no ejecución irreversible. |
| Seguimiento           | Aciertos y fallos no explican la calidad de decisión.                      | Registrar versión de estrategia, precio simulado, resultado y CLV.      |

### Recogida de datos

BetX trata el escaneo de mercados como una preocupación separada. Los datos crudos se normalizan en snapshots antes de llegar a cualquier estrategia. Así es más fácil depurar si una recomendación mala viene de datos incorrectos, un mapeo, una regla o un control de riesgo.

### Cambios en las cuotas

Las cuotas son sensibles al tiempo. Un precio que parecía interesante a las 10:00 puede haber desaparecido a las 10:03. BetX registra cuándo se escaneó el mercado, qué cuotas estaban disponibles y qué snapshot generó la recomendación.

### Gestión de riesgo

El componente más importante no es la predicción. Es la gestión de riesgo. BetX incluye un Risk Manager dedicado para que una recomendación solo sea aceptada después de pasar límites de exposición, duplicados y bankroll simulado.

### Ejecución

BetX se centra ahora mismo en recomendaciones, paper trading y análisis, no en ejecución directa con dinero real. Antes de automatizar cualquier acción irreversible, quería que el sistema registrara decisiones, reprodujera resultados, manejara duplicados, liquidara posiciones simuladas y explicara su propio comportamiento.

### Seguimiento del rendimiento

Medir rendimiento es más que calcular aciertos y fallos. BetX guarda versión de estrategia, snapshot de mercado, precio recomendado, precio simulado de ejecución, resultado y **CLV**, o closing line value. El CLV no prueba rentabilidad futura, pero sí aporta una señal técnica útil.

## Por qué Java

Elegí **Java 21** y **Spring Boot** porque BetX se comporta como un servicio backend, no como un script rápido. Quería tipado fuerte, límites explícitos, tests repetibles, inyección de dependencias, configuración, jobs programados y un camino limpio hacia Docker y CI/CD.

| Elección                       | Por qué encaja en BetX                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Java 21                        | Tipado fuerte, tooling maduro y buen soporte para servicios de larga ejecución.                      |
| Spring Boot                    | Inyección de dependencias, configuración, scheduling, tests por capas y wiring cercano a producción. |
| SQLite                         | Persistencia local simple para un proyecto personal con estado estructurado.                         |
| JUnit 5                        | Feedback rápido para reglas de dominio, casos de uso y adaptadores.                                  |
| Docker                         | Ejecución repetible entre local y despliegue.                                                        |
| Diseño preparado para RabbitMQ | Futuro procesamiento con colas sin reescribir los casos de uso centrales.                            |

Python habría sido más rápido para un prototipo, pero la rapidez no era el único objetivo. Quería un backend mantenible que pudiera crecer desde persistencia local hasta futuros adaptadores de exchanges, procesamiento con colas y mejores analíticas.

## Arquitectura del sistema

BetX sigue **Hexagonal Architecture**, también conocida como arquitectura de puertos y adaptadores. Dominio y aplicación viven en el centro. Bases de datos, APIs, Telegram, schedulers y futuros exchanges quedan fuera.

```text
betx/
  domain/
    market/
    recommendation/
    risk/
    strategy/
  application/
    port/in/
    port/out/
    usecase/
  adapter/
    in/scheduler/
    out/persistence/
    out/telegram/
    out/exchange/
  bootstrap/
```

### Capa de dominio

La capa de dominio contiene los conceptos que importan aunque mañana desaparecieran Spring Boot, SQLite o Telegram: mercados, cuotas, selecciones, recomendaciones, estrategias, políticas de riesgo, operaciones simuladas, resultados de backtesting y métricas de rendimiento.

### Capa de aplicación

La capa de aplicación coordina casos de uso: escanear mercados, evaluar estrategias, generar recomendaciones, aplicar controles de riesgo, registrar operaciones simuladas, ejecutar backtests y enviar notificaciones.

### Adaptadores

Los adaptadores gestionan el mundo exterior. Un adaptador de Telegram debe traducir una recomendación a un mensaje. No debe decidir si una recomendación es válida.

### Persistencia

SQLite es suficiente para la versión actual: simple, local, inspeccionable y adecuada para persistencia estructurada sin carga operativa. La decisión importante fue mantenerla detrás de puertos de repositorio.

### Integración con Telegram

Telegram da feedback rápido cuando BetX detecta una recomendación. La notificación incluye mercado, estrategia, precio, estado de riesgo y contexto.

Este es un ejemplo simplificado del tipo de frontera que quería:

```java
public interface MarketDataPort {
    List<MarketSnapshot> findOpenMarkets(MarketScanQuery query);
}

public interface RecommendationRepository {
    RecommendationId save(Recommendation recommendation);
}

public final class GenerateRecommendationsUseCase {
    private final MarketDataPort marketData;
    private final BettingStrategy strategy;
    private final RiskManager riskManager;
    private final RecommendationRepository recommendations;

    public List<Recommendation> execute(MarketScanQuery query) {
        return marketData.findOpenMarkets(query).stream()
            .flatMap(market -> strategy.evaluate(market).stream())
            .map(riskManager::evaluate)
            .filter(RiskDecision::accepted)
            .map(RiskDecision::recommendation)
            .map(recommendations::save)
            .map(Recommendation::fromId)
            .toList();
    }
}
```

El código real tiene más detalle, pero la forma importa: el caso de uso depende de puertos, no de infraestructura.

## Componentes principales

| Componente            | Responsabilidad                                                 |
| --------------------- | --------------------------------------------------------------- |
| Strategy Engine       | Evaluar mercados normalizados y producir señales de estrategia. |
| Recommendation Engine | Convertir señales en recomendaciones estructuradas.             |
| Risk Manager          | Aceptar, limitar o rechazar candidatas antes de recomendarlas.  |
| Backtesting Engine    | Ejecutar estrategias contra snapshots históricos.               |
| Paper Trading Engine  | Simular ejecución y liquidación sin realizar apuestas reales.   |

### Strategy Engine

El Strategy Engine evalúa reglas contra datos de mercado normalizados. Intenté mantener las estrategias explícitas y testeables porque el comportamiento escondido entre adaptadores es difícil de validar.

```java
public final class ValueBetStrategy implements BettingStrategy {
    private final BigDecimal minimumEdge;

    @Override
    public Optional<StrategySignal> evaluate(MarketSnapshot market) {
        BigDecimal modelProbability = estimateProbability(market);
        BigDecimal impliedProbability = BigDecimal.ONE.divide(
            market.bestPrice(),
            MathContext.DECIMAL64
        );

        BigDecimal edge = modelProbability.subtract(impliedProbability);

        if (edge.compareTo(minimumEdge) < 0) {
            return Optional.empty();
        }

        return Optional.of(StrategySignal.valueBet(market.id(), edge));
    }
}
```

### Recommendation Engine

Una recomendación incluye más que un mercado y un precio. Lleva estrategia de origen, timestamp, edge detectado, contexto del mercado, estado de riesgo y metadatos para inspeccionar la decisión más tarde.

### Risk Manager

El Risk Manager evita que una estrategia actúe a la vez como generador de señales y mecanismo de seguridad.

```java
public RiskDecision evaluate(StrategySignal signal, PortfolioState state) {
    if (state.hasOpenRecommendationFor(signal.marketId())) {
        return RiskDecision.rejected(signal, "duplicate market exposure");
    }

    if (state.dailyExposure().plus(signal.suggestedStake()).isAbove(limit)) {
        return RiskDecision.rejected(signal, "daily exposure limit");
    }

    return RiskDecision.accepted(signal);
}
```

### Backtesting Engine

El **Backtesting** Engine evalúa estrategias contra snapshots históricos. Un backtest no es una promesa; es un filtro. Ayuda a rechazar ideas débiles antes de convertirlas en comportamiento automatizado.

[![Flujo de backtesting y paper trading de BetX desde snapshots históricos hasta revisión de estrategia](/images/blog/betx-backtesting-paper-trading-flow.svg)](/images/blog/betx-backtesting-paper-trading-flow.svg)

### Paper Trading Engine

El paper trading simula qué habría pasado si se hubiera seguido una recomendación, sin realizar apuestas reales. Prueba el ciclo completo: recomendación creada, riesgo validado, posición simulada registrada, resultado liquidado, métricas actualizadas y notificación enviada.

## Retos que encontré

### Overfitting

El overfitting es un riesgo constante. Si ajusto una estrategia hasta que se ve bien con datos históricos, quizá solo estoy ajustando ruido. La respuesta es mantener escepticismo: hipótesis simples, pruebas fuera de muestra y menos parámetros.

### Sesgo en backtesting

El sesgo en backtesting es fácil de introducir. El sistema no debe usar datos que no habrían existido en el momento de decidir, y los mercados ausentes no pueden ignorarse solo cuando molestan.

### Calidad de datos

Los malos datos crean falsa confianza. Nombres inconsistentes, eventos duplicados, actualizaciones con retraso y precios ausentes pueden distorsionar todo el pipeline, así que validación y normalización acabaron siendo centrales.

### Gestión de estado

El mismo mercado puede escanearse muchas veces, generar varias señales, recibir cuotas actualizadas y liquidarse más tarde. BetX necesitó gestión cuidadosa de estado, idempotencia y transiciones trazables.

### Monitorización

La automatización necesita visibilidad. Si BetX recomienda algo, quiero saber por qué. Si lo descarta, también quiero saber por qué. Logs, notificaciones, decisiones almacenadas y métricas forman parte del trabajo de ingeniería.

## Lo que aprendí

| Aprendizaje                                      | Efecto práctico                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| La mayoría de ideas fallan en backtests.         | El sistema debe hacer que las ideas débiles fallen barato.                  |
| El riesgo importa más que la predicción.         | Las señales no sirven sin control de exposición.                            |
| La arquitectura importa en proyectos personales. | Hexagonal Architecture hizo BetX más testeable y extensible.                |
| La observabilidad importa desde pronto.          | Las decisiones automatizadas necesitan razones guardadas y estado trazable. |

## Mejoras futuras

| Mejora                 | Por qué importa                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Soporte multi-exchange | Cada exchange trae formatos, límites y reglas de ejecución distintas.              |
| Mejores analíticas     | Informes por estrategia, gráficos de CLV, drawdown e histórico de recomendaciones. |
| Experimentos con ML    | Útiles solo si responden una pregunta mejor que reglas simples.                    |
| Dashboard web          | Telegram sirve para alertas, pero no basta para análisis.                          |
| Más automatización     | Escaneos programados, RabbitMQ y despliegues preparados para CI/CD.                |

## Conclusión

BetX empezó como un **sistema automatizado de apuestas** en Java, pero la parte más valiosa del proyecto ha sido la disciplina de ingeniería alrededor.

Me obligó a pensar con cuidado en límites con Spring Boot, Hexagonal Architecture, calidad de datos, backtesting, paper trading, gestión de riesgo y monitorización. Los mismos principios aplican a muchos sistemas profesionales: [backends con Spring Boot](/es/services/backend-spring-boot/), [aplicaciones web a medida](/es/services/software-a-medida/), [automatización de workflows](/es/services/automatizacion-de-procesos/) e [integraciones API](/es/services/integraciones-api/).
