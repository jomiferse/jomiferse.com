---
title: "Website redesign SEO checklist: before and after launch"
description: "Plan a website redesign with URL mapping, content checks, redirects, contact form tests and Search Console monitoring before and after launch."
date: 2026-09-22
author: "José Miguel Fernández"
readingTime: "9 min"
translationSlug: "redisenar-web-sin-perder-seo"
commercial:
  role: buyer-led
  audience: business
  cluster: website-redesign
cover:
  src: "/images/blog/covers/website-redesign-seo-checklist.avif"
  alt: "Editorial illustration of an old website whose pages are reviewed and mapped to a redesigned version"
tags: [website-redesign, website-migration, seo, redirects, small-business]
---

A **website redesign SEO checklist** starts with the pages that already bring people to your business. Record what they do, keep useful URLs and test every address that changes. The new design should preserve the answers visitors came for and make their next step easier, whether that is an enquiry, booking or purchase.

Nobody can guarantee unchanged rankings. Search visibility may fluctuate while Google processes a move, as its [site migration documentation](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) explains. The practical objective is to avoid preventable mistakes and collect enough evidence to investigate problems.

This guide assumes you have decided to renew the site. If you are still choosing the scope, start with [whether to redesign or rebuild your website](/en/blog/redesign-website-or-rebuild/). What follows is a working plan for delivery and acceptance.

## What to request before approving the work

Ask for a page inventory, a change map and a named owner for monitoring. A design preview cannot tell you what will happen to an old article linked from another website, or to a service page that attracts few visits but useful enquiries.

The proposal should say who checks old addresses, who implements redirects and how much follow-up is included. If those jobs have no owner, part of the project is still undefined. The same approach helps when [evaluating a development proposal](/en/blog/evaluate-custom-software-proposal/): agree on the evidence that will demonstrate completion.

For a small business, I would keep the working documents simple:

| Deliverable       | What it lets you check               | Suggested reviewer                 |
| ----------------- | ------------------------------------ | ---------------------------------- |
| URL inventory     | What exists and needs to remain      | Business owner and developer       |
| Destination map   | Where each changed page will end up  | Developer and content owner        |
| Acceptance checks | What must work at launch             | Business owner                     |
| Results log       | What changed from the starting point | Person responsible for measurement |

A shared sheet can be enough. The useful part is having recorded decisions that everyone can inspect, rather than relying on what someone remembers from a call.

## 1. Save a baseline you can reproduce

Export available Search Console data by page and query. For a small site, look at several months as well as recent weeks: a valuable page may receive no clicks for days. Record the date range, country and filters so that your later comparison uses the same settings.

Separate searches for your business name from searches describing your services. Growing brand traffic can hide declining visibility for the problems you solve. If the website has multiple languages, keep those page groups separate too.

Save the main copy, page titles and descriptions. Capture the form and its confirmation message. Those records help resolve questions such as whether the old form asked for a telephone number or sent requests to a different inbox.

Connect pages to business outcomes where you have the data. Visits and sales opportunities are different measurements. If you cannot attribute enquiries to pages, document that gap instead of presenting a guess as a baseline.

Choose a person who can explain what a useful enquiry looks like. Otherwise the development team may optimize for a button click while the business cares about a completed request with enough detail to quote the work.

## 2. Decide which URLs actually need to change

New typography, colours or layouts do not require new addresses. If `/services/renovations/` still describes the same service, keeping it removes part of the migration work.

Give each relevant address a row: service pages, articles, active campaigns and documents shared with customers. For a small website I would review every published page. For a larger one, begin with known traffic, links and business dependencies, then account for the remaining content.

Here is a fictional example:

| Current address             | Decision                                  | Expected destination |
| --------------------------- | ----------------------------------------- | -------------------- |
| `/services/renovations/`    | Keep the address, review the copy         | The same page        |
| `/company/contact.html`     | Change the address                        | `/contact/`          |
| `/blog/kitchen-renovation/` | Keep the article                          | The same page        |
| `/offer-2019/`              | Check whether a useful replacement exists | A recorded decision  |

<picture>
  <source media="(max-width: 40rem)" srcset="/images/blog/website-redesign-url-map-en-mobile.svg" width="640" height="1030" />
  <img src="/images/blog/website-redesign-url-map-en.svg" width="1600" height="640" sizes="(max-width: 52rem) calc(100vw - 2rem), 50rem" alt="Diagram showing an old URL, a 301 redirect and a relevant destination in a website redesign" loading="lazy" decoding="async" />
</picture>

Do not assume that an old-looking page has no value. It may answer a specific customer question that the new layout overlooks. Equally, keeping an expired offer as though it were still available is misleading. Record what is being removed and the reason for doing so.

Ask the content owner to approve these choices before implementation. Discovering a missing service page after launch is more disruptive than correcting a row in a planning sheet.

## 3. Test redirects from the old address

For a permanent address change, implement a server-side permanent redirect, usually `301` or `308`. Google's [redirect documentation](https://developers.google.com/search/docs/crawling-indexing/301-redirects) distinguishes permanent moves from temporary ones. Updating the navigation link alone does not handle visitors arriving at an old address.

Open the old URL directly. Check its HTTP response and final destination, then inspect the destination's content. A technically successful request can still land on a page that no longer answers the visitor's question.

