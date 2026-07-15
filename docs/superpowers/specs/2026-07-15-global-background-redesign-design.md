# Global Background Redesign

**Date:** 2026-07-15

**Status:** Approved for planning

## Objective

Replace the current global grid, glow, and diagonal-light treatment with a restrained technical-editorial background that works across the entire website in light and dark mode. The result should add structure without becoming a decorative focal point or introducing “vibe slop.”

## Scope

The redesign applies to every public page through the global `body` background. Existing page and section surfaces continue to use `--surface`, `--surface-strong`, and `--bg-band`, so the new treatment remains visible only where the layout intentionally exposes the page background.

The implementation is limited to global background tokens and styles in `src/styles/global.css`. No page-level layout, component, typography, content, or CTA changes are included.

## Visual Direction

The selected direction is a pared-back version of “technical editorial paper.”

### Light mode

- Use a near-flat mineral paper colour with a subtle grey warmth, avoiding a yellow or cream cast.
- Draw low-contrast horizontal rules that establish a calm editorial rhythm.
- Add one thin terracotta registration guide aligned with the left edge of the main content area on desktop.
- Keep existing navy headings, terracotta actions, and surface colours as the primary visual hierarchy.

### Dark mode

- Use a deep graphite base rather than pure black.
- Draw horizontal rules with a very low-contrast cool light tone.
- Use the dark-mode action colour for the registration guide at reduced opacity.
- Preserve the current readable relationship between text, surfaces, borders, and the global background.

## Anti-Slop Constraints

The global background must not include:

- blurred blobs or decorative halos;
- gradient meshes or ambient colour washes;
- glassmorphism or translucent decorative panels;
- artificial grain, noise textures, or image assets;
- animated background movement or pointer-following effects;
- a complete square grid that evokes a generic developer-site treatment;
- ornamental marks without an alignment or rhythm function.

The background should be noticeable as a system when looking at the full page, but should recede during normal reading.

## CSS Architecture

Define semantic background tokens in `:root` and override them in `.dark`. The tokens cover:

- the base paper colour;
- horizontal rule colour;
- registration guide colour;
- editorial rule spacing.

Apply the base and horizontal rules directly to `body`. Use one pseudo-element for the desktop registration guide so its position can follow the global content container independently of the repeating background.

Remove the current radial gradients, cyan wash, square grid, diagonal overlay, blend modes, and their redundant light/dark declarations. The result remains CSS-only and adds no runtime logic, network request, or asset.

## Responsive Behaviour

- At desktop widths, align the registration guide to the left edge of the main content container rather than to an arbitrary viewport percentage.
- At mobile widths, remove the registration guide entirely. The horizontal rules remain at reduced contrast and must not cause horizontal overflow.
- The rule rhythm remains stable across viewport sizes so the background does not visually jump at breakpoints.

## Accessibility and Performance

- Background lines and the registration guide must not reduce text contrast or create false interactive affordances.
- The treatment remains behind opaque and semi-opaque content surfaces and accepts pointer events nowhere.
- No motion is introduced, so reduced-motion handling is unnecessary.
- CSS gradients replace the current, more complex gradient stack and require no downloaded asset.

## Verification

Run the repository validation commands required for CSS changes:

- `pnpm run format`
- `pnpm run check`
- `pnpm run lint`
- `pnpm run format:check`
- `pnpm run verify:ai-seo`
- `pnpm run build`

Visually inspect at minimum:

- `/en` and `/es`;
- one service detail page;
- the projects index or a project detail page;
- one blog article;
- light and dark mode;
- 1440 px desktop and 390 px mobile widths;
- the transition between exposed page background, `--surface`, and `--bg-band` sections;
- absence of horizontal overflow.

## Success Criteria

The redesign is complete when the background is consistent across all routes, light and dark modes feel intentionally related, the desktop registration guide aligns with the shared content shell, mobile remains visually quiet, existing content hierarchy remains intact, and the result contains none of the excluded decorative treatments.
