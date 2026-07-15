---
title: "Right-Sizing Kubernetes Pods: Set Requests and Limits Without Guessing"
description: "A practical guide to sizing Kubernetes pods from real usage, not from vibes. Learn how requests, limits, HPA, and VPA fit together."
date: "2026-05-21"
language: "en"
author: "José Miguel Fernández"
readingTime: "7 min"
translationSlug: "ajustar-tamano-pods-kubernetes-requests-limits"
commercial:
  role: technical-authority
  audience: technical
  cluster: spring-boot-maintenance
cover:
  src: "/images/blog/covers/right-sizing-kubernetes-pods-requests-limits.avif"
  alt: "Technical editorial illustration about Right-Sizing Kubernetes Pods: Set Requests and Limits Without Guessing"
tags: [kubernetes, devops, cloud-native, performance, platform-engineering]
---

If you have ever copied a `resources:` block from another service and hoped for the best, this article is for you.

Right-sizing Kubernetes pods is one of those boring topics that quietly decides whether your platform feels stable or expensive. Set the numbers too high and you waste money. Set them too low and you get throttling, OOMKills, noisy alerts, and surprise latency spikes.

You do not need perfect math to get this right. You need a repeatable way to read your workload and a clear mental model of what Kubernetes does with those numbers.

## The short version

Kubernetes treats _requests_ and _limits_ very differently:

- **Requests** tell the scheduler where a Pod can run.
- **Limits** tell the runtime what a container is not allowed to exceed.

That means right-sizing is not just about saving resources. It is about matching the shape of your workload to the way Kubernetes places and protects it.

> **Practical rule:** start from real usage, not from a team convention.
>
> The worst sizing decisions usually come from copying a previous YAML file without looking at traffic, memory working set, or throttling.

## What requests and limits actually do

A lot of Kubernetes confusion comes from mixing these two up.

| Setting            | What it affects                    | What happens if you set it badly                          |
| ------------------ | ---------------------------------- | --------------------------------------------------------- |
| **CPU request**    | Scheduling and guaranteed capacity | Too high: pods stay Pending longer or waste node capacity |
| **CPU limit**      | Runtime throttling                 | Too low: containers get throttled during spikes           |
| **Memory request** | Scheduling and node fit            | Too high: inefficient bin packing                         |
| **Memory limit**   | OOM protection                     | Too low: the container gets killed                        |

For CPU, Kubernetes can throttle a container once it reaches its limit. For memory, the failure mode is harsher: if a container goes over its limit, it can be OOMKilled.

So if you only remember one thing, remember this:

- **CPU limits are a performance control.**
- **Memory limits are a safety control.**

That difference matters a lot when you are sizing real services.

## The right-sizing loop I actually trust

I do not trust guesses. I trust a loop:

1. **Measure real usage** in staging or production-like traffic.
2. **Look at the steady state**, not the absolute peak.
3. **Add headroom** for normal bursts.
4. **Test one change at a time**.
5. **Watch for throttling, OOMKills, and latency regressions**.
6. **Repeat after traffic or code changes**.

That sounds obvious, but many teams skip step 1 and jump straight to a YAML template.

### The metrics that matter

If you are right-sizing a service, check more than the average CPU chart:

- CPU usage over time, especially p95 and short spikes
- Memory working set, not just resident size
- Throttled CPU time
- OOMKilled events and restarts
- Latency at the request level
- HPA behavior if autoscaling is already enabled

If your observability stack gives you only averages, it is not giving you enough.

## A practical starting point

Here is a sane way to think about it:

- **CPU request:** start near the service’s steady-state p95 under real load.
- **CPU limit:** keep it above normal bursts, or leave it unset if your platform policy allows that and the workload is latency sensitive.
- **Memory request:** use the observed working set with headroom.
- **Memory limit:** give yourself a hard ceiling, but not one so tight that GC or short-lived spikes turn into restarts.

This will not fit every service. It is a way to stop lying to yourself.

```yaml
resources:
  requests:
    cpu: 250m
    memory: 512Mi
  limits:
    cpu: 500m
    memory: 768Mi
```

This is not a universal answer. It is only a starting point. A batch job, an API, and a frontend rendering service do not deserve the same values.

## Common mistakes I see all the time

### 1. Setting requests and limits equal by default

This looks tidy. In operation, it is often too rigid.

