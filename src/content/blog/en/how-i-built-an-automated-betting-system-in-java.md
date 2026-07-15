---
title: "Betx: An Operational Betting Tool Built with Java and Spring Boot"
description: "How I approached Betx, a terminal application for recording and managing bets, odds, statuses and results with Java, Spring Boot and SQLite."
date: 2026-06-22
translationSlug: "como-construi-un-sistema-automatizado-de-apuestas-en-java"
commercial:
  role: case-study
  audience: technical
  cluster: custom-software
cover:
  src: "/images/blog/covers/how-i-built-an-automated-betting-system-in-java.avif"
  alt: "Editorial illustration of a betting management tool built with Java"
tags:
  - java
  - spring-boot
  - cli
  - sqlite
  - software-engineering
author: "José Miguel Fernández"
readingTime: "6 min"
---

## The commission

Betx came from a specific need raised by a client in the gambling sector. They wanted a straightforward tool to record bets, review odds, update statuses and store results without depending on a web interface or complex infrastructure.

The solution was a terminal-based backend application. Its main workflow runs through commands, configuration stays outside the code and data is stored locally. The client gets a direct operational tool without adding a frontend as a separate moving part.

![Technical view of the Betx project](/images/projects/betx.avif)

## Why a command-line interface

For this scope, a web interface would have added navigation, browser state and visual work. A CLI kept input and output explicit while reducing the number of parts to build and maintain.

I chose **Picocli** to define commands and their arguments explicitly. This keeps user input separate from the logic that records or updates a bet.

The workflow is split into a small number of clear steps:

1. The command reads the action and validates its arguments.
2. The use case applies the relevant rules.
3. The persistence layer reads from or updates SQLite.
4. HTTP clients handle external integrations.
5. The terminal presents a readable result.

This separation also makes the logic easier to test without running the entire program from the command line for every check.

## Configuration outside the code

Endpoints, credentials and runtime settings should not be scattered across application classes. Betx uses a `betx.yml` file as its local configuration point.

This has two practical benefits: each environment can hold its own values, and an integration setting can change without recompiling the application. Credentials remain private configuration rather than repository content.

## Local persistence with SQLite

The scope called for lightweight local persistence to retain bets, odds, statuses and results. **SQLite** was a better fit than deploying a separate database server.

Persistence sits behind its own layer. Commands do not write SQL directly, and the workflow does not depend on the storage implementation. If the volume or operating model changes, the database can be replaced without rebuilding the terminal interface.

## HTTP integrations with clear boundaries

External calls are implemented as separate HTTP clients. Their job is to translate a domain request into the format required by each service and return a controlled response.

These boundaries prevent details such as URLs, headers or JSON formats from leaking into the main workflow. They also make external responses easier to simulate in tests.

## What I delivered

The first operational version includes:

- a Picocli CLI for running the workflow from the terminal;
- declarative YAML configuration;
- local SQLite persistence;
- HTTP clients for the required integrations;
- JUnit 5 and AssertJ tests around the primary behavior.

The result is a lightweight tool that lets the client review and update betting records through one workflow, with data and configuration kept separate from the code.

## What this project confirms

Not every commission needs a web application. Sometimes the most useful solution is a small tool that handles a clearly bounded operational workflow.

The important choice was not the most visually impressive interface, but fewer moving parts: a terminal for operation, YAML for configuration, SQLite for persistence and clear adapters for external services.

You can read the [Betx case study](/en/projects/betx/) or see how I approach [Spring Boot backend development](/en/services/backend-spring-boot/).

## FAQ

**Why was there no web dashboard?**

The first version was deliberately scoped as a local CLI to keep the work focused and reduce interface maintenance.

**Does SQLite limit the project?**

It provides simple, sufficient persistence for the current use. The layer boundaries make it possible to replace if the requirements change.

**Does the configuration contain secrets?**

It can reference sensitive local values, but those details are not published or included in the repository.
