# Privacy Responsive Editorial Redesign

**Date:** 2026-07-16
**Status:** Approved design, pending implementation plan

## Goal

Refine `/[locale]/privacy` into a calmer editorial document that works equally well at 390 px and 1440 px. Preserve the existing legal content and functionality while fixing the broken mobile section indicator, reducing vertical density, and aligning the page more closely with the home page's restrained commercial language.

This specification refines the visual and responsive requirements of the privacy page defined in `2026-07-15-privacy-education-redesign-design.md`. It does not reopen the approved legal content or the education page.

## Root Cause

The shared `SectionToc` component updates its mobile current-section label with the complete `textContent` of the active section. On the privacy page, this inserts the section number, heading, paragraphs, facts, and links into a compact status area. At 390 px the label becomes a 126 px block instead of a one-line section title.

The page has no horizontal overflow at 390 px, but its current mobile hierarchy is unnecessarily tall: the H1 starts at 48 px, the four-item summary becomes a single column below 496 px, and the navigation uses a visually heavy card before a long legal document.

## Approved Direction

Use a restrained editorial-document composition. The design keeps the home page's hierarchy and colour system without turning a legal page into a commercial landing page:

- `var(--home-navy)` for the page title and document headings.
- `var(--action)` for the eyebrow, section numbers, links, active navigation state, icons, and primary cookie action.
- Existing surface and border variables for separators and subtle grouping.
- Dividers, readable spacing, and typographic hierarchy instead of decorative card stacks.
- No global cyan accent, new gradients, ornamental animation, or sales CTA.

## Page Structure

### Hero

Keep the current eyebrow, plain-language H1, introduction, last-updated date, and cookie-settings action. Make the composition more compact on both breakpoints:

- Desktop uses a wide editorial heading block with the action aligned to the content rather than visually detached.
- Mobile uses a smaller fluid H1, tighter but readable spacing, and a full-width primary action.
- The action remains the sole primary CTA and continues to open the existing cookie-preferences dialog.

### Privacy Summary

Keep the four facts: controller, privacy contact, optional analytics, and no advertising/profiling.

- Desktop presents them as one divided horizontal strip.
- Mobile uses a stable 2 × 2 grid at 390 px; it must not collapse to four full-width rows.
- Values may wrap naturally without clipping. Long email addresses must use safe wrapping and must not cause horizontal overflow.
- The strip remains a labelled region and does not become four decorative cards.

### Section Navigation

Desktop uses a lightweight sticky index in the left column. It should read as document navigation through typography, dividers, and active-state cues rather than a raised card. The index remains height-bounded when the viewport is short.

Mobile uses a compact native disclosure above the document:

- Its closed state displays the navigation label and only the active section heading.
- Opening it reveals all nine section links with comfortable touch targets.
- Selecting a link updates `aria-current="location"`, closes the disclosure, and scrolls to the section with the sticky header accounted for.
- Without JavaScript, the disclosure and every anchor remain usable.

Fix the shared component at the source. The active label must be derived from the corresponding navigation item's text or the section heading, never from the section's complete `textContent`. Blog article consumers of `SectionToc` must retain their current behavior.

### Legal Document

Preserve all nine existing sections, their order, text, links, facts, and cookie controls. Present them as one continuous editorial document with:

- A controlled reading width.
- Clear numbered signals and H2 hierarchy.
- Consistent separators between sections.
- Provider entries as editorial rows.
- Existing rights actions with one-column stacking on mobile.
- Scroll margins that keep anchored headings visible below the header.

Do not introduce accordions for the legal content. Hiding sections would make direct lookup and browser search less useful.

### Storage Inventory

Keep the semantic table at wider breakpoints. On mobile, retain an equivalent stacked presentation but tighten its visual treatment:

- Each storage entry becomes a compact labelled record.
- A small action-colour edge or signal may distinguish records without turning them into promotional cards.
- The storage key must wrap safely, including `jomiferse.cookie-consent.v1` and `_ga_<container-id>`.
- Table semantics, captions, row headers, and labels must remain available to assistive technology.

## Component Boundaries

- Modify `src/pages/[locale]/privacy.astro` for page-specific structure and scoped styles.
- Modify `src/components/common/SectionToc.astro` only where required to fix current-section derivation and refine the shared navigation presentation.
- Keep localized public copy in `src/i18n/es.json` and `src/i18n/en.json`; no copy changes are required unless implementation exposes a genuinely unclear label.
- Keep cookie-dialog behavior, privacy metadata, structured data, `noindex`, provider links, and storage data unchanged.
- Add no dependency and no new client-side component.

## Accessibility and Interaction

- Preserve one H1 and sequential H2/H3 structure.
- Retain `aria-current="location"` for the active section.
- Keep the mobile disclosure keyboard operable through native `details` and `summary` behavior.
- Give standalone controls and navigation rows comfortable touch targets, with 44 px as the design target.
- Preserve visible focus states using `var(--action)`.
- Do not use colour alone to communicate the active section.
- Ensure focused and anchored content is not hidden behind the sticky header.
- Respect the existing reduced-motion preference.

## Responsive and Theme Requirements

- Required viewport checks: 390 × 844 and 1440 × 900.
- No horizontal overflow at either size.
- Verify both Spanish and English; English labels may be longer and must not break the summary or navigation.
- Preserve the same hierarchy in light and dark modes using existing variables. Do not hard-code a light-only background or text colour.
- Keep the desktop prose measure readable even though the global shell is 88 rem wide.

## Validation

Before completion:

1. Add or update focused automated coverage for `SectionToc` so the mobile current label contains only the active navigation text.
2. Run the repository's privacy redesign verifier if it remains present and applicable.
3. Run `pnpm run format`, followed by `pnpm run format:check`, `pnpm run lint`, `pnpm run test`, `pnpm run check`, `pnpm run verify:ai-seo`, and `pnpm run build`.
4. Inspect `/es/privacy` and `/en/privacy` at 390 × 844 and 1440 × 900.
5. Verify light and dark modes, language switching, keyboard focus, section tracking, hash navigation, mobile disclosure closing, cookie-settings opening, storage-record wrapping, and absence of horizontal overflow.

## Out of Scope

- Rewriting or legally certifying the privacy policy.
- Changing providers, analytics configuration, consent categories, storage keys, or retention periods.
- Redesigning the cookie-preferences dialog, global header, footer, blog pages, or education page.
- Adding a legal notice, terms page, search, accordion-based legal content, or new analytics events.
