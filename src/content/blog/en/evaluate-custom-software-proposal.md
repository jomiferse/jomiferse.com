---
title: "How to evaluate a custom software proposal"
description: "What to compare in a custom software proposal: scope, risk, assumptions, deliverables, ownership, testing, delivery and maintenance."
date: 2026-07-11
dateModified: 2026-07-12
author: "José Miguel Fernández"
readingTime: "11 min"
translationSlug: "evaluar-presupuesto-software-a-medida"
cover:
  src: "/images/blog/covers/evaluate-custom-software-proposal.avif"
  alt: "Technical editorial illustration about How to evaluate a custom software proposal"
tags: [custom-software, proposal, small-business, consulting]
---

A custom software proposal is not an exact prediction of the future. It is a hypothesis about what will be built, what might go wrong and who carries each uncertainty.

That is why two proposals can have very different prices even when both mention "a management application", "a dashboard" or "a CRM integration". One may include discovery, design, testing, deployment and support. The other may cover only the most visible user journey. Both can be honest. They are not offering the same thing.

The important question is not "which is cheaper?". It is: what outcome am I buying, which assumptions sit inside the price and what will I need to provide or pay later for the system to work in practice?

For a new project, I would normally choose a small first delivery that can be checked and extended. A proposal that tries to settle every detail of a platform nobody has used yet often moves risk into a long list of later changes. It is better to define a specific problem, test an initial solution and choose the next step with real information.

The [custom software for small businesses](/en/custom-software-small-businesses/) page describes the kind of first version I consider reasonable. This article helps you read and compare proposals before hiring.

## What to resolve before asking for a price

You do not need to design the application or choose the technology before requesting a proposal. You do need to explain enough context for another person to ask useful questions.

Start with the work that is slow, error-prone or difficult to control today. Explain who does it, which information they use, which tools are involved and what happens when data is missing or something fails. If you expect the system to generate revenue, save time or prevent errors, explain how you will know it has done so.

"We need a management dashboard" is a label, not scope. "The team receives orders by email, copies data into three spreadsheets, cannot see who has replied and spends an hour each day reconciling them" is a problem we can work from.

Before comparing proposals, try to answer these questions:

| Question                                             | If it is unclear                                              |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| Who will use the system and what do they need to do? | The first phase should include discovery or prototypes.       |
| Which journey has the most value?                    | The scope may grow around secondary features.                 |
| Which data exists and what is its source of truth?   | Migration and integrations will hold surprises.               |
| Which systems must connect?                          | An integration cannot be estimated from a product name alone. |
| Which decisions or actions are sensitive?            | Permissions, validation or human review may be needed.        |
| What must happen for delivery to be accepted?        | The project ending will be open to interpretation.            |
| What can wait for a later phase?                     | The proposal will fund unnecessary uncertainty.               |

It is fine if several answers are "we do not know yet". That does not mean cancelling the project. It means pricing uncertainty as a discovery phase rather than hiding it behind a fixed figure.

## Scope: where most cost begins

A good proposal names the behaviour that will be delivered. Listing screens or technologies is not enough.

For every important journey, look for clarity on:

- which person or role starts it;
- which data they enter or read;
- which validation is applied;
- which system stores or owns each item of data;
- what happens when the normal path fails;
- which outcome the user sees;
- what is outside the first delivery.

For example, "customer management" might mean viewing a list, creating contacts, importing existing records, assigning permissions, preventing duplicates, recording changes, sending notices and synchronising with a CRM. Each decision changes effort, risk and cost.

You do not need to specify every button at the start. You do need to distinguish the main journey from ideas that are still hypotheses. When everything has the same priority, the proposal becomes an expensive bet.

## Assumptions and exclusions: the section to read twice

Hidden assumptions are a common cause of delay and overruns. A proposal should make them visible.

Look for answers to questions like these:

- who provides API access, accounts and test environments?;
- who prepares, cleans or migrates existing data?;
- who writes and approves copy, business rules and design?;
- which browsers, devices and languages are covered?;
- what happens if an external integration does not provide the expected capability?;
- how many review rounds are included?;
- which training, documentation or support is provided?;
- what will not be done in this phase?

An exclusion is not a bad sign. It may show that the professional has bounded the problem. It is better to read "historical data migration is not included" before you sign than to discover it when launch is near.

Also review how changes are handled. Changes are normal in software. What matters is a simple way to say: "this is new scope, let us assess its price and date impact before we build it".

## Fixed price, time and materials, or a discovery phase

There is no pricing model that fits every case. The choice should follow the uncertainty level.

A fixed price works when the outcome, user journeys and dependencies are reasonably stable. It gives the client predictability, but the provider needs to include room for risks they cannot control. If the project is very ambiguous, that room increases or arrives later as a change request.

Time and materials works better when the team needs to investigate, test an integration or learn from real users. It gives flexibility, but requires frequent prioritisation and visibility into completed work. Without someone deciding what comes next, it can become a list with no end.

A limited-budget discovery phase is often a good first option when the problem matters but the scope is not mature. It may include interviews, process mapping, data and systems review, a prototype or a first-delivery specification. Its purpose is not documentation for its own sake. It is reducing uncertainty before committing to a larger budget.

| Model              | It fits when                                  | Risk to watch                                                  |
| ------------------ | --------------------------------------------- | -------------------------------------------------------------- |
| Fixed price        | Scope and dependencies are stable             | Paying for uncertainty or forcing changes outside the contract |
| Time and materials | Decisions depend on learning                  | Moving forward without priorities or an investment limit       |
| Bounded discovery  | The problem is clear, but the solution is not | Extending analysis without deciding an initial delivery        |

## How to compare two proposals

