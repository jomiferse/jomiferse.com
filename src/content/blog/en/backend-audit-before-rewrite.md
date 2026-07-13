---
title: "What to review in a backend before deciding to rewrite"
description: "A practical audit before rewriting: behavior, incidents, dependencies, data, contracts, delivery and transition cost."
date: 2026-07-11
dateModified: 2026-07-12
author: "José Miguel Fernández"
readingTime: "11 min"
translationSlug: "auditoria-backend-antes-reescribir"
cover:
  src: "/images/blog/covers/backend-audit-before-rewrite.avif"
  alt: "Technical editorial illustration about What to review in a backend before deciding to rewrite"
tags: [backend, audit, architecture, legacy, rewrite]
---

Rewriting a backend sounds decisive when code is hard to change, incidents recur, or the technology is old. Yet a rewrite does not automatically remove complexity. It requires the team to rediscover business rules, reproduce contracts, migrate data, and operate two systems through a transition. The useful question is not “is the code ugly?” but “which business constraint must we remove, and what is the least risky way to remove it?”

A pre-rewrite audit turns impressions into evidence. It separates product, architecture, operational, and organisational problems; compares replacement with incremental alternatives; and produces a decision that leaders and engineers can defend. It may still conclude that rewriting is right. Its purpose is not to prevent that answer, but to prevent the company from choosing it without understanding the full cost.

## 1. Define the problem before assessing a solution

Start with the outcomes the system prevents. A feature may take six weeks instead of two, monthly close may require manual corrections, releases may cause outages, or an unsupported runtime may expose the business. Give each reason a baseline measure: request-to-production lead time, monthly incidents, recovery hours, proportion of manual operations, or infrastructure cost per transaction.

Interview product, support, operations, and engineering separately. Developers may describe technical coupling while customer support reveals that an unstable integration produces most of the cost. Record what is not in scope too. If the objective is fewer billing failures, redesigning authentication or replacing every user interface may not belong in the first initiative.

The output is short: prioritised problems, observable impact, constraints, and success conditions. Without it, every new architecture looks better because it is being compared with every accumulated defect rather than with a bounded objective.

## 2. Reconstruct actual system behaviour

In long-lived systems, the specification is distributed across code, stored procedures, scheduled jobs, spreadsheets, configuration, and people. Inventory critical journeys—create an order, settle an invoice, renew a subscription—and follow each from input to side effects. Record validations, states, permissions, notifications, and exceptions.

