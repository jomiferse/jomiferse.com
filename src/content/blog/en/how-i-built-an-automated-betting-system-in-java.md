---
title: "How I Built an Automated Betting System in Java"
description: "How I built BetX, an automated betting system in Java and Spring Boot, using Hexagonal Architecture, backtesting, paper trading, and clear risk controls."
date: 2026-06-22
translationSlug: "como-construi-un-sistema-automatizado-de-apuestas-en-java"
cover:
  src: "/images/blog/covers/how-i-built-an-automated-betting-system-in-java.avif"
  alt: "Technical editorial illustration about How I Built an Automated Betting System in Java"
tags:
  - java
  - spring-boot
  - hexagonal-architecture
  - backtesting
  - software-engineering
author: "José Miguel Fernández"
readingTime: "8 min"
---

## Introduction

Building an automated betting system is an interesting **Software Engineering** challenge because it looks simple from the outside and becomes complex as soon as you treat it seriously. Collecting odds and applying a rule is easy. Building a system that can explain a recommendation, simulate it, reject it for risk reasons, and later reproduce the decision is a different problem.

That is why I built **BetX**, a personal project focused on the engineering side of betting automation. It is not a gambling promotion project and it does not promise profitability. The goal was to build an **Automated Betting System** in **Java** that could scan markets, detect possible value, generate recommendations, run **Backtesting**, simulate decisions with paper trading, track CLV, and stay maintainable as the platform grows.

[![BetX hexagonal architecture diagram showing domain, application layer, adapters, persistence, Telegram, testing, Docker, and future exchange integrations](/images/blog/betx-hexagonal-architecture.svg)](/images/blog/betx-hexagonal-architecture.svg)

## The Problem

The hard part is not writing a strategy. The hard part is making that strategy operate in a changing environment without losing context.

| Challenge            | Engineering concern                                                      | BetX response                                                             |
| -------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Data collection      | Markets are incomplete, duplicated, or named differently across sources. | Normalize snapshots before strategy evaluation.                           |
| Odds changes         | A useful price can disappear minutes later.                              | Store timestamps and link every recommendation to its snapshot.           |
| Risk management      | A good signal can still create bad exposure.                             | Run every candidate through a dedicated Risk Manager.                     |
| Execution            | Automation can make mistakes faster.                                     | Start with recommendations and paper trading, not irreversible execution. |
| Performance tracking | Wins and losses do not explain decision quality.                         | Track strategy version, simulated price, result, and CLV.                 |

### Data collection

BetX treats market scanning as its own concern. Raw market data is normalized into snapshots before any strategy sees it. That makes it easier to debug whether a bad recommendation came from bad input, a mapping issue, a strategy rule, or a risk check.

### Odds changes

Odds are time-sensitive. A price that looked interesting at 10:00 may be gone at 10:03. BetX records when a market was scanned, which odds were available, and which snapshot generated the recommendation.

### Risk management

The most important component is not prediction. It is risk management. BetX includes a dedicated Risk Manager so that a recommendation is only accepted after it passes limits around exposure, duplicates, and simulated bankroll rules.

### Execution

BetX currently focuses on recommendations, paper trading, and analysis instead of direct real-money execution. Before automating any irreversible action, I wanted the system to record decisions, reproduce outcomes, handle duplicates, settle simulated positions, and explain its own behavior.

### Tracking performance

Tracking performance is more than calculating wins and losses. BetX stores the strategy version, market snapshot, recommended price, simulated execution price, result, and **CLV** or closing line value. CLV is not proof of future profitability, but it is a useful engineering signal.

## Why Java

I chose **Java 21** and **Spring Boot** because BetX behaves like a backend service, not a quick script. I wanted strong typing, explicit boundaries, repeatable tests, dependency injection, configuration, scheduled jobs, and a clean path toward Docker and CI/CD.

| Choice                | Why it fits BetX                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------ |
| Java 21               | Strong typing, mature tooling, and good support for long-running services.                 |
| Spring Boot           | Dependency injection, configuration, scheduling, test slices, and production-style wiring. |
| SQLite                | Simple local persistence for a personal project with structured state.                     |
| JUnit 5               | Fast feedback for domain rules, use cases, and adapters.                                   |
| Docker                | Repeatable execution across local and deployment environments.                             |
| RabbitMQ-ready design | Future queue-based processing without rewriting the core use cases.                        |

Python would have been faster for a prototype, but speed was not the only goal. I wanted a maintainable backend that could grow from local persistence to future exchange adapters, queue-based processing, and stronger analytics.

## System Architecture

BetX follows **Hexagonal Architecture**, also known as ports and adapters. The domain and application logic live in the center. Databases, APIs, Telegram, schedulers, and future exchanges stay outside.

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

### Domain layer