Test variants the site actually used, including file extensions, trailing slashes and important campaign links. A query parameter may affect a form or attribution. Decide deliberately whether it must survive the move.

For acceptance, request a list of source URL, expected destination, observed destination and result. This gives the team specific failures to fix and a check they can repeat after launch. A configuration file describes intended behaviour; a server response shows what happened.

Have someone outside the implementation work review a few commercial journeys as well. They may notice that a destination is technically correct but uses an unfamiliar service name or omits the action customers expect.

## 4. Preserve the information customers need

A redesign can remove useful content without changing any URLs. A detailed service page may become a large photograph with a short paragraph, losing the explanation of scope, timing and limitations.

Review each service with a practical question: can a visitor decide whether this fits their situation? Keep the necessary answers, even if you reorganize them. Use FAQs for actual questions customers ask, rather than repeating a generic block everywhere.

Review evidence of work too: screenshots, project links, examples and outcomes you can support. Update outdated references or explain their context. An invented conversion figure does not make a new design more credible.

The guide to [what a professional website needs to get clients](/en/blog/what-a-professional-website-needs-to-get-clients/) covers this part in more detail. Shorter headings and cleaner sections should still explain what the business does.

For each important page, ask the business owner to approve the final copy rather than only its appearance in a mockup. The words that reach production are part of the deliverable.

## 5. Review indexing, canonicals and language links

Restrict access to the staging environment as appropriate. Before launch, confirm that pages intended for search do not retain an accidental `noindex`. Blocking crawling in `robots.txt` is different from preventing indexing; Google's [noindex documentation](https://developers.google.com/search/docs/crawling-indexing/block-indexing) explains that distinction.

Check the canonical URL too. It signals the preferred address among duplicate or very similar versions, and should not point to the staging domain. See the [canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) for implementation details.

On an English and Spanish website, try the language switch from individual articles. It should take you to the equivalent content. `hreflang` relationships should reflect those equivalents and include return links, as described in Google's [localized page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).

Finally, review the sitemap's canonical URLs. A sitemap helps discovery but does not guarantee indexing. Google's [sitemap instructions](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) explain what belongs in it.

Include the production hostname in your acceptance notes. This avoids approving checks made against a preview that behaves differently from the public website.

## 6. Follow the journey through to an enquiry

Test on a phone and a desktop computer. Start at a service page, read through to the contact action and change language where relevant. Check that text and controls remain usable without zooming.

Submit an enquiry clearly marked as a test and verify that it reaches the agreed destination. Check required fields, error messages and confirmation. Try a failed connection too: the visitor needs to understand whether another attempt is necessary.

If the site connects to a CRM, confirm that the request arrives with the correct fields. A thank-you page does not prove that the sales team received anything. The guide to [integrating forms, CRM and payments](/en/blog/integrate-crm-forms-payments/) explains why delivery states and errors matter.

Record how measurement behaves under the visitor's consent choices. Missing analytics events might indicate a configuration issue; they do not automatically prove that real enquiries have disappeared.

Agree where test submissions should go and who removes them from operational queues. Testing should establish that the workflow works without confusing colleagues who are handling customer requests.

## 7. Launch with acceptance checks and a recovery plan

For a small business, my release checklist would include:

- Priority pages load and show the approved content.
- Changed addresses reach their agreed destinations.
- Public pages do not inherit staging restrictions.
- Important links, images and downloads work.
- A test enquiry reaches the intended inbox or system.
- A recoverable copy exists and someone is available to handle faults.

Define what justifies a rollback. Unusable forms, widespread errors or missing commercial information are examples. A daily ranking fluctuation calls for a different response.

If the website stores orders or enquiries, restoring old code must not erase data received after launch. The recovery plan needs to cover both the application and its data. Agreeing this beforehand reduces the decisions that must be made under pressure.

Give the launch a clear owner and a short record of what was released. If an issue appears later, the team should be able to identify the version involved without reconstructing several conversations.

## 8. Monitor page groups and queries after launch

Check functional problems promptly, then allow an observation period for search trends. Compare equivalent date ranges in Search Console and break results down by pages, queries and devices. Its [performance report](https://support.google.com/webmasters/answer/7576553) supports those views.

When an address changes, group its old and new URLs in your monitoring. Otherwise a transfer of visibility can look like a complete loss on one page.

Keep a log with the date, symptom, hypothesis and check performed. For example, a page loses impressions and the review finds that its main explanation was removed. Investigate that decision before changing several unrelated things.

Small datasets need particular care. One enquiry or a few clicks can move a percentage sharply. Discuss the underlying counts alongside the percentage so the business does not react to a misleading headline.

## Frequently asked questions

### Does moving away from WordPress cause an SEO loss?

The technology alone cannot predict the outcome. Review the resulting pages, their content and their behaviour. Ask for evidence of those outputs in the [website redesign project](/en/services/website-redesign/).

### Can a developer guarantee unchanged rankings?

No. A developer can commit to checks and corrections, but cannot control every search engine decision or competing website. A useful agreement separates those responsibilities.

### What should I provide before work starts?

Appropriate access to the website and measurement tools, a content inventory, commercial priorities and the journeys that must continue working. Share credentials securely and agree who removes access when the work ends.

### When is the redesign complete?

When the agreed deliverables have passed acceptance and someone owns the follow-up. Publishing is a milestone. Completion should include test evidence and a record of resolved or outstanding issues.
