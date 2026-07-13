# Blog article pyramid hero

## Objective

Replace the split desktop article hero with a centered editorial stack that follows the same reading order at every breakpoint. The new composition should feel calmer, make the cover a deliberate visual moment, and remove decorative topic pills that do not help readers navigate.

## Selected composition

Keep the existing back-to-blog link above the hero. Inside the article header, render content in this order:

1. Article title.
2. Cover image.
3. Publication metadata.
4. Article description.

Do not render the article tags as visible pills in the hero.

This order is shared by mobile, tablet, and desktop. Desktop no longer uses two columns. The result is a single-column editorial pyramid rather than a text-and-image split.

## Visual hierarchy

- Center the `h1` and constrain it to a readable display width so long titles wrap intentionally.
- Keep the title as the only `h1` on the page.
- Place the 16:9 cover below the title in a centered container wider than the text blocks, using the current border, radius, background, and shadow treatment.
- Center the metadata row below the cover. Preserve publication date, optional modified date, reading time, and author link.
- Center the description below the metadata and constrain it to a comfortable text measure.
- Use existing navy, coral, surface, and muted-text tokens. Do not introduce new colors, cards, gradients, or decorative elements.

The intended width progression is broad cover, medium title and metadata, and narrower description. This creates the requested pyramid effect without reducing legibility.

## Tags and SEO

Remove only the visible tag pills from `BlogPostLayout.astro`. Preserve each post's `tags` frontmatter because it is still used as editorial metadata and passed to the existing `BlogPosting` structured data and page metadata.

The current pills are plain text spans, not links to topic archives, so they provide no meaningful internal-navigation benefit. Google does not use the `meta keywords` tag for indexing or ranking. A future topic taxonomy could make tags useful by linking them to indexable category pages, but that is outside this redesign.

## Responsive behavior

- Mobile keeps the same semantic order as desktop: title, cover, metadata, description.
- The title scales through the existing responsive typography sizes.
- The cover remains 16:9 and uses the available width without horizontal overflow.
- Metadata wraps naturally into multiple centered rows on narrow screens.
- The description remains left-readable within its centered block; it should not become a long centered paragraph on mobile.
- The reading area, table of contents, conversion CTA, and article body remain unchanged.

## Accessibility and semantics

- Preserve the semantic `header`, `h1`, `time`, author link, image `alt`, intrinsic dimensions, eager loading, and high fetch priority.
- Decorative metadata icons remain hidden from assistive technology.
- The author link keeps its current visible keyboard focus treatment.
- Removing tag pills must not remove tags from content data or structured metadata.

## Component scope

Only `src/layouts/BlogPostLayout.astro` needs visual markup changes. Extend `scripts/verify-blog-redesign.mjs` to assert the stacked hero marker/order and the absence of visible `tag-pill` rendering in the article layout.

Do not change article content, cover assets, archive cards, pagination, navigation, structured-data builders, or localization.

## Verification

Verify representative Spanish and English article routes at mobile and desktop widths:

- The title appears before the cover in source and visual order.
- The cover appears before metadata and description.
- No tag pills are visible.
- Long titles wrap cleanly.
- Metadata wraps without overflow.
- The image preserves its aspect ratio.
- The transition into the article navigation and body remains visually balanced.
- Light and dark themes preserve contrast.

Run the focused blog verifier, Astro checks, lint, formatting checks, and the production build before completion.
