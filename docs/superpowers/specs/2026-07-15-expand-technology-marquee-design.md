# Expand the technology marquee

## Goal

Add PHP, Laravel, ChatGPT, Claude, Python, GitHub, and GitLab to the technology marquee shared by the localized home and contact pages. Keep every existing technology in the marquee.

## Scope

- Extend the `technologies` collection in `src/components/common/TechnologyMarquee.astro`.
- Reuse the existing local GitHub icon.
- Add local SVG icons for PHP, Laravel, ChatGPT, Claude, Python, and GitLab under `src/icons/`.
- Keep labels identical in Spanish and English because they are product and technology names.

The change will not alter project-specific technology lists, CV experience stacks, service copy, or page layout.

## Presentation

Each new entry will use the existing marquee item markup, sizing, colors, spacing, animation, focus behavior, and reduced-motion fallback. Brand icons will use the component's current monochrome treatment so the additions remain consistent in light and dark themes.

The new entries will be appended after the current set in this order: PHP, Laravel, ChatGPT, Claude, Python, GitHub, GitLab.

## Accessibility and behavior

Icons remain decorative with `aria-hidden="true"`; the visible technology label provides the accessible name. The duplicated marquee list remains hidden from assistive technology. No new JavaScript or interactive behavior is needed.

## Verification

- Confirm every referenced icon resolves during Astro compilation.
- Run Prettier on the files changed for this task.
- Run `pnpm run check`, `pnpm run lint`, and `pnpm run build`.
- Inspect the localized home and contact routes at desktop and mobile widths when a local browser preview is available.
- Confirm the reduced-motion layout wraps all seventeen technologies without horizontal overflow.
