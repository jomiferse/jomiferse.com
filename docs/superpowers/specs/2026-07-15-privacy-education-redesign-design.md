# Privacy and Education Redesign Specification

**Date:** 2026-07-15
**Status:** Approved design, pending implementation plan

## Objective

Redesign `/[locale]/privacy` and `/[locale]/education` so they match the restrained commercial language of the home, about, projects, services and contact pages.

The privacy page must become a clear, professional second layer of information for the site's actual personal-data and cookie processing. The education page must explain how José Miguel's training improves client work instead of presenting an academic CV in card form.

## Scope

### Included

- Spanish and English versions of both routes.
- Privacy information for the contact form, local preferences, hosting, email delivery and consent-based analytics.
- A detailed cookie and browser-storage inventory.
- A section-aware navigation for the privacy document.
- A client-oriented education hero, applied-learning section, compact certification list, formal-education timeline and closing CTA.
- Responsive, dark-mode, accessibility and generated-route verification.

### Excluded

- A separate legal notice or terms-of-service page.
- Publication of a tax identifier or postal address.
- New analytics, consent-management or legal-compliance vendors.
- New education or certification records.
- Changes to the contact form fields or API behavior.
- Legal certification or a claim that the resulting text replaces professional legal advice.

## Shared Visual Direction

Both pages use the home page as their reference:

- `var(--home-navy)` for primary headings.
- `var(--action)` for eyebrows, icons, navigation state, small signals and the primary action.
- `var(--surface)`, `var(--surface-strong)`, `var(--bg-band)` and `var(--surface-border)` for restrained surfaces.
- Editorial rows, dividers and controlled whitespace instead of repeated promotional cards.
- No use of `--accent*` as a commercial colour.
- The same hierarchy in light and dark themes.
- No horizontal overflow at 390 px and a deliberately wide composition at 1440 px.

## Privacy Page

### Purpose and indexing

`/[locale]/privacy` is the permanent second layer for privacy and cookie information. It remains `noindex,follow`: users and linked forms can reach it, while it is not treated as a search landing page.

The route remains excluded from the global contact and exit-intent dialogs.

### Hero

The hero contains:

- An eyebrow equivalent to “Privacy and cookies”.
- A plain-language H1 equivalent to “Your data, explained clearly”.
- A short introduction explaining that analytics is optional and advertising profiles are not created.
- The last-updated date.
- One primary action that opens the existing cookie-preferences dialog.
- A compact trust strip containing the controller, contact channel, optional analytics and no-advertising statement.

The hero must not include a sales CTA.

### Information architecture

The main document uses a two-column layout on large screens: a section-aware navigation on the left and readable legal content on the right. On mobile, navigation becomes a compact disclosure above the content.

The navigation marks the current section with `aria-current="location"`, updates as the reader scrolls and closes after a mobile section is selected. Without JavaScript, every anchor remains usable and all content remains visible.

The sections are:

1. Controller and contact details.
2. Data collected and its source.
3. Purposes and legal bases.
4. Retention criteria.
5. Service providers and recipients.
6. International transfers and safeguards.
7. Data-subject rights and AEPD complaints.
8. Cookie and browser-storage policy.
9. How to change or withdraw consent.

### Actual processing to describe

The policy must reflect the repository's current behavior:

- Contact enquiries collect name, email address, message, selected service or scope, locale and page/source context.
- Contact details are used to answer the enquiry and assess the requested service.
- Resend delivers the contact email.
- Vercel hosts and serves the website and API.
- Google Analytics 4 is loaded only after analytics consent.
- The site stores the selected visual theme and cookie decision locally in the browser.
- The exit-intent session flag is temporary interface state and is not used for advertising or profiling.
- WhatsApp and other external links only transfer data after the visitor chooses to open those third-party services.

The copy must state criteria rather than invent unsupported guarantees. Enquiry data is retained while the request is handled and for up to 12 months after the last communication, unless a contractual relationship or legal obligation requires longer retention. The owner must verify this 12-month period before publication.

### Providers and transfers

The policy identifies Resend, Vercel and Google as providers relevant to the current site. It explains that these providers may process data outside the European Economic Area and links to their current privacy and transfer information. It must not claim a transfer mechanism that has not been verified against the provider's current terms.

### Storage table

Use a semantic table on wider screens and an equivalent labelled stacked presentation on narrow screens. It covers:

| Key or pattern | Type | Provider | Purpose | Duration | Consent |
| --- | --- | --- | --- | --- | --- |
| `theme` | Local storage | jomiferse.com | Remember light or dark theme | Until removed | Necessary preference |
| `jomiferse.cookie-consent.v1` | Local storage | jomiferse.com | Remember cookie choice | Until removed or policy version changes | Necessary preference |
| `jomiferse.exit-intent.v2` | Session storage | jomiferse.com | Avoid repeating the exit prompt in one session | Browser session | Necessary interface state |
| `_ga` | First-party analytics cookie | Google Analytics | Distinguish users for aggregate analytics | Up to 2 years by default | Analytics consent |
| `_ga_<container-id>` | First-party analytics cookie | Google Analytics | Preserve session state | Up to 2 years by default | Analytics consent |