Do not compare only the total or number of weeks. Compare what each proposal reduces and what it leaves for later.

| Dimension      | What to check                                                       |
| -------------- | ------------------------------------------------------------------- |
| Problem        | Does it describe the real case or reuse generic language?           |
| Scope          | Does it name journeys, data, integrations and exclusions?           |
| Assumptions    | Does it clarify what the client provides and external dependencies? |
| Process        | Are there deliveries and reviews before the end?                    |
| Quality        | Does it explain how critical paths and failures are tested?         |
| Delivery       | Does it include environments, deployment, access and documentation? |
| Ownership      | Can the business control code, data and accounts?                   |
| Continuity     | Can another provider maintain or continue the work?                 |
| Recurring cost | Does it cover hosting, licences, APIs, monitoring and support?      |

A higher proposal may include work that prevents months of trouble: a well-defined integration, safe migration, tests for a payment flow or a production release that does not depend on copying files by hand. A lower proposal may be the better choice when it honestly excludes those parts because the first delivery does not need them.

A useful comparison does not seek a magic figure. It checks whether price, scope and risk tell the same story.

## Deliverables and acceptance criteria

Every phase should end with something you can review. That could be a process map, prototype, version deployed for testing or functionality ready to use. "Eighty percent complete" is not very helpful if nobody can check what is done.

Acceptance criteria should be understandable to people who know the business. For example:

- an operations user with permission can create an order using the mandatory fields;
- the system prevents a reference already in use from being saved twice;
- if the payments API does not respond, the order remains pending and the team can see the incident;
- an administrator can export the required data;
- the journey works on mobile for the agreed browser version.

You do not need to turn every sentence into a legal contract. You do need to avoid "done" meaning one thing to the buyer and another to the developer.

## Quality proportional to risk

Every project needs quality, but not every project needs the same investment in controls. An informational page and an application that processes payments do not have the same risk profile.

The proposal should explain, in proportion to the risk, how it covers critical journeys, permissions, data validation, expected failures, backups and recovery. If personal data, payments, irreversible operations or dependency on an external API are involved, that conversation needs to be more specific.

Be wary both of "it does not need testing" and of a quality-tool list with no connection to the case. The question is: which failure would be costly for this business, and how do we stop it reaching production unnoticed?

## Ownership, deployment and continuity

Software does not end at the code repository. There are also domains, hosting, databases, cloud accounts, error logs, email providers, analytics and third-party APIs.

Clarify who owns each important account and who can access it. The business does not need to operate infrastructure daily, but it should not depend on one person to recover the code, data or domain.

Ask as well:

- where the system will be deployed and how it can be deployed again;
- which environments exist before production;
- how secrets and access are managed;
- which documentation is delivered;
- what happens during an incident;
- which maintenance, updates and recurring costs exist;
- how another team or provider could continue the work.

A continuity plan does not mean expecting a bad relationship. It means the project remains business property even when people change.

## Warning signs

Some proposals deserve closer questions:

- a final price without questions about users, data or existing systems;
- a technology list used as a substitute for scope;
- broad phrases such as "complete dashboard" or "full integration" without behaviour examples;
- no exclusions or mention of changes;
- fast-delivery promises that omit testing, deployment or account access;
- reliance on the provider's personal accounts;
- no information about recurring costs;
- open-ended support without conditions or limits;
- guaranteed business results that depend on factors beyond the software.

I would also watch for too much premature detail. If you do not yet know how people work, paying to define every screen can block better decisions. The aim is to make known boundaries visible and learn the rest as cheaply as possible.

## A way to move forward without betting everything at the start

The approach I trust most is: understand, narrow, build, check, then expand.

1. Describe the current problem and intended outcome.
2. Clarify users, data, systems and risks in the main journey.
3. Commission a discovery phase if those answers remain uncertain.
4. Define a small first delivery with explicit exclusions.
5. Review a working version before funding secondary improvements.
6. Test the critical journeys and fix what appears in real use.
7. Launch with access, documentation and clear maintenance responsibility.
8. Choose later improvements from data and feedback, not an old wish list.

This sequence does not remove difficult decisions. It makes them earlier and cheaper. If an integration proves more fragile than expected or a feature is not used, you can adjust the plan without turning the whole project into a renegotiation.

## Final recommendation

When evaluating a custom software proposal, look for clarity over apparent precision. The best proposal is not the longest or the cheapest. It is the one that lets you understand which problem it solves, what it will deliver first, what is outside scope, which risks exist and how the business will maintain what is built.

Begin with the smallest scope that can demonstrate value. Expand when the system and user needs give you concrete reasons to do so.

## Frequently asked questions

### Is the most detailed proposal always best?

No. It should be detailed enough to explain scope, exclusions, assumptions and acceptance. A long document that tries to fix unknown decisions can create false confidence.

### Why are two proposals for the same application so different?

They probably do not include the same work or carry the same risk. Compare journeys, integrations, data, testing, deployment, support and account ownership, not just the total.

### Is a discovery phase a bad sign?

No. It is reasonable when the problem matters but there is not enough information to estimate a complete solution honestly. It needs an objective, a cost limit and a clear path to an initial delivery.

### What should I receive at the end of a phase?

Something reviewable and useful: a working version, validated prototype, decision documentation or deployed environment. Access, code and data handover should be clear too.

### How can I prevent the proposal cost from escalating?

Prioritise one main journey, write exclusions down and confirm each change's impact before it is built. Projects become expensive when new ideas enter without deciding what they replace or delay.

### Should maintenance be included in the initial proposal?

You should at least understand which maintenance will be needed and what it costs. You can contract it later, but it should not be a surprise when the first update or incident happens.
