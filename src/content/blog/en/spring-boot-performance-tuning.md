---
title: "Spring Boot performance tuning: the changes that actually move the needle"
description: "A practical guide to Spring Boot performance tuning focused on measurement, caching, async work, connection pools, and observability."
date: "2026-05-22"
language: "en"
author: "José Miguel Fernández"
readingTime: "7 min"
tags: [spring-boot, java, performance, backend, observability]
---

If a Spring Boot app feels slow, the answer is usually not “add more framework stuff”. It is almost always “find the real bottleneck first, then change the smallest thing that actually matters”.

That sounds obvious, but a lot of performance work still starts with vibes: someone spots slow requests, someone else raises a pool size, and suddenly the system is more complicated without being faster.

This article is the version I wish more teams read before they start tuning blindly.

## The short version

Spring Boot performance tuning is not about squeezing every last millisecond out of the JVM. It is about removing avoidable work and making the expensive parts of your app easier to measure.

The levers that usually matter most are:

- caching repeated work
- using asynchronous processing where blocking is the real problem
- right-sizing database connections instead of guessing
- exposing the right metrics so you can see what changed

If you fix those four areas well, you usually get more gain than from any fancy trick.

> **Practical rule:** optimize the path that is hot in production, not the path that looks clever in code review.

## Start with measurement, not tuning

Before changing anything, ask three questions:

1. Where is the time going?
2. Is the bottleneck CPU, memory, IO, database latency, or thread starvation?
3. Did the problem appear after a code change, traffic growth, or infrastructure change?

If you do not know the answer yet, do not guess at the solution.

Spring Boot gives you good observability primitives out of the box, especially through Actuator and Micrometer-based metrics. That is where I would start.

What I look at first:

- request latency percentiles, not just averages
- error rates
- database connection wait time
- thread pool saturation
- GC pauses if the app allocates heavily
- slow endpoints that repeat under real load

If your dashboard only shows averages, it is hiding the problem.

## 1. Cache the expensive things

Caching is one of the cleanest wins when the same expensive computation happens again and again.

That might be:

- a product catalog lookup
- a settings read that rarely changes
- a permissions calculation
- an external API response that does not need to be fetched on every request

Spring Boot supports caching very well, but the useful part is not the annotation. The useful part is choosing the right boundary.

A few rules I trust:

- cache results that are expensive and stable enough to reuse
- keep cache keys predictable
- define a clear invalidation strategy before you ship
- do not cache everything just because it is possible

Spring Boot documents caching support directly in the reference docs, and the main takeaway is simple: enable it deliberately and keep the design boring.

```java
@Configuration
@EnableCaching
class CacheConfig {
}
```

Do not put `@EnableCaching` on your main application class unless you really want that to be part of the core bootstrap path.

> **Common mistake:** using caching as a band-aid for a bad query or an unbounded N+1 problem. Cache can hide the pain. It does not remove it.

## 2. Use async only where blocking is the real issue

Async is useful when work can happen in the background and the request does not need to wait for it.

Good candidates:

- sending emails
- writing audit events
- calling slow non-critical services
- generating reports that can finish later

Bad candidates:

- logic that must be consistent before the response returns
- code that depends on shared mutable state without a plan
- anything where you are using async just to feel modern

Spring Framework’s `@Async` support is straightforward, but it should be backed by a real executor strategy, not wishful thinking.

```java
@Configuration
@EnableAsync
class AsyncConfig {
}

@Service
class NotificationService {
  @Async
  public CompletableFuture<Void> sendWelcomeEmail(Long userId) {
    // background work
    return CompletableFuture.completedFuture(null);
  }
}
```

The real tuning question is not “can I make this async?” It is “should this work leave the request thread at all?”

If the answer is yes, async can help a lot.

If the answer is no, async can make the system harder to reason about and slower to debug.

## 3. Right-size your database pool

