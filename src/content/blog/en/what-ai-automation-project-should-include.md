---
title: "What an AI automation project should include"
description: "Practical AI automation scope covering examples, evaluation, data, human review, integration, cost and observability."
date: 2026-07-11
dateModified: 2026-07-12
author: "José Miguel Fernández"
readingTime: "11 min"
translationSlug: "que-incluye-proyecto-automatizacion-ia"
tags: [ai, automation, evaluation, operations, documents]
---

An AI automation project should not start by choosing a model. It should start with the task, acceptable error and who decides when output is unreliable. A demo that classifies five documents is easy; a workflow that handles real data every day, leaves an audit trail and fails safely is the product a business needs to buy.

The proposal should explain both the probabilistic component and the conventional integration around it. Receiving files, validating fields, applying permissions, storing states, sending alerts and supporting corrections can require as much work as the model call. Use this guide as a checklist for requesting, comparing and governing that scope.

## 1. A bounded problem and a baseline

“Use AI for documents” is not a testable objective. “Extract invoice number, date, supplier and total to prepare accounting review” is a better start. Define input, the structure required by the next system, volume and what a person does today.

Record baseline time, errors, waiting, cost and the share of cases requiring judgement. Otherwise, you cannot tell whether the project improves operations or merely changes their interface. Include actions AI must never perform, such as approving a payment or permanently rejecting an application.

Before introducing a model, check whether rules, search or an integration are sufficient. AI adds value where language, images or variation are difficult to express as rules. Moving structured data between systems is usually better served by [conventional process automation](/en/blog/when-business-process-automation-is-worth-it/).

## 2. Real examples and an evaluation set

The project needs normal, difficult and clearly invalid cases—not only clean documents selected for a demo. Collect common formats, poor scans, missing fields, languages and genuine exceptions, anonymising them where appropriate.

Separate development cases from evaluation cases. Define the correct answer by field or category and how partial responses are scored. For extraction, measure by field; for classification, inspect false positives and negatives per class; for summaries, use a rubric that penalises omissions and unsupported claims.

The result should not be “it looks quite good”. It should report how many cases pass automatically, reach review and fail the threshold. The [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) treats measurement and risk management as lifecycle activities, not a one-off check before launch.

## 3. Acceptance criteria tied to risk

There is no universal sufficient accuracy. It depends on the field, subsequent action and how easily an error can be detected. A category that merely sorts a queue can tolerate more uncertainty than an amount feeding a payment.

Define criteria by output. Critical fields may require deterministic validation and human review; secondary ones may accept a lower threshold. Set an error budget, latency maximum and per-case cost that the business can support.

Include a stop condition. If the pilot misses quality on representative data or demands as much review as manual work, reformulation or cancellation may be correct. That protects the buyer better than assuming another model will solve every limitation.

## 4. Data, privacy and permissions

The proposal should inventory what information is sent, where it is processed, how long it is retained and who can see it. Minimise data: if the task does not need a full name or entire attachment, do not send it. Separate environments and avoid casual testing with sensitive real documents.

Review provider terms, processing regions, subprocessors and retention with the relevant privacy owner. The UK's data protection authority provides practical guidance on [AI and data protection](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/) that can inform the assessment, although it does not replace advice for a specific jurisdiction.

Permissions extend beyond the API. Review queues, logs and exports contain information too. Define roles, authentication, least-privilege access and change records. Credentials should live outside code and rotate without rebuilding the flow.

## 5. Designing human control

“A person will review it” is not enough. Describe what they see, can correct and what happens next. A useful interface shows the original document, proposed result, confidence or warning reason, and failed validations.

Use three routes: automatic acceptance for cases meeting strict criteria, review for uncertainty and controlled rejection for invalid input. A model confidence score is not a guarantee; calibrate thresholds on your data and combine them with rules.

Store corrections as operational signals, not automatic training data. Their quality, permissions and representativeness need checking before reuse. Define who can reverse an action and how complaints or disputed outcomes are handled.

## 6. Architecture and integration with real work

