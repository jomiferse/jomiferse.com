# Compact density for services pages

## Objective

Reduce the excessive vertical space in the localized services hub and service detail template while preserving the commercial hierarchy, readable rhythm, accessibility, and visual language established by the home page.

The change is a density refinement, not a new redesign. Content, pricing, route generation, conversion behavior, structured data, and service positioning remain unchanged.

## Observed baseline

The issues reproduce consistently at a 1440 × 900 viewport:

- The services hub hero uses 100.8 px of padding above and below its content and its `h1` renders at 90 px.
- Most hub and detail sections use 112 px of padding at both the top and bottom. Adjacent sections therefore create up to 224 px of empty space between their visible content.
- Pricing cards are 714 px high. Their descriptions force a 96 px minimum height even when the copy needs only two lines.
- Pricing actions are visually translated 24 px down, leaving approximately 9 px between the button and card edge despite a declared 32 px card padding.
- Related-service actions use the same pattern with a 19.2 px downward translation, leaving approximately 6 px below the button.
- Open FAQ answers render at approximately 14 px, which is too small for comfortable reading in these wide layouts.
- Service-area introductions and engagement-model cards use large minimum heights that add space without clarifying hierarchy.

These measurements identify shared spacing rules and artificial minimum heights as the root cause. The solution must correct those rules rather than add page-specific negative margins.

## Approved direction

Use a compact shared density scale across every localized `/{locale}/services/` hub and `/{locale}/services/{slug}/` detail page.

The intended result is approximately 40% less non-content vertical space on desktop. The pages should still feel editorial and professional rather than compressed. Mobile spacing remains comfortable enough for touch interaction and scanning.

## Spacing system

Define page-level custom properties for repeated service spacing values and let components consume them where practical:

- Section padding: `clamp(3.25rem, 5vw, 4.5rem)`.
- Gap after section headings: `2.25rem` on desktop and `1.75rem` on mobile.
- Card padding: `clamp(1.35rem, 2vw, 1.75rem)` unless an existing component already uses a smaller value.
- Internal list gaps: `0.75rem` unless a component needs a documented semantic separation.

The shared values apply to the hub areas, engagement models, proof, process, directory, FAQ, detail outcome, pricing, scope, process, related proof, related services, and detail FAQ sections. Full-width background bands remain full width; only their vertical padding changes.

## Services hub

### Hero

- Align the hero start with the spacing used by About and Projects using `clamp(1.5rem, 3vw, 2.5rem)` top padding and `clamp(3.5rem, 5vw, 4.5rem)` bottom padding.
- Reduce the hub `h1` to `clamp(2.75rem, 5.1vw, 4.8rem)` while keeping balanced wrapping.
- Reduce the hero bottom padding independently so the next section begins sooner without crowding the CTA and trust panel.
- Keep the existing two-column composition, CTA priority, colors, and content.

### Sections and area cards

- Apply the compact shared section padding instead of the current 7rem maximum.
- Reduce heading-to-content margins from around 3rem–3.25rem to `2.25rem`.
- Replace the service-area introduction `min-height: 10.5rem` with content-driven sizing. Matching cards may still stretch within the CSS grid, but their internal blocks must not reserve unused space.
- Reduce large internal top margins while preserving the icon, title, service links, price, and CTA hierarchy.
- Keep the two-column desktop grid and stacked mobile layout.

### Engagement models and directory

- Remove the 22rem minimum height from engagement-model items and let the tallest real content determine the grid row height.
- Increase directory service descriptions from 0.75rem to at least 0.875rem with a readable line height.
- Keep native `details` elements, focus styles, and minimum 44 px interactive targets.

## Service detail pages

### Hero and sections

- Use the same compact hero start as the services hub.
- Keep detail titles slightly smaller than the hub title and preserve responsive wrapping for long localized names.
- Replace the repeated 7rem section maximum with the shared compact spacing.
- Reduce heading-to-content gaps consistently across outcome, pricing, scope, process, proof, related services, and FAQ.

### Pricing cards

- Remove the fixed 6rem minimum height from pricing descriptions on desktop.
- Keep the three cards equal in height through grid stretching, allowing the tallest real content to determine the row height.
- Reduce oversized gaps around the price, deliverables, and boundary without combining semantically separate groups.
- Remove the `translateY` treatment from CTA buttons.
- Give every CTA a normal top margin and preserve the card's bottom padding, producing visually balanced space above and below the button.
- Keep the featured project card distinction, three-level comparison, button styles, pricing selection data, and mobile stacking.

### Related-service cards

- Remove the downward button translation.
- Use a normal top margin before the action and balanced card padding.
- Keep equal card heights in a row through flex or grid behavior, not artificial bottom overflow.
- Preserve icons, three-line description clamping, and existing secondary-button treatment.

### FAQ and disclosures

- Increase open FAQ answers to `1rem` with a `1.7` line height.
- Ensure summary questions render at no less than 1rem where the inherited size is smaller.
- Render descriptive copy inside the compact service directory at `0.875rem` with at least a `1.55` line height.
- Preserve native disclosure behavior, visible focus rings, plus-to-close rotation, semantic headings, and keyboard operation.

## Responsive and theme behavior

- Validate the hub and one representative detail route at 1440 × 900 and 390 × 844.
- Confirm Spanish and English long titles do not overflow.
- Keep all interactive controls at least 44 px high.
- Ensure the compact spacing does not create overlapping content when text wraps on mobile.
- Validate light and dark themes using existing variables only.
- Maintain zero horizontal overflow.

## Testing and acceptance criteria

The implementation is accepted when:

- The services hub `h1` is visibly aligned with the scale used by the other commercial pages and no longer dominates the first viewport.
- Desktop service sections use roughly 64–72 px of vertical padding instead of 112 px.
- Pricing and related-service buttons have balanced bottom spacing and no transform-based positioning.
- Pricing cards are content-driven and materially shorter for concise offerings.
- FAQ answers and directory descriptions render at 16 px and 14 px respectively or larger.
- The hub and detail pages remain readable and free of horizontal overflow at 1440 px and 390 px.
- Dark mode, language switching, pricing-to-contact selection, keyboard focus, and native disclosures continue to work.
- `pnpm run format:check`, `pnpm run check`, `pnpm run lint`, `pnpm run verify:service-redesign`, `pnpm run verify:ai-seo`, and `pnpm run build` pass.

## Out of scope

- Rewriting service content or prices.
- Changing the four service areas or three pricing models.
- Removing sections or changing their order.
- Replacing cards with a new editorial layout.
- Changing contact behavior, structured data, routes, or internal-link strategy.
