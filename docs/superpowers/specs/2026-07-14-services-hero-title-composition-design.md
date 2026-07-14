# Services Hero Title Composition

## Objective

Remove the stepped appearance of the `/services` hero title while preserving its current bilingual copy, the compact vertical rhythm, and the two-column commercial layout.

## Approved direction

Use the `/about` hero as the composition reference instead of shortening the services headline.

- Keep `page.title` and `page.titleAccent` unchanged in Spanish and English.
- Render the accent phrase as an explicit block so the colour change also becomes an intentional line break.
- Remove the restrictive `15ch` title width and let the heading use the available left column, with a broad but bounded maximum width.
- Restore the former desktop scale: `clamp(3rem, 6.25vw, 6rem)`.
- Retain the current mobile cap so long localized text remains proportional at 390px.
- Give the copy column enough space for balanced lines without shrinking or displacing the signal card.

## Scope

The change is limited to the services hub hero in `src/pages/[locale]/services.astro` and its visual regression contract. It does not alter service copy, section density, pricing cards, detail pages, CTA hierarchy, or the signal card.

## Responsive behaviour

At 1440px, the title should form a small number of deliberate lines and keep the signal card fully visible. At 390px, the hero remains single-column, the title stays within the viewport, and CTAs retain their existing full-width treatment. Spanish and English must have no horizontal overflow.

## Validation

- Extend the service redesign verifier to protect the restored title scale, explicit accent block, and removal of the `15ch` restriction.
- Run the focused verifier red-green before implementation.
- Run formatting, Astro check, lint, service verification, and production build.
- Inspect `/es/services/` and `/en/services/` at 1440px and 390px in light and dark themes.
