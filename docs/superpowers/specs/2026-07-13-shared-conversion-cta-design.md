# Shared conversion CTA design

## Objective

Replace duplicated final calls to action across interior pages with one reusable Astro component. Every migrated page will use the same approved visual treatment; only localized copy, destinations, and the optional secondary action will vary.

The shared CTA should make commercial pages feel like parts of one site, prevent small styling differences from accumulating, and give future pages an obvious default closing section.

## Scope

Create `src/components/common/ConversionCta.astro` and use it for the final CTA on:

- About.
- Education.
- Blog index, paginated blog archives, and individual blog posts.
- Services index.
- Individual service pages.
- Generic localized landing pages.
- Individual project pages.

The home page keeps its existing bespoke final CTA because it belongs to the home composition. The change does not affect hero actions, mid-page service actions, contact forms, exit-intent dialogs, header or footer actions, or project sidebar cards.

## Component contract

`ConversionCta.astro` receives content rather than translation keys so it remains independent of the i18n structure:

- `eyebrow`: localized short introduction.
- `title`: localized heading.
- `text`: localized supporting copy.
- `primary`: an object containing `label`, `href`, and an optional `opensContactModal` flag used by service pages to open the existing contact dialog.
- `secondary`: an optional object containing `label`, `href`, and an optional `external` flag.
- `headingId`: an optional unique heading ID when a page needs to reference the section with `aria-labelledby`; the component generates a safe default otherwise.

The primary action always uses the approved action treatment and an `arrow-right` icon. A secondary action uses the quieter secondary button treatment. When the secondary action is external, it opens in a new tab, receives the repository's safe external-link relationship values, and uses `move-up-right` instead of the standard arrow.

No slots or arbitrary presentation classes are exposed. This keeps the component flexible in content but closed in design.

## Visual design

The component adopts the final project-page CTA as the canonical design:

- Full available content width.
- Rounded warm surface with an action-tinted border.
- White-to-soft-coral background in light mode.
- Elevated dark surface with a restrained coral glow in dark mode.
- Centered eyebrow, large navy/theme-aware heading, supporting copy, and actions.
- The existing `button-action` style for the primary action.
- The existing `button-secondary` style for the optional secondary action.
- Consistent spacing and typography at every route.

The current `.project-detail-cta` styles move to a semantic `.conversion-cta` class. Page-specific CTA wrappers such as `.about-cta` are removed when no longer used.

## Responsive behavior

At mobile sizes, actions stack and each button occupies the available width. From the small breakpoint upward, actions sit side by side and return to intrinsic width. Heading size scales from a readable mobile size to the existing large desktop presentation.

The component must never create horizontal overflow, and long translated button labels must wrap without clipping.

## Accessibility and interaction

- The section is labelled by its `h2` through `aria-labelledby`.
- Icons are decorative and use `aria-hidden="true"`.
- Links retain semantic anchor behavior and existing focus-visible styles.
- External actions receive `target="_blank"` and `rel="noopener noreferrer nofollow"`.
- Service-page primary actions retain `data-contact-modal-open`, so the existing dialog behavior is unchanged.
- The component adds no JavaScript and respects the site's reduced-motion behavior.

## Localization and content migration

Existing localized page copy remains the source of truth. Pages that currently lack an eyebrow receive equivalent Spanish and English CTA eyebrow copy in their existing translation section. Copy intent is preserved rather than rewritten as part of this refactor.

Button destinations remain page-specific. Migration changes presentation, not navigation intent or conversion tracking parameters.

## Verification

Add a focused verifier that requires:

- The shared component and its typed content/action contract.
- The canonical CTA marker and shared style.
- Primary and optional secondary action behavior.
- External-link safety and contact-dialog support.
- Use of the component on every in-scope page.
- Absence of the previous project and About CTA style classes.
- Continued use of the bespoke home CTA.

Run formatting, Astro checks, lint, the focused verifier, existing project/About/home verifiers, and the production build. Manually inspect representative Spanish and English pages at mobile and desktop widths in light and dark themes, including an individual service page whose primary CTA opens the contact dialog and whose secondary WhatsApp action is external.
