# Header redesign — design specification

**Date:** 2026-07-14

**Status:** Approved

**Scope:** Global desktop and mobile header

## Objective

Redesign the global header around one commercial priority: taking visitors to the free initial assessment. The result must use the same restrained editorial language as the home page and remain consistent across every localized route.

## Design direction

Use an **editorial conversion header**. The header should feel professional and personal without becoming a generic corporate navigation bar. Navy remains the dominant interface colour; red is reserved for the primary CTA, active signals and small interactive accents.

The redesign must:

- use the same wide visual alignment as the commercial pages;
- keep one unmistakable primary CTA;
- make service discovery easier by placing Services early in the navigation;
- reduce its height after the user starts scrolling;
- provide a purpose-built full-screen mobile menu;
- preserve language switching, light/dark themes and active-route feedback.

## Desktop composition

The header inner container will use the commercial page width, with a maximum width of approximately `88rem`.

From left to right:

1. **Identity:** `JMF` monogram, full name and the supporting label “Full-stack developer” in the current locale.
2. **Primary navigation:** Home, Services, Projects, About and Blog. Services moves ahead of Projects to reflect the commercial priority.
3. **Utilities and action:** language selector, theme control and a red “Free initial assessment” CTA linking to the localized contact page.

The initial header height should be around `80px`. After a short scroll it should compact to approximately `64px`. The compact state gains a solid surface, a restrained border and a very light shadow. Transitions must not cause layout shifts.

The active navigation entry uses stronger navy text and a small red underline. Hover and keyboard-focus states use the existing commercial palette rather than the global cyan accent.

## Tablet behaviour

The intermediate layout must not reproduce the current gap where desktop navigation disappears before a complete mobile replacement becomes available.

As width decreases:

1. remove the supporting identity label;
2. reduce non-essential spacing;
3. switch the complete navigation to the mobile pattern when the desktop composition no longer fits.

There must always be one complete navigation mechanism at every viewport width.

## Mobile header

The visible mobile bar is compact:

- `JMF` and a shortened personal-name treatment on the left;
- language selector and menu trigger on the right;
- theme control moves into the open menu to keep the bar uncluttered.

It remains sticky and becomes slightly smaller and more opaque after scrolling.

## Full-screen mobile menu

Opening the menu reveals a full-viewport editorial navigation layer rather than a card-based side drawer.

The layer contains:

1. a top area with identity, role and close control;
2. large numbered navigation links separated by fine dividers;
3. a clear red active-route signal;
4. a lower utility area for availability, theme and language;
5. a red “Free initial assessment” CTA anchored at the bottom.

On short screens, the navigation body may scroll while the top controls and primary CTA remain reachable. No WhatsApp shortcut is added to the header: the free assessment remains the sole primary conversion action.

## Interaction and accessibility

- Keep the header sticky and derive the compact state from a short scroll threshold.
- Respect `prefers-reduced-motion` for every transition.
- Maintain minimum 44px interactive targets and visible keyboard focus.
- Synchronize menu state with `aria-expanded`, `aria-controls` and appropriate dialog/navigation semantics.
- On open, move focus into the menu and contain keyboard focus within it.
- Close from the close control, `Escape` or the dismissible background where applicable.
- Restore focus to the menu trigger on close.
- Lock background scrolling while the menu is open.
- Determine active state for both index and nested dynamic routes, including service, project and blog detail pages.
- Preserve correct localized URLs and both light and dark themes.

## Visual constraints

- Use `var(--home-navy)` for primary navigation and identity.
- Use `var(--action)` for the main CTA, active underline and small conversion signals.
- Use the existing surface and border variables so dark mode remains native.
- Do not introduce cyan commercial accents, ornamental cards or excessive shadows.
- The header and footer remain globally shared components across all pages.

## Validation

Verify at minimum:

- Spanish and English routes;
- 390px mobile, representative tablet widths and 1440px desktop;
- initial and compact scroll states;
- light and dark themes;
- active states on index and nested routes;
- menu keyboard flow, focus restoration, scroll locking and `Escape` handling;
- absence of horizontal overflow and header content collisions;
- `pnpm run check`, `pnpm run lint`, `pnpm run format:check` and `pnpm run build`.

## Out of scope

- Redesigning the footer.
- Changing contact-page fields or submission behaviour.
- Adding WhatsApp, social links or additional conversion actions to the header.
- Changing the wider site colour system or typography scale.
