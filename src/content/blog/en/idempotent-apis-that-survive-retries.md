---
title: "Idempotent APIs That Survive Retries: A Practical Guide for Backend Developers"
description: "Learn how to design idempotent APIs that survive retries without creating duplicate payments, orders, or jobs. Practical patterns, examples, and trade-offs."
date: 2026-05-23
language: "en"
author: "José Miguel Fernández"
readingTime: "6 min"
translationSlug: "apis-idempotentes-que-sobreviven-a-reintentos"
commercial:
  role: technical-authority
  audience: technical
  cluster: api-integrations
cover:
  src: "/images/blog/covers/idempotent-apis-that-survive-retries.avif"
  alt: "Technical editorial illustration about Idempotent APIs That Survive Retries: A Practical Guide for Backend Developers"
tags: [api-design, backend, retries, idempotency, rest, webhooks, payments]
---

If your API gets retried, your design choices matter a lot more than they do in a happy-path demo.

A request that is sent once is easy. A request that is sent twice because the client timed out, the network blinked, or a worker crashed is a different problem. That is where a harmless-looking endpoint can create duplicate payments, duplicate orders, duplicate emails, or duplicate background jobs.

Idempotency exists for that gap.

The short version: an idempotent API gives the client a safe way to repeat a request without changing the outcome more than once.

## What idempotency actually means

In plain English, idempotency means:

- sending the same request multiple times leads to the same end result
- retries do not create duplicate side effects
- the server can recognize that it has already processed the operation

That does **not** mean every response is identical, and it does **not** mean every HTTP method is naturally safe to repeat in the way your business logic needs.

The problem shows up most often with `POST`, because `POST` usually creates something or triggers work. If the client retries that request after a timeout, the server may not know whether the first attempt succeeded.

An idempotency key helps with that.

[![A flowchart showing how an idempotent retry returns the same result instead of creating a duplicate](/images/blog/idempotency-flow.svg)](/images/blog/idempotency-flow.svg)

## Why this matters in real systems

The usual failure cases are boring and expensive:

- a payment gets charged twice
- an order is created twice
- a webhook handler runs twice
- a background job is scheduled twice
- a user receives duplicate confirmation emails

None of these bugs looks dramatic in a code review. They show up later, when the network misbehaves or an upstream client retries aggressively.

Here is the mental model I use:

```text
client sends request
       ↓
server starts work
       ↓
network times out
       ↓
client retries
       ↓
server must decide:
  - process again
  - or return the previous result
```

If your API cannot answer that second time correctly, you do not really have a reliable API. You have a hopeful one.

## A practical pattern that works

The cleanest pattern is:

1. the client generates an idempotency key
2. the client sends the key with the request
3. the server stores the key with the result of the operation
4. if the same key comes back, the server returns the original outcome

The idempotency key is not just a random header. It is part of the contract between client and server.

A minimal flow looks like this:

```text
POST /payments
Idempotency-Key: 9f1b2c...

1st request:
- validate input
- create payment
- store response under key
- return success

2nd request with same key:
- detect duplicate
- return stored result
- do not charge again
```

The important part is not the header itself. The important part is that the server owns the deduplication logic.

## What to store

At minimum, store enough to answer the retry safely.

Usually that means:

- the idempotency key
- the request fingerprint
- the operation status
- the response body or a reference to the created resource
- timestamps for cleanup
- the caller or tenant, if relevant

Do not just store the key and hope for the best. If two different requests reuse the same key, you need a way to detect the mismatch.

## The trade-offs people skip

Idempotency sounds simple until you hit the edge cases.

### 1. Replays must be controlled

If you keep keys forever, storage grows and stale entries pile up. If you delete them too soon, retries can slip through.

### 2. Same key, different payload

If a client reuses a key with a different request body, you need a clear policy:

- reject it
- or treat it as a conflict

Do not silently accept it.

### 3. Side effects outside the database

If your endpoint sends an email, pushes to a queue, or calls another service, you need to think about those side effects too. Storing the DB result alone is not enough if the side effect already happened.

### 4. Not every retry should be hidden

Some retries should fail loudly. If the request is malformed or unauthorized, idempotency should not turn that into a quiet success.

[![A comparison showing unsafe retries on the left and idempotent retries on the right](/images/blog/idempotency-compare.svg)](/images/blog/idempotency-compare.svg)

## What I would do in practice

If I were designing a backend endpoint today, I would follow this checklist:

- make the operation explicit and narrow
- require an idempotency key for non-repeatable actions
- persist the key and the outcome
- dedupe before side effects happen
- return the original response on retry
- reject key/payload mismatches
- expire old keys on a sane schedule
- log enough context to trace the request later

> **Practical rule:** if a duplicate request would hurt you, make duplication impossible or harmless.

## Idempotency is not a substitute for good HTTP design

This part breaks often.

Idempotency helps with retries. It does not fix:

- bad resource modelling
- unclear status codes
- inconsistent errors
- vague API contracts
- missing observability

You still need good endpoint design, predictable responses, and clear documentation.

Standard error formats like RFC 9457 / Problem Details can help because they make failures easier to parse for clients and easier to debug for humans. But that is a separate problem. Idempotency is about avoiding duplicate side effects.

## Final thought

Idempotency is one of those backend topics that looks small until it saves you from a very expensive bug.

If your API accepts retries, design for them on purpose. Do not pretend they will not happen. They will. And when they do, your system should either return the same result or fail in a way that is safe to retry.

If you are designing a backend that will run in production, this connects with [Spring Boot in production](/en/blog/spring-boot-production-devops-checklist/) and the [API integrations](/en/services/api-integrations/) service, where retries and visible errors are part of the contract.

Better that than discovering double charges at 2 a.m.

## Sources and references

- <a href="https://docs.stripe.com/api/idempotent_requests" rel="nofollow noopener noreferrer">Stripe: Idempotent requests</a>
- <a href="https://www.ietf.org/archive/id/draft-ietf-httpapi-idempotency-key-header-01.html" rel="nofollow noopener noreferrer">IETF draft: The Idempotency-Key HTTP Header Field</a>
- <a href="https://datatracker.ietf.org/doc/html/rfc9457" rel="nofollow noopener noreferrer">RFC 9457: Problem Details for HTTP APIs</a>
- <a href="https://swagger.io/blog/problem-details-rfc9457-api-error-handling/" rel="nofollow noopener noreferrer">Swagger: Problem Details (RFC 9457) API error handling</a>