The Google durations are described as defaults and linked to Google's documentation. The table must be updated if the site's measurement configuration changes.

### Rights and cookie controls

The policy explains access, rectification, erasure, objection, restriction, portability and withdrawal of consent in plain language. Requests use the published email address. It includes a direct link to the Spanish Data Protection Agency for complaints.

Cookie preferences can be reopened from the hero, the relevant section and the footer. Accepting and rejecting analytics retain equivalent prominence in the consent interface.

### Source basis

The content follows the layered-information structure described by the Spanish Data Protection Agency and the information categories in GDPR Article 13. Cookie controls follow the AEPD cookie guide. GA4 cookie names and default durations follow Google's current product documentation.

## Education Page

### Positioning

`/[locale]/education` is client-first. Formal studies and courses provide evidence, but the main message is how continuous learning improves technical judgment, software quality and production delivery.

### Hero

The hero contains:

- An eyebrow equivalent to “Applied learning”.
- An H1 equivalent to “Learning to solve better”.
- An introduction connecting study with practical delivery and maintainability.
- A compact summary showing the number of technical courses, number of formal qualifications and current technical focus.

Counts and latest years are derived from CV data instead of duplicated in translations.

### Applied learning

Replace the current three-card grid with three editorial rows using restrained action-colour icons:

1. Reliable backend systems.
2. Quality, testing and maintainability.
3. Infrastructure, deployment and operations.

Each row explains a concrete client benefit. The section must avoid claims that cannot be supported by experience or project content.

### Certifications

Redesign `CertificationCard.astro` as a compact editorial record:

- Year and provider form the small metadata column.
- Course title is the visual focus.
- Up to four relevant skills appear as secondary metadata.
- Credential identifiers are visually de-emphasized but remain available.
- The credential link uses the shared secondary-button philosophy and clearly indicates that it opens a new tab.
- Records remain in reverse chronological order using the CV data.

### Formal education

Redesign `EducationCard.astro` as a simple timeline row:

- Period, institution and location are grouped as metadata.
- Qualification and description are the main content.
- Grade and technologies remain supporting evidence.
- The timeline works as a single linear sequence on mobile.

### Connection to real work

The closing section states that training is validated through production work. Its primary CTA links to projects and its secondary CTA links to the combined about/experience page. It uses the shared conversion component and keeps one clear primary action.

No carousel is used because the records are reference information that visitors may need to compare and scan.

## Components and Boundaries

- Create a generic section-navigation component from the established blog article navigation behavior. Keep the blog-facing API stable through a thin wrapper or compatible props.
- Keep privacy-specific content and storage-table markup within the privacy page unless a second consumer appears.
- Modify `CertificationCard.astro` and `EducationCard.astro` in place because only the education page consumes them.
- Keep all public copy in parallel `src/i18n/es.json` and `src/i18n/en.json` structures.
- Keep CV facts in `src/data/cv.es.json` and `src/data/cv.en.json`; do not duplicate those facts in translation files.

## Accessibility

- One H1 per page and a sequential H2/H3 hierarchy.
- Section anchors account for the sticky header with scroll margin.
- Current navigation state is exposed with `aria-current="location"`.
- Tables preserve header associations; the mobile alternative exposes the same labels and values.
- External credential and provider links have descriptive labels and new-window context.
- All interactive targets are at least 44 px where they are standalone controls.
- Focus indicators use `var(--action)` and are never removed.
- Motion respects `prefers-reduced-motion`.

## Responsive and Theme Behavior

- Required visual checks: 390 px mobile and 1440 px desktop.
- Privacy navigation is sticky only when sufficient vertical and horizontal space exists.
- Legal prose uses a readable measure while the overall page aligns to the site's wide shell.
- Education rows collapse into one column without hiding metadata.
- Both pages are checked in light and dark themes and must not hard-code light-only colours.

## SEO and Structured Data

- Privacy remains noindex with self-consistent localized canonical and alternate paths.
- Education remains indexable with a unique localized title and description, one H1 and existing collection/breadcrumb structured data.
- Education metadata describes technical education and applied professional learning without keyword stuffing.
- Internal links use localized paths.

## Verification

Add a focused verifier for the two redesigned pages before implementation. It checks:

- Required page components and semantic markers.
- Spanish and English key parity.
- Privacy `noindex`, storage entries, rights, providers and cookie-preferences triggers.
- Education data-driven counts, applied-learning rows, compact records and project/about CTA destinations.
- No `var(--accent` references in either page or its education cards.
- Generated `/es` and `/en` routes after build.

Run the repository's required validation set:

- `pnpm run test`
- `pnpm run check`
- `pnpm run lint`
- `pnpm run format:check`
- `pnpm run verify:ai-seo`
- The new privacy/education verifier against source and generated output.
- `pnpm run build`

Manually verify both locales at 390 px and 1440 px, light and dark themes, keyboard navigation, language switching, section tracking, external links and cookie-settings opening.

## Publication Review

Before publication, the owner must verify:

- The controller name and contact email.
- The chosen enquiry-retention period.
- The active Vercel, Resend and Google Analytics configurations.
- The providers' current privacy and international-transfer terms.
- That no additional cookies, embeds or analytics tools have been introduced.
