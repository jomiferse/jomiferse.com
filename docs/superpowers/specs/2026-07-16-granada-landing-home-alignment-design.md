# Granada landing home alignment

## Objective

Redesign the bilingual Granada web-design landing so it feels like a focused local extension of the home page, not a standalone SEO template. The page must preserve its acquisition target—Spanish buyers searching for `diseño web Granada`—while using the same restrained, personal, editorial visual language as the home.

## Scope

This redesign applies to the shared commercial landing route and therefore to both:

- `/es/diseno-web-granada/`
- `/en/web-design-granada/`

The work may adjust the Granada landing content model where needed, but it must not redesign unrelated commercial landings, change canonical URLs, remove structured data, or alter the keyword-ownership strategy.

## Design direction

Use the home page as the direct visual reference:

- Personal, pragmatic positioning rather than agency-style copy.
- `var(--home-navy)` for major headings and `var(--action)` for small conversion signals.
- Restrained surfaces, editorial dividers, generous spacing, and full-width bands.
- One visually dominant CTA.
- Real project evidence instead of invented metrics, testimonials, local offices, or team claims.
- No generic conversion-page card stacks, decorative gradients, or repeated SEO sections.

The result should feel like a compact local home page: recognizably part of the same site, but focused on one commercial intent.

## Page composition

### 1. Home-derived hero

The hero follows `HomeHero` rather than the existing commercial-landing hero.

- Centered eyebrow and H1 on desktop; left-aligned on narrow mobile screens.
- H1 remains `Diseño web en Granada para captar clientes` in Spanish and keeps the approved English equivalent.
- A two-column body sits below the heading.
- The left column contains the concise offer, the direct-working relationship, an experience signal already supported by CV data, the primary contact CTA, a secondary project link, and a low-emphasis assessment note.
- The right column acts as a needs selector with four editorial options: new service website, redesign, WordPress site, and campaign landing page. Each option links to the most relevant canonical service page.
- The selector may use restrained surfaces like the home, but it must not become a generic grid of marketing cards.

### 2. Decision band

A full-width `var(--bg-band)` section explains when the service is a sensible investment.

- Three buyer situations only.
- Horizontal three-column presentation on desktop and divided rows on mobile.
- Number, short heading, and practical supporting text for each situation.
- The content consolidates the current problem and when-worth-it sections.

### 3. Typical work

Present three common engagements using the home page's editorial service treatment:

- Service website.
- Lead-generation landing page.
- WordPress build or redesign.

Use one bordered editorial row/grid with dividers, not separate floating cards. Each item includes a short description, useful scope points, and a link to the canonical supporting service page.

### 4. Real project evidence

Show one existing portfolio project with its real image, title, status, and link.

- Reuse an existing project record and image rather than adding an unverified case study.
- Introduce it as evidence of working method and execution quality, not proof of rankings or revenue.
- Match the home page's case-preview treatment.

### 5. Compact process

Keep four steps from the existing landing content, but present them with the same restrained numbered/divider language as `HomeProcess`.

- Discovery and offer review.
- Scope, content, and platform decision.
- Build and review.
- Launch, checks, and handoff.

No duplicate scope or working-criteria sections remain. Relevant expectations from those sections should be folded into the process copy.

### 6. Focused FAQ

Retain FAQ structured data and a visible accordion, reduced to questions with genuine purchase intent:

- Whether the service is available to Granada businesses without in-person meetings.
- WordPress versus Astro.
- Typical price factors.
- Timing and what the client needs to provide.

Answers remain specific and avoid fixed promises that the project cannot substantiate.

### 7. Home-style final CTA

Use the same full-width visual philosophy as the home final CTA.

- One primary action: request the initial assessment.
- One short supporting sentence.
- The services index may remain as a low-emphasis text link only if it does not compete with the primary action.

## Content consolidation

Remove the existing standalone sections for:

- Problem statement.
- Five investment signals.
- Separate build scope.
- Separate working criteria.
- Related blog posts.
- Repetitive related-service cards.

The useful information from these sections must be consolidated into the hero, decision band, typical-work items, process, and FAQ. Removing visible sections must not remove the page's primary keyword, local relevance, WordPress/Astro distinction, project scope language, pricing factors, or contact path.

## Components and data boundaries

The route remains responsible for metadata, canonical/alternate links, structured data, contact attribution, and resolving service/project links.

Presentation should be split into small landing-specific components only where this makes the page easier to understand. Existing home components may be reused when their props fit naturally; they must not be forced through conditional logic that makes the home harder to maintain.

The commercial landing data remains the source for bilingual copy. Granada-specific needs-selector content and condensed sections may be added to its typed model. Both locales must have equivalent intent, not literal translations.

## SEO requirements

- Preserve the current canonical and hreflang paths.
- Preserve `Service`, `FAQPage`, and breadcrumb structured data.
- Keep the Spanish primary query in the title, H1, introduction, and natural supporting copy.
- Keep Granada in buyer-relevant context without keyword repetition.
- Preserve internal links to canonical website, WordPress, redesign, and landing-page services.
- Do not reintroduce meta keywords.
- Do not add unsupported local address, agency, team, ranking, traffic, lead, or revenue claims.

## Responsive and accessibility requirements

- Validate at 1440 px and 390 px.
- No horizontal overflow.
- The primary CTA remains visible and unambiguous on both sizes.
- Mobile reading order follows the visual order: heading, offer, CTA, needs selector, decision support, evidence, process, FAQ, final CTA.
- Preserve semantic heading order, visible focus states, keyboard-operable FAQ controls, accessible link names, and dark-mode variables.
- Repeated content must use stable dimensions and avoid layout shift.

## Verification

Automated checks must cover:

- Both localized routes still build.
- Canonical, alternate, and structured-data output remains present.
- The primary Spanish title/H1 and Granada area served remain unchanged.
- The page links to the expected canonical service and contact routes.
- Removed template-style sections and related-post grid no longer render.
- Existing redirect and SEO ownership tests remain green.

Run the repository quality command after implementation:

```sh
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run quality
```

Then inspect both locales at 1440 px and 390 px, including dark mode and language switching.
