# 404 Editorial Redesign

## Goal

Bring the not-found page into the visual and commercial system established by the home page while keeping the error state calm, useful, and unmistakable. The page should help a lost visitor recover without turning the error into an aggressive sales pitch.

## Direction

Use a restrained editorial composition instead of the current stack of dark cards. A large `404` acts as the visual signal, paired with a concise explanation and one clear primary action. Supporting destinations appear below as divided rows, following the site's preference for hierarchy, spacing, and editorial structure over decorative surfaces.

The page must use existing theme tokens: `var(--home-navy)` for the main heading, `var(--action)` for the eyebrow and small interaction cues, and the existing surface and border variables for the lower navigation band. It must not introduce the global cyan accent or a new visual language.

## Page Structure

1. A two-column hero on desktop:
   - Oversized `404` signal in the narrower column.
   - Eyebrow, direct title, short explanation, primary home CTA, and secondary contact link in the wider column.
2. A lower editorial navigation band with three useful destinations:
   - Services
   - Projects
   - Blog
3. Each destination is a semantic link row with a short description and directional icon. Rows use dividers and interaction states rather than card shadows.

On mobile, the hero becomes one column, the `404` remains prominent without forcing horizontal overflow, actions stack cleanly, and navigation rows stay comfortably tappable.

## Content

Replace the current generic card labels with concise recovery-oriented copy in Spanish and English. Both locales must express equivalent intent rather than literal translations.

The primary action is always the localized home page. Contact remains secondary. The lower destinations help visitors resume browsing without competing with the primary CTA.

## Technical Scope

- Redesign `src/components/common/NotFoundPage.astro` using semantic Astro markup and scoped CSS.
- Update the `notFound.page` content in `src/i18n/es.json` and `src/i18n/en.json` to support the revised actions and destination rows.
- Preserve `src/pages/404.astro`, its HTTP 404 response, `noindex`, metadata, and localized home alternate paths unless implementation reveals a necessary compatibility adjustment.
- Reuse existing button, icon, reveal, focus, layout, and theme conventions.
- Add no client-side JavaScript and no new dependencies.

## Accessibility and Responsive Requirements

- Keep one visible `h1` and a logical heading structure.
- Use descriptive link text and decorative icons with `aria-hidden`.
- Preserve visible keyboard focus through the site's global focus styles.
- Maintain sufficient contrast in light and dark themes.
- Verify at 390px and 1440px with no horizontal overflow.
- Respect existing reduced-motion behavior.

## Validation

- Run formatting, Astro checks, linting, and the production build.
- Inspect the generated 404 page in Spanish, mobile and desktop, light and dark modes.
- Confirm English content through the shared component or an equivalent localized preview.
- Confirm the response configuration remains a real 404 and the page remains `noindex,follow`.

## Out of Scope

- Changing global header or footer behavior.
- Adding search, route suggestions based on the missing URL, analytics events, or client-side recovery logic.
- Redesigning other commercial pages or global theme tokens.