Output should enter the CRM, ERP, dashboard or queue with a validated schema, state, source and version. Reject incomplete responses structurally. Give every case an identifier and preserve the relationship between input, output, review and subsequent action.

The workflow must retry without duplicating effects. If a provider is unavailable, the case remains pending and somebody receives an alert; it does not vanish. Add concurrency, size and cost limits, plus a way to pause processing.

Where most value comes from connecting systems, inspect available APIs early. My [AI automation for operations and documents service](/en/ai-automation-operations-documents/) combines that integration with evaluation and supervision instead of delivering an isolated prototype.

## 7. Security against problematic input and output

Documents and messages are untrusted input. They may contain malicious instructions, unexpected data or corrupt files. Limit file types and sizes, scan attachments where appropriate and do not let content grant tools or permissions to a model.

Validate output before action. Correctly formatted content can still be factually wrong. Apply allowlists, ranges, cross-checks and separation of duties. External actions need minimum permissions and human confirmation where impact warrants it.

The [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) provides a practical map of risks such as prompt injection, information disclosure and excessive agency. A proposal should state which apply and which control reduces each one.

## 8. Observability, cost and production quality

In production, track volume, latency, technical errors, usage, cost, reviewed cases and corrections. Do not retain sensitive content by default in the name of debugging. Prefer identifiers, aggregate metrics and proportionate retention.

Define actionable alerts: an ageing queue, rising errors, abnormal spend or declining acceptance. Distinguish a provider failure from an output failing validation; each requires a different response.

Monitor cost per document or task and set daily limits. Model price is not total cost: include OCR, storage, infrastructure, review and maintenance. The guide to [the cost of administrative automation](/en/blog/cost-to-automate-administrative-process/) helps compare investment and operations.

## 9. Gradual rollout and rollback

Start in shadow mode: the system produces results without acting and they are compared with human decisions. Then use assisted mode, where it prepares and a person confirms. Only low-risk case types with demonstrated performance should gain autonomy.

Set percentages and review dates rather than an open-ended transition. Keep the previous process available while recovery is validated and train supervisors. Documentation should explain known limits, escalation and how to pause or roll back.

A model, prompt, schema or data-source change is a product change. Version those pieces, rerun evaluation and deploy gradually. “The provider updated the model” cannot mean accepting new behaviour without checking.

## 10. Deliverables, ownership and maintenance

At completion, the buyer should receive agreed code or configuration, architecture documentation, a service inventory, evaluation set and results, operating instructions and outstanding risks. Intellectual property and data export must be clear.

The maintenance plan says who reviews alerts, how often evaluations run, how changes are managed and which support is included. Reserve capacity to reassess when documents, business rules or providers change.

A serious proposal separates pilot and production. The pilot answers whether the task is viable; production adds security, integration, recovery, training and operations. Mixing them obscures what is being purchased.

## Comparing supplier proposals

Give every supplier the same examples and criteria. Ask for results on a held-out set and a demonstration of the failure path, not only the happy path. Compare automation rate, review burden, total cost, latency and ability to leave the provider.

Be cautious with precision promises lacking a definition, proposals that omit data handling and systems granting broad actions to a model. A good answer acknowledges uncertainty and demonstrates how it is contained.

## Frequently asked questions

### Is a prototype enough?

It can validate feasibility and initial quality. Production also needs permissions, integration, recovery, cost limits, monitoring and named supervisors.

### How large should the evaluation set be?

There is no universal number. It must cover classes, formats and exceptions well enough to expose material failure. Expand it as new cases appear while retaining a stable subset for version comparison.

### Can it operate without human review?

Only on low-risk paths with measured performance and strong validation. Autonomy is earned per case type, not granted to the entire workflow because an average looks good.

### How is return calculated?

Compare current time and errors with net savings after review, licences, usage and maintenance. Include faster turnaround where measurable without inventing commercial benefits.

### What happens when the model changes?

Rerun evaluation, compare quality, cost and latency, and deploy gradually. Keep a previous version or manual mode available if performance declines.

### Who is responsible for a wrong decision?

The organisation must define responsibility and escalation before launch; it cannot delegate them to a model. For sensitive decisions, involve the relevant compliance and process owners.