If CPU request and CPU limit are identical, the container has very little room to breathe during short spikes. That is how you get throttling that looks like random slowness.

### 2. Using averages instead of percentiles

Averages hide bursty behavior.

A service with a nice flat mean CPU chart can still have nasty p95 spikes that matter for tail latency.

### 3. Optimizing memory like CPU

Memory is not a nice smooth elastic resource.

If you undersize memory, you do not just get a smaller number. You may get GC pressure, cache churn, or an OOMKilled container.

### 4. Copying the same values across every service

A webhook, a cron worker, and a public API do not have the same profile.

If you reuse the same `resources:` block everywhere, you are probably paying for the wrong thing.

## How HPA and VPA fit into the picture

Right-sizing is easier when you stop treating autoscaling as a single feature.

- **HPA** changes the number of Pods.
- **VPA** changes resource recommendations and, in some setups, the requests themselves.
- **Node autoscaling** changes the cluster capacity.

That means:

- If the service is under provisioned because traffic grows, HPA helps.
- If the service is consistently over- or under-requested, VPA helps.
- If the cluster is simply too small, node autoscaling helps.

Kubernetes is at its best when you use these tools for the right job.

Kubernetes now also supports **pod-level resources** in newer releases, which is useful when you want to think about a shared pod budget instead of only per-container values. That is not a reason to ignore container-level sizing. It is a reminder that the platform is getting more flexible.

## What I would do in a real team

If I had to right-size a service this week, I would do this:

1. Pull the last 7 to 14 days of CPU and memory usage.
2. Check p95 and p99, not just averages.
3. Compare usage against request, limit, and throttling.
4. Look for restarts, OOMKills, and latency jumps.
5. Change one resource setting.
6. Re-test under realistic traffic.
7. Document why the new values exist.

That last step is underrated. If nobody remembers why the numbers exist, they will drift back into guesswork.

## Quick checklist

1. Real workload shape
2. CPU and memory measured separately
3. p95/p99 checked, not just averages
4. Latency-sensitive or not
5. Throttling checked
6. OOMKills checked
7. Clear reason for every request and limit
8. Numbers will be revisited after traffic changes

## My take

If you want a practical default, think like this:

- Request = what the service really needs
- Limit = the boundary that protects the rest of the system

The mistake is to treat both as a way to “make Kubernetes happy.” Kubernetes is already happy. Your users care whether the service is fast, stable, and cheap.

## Bottom line

Right-sizing Kubernetes pods is less about finding the perfect number and more about building a feedback loop.

Start with real usage.
Measure the right signals.
Change one thing at a time.
Then keep adjusting as traffic, code, and dependencies change.

This is especially relevant for backend applications in production. If your service is Spring Boot, I would also review the [Spring Boot production checklist](/en/blog/spring-boot-production-devops-checklist/) before changing CPU and memory values without data.

If the problem includes latency, restarts or unexplained resource use in a Java application, a [Spring Boot maintenance and evolution review](/en/spring-boot-maintenance/) can connect application, JVM and Kubernetes metrics before changing capacity.

That keeps the cluster efficient without turning every deploy into a guess.

## FAQ

**Should I always set both requests and limits?**  
Not always. Requests are important for scheduling. Limits depend on the workload and your team’s platform policy. For CPU, a hard limit is sometimes helpful and sometimes a source of throttling.

**What should I optimize first: CPU or memory?**  
Usually memory first if you are seeing OOMKills or high memory pressure. CPU is easier to observe, but memory mistakes tend to be more disruptive.

**Can VPA replace manual sizing?**  
It can reduce manual work, but you still need to understand what it is recommending and why. Automated recommendations are useful only if you verify them against real behavior.

**Is HPA enough?**  
No. HPA scales replicas. It does not fix bad requests or memory limits.

## Sources and verification notes

- Kubernetes: Resource Management for Pods and Containers — https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
- Kubernetes: Assign CPU Resources to Containers and Pods — https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/
- Kubernetes: Vertical Pod Autoscaling — https://kubernetes.io/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/
- Kubernetes: Assign Pod-level CPU and memory resources — https://kubernetes.io/docs/tasks/configure-pod-container/assign-pod-level-resources/
- Kubernetes blog: v1.36 in-place vertical scaling for pod-level resources — https://kubernetes.io/blog/2026/04/30/kubernetes-v1-36-inplace-pod-level-resources-beta/
