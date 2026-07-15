# Global outer spacing reduction

## Goal

Reduce the website's outer page and section spacing by approximately 50% so pages feel denser and require less scrolling, without compressing the spacing inside content or interactive components.

## Scope

- Halve the main page shell's vertical padding and reduce its horizontal padding while preserving a safe mobile gutter.
- Halve the vertical padding that separates top-level page sections, including page-specific section values and shared full-width sections.
- Apply the same density to localized English and Spanish routes because both use the same layouts and components.
- Keep header, footer, cards, typography, prose rhythm, buttons, forms, navigation, dialogs, and other component-internal spacing unchanged.
- Preserve existing maximum content widths, full-bleed behavior, safe-area handling, focus visibility, and scroll offsets.

## Implementation approach

Use the existing shared spacing points first: the `BaseLayout` page shell, reusable section classes, and existing section-spacing custom properties. Then update explicit top-level section padding in page templates that do not use those shared values. Do not introduce a blanket CSS transform or halve every margin and padding declaration.

On mobile, the horizontal page gutter will retain a practical minimum instead of applying a mathematically exact reduction that would place content too close to the viewport edge. Vertical outer spacing should follow the requested 50% reduction wherever the current layout permits it.

## Acceptance criteria

- Outer whitespace above, below, and between top-level sections is approximately half its current size.
- Internal spacing within cards, text groups, controls, article prose, and navigation is visually unchanged.
- No horizontal overflow occurs at a 390 px viewport.
- The layout remains coherent at 390 px and 1440 px in light and dark modes.
- English and Spanish routes inherit the same spacing behavior.
- Formatting, Astro checks, linting, AI/SEO verification, and the production build pass.

## Validation targets

Visually inspect representative routes for the home page, services, projects, blog index and article, about, contact, privacy/education, a commercial landing page, and the 404 page. Check both localized route families where content length can affect section boundaries.