A surprising amount of Spring Boot performance work is really database work.

If your app spends time waiting for database connections, the fix is not always “increase the pool”. Sometimes the real issue is:

- slow queries
- too many concurrent requests
- transactions held open too long
- connection leaks
- a pool size that does not match the workload

Spring Boot prefers HikariCP for performance and concurrency, which is a good default. But default is not the same as correct.

What I usually check:

- average and p95 connection wait time
- active vs idle connections
- whether the pool is saturated under real load
- whether query time is the actual bottleneck

A small example:

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 1000
```

That is not a magic configuration. It is just a place to start measuring.

> **Common mistake:** raising the pool size every time the app gets slow. If the database is already the bottleneck, a bigger pool can make things worse.

## 4. Use Actuator to see what the app is really doing

Performance tuning without observability is just guessing with nicer wording.

Spring Boot Actuator is valuable because it makes the app easier to inspect in production-like environments. Combined with metrics, it helps answer questions like:

- Are requests slowing down because of CPU or IO?
- Is memory pressure causing GC overhead?
- Are thread pools getting saturated?
- Is the database waiting on connections?

I like to think of Actuator as the instrumentation layer that keeps tuning honest.

If you are changing behavior, verify the effect with metrics before and after the change. Otherwise you are just decorating code.

## A practical example

Imagine a simple API that loads a user profile, fetches preferences, and sends an audit event.

A reasonable performance pass might look like this:

1. cache the preferences if they rarely change
2. move the audit event to async processing
3. inspect the database pool for connection wait time
4. expose timings through Actuator and track the percentile shift

That is a small amount of work. It is also the kind of work that usually produces real improvement.

## What I would not do first

I would not start by:

- adding more threads
- rewriting everything with reactive code because it sounds faster
- increasing the DB pool blindly
- introducing distributed caching before the local bottleneck is clear
- micro-optimizing controller code that is not even hot

A lot of performance regressions come from solving the wrong problem very efficiently.

## My practical take

The best Spring Boot tuning work is usually boring in the right way.

You measure first.
You remove repeated work.
You isolate blocking tasks.
You keep the database honest.
You expose metrics so the next change is easier.

That is the real skill: not making the app look tuned, but making it behave better under load.

If you also care about how this fits into the rest of a practical backend stack, this pairs well with [Spring Boot in production](/en/blog/spring-boot-production-devops-checklist/), [right-sizing Kubernetes pods](/en/blog/right-sizing-kubernetes-pods-requests-limits/) and the [Spring Boot backend](/en/services/backend-spring-boot/) service.

## Bottom line

Spring Boot performance tuning works best when you treat it like debugging, not like decoration.

Measure the bottleneck.
Fix the expensive repeated work.
Use async where it actually helps.
Keep the database pool aligned with reality.

If you do those things well, the app gets faster without turning the codebase into a science project.

## FAQ

**Should I enable caching by default?**  
Only if the app has repeated expensive reads that are safe to reuse. Caching is great when the invalidation story is clear.

**Is `@Async` always a performance win?**  
No. It helps when you can move non-critical blocking work off the request path. It can also make debugging harder if you overuse it.

**What should I tune first: the database pool or the JVM?**  
Usually the database path first, because connection waits and slow queries are common bottlenecks. JVM tuning matters too, but it is rarely the first lever I reach for.

**Do I need Actuator in production?**  
If you care about diagnosing performance with less guesswork, yes. You do not need every endpoint exposed, but you do need observability.

## Sources and verification notes

- Spring Boot caching docs — https://docs.spring.io/spring-boot/reference/io/caching.html
- Spring Boot production-ready features / Actuator — https://docs.spring.io/spring-boot/reference/actuator/index.html
- Spring Boot SQL / datasource pool selection — https://docs.spring.io/spring-boot/reference/data/sql.html
- Spring Framework `@Async` — https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html
- Spring MVC async programming model — https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-async.html
