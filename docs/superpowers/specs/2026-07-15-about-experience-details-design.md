# About experience details and technology grid

## Goal

Improve the experience section on `/about` without making the page excessively
long. Each company must expose the full set of supplied contributions while
keeping three visible by default, and its main technologies must use the same
visual system as the technology card on project detail pages.

## Confirmed content

The bilingual CV data already contains the complete experience currently
published on the former `/experience` page:

- CGI for The Workshop: six contributions in Spanish and six in English.
- EDUCA EDTECH Group: six contributions in Spanish and six in English.

No new claims or experience records are required. The change must render the
existing arrays in full rather than creating additional copy.

## Experience disclosure

Each company entry shows its first three contributions in the existing list.
When more contributions exist, a native `details` element follows the visible
items. Its `summary` is styled as a compact secondary action and displays the
number of hidden contributions: `Ver más (3)` in Spanish and `View more (3)`
in English. When open, the label changes to `Ver menos` / `View less`, and the
remaining contributions appear in the same list style.

Each disclosure is independent. Native `details` provides keyboard operation,
focus behavior and state without adding client-side JavaScript. If an
experience has three or fewer contributions, no disclosure is rendered.

## Reusable technology grid

Create `src/components/common/TechnologyGrid.astro` and move the technology
icon-selection rules currently embedded in `ProjectServiceCard.astro` into it.
The component receives:

- `technologies: string[]`;
- `label: string`.

It renders the label, a zero-padded item count and the existing two-column grid
of compact technology tiles. Each tile keeps the project card's icon, action
colour, border, surface and typography. `ProjectServiceCard.astro` delegates
its technology section to this component, preserving the current layout and
data markers.

`AboutExperience.astro` uses the same component inside a restrained technology
panel beside the contribution list. The surrounding panel follows the project
card surface, border and subtle action-colour background treatment, but it is
not sticky and contains no service CTA. On narrow screens it remains below the
contributions and uses the same two-column tile grid.

## Localized copy

Add the following fields under `about.page.experience` in both translation
files:

- `showMore`: localized label with a `{count}` placeholder;
- `showLess`: localized label shown while the disclosure is expanded.

Existing `stackLabel`, contribution text and role stacks remain the source of
truth.

## Accessibility and behavior

- Preserve semantic company articles and contribution lists.
- Keep a visible focus state on each `summary` action.
- Use the native expanded state rather than a custom ARIA implementation.
- Ensure the closed label is hidden when open and the open label is hidden
  when closed.
- Respect existing light and dark theme variables.
- Do not add horizontal overflow at 390px.

## Verification

Extend `scripts/verify-about-merge.mjs` before implementation so it requires:

- the reusable technology component in both consumers;
- no duplicated technology icon mapping in `ProjectServiceCard.astro`;
- localized `showMore` and `showLess` copy;
- rendering all highlights with three initially visible;
- a native `details`/`summary` disclosure;
- the generated Spanish and English pages to contain all six contributions for
  both companies and the localized disclosure labels.

Run the about verifier in red and green phases, then run the repository tests,
Astro check, lint, formatting, production build and the generated-output about
verifier. Manually inspect `/es/about` and `/en/about` at 390px and 1440px in
light and dark themes, including keyboard opening and closing of each company
disclosure.
