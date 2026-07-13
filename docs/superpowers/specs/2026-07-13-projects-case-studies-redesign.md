# Projects case studies redesign

## Objective

Redesign the localized project archive and project detail routes so visitors can scan delivered work quickly, understand the business relevance of each project, and move naturally toward a free assessment. The presentation should take structural inspiration from the case-study discovery approach on `consultoriainformatica.net/casos-de-exito` while retaining the site's own commercial visual system.

## Scope

The redesign covers:

- `/es/projects/` and `/en/projects/`.
- Every localized `/[locale]/projects/[project]/` route.
- The reusable project archive card and mobile carousel behavior.
- Localized Projects copy required by the new presentation.
- Source and generated-output verification for the redesigned routes.

It does not redesign or fork the shared header and footer. Both routes continue to use `BaseLayout` and the existing common `Header.astro` and `Footer.astro` components without project-specific variants.

## Visual direction

Projects is a commercial case-study surface, not a gallery. It follows the same visual philosophy as the home and About pages:

- Use `--home-navy` for the main headings.
- Use `--action` for eyebrows, arrows, active indicators, bullets, and commercial calls to action.
- Use restrained surfaces, hairline borders, and limited shadows.
- Keep light mode as the default and preserve the existing dark-mode variables.
- Use the 88rem commercial shell on large screens.
- Avoid the older cyan `--accent*` treatment within the redesigned Projects surfaces.

## Project archive

### Hero

The archive opens with a compact, left-aligned hero. It contains the eyebrow, a direct title, a short outcome-oriented introduction, and a primary link to the project collection. The hero should establish credibility without occupying most of the first viewport.

### Project collection

On desktop widths, projects appear in a three-column grid. All projects remain visible without carousel controls so visitors can compare and scan them quickly.

On mobile widths, the same cards become a horizontal scroll-snap carousel:

- Each card occupies approximately 86% of the available width.
- A visible portion of the next card signals that the row is scrollable.
- The carousel has accessible previous and next buttons.
- A concise position indicator communicates the current slide.
- There is no autoplay, infinite loop, or external carousel dependency.
- Touch scrolling remains native and keyboard users can reach every project link.

Tablet widths use a two-column grid rather than the carousel.

### Compact project card

Each card is a single semantic link to its project detail. It includes:

- A 16:9 image with stable dimensions.
- An optional status label.
- A short context line using role and organization where available.
- The project title.
- A concise summary clamped to a consistent height.
- At most two visible technology labels plus an overflow count when needed.
- A clear localized “View case” action with an arrow.

Cards use smaller padding, typography, image height, and gaps than the current two-column implementation. Hover-image behavior remains available on devices that support hover. Cards do not open dialogs.

## Project detail

### Header and case-study hero

The detail route retains the archive backlink, then presents a compact editorial hero:

- Project status and context above the title.
- Project title and summary on the left.
- Project image on the right at desktop widths and below the title on mobile.
- A short facts row for role, organization, and timeframe when available.

### Case-study narrative

The main column presents only sections supported by project data, in this order:

1. Context.
2. Challenge and constraints.
3. Contribution and technical decisions.
4. Delivered work and practical outcome.
5. Selected highlights.

Missing fields do not leave empty headings or spacing. Existing project data remains the source of truth; this redesign does not invent client metrics or outcomes.

### Sticky project facts

The desktop sidebar contains technologies, related service, and external link when available. It may be sticky but must remain in normal flow on mobile.

### Commercial close

Every detail page ends with a full-width case-study CTA using the same pattern as the home and About pages. The primary action requests a free assessment. A secondary action returns to all projects.

## Content and localization

Public copy is added or updated in both `src/i18n/es.json` and `src/i18n/en.json` with equivalent intent rather than literal translation. Copy remains specific and factual, avoids inflated claims, and frames projects around problems, decisions, and useful delivery.

## Accessibility and interaction

- Archive cards remain normal links with visible focus states.
- Carousel controls have localized accessible names and disabled states at the limits.
- Native horizontal scrolling works without JavaScript.
- JavaScript only updates carousel position and button state; content remains fully available if it fails.
- Motion respects `prefers-reduced-motion`.
- Headings remain hierarchical and each archive card has a project heading.
- Text and action colors meet accessible contrast in light and dark themes.

## Responsive requirements

- Mobile verification target: 390 × 844.
- Desktop verification target: 1440 × 900.
- No horizontal page overflow at either target. Horizontal overflow is allowed only inside the mobile carousel scroller.
- The desktop archive shows three cards per row.
- The mobile archive shows one primary card and a visible preview of the next card.
- The detail hero stacks cleanly on mobile and uses its two-column composition on desktop.

## SEO and routing

Existing localized paths, canonical URLs, alternate paths, breadcrumbs, `CollectionPage`, `CreativeWork`, and `SoftwareApplication` structured data remain intact. The redesign must not change project slugs or remove generated project routes.

## Verification

- Add or extend a source verifier for archive structure, compact card rules, carousel accessibility, detail sections, CTA copy, and shared-layout usage.
- Run `pnpm run format`, `pnpm run check`, `pnpm run lint`, `pnpm run format:check`, and `pnpm run build`.
- Verify all generated Spanish and English project routes.
- Manually inspect archive and one representative detail route in Spanish and English, light and dark themes, at 390 × 844 and 1440 × 900.
- Confirm header and footer markup remain supplied by the same shared components across home, About, archive, and detail pages.