The domain layer contains the concepts that matter even if Spring Boot, SQLite, or Telegram disappeared tomorrow: markets, odds, selections, recommendations, strategies, risk policies, paper trades, backtesting results, and performance metrics.

### Application layer

The application layer coordinates use cases: scan markets, evaluate strategies, generate recommendations, apply risk controls, record paper trades, run backtests, and send notifications.

### Adapters

Adapters handle the outside world. A Telegram adapter should translate a recommendation into a message. It should not decide whether a recommendation is valid.

### Persistence

SQLite is enough for the current version: simple, local, inspectable, and good for structured persistence without operational overhead. The important decision was to keep persistence behind repository ports.

### Telegram integration

Telegram gives quick feedback when BetX detects a recommendation. The notification includes the market, strategy, price, risk status, and context, but tests still run without sending real messages.

Here is a simplified example of the kind of boundary I wanted:

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

The real code has more detail, but the shape matters: the use case depends on ports, not infrastructure.

## Core Components

| Component             | Responsibility                                                          |
| --------------------- | ----------------------------------------------------------------------- |
| Strategy Engine       | Evaluate normalized markets and produce strategy signals.               |
| Recommendation Engine | Turn signals into structured recommendations.                           |
| Risk Manager          | Accept, limit, or reject candidates before they become recommendations. |
| Backtesting Engine    | Run strategies against historical snapshots.                            |
| Paper Trading Engine  | Simulate execution and settlement without placing real bets.            |

### Strategy Engine

The Strategy Engine evaluates rules against normalized market data. I tried to keep strategies explicit and testable because hidden strategy behavior spread across adapters is difficult to validate.

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

A recommendation includes more than a market and a price. It carries the strategy source, timestamp, detected edge, market context, risk status, and metadata to inspect the decision later.

### Risk Manager

The Risk Manager prevents a strategy from acting as both signal generator and safety mechanism.

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

The **Backtesting** Engine evaluates strategies against historical snapshots. A backtest is not a promise; it is a filter. It helps reject weak ideas before they become automated behavior.

[![BetX backtesting and paper trading flow from historical snapshots to strategy review](/images/blog/betx-backtesting-paper-trading-flow.svg)](/images/blog/betx-backtesting-paper-trading-flow.svg)

### Paper Trading Engine

Paper trading simulates what would happen if a recommendation were followed, without placing real bets. It tests the full lifecycle: recommendation created, risk checked, simulated position recorded, result settled, metrics updated, and notification sent.

## Challenges I Faced

### Overfitting

Overfitting is a constant risk. If I keep adjusting a strategy until it looks good on historical data, I may only be fitting noise. The answer is to stay skeptical: simple hypotheses, out-of-sample checks, and fewer parameters.

### Backtesting bias

Backtesting bias is easy to introduce. The system must not use data that would not have existed at decision time, and missing markets cannot be ignored only when they are inconvenient.

### Data quality

Bad data creates fake confidence. Inconsistent team names, duplicated events, delayed updates, and missing prices can distort the whole pipeline, so validation and normalization became central.

### State management

The same market can be scanned many times, generate several signals, receive updated odds, and later settle. BetX needed careful state handling, idempotency, and traceable transitions.

### Monitoring

Automation needs visibility. If BetX recommends something, I want to know why. If it skips something, I also want to know why. Logs, notifications, stored decisions, and metrics are part of the engineering work.

## What I Learned

| Lesson                                 | Practical effect                                             |
| -------------------------------------- | ------------------------------------------------------------ |
| Most ideas fail in backtests.          | The system should make weak ideas fail cheaply.              |
| Risk matters more than prediction.     | Signals are not useful without exposure control.             |
| Architecture matters in side projects. | Hexagonal Architecture made BetX easier to test and extend.  |
| Observability matters early.           | Automated decisions need stored reasons and traceable state. |

## Future Improvements

| Improvement            | Why it matters                                                              |
| ---------------------- | --------------------------------------------------------------------------- |
| Multi-exchange support | Different exchanges mean different formats, limits, and execution rules.    |
| Better analytics       | Strategy-level reports, CLV charts, drawdown, and recommendation history.   |
| ML experiments         | Useful only where they answer a specific question better than simple rules. |
| Web dashboard          | Telegram is good for alerts, but not enough for analysis.                   |
| More automation        | Scheduled scans, RabbitMQ processing, and CI/CD friendly deployment.        |

## Conclusion

BetX started as an **Automated Betting System** in Java, but the most valuable part of the project has been the engineering discipline around it.

It forced me to think carefully about Spring Boot boundaries, Hexagonal Architecture, data quality, backtesting, paper trading, risk management, and monitoring. The same principles apply to many professional systems: [Spring Boot backends](/en/services/backend-spring-boot/), [custom web applications](/en/services/custom-web-application/), [automation workflows](/en/services/automation-workflows/), and [API integrations](/en/services/api-integrations/).
