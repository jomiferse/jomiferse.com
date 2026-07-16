# Granada landing as a service page

## Objective

Rework the bilingual Granada web-design landing as a transactional service page. The page should answer the questions a buyer has before contacting a developer: what the service solves, what it costs, what is included, how the project runs, and what evidence supports the offer.

The Spanish page continues to own the primary acquisition query `diseño web Granada`.

## Scope

The redesign applies only to:

- `/es/diseno-web-granada/`
- `/en/web-design-granada/`

The routes remain commercial landing routes. They must not move under `/services/`, and the existing redirects, canonical URLs, hreflang links, sitemap entries, and structured data must remain valid.

Other commercial landings and canonical service pages keep their current presentation.

## Design direction

Use the existing service-detail page as the visual and interaction reference. The Granada page should feel like a local service entry in the same commercial system, not a second home page and not a generic campaign template.

The page uses:

- `var(--home-navy)` for primary headings.
- `var(--action)` for the primary CTA, price emphasis, icons, and small commercial signals.
- Existing service surfaces, borders, spacing, pricing cards, proof treatment, FAQ, and final conversion CTA.
- Direct first-person copy that makes clear the client works with José Miguel, not an agency or local office.

## Commercial data source

The page must not define a second independent price table. It resolves the canonical WordPress web-design offering, identified by `web-wordpress:0`, from `getServicePages(locale)` and consumes its:

- Three pricing options.
- Timeline.
- Included scope.
- Commercial boundaries.
- Icon and related service metadata where useful.

This keeps the Granada page consistent with `/es/services/diseno-web-wordpress/` and its English equivalent. If that service is not resolved at build time, the route must fail clearly rather than publish an incomplete pricing section.

Granada-specific copy remains in the commercial landing model because local intent, buyer situations, FAQs, title, description, and structured data differ from the general WordPress service.

## Page composition

### 1. Service hero

The hero follows the service-detail pattern:

- Back link to the localized service index.
- Service icon and local-service eyebrow.
- Existing Granada H1 and introduction.
- Primary CTA to the attributed contact route.
- Secondary WhatsApp CTA using the same public business number and safe external-link attributes as existing service pages.
- Summary panel with the lowest applicable `from` price, tax note, timeline, and anchor link to compare the three options.

The hero should mention Granada as the service area without implying a physical office.

### 2. Trust strip

Reuse the existing three-signal service treatment. The signals state:

- Direct communication with the developer.
- Scope and responsibilities agreed in writing.
- The client keeps access and ownership of the delivered website.

Do not add review scores, client counts, or unsupported performance claims.

### 3. Outcome section

Combine the local landing's problem and buyer situations into the service-detail outcome pattern:

- One clear problem statement.
- Supporting explanation based on the existing Granada copy.
- Three concrete benefits: clearer offer, easier contact, and a maintainable technical base.

The copy may discuss technical SEO and performance as project work. It must not promise rankings, traffic, leads, or revenue.

### 4. Pricing options

Reuse `ServicePricingGrid` with the three pricing options from `web-wordpress:0`:

- Focused intervention.
- Complete website project.
- Ongoing support.

Display `from` pricing, IVA/tax information, included items, boundaries, and the existing most-common option treatment. Each CTA carries the Granada landing source path so conversions remain attributable to the local page.

### 5. Scope and boundaries

Use the two-column service-detail treatment:

- Included work comes from the resolved service plus any Granada-specific requirement that is already present in the landing copy.
- Boundaries are deduplicated from the three pricing options.

The section must cover content structure, responsive design, WordPress or Astro selection, forms, consented analytics, technical SEO, launch, and handover without implying that all items belong to every price level.

### 6. Process

Present the four existing Granada steps in the service-detail numbered layout:

1. Review the offer, current website, and desired enquiries.
2. Define pages, content, platform, responsibilities, and deliverables.
3. Build and review the main visitor journeys.
4. Launch, test forms, and hand over access and documentation.

### 7. Proof

Use `ServiceProofCard` with the existing GetYourTicket project and real image. Describe it as evidence of web-platform execution and operational handover, not evidence of local SEO results.

### 8. Related services

Show three canonical supporting services:

- WordPress web design.
- Website redesign.
- Landing pages.

Use service-detail cards and canonical localized paths. Do not restore the removed blog-post grid.

### 9. FAQ

Keep the four approved purchase questions:

- Working with Granada businesses and meeting format.
- Price factors.
- WordPress, Astro, and editing.
- Project timing and client inputs.

Retain visible native accordions and `FAQPage` structured data.

### 10. Final CTA

Use the shared `ConversionCta` service treatment. The primary action starts the attributed assessment. A secondary link may return to the service index, but it must remain visually subordinate.

## Components and route responsibilities

`[locale]/[landing].astro` remains responsible for routing, canonical and alternate paths, schema, service resolution, project resolution, contact attribution, and WhatsApp URL construction.

The Granada presentation remains isolated in `GranadaWebDesignLanding.astro`. Its props should describe the data it needs rather than require it to query global collections. The current home-derived component implementation should be replaced, not layered underneath the service page.

Reuse these existing components where their interfaces fit:

- `ServiceIconBadge`
- `ServiceTrustStrip`
- `ServicePricingGrid`
- `ServiceProofCard`
- `ConversionCta`

## SEO requirements

- Preserve the current Spanish and English URLs.
- Preserve canonical, hreflang, sitemap, and redirect behavior.
- Preserve `Service`, `FAQPage`, and breadcrumb structured data.
- Keep the primary Spanish query in the title, H1, introduction, and natural local copy.
- Keep `Granada, España y remoto` and its English equivalent in `areaServed`.
- Add offers to the Granada `Service` structured data using the same resolved pricing options shown on the page.
- Keep internal links to WordPress design, redesign, landing pages, the project, contact, and services.
- Do not add meta keywords or unsupported local business attributes.

## Responsive and accessibility requirements

- Validate at 1440 by 900 and 390 by 844.
- No horizontal overflow.
- The primary CTA, starting price, and comparison link remain visible at both widths.
- Pricing cards collapse to one column using the existing component behavior.
- Preserve semantic heading order, visible focus states, native keyboard-operable FAQ controls, accessible names, and dark-mode variables.
- WhatsApp opens in a new tab with `noopener noreferrer` and a prefilled message that contains no sensitive data.

## Verification

Automated checks must prove:

- Only the two local web-design routes use the Granada service presentation.
- Both routes contain service hero, trust, outcome, pricing, scope, process, proof, related services, FAQ, and CTA markers.
- The production HTML contains three pricing options from the canonical web-design offering.
- Structured data contains the local area served and commercial offers.
- Canonical service, project, contact, and alternate-language links are present.
- The removed home-derived needs selector and related-post section do not render.
- All existing redirects and keyword ownership tests remain green.

Run the repository quality command after implementation:

```sh
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run quality
```

Then inspect both locales, both required viewport sizes, dark mode, language switching, and console output in the local browser.