Production logs, support tickets, and frequent queries expose variants that nobody remembers. Characterisation tests are valuable: they do not claim current behaviour is correct, but capture what happens before it changes. Martin Fowler’s description of the [Strangler Fig Application](https://martinfowler.com/bliki/StranglerFigApplication.html) explains gradual replacement around an existing system; using the pattern still requires knowing which behaviour to protect and where a boundary exists.

Classify rules as required, accidental, or awaiting a decision. Copying every anomaly perpetuates debt, while ignoring all anomalies breaks legitimate cases. A product owner should resolve ambiguous cases and leave accepted examples that can become tests.

## 3. Measure incidents and cost of change

Repository age says little by itself. Review twelve months of incidents: frequency, severity, detection and recovery time, responsible component, and recurrence. Separate code defects from configuration, data, infrastructure, and supplier failures. A rewrite will not repair an uncontrolled deployment process or a source that sends inconsistent information.

Analyse a sample of recent changes. How long went into understanding, implementation, testing, approval, and deployment? Which modules are change hotspots? Do failures result from coupling, missing tests, or unstable requirements? DORA’s deployment frequency, lead time, change failure, and recovery measures offer useful language; Google maintains an [official guide to DORA capabilities and metrics](https://dora.dev/guides/dora-metrics-four-keys/).

This is not a score for judging the team. It locates the constraint and establishes a baseline. If improving the pipeline halves lead time, that evidence changes the economic case for rewriting.

## 4. Inventory architecture, dependencies, and support

Map modules, processes, data stores, queues, external services, and authentication mechanisms. For each, record ownership, version, support status, criticality, and replaceability. Run dependency and vulnerability analysis, then review its findings: an old isolated library does not carry the same risk as an Internet-facing component.

Support policy matters more than novelty. Use vendor sources such as the [Spring Boot support policy](https://spring.io/projects/spring-boot#support), and relate end-of-support dates to what is actually deployed. Review licences, runtimes, base images, and managed services. If an abandoned dependency cuts across the whole domain, there is a modernization case; if it sits behind a stable interface, replacing just that dependency may be enough.

Look for organisational dependencies too: one person who can deploy, shared credentials, or informal approvals. A new architecture retains those risks unless the initiative also improves how software is operated.

## 5. Map data, contracts, and consumers

The database is often the hardest part to replace. Catalogue tables, volume, growth, quality, retention, personal information, migrations, and ownership. Find writes outside the application, reports that query tables directly, and overnight processes. Measure unexpected nulls, duplicates, and broken relationships before estimating migration.

Then inventory APIs, events, files, webhooks, and exports. For each consumer, record version, authentication, latency expectations, retry behaviour, and contact. Traffic and logs find unknown consumers more reliably than documentation. An apparently unused contract may feed a critical monthly reconciliation.

Design equivalence checks: reconcile counts and amounts, shadow execution, compare reads, or use carefully controlled dual writes. Duplicate effects are a specific risk when APIs retry; the guide to [idempotent APIs](/en/blog/idempotent-apis-that-survive-retries/) explains how to protect operations during coexistence.

## 6. Assess tests, security, and operations

Count protected journeys, not only coverage percentage. Check whether tests catch changes to meaningful rules, remain deterministic, and run in the delivery pipeline. Add contract tests for integrations and a small end-to-end suite for the highest-impact flows. This safety net is useful whether the team refactors or rewrites.

Review authentication, authorisation, secret management, encryption, audit trails, dependencies, and data handling. OWASP publishes the [Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/) as a testable reference for application controls. The audit need not certify the entire system, but it should identify exposures that alter priority or transition design.

For operations, verify reproducible builds, environment configuration, observability, actionable alerts, backups, restore, and rollback. Ask for a real deployment and recovery demonstration. A modern solution that the on-call team cannot diagnose is not an improvement.

## 7. Calculate the complete transition cost

Do not compare “maintain old code” with “write new code.” Include discovery, characterisation tests, design, implementation, data cleaning and migration, compatibility, temporary infrastructure, security, documentation, training, and retirement. Add the time of domain experts and the existing engineering team, plus the opportunity cost of deferred features.

Model at least three scenarios: a minimum intervention for immediate risk, incremental modernization by boundary, and a broad rewrite. Use ranges and assumptions rather than false precision. Include the duration and cost of dual operation and synchronisation. The longer value remains unverified, the greater the exposure to changes in priorities, people, and markets.

Relate each investment stage to an outcome: remove an unsupported platform, reduce failures, accelerate a family of changes, or retire manual work. That makes it possible to stop if the benefit does not appear.

## 8. Compare alternatives with the same criteria

Options commonly include dependency upgrades, modularisation within the monolith, encapsulating an integration, extracting one service, replacing one product, or rebuilding. Score each for impact, time to value, risk, reversibility, transition cost, and internal capability. Record uncertainty and the evidence needed to reduce it.

A bounded experiment can answer a question more cheaply than another estimating round: upgrade a representative module, capture an API’s contracts, or migrate a small data family. The guide to [hexagonal architecture in backend projects](/en/blog/hexagonal-architecture-what-it-is-how-to-apply-backend-projects/) offers ways to establish boundaries without requiring microservices.

A rewrite wins when the current system blocks important goals, its boundaries prevent a reasonable transition, and the organisation can fund coexistence and migration. It loses when the main problem lies outside the code, rules are unknown, or there is no capacity to operate the destination.

## 9. Turn the audit into an executable decision

The report should make sense without reading the repository. Include a system map, evidence-backed risks, metric baseline, compared options, recommendation, assumptions, and open questions. Propose a four-to-eight-week first block with an owner, acceptance criteria, rollback, and a decision at the end.

“Do not rewrite yet” is a valid outcome: improve observability, secure backups, upgrade one critical dependency, and measure for three months. Another valid outcome is replacement beginning at the least coupled boundary. Either way, set a date to revisit evidence instead of publishing an irrevocable roadmap.

My [backend, API, and architecture audit](/en/backend-api-architecture-audit/) turns these questions into prioritised risks and a verifiable first scope. When a transition is already justified, the [legacy backend modernization service](/en/legacy-backend-modernization/) focuses on coexistence, measures, and safe retirement.

## Frequently asked questions

### When does rewriting a backend make sense?

When it prevents important goals, incremental alternatives cannot remove the constraint, and resources exist to migrate data, maintain compatibility, and operate the transition. Metrics and an initial boundary should support the decision.

### How long does a pre-rewrite audit take?

It depends on size and access to people and production. Two or three weeks may support an initial decision for a small system; multiple domains and integrations require longer. Time-box the work and state unresolved uncertainty.

### Must feature development stop during the audit?

Usually not. Interviews, metric access, and change reviews can be coordinated with delivery. It can help to freeze one boundary during an experiment or capture a baseline before changing behaviour.

### Who should participate in the decision?

Product, engineering, operations, security, and representatives of critical processes. Finance or leadership should validate cost and opportunity. Leaving the choice solely to engineers hides business rules and impact.

### Which deliverable makes later procurement safer?

A verifiable map, prioritised risks, inventoried contracts and data, comparable options, and a first block with acceptance and rollback. Suppliers can quote against the same scope instead of charging to rediscover it.
