# Blog visual alignment redesign

## Objective

Bring the localized blog archive and article pages into the same restrained commercial design system already established by Home, About, and Projects. The redesign must remove the current visual mismatch in page width, cards, buttons, inline links, metadata, pagination, and article navigation while preserving the existing editorial covers, content, URLs, localization, and conversion CTA architecture.

The blog should feel like another part of the same professional consultancy site, not a separate publication template.

## Current problems

The current implementation has five visible inconsistencies:

- `BaseLayout` leaves blog pages on the default `69rem` shell while Home, About, and Projects opt into `88rem`.
- `BlogPostCard.astro` and `BlogFeaturedPost.astro` use the generic `dark-card` treatment instead of the more deliberate visual hierarchy of `ProjectArchiveCard.astro`.
- Blog links, return actions, pagination, metadata, and article typography mix accent treatments that do not consistently use the navy/coral commercial palette.
- `BlogArticleToc.astro` is a static list inside a generic card. It has no active-section state, progress feedback, or visual connection to `ProjectServiceCard.astro`.
- The reading grid is artificially centered inside `max-w-6xl`, which wastes available space on large displays and makes the sidebar feel detached from the article.

## Selected approach

Adapt Blog directly to the visual system used by Projects without introducing a generic universal card abstraction. Blog components remain focused on blog content, but reuse the same palette, border radii, shadows, hover behavior, action rows, icon treatment, and responsive shell width.

This approach is preferred over a broad component refactor because it improves consistency without risking regressions in existing project pages. It is also preferred over an independent editorial style because the commercial site should communicate one coherent identity.

## Page shell and spacing

Both the archive and article pages opt into the `88rem` shell used by Home, About, and Projects. Add stable page marker classes rather than tying width to individual child components:

- `.blog-page` for archive and pagination routes.
- `.blog-article-page` for individual articles.

Update the global shell selectors so both markers set `main.site-shell` to `88rem`. Retain the existing responsive outer padding from `BaseLayout`: `1rem` on small screens and `1.5rem` from the medium breakpoint.

The wider shell must not make article paragraphs excessively long. The outer composition uses the full shell, while the reading column remains between approximately `45rem` and `48rem`. The extra width belongs to the navigation rail and inter-column spacing.

Vertical spacing should match Projects and About:

- Archive hero: compact top padding and `3rem` to `4rem` bottom spacing.
- Archive sections: `3rem` to `6rem` between major blocks depending on breakpoint.
- Article hero: `2.5rem` to `3.5rem` vertical padding.
- Reading area: top border and `3.5rem` to `4.5rem` vertical padding, matching the project narrative boundary.

## Archive hero

Replace the generic blog heading treatment with the hierarchy used on Projects:

- Coral eyebrow using `var(--action)`.
- Navy `h1` using `var(--home-navy)`, stronger `0.98` line height, and the same responsive scale as other interior heroes.
- Intro copy aligned in a narrower supporting column at desktop widths.
- A coral action button that scrolls to the article archive, using the shared arrow icon and `button-action` treatment.

The hero remains content-first. Do not introduce another enclosing card, illustration, gradient panel, or decorative SaaS pattern.

## Featured article

Keep the horizontal featured composition on the first archive page, but restyle it as a large project-style case card:

- `1.15rem` to `1.35rem` border radius, shared surface border, restrained shadow, and coral hover border.
- Stable 16:9 image with subtle scale on hover.
- Coral eyebrow and navy title.
- Metadata uses small bold text and optional icons for date and reading time.
- The read action becomes a separated bottom action row with the same structure as `ProjectArchiveCard`: top border, strong label, arrow icon, and coral hover state.
- The complete card remains one semantic link with a clear focus-visible outline.

At desktop widths, image and copy use two balanced columns. On mobile, image precedes content and the action row remains at the bottom.

## Article cards

Redesign `BlogPostCard.astro` to follow `ProjectArchiveCard.astro` closely while preserving blog-specific metadata:

- Root `article` plus one full-card anchor.
- Rounded surface, controlled border, restrained shadow, `-translate-y-1` hover movement, and coral hover border.
- Stable 16:9 image with the same hover scaling behavior as project cards.
- Date and reading time in one compact metadata row, with small calendar and clock icons when both are available.
- Navy title with a two-line clamp.
- Muted description with a three-line clamp.
- At most two tags, styled quietly so they do not compete with the action.
- Bottom action row separated by a border, with localized “Read article” copy and an arrow icon.
- Equal card heights within a grid row.

Keep one column on mobile, two on small and medium screens, and three on large screens. Do not add a carousel: blog browsing benefits from scanning and pagination, unlike a deliberately curated project carousel.

## Buttons, links, and pagination

All blog actions use existing shared primitives:

- Primary commercial actions use `button-action`.
- Secondary actions use `button-secondary`.
- Return links use a compact inline action with an `arrow-left` icon, strong navy text, coral hover state, and an accessible focus outline.
- Card actions use the project-style bordered footer row rather than a pill button.
- Pagination controls use the same border, radius, font weight, hover translation, coral active state, and focus-visible outline as other site actions.

The current page in pagination must expose `aria-current="page"`. Disabled previous/next controls must not look interactive and must remain semantically unavailable.

Article-body links should stop using the older blue-like accent treatment. Use the site’s action color with a restrained underline, clear hover contrast, and visible keyboard focus. External-link processing remains unchanged.

## Article hero

Keep the split hero but align it with the project detail page:

- Compact inline return link above the hero instead of a pill-shaped secondary button.
- Left column: coral metadata/eyebrow, navy `h1`, muted description, and a restrained metadata strip.
- Right column: 16:9 cover inside the same framed media treatment as a project hero.
- Responsive heading scale and spacing match the project detail hero.
- The title remains the only `h1`.

The hero uses the full `88rem` shell. On mobile, it stacks naturally without horizontal overflow; the text remains before the image.

## Reading layout

Use a two-column desktop composition inspired by the project detail page:

- Main reading column: `minmax(0, 1fr)` but capped at a comfortable measure of approximately `45rem` to `48rem`.
- Contextual navigation rail: approximately `19rem`.
- Gap: approximately `3rem` to `4rem` depending on viewport.
- A full-width top border separates the hero from the reading area.

Place the article content first in source order and the navigation second. Use CSS grid placement to show the navigation on the left at large widths if that remains visually strongest, without compromising logical reading order for assistive technology.

The prose system should use the same navy headings, coral markers and links, shared surfaces, radii, and shadows. Preserve readable line length and existing support for code, tables, callouts, figures, and inline diagrams.

## Active article navigation

Redesign `BlogArticleToc.astro` as contextual navigation inspired by the service section of `ProjectServiceCard.astro`.

### Desktop

- Sticky rail positioned below the global header.
- Decorative coral-tinted radial surface, shared border, radius, and shadow.
- Header row with a coral icon container and localized “In this article” eyebrow.
- Optional thin progress indicator showing approximate reading progress through indexed `h2` sections.
- One link for each rendered `h2` heading.
- Default links use muted text; hover and keyboard focus use coral.
- The currently visible section receives `aria-current="location"`, navy text, a coral-tinted background, and a visible coral leading indicator.
- Long labels wrap cleanly without changing rail width.

### Scroll tracking

Add a small progressive-enhancement script owned by the navigation component:

- Use `IntersectionObserver` to observe indexed `h2` elements.
- Use a top root margin that accounts for the sticky header and a negative bottom margin so the active item changes near the upper reading region, not at the bottom of the viewport.
- When several headings intersect, select the nearest visible heading to the top reading threshold.
- Before the first heading intersects, activate the first item.
- Near the end of the document, activate the final indexed heading.
- Update `aria-current`, an active data attribute, and the mobile current-section label.
- Recalculate observation after `astro:page-load` so the component remains compatible with future Astro view transitions.
- Do not change the URL with `history.replaceState` while scrolling; URL hashes change only when the user follows an index link.
- If JavaScript is disabled, all links remain visible and functional as a normal table of contents.

### Mobile and tablet

- Use native `details` and `summary` before the article body.
- The summary shows the navigation icon, localized label, and the current section title when enhanced by JavaScript.
- Opening the disclosure reveals the same semantic links and active treatment.
- Following a link closes the disclosure after navigation.
- The component must remain keyboard-operable without custom key handling.

The active state is limited to the article navigation. The global header navigation does not react to article sections.

## Related service treatment

The navigation rail borrows its surface, icon block, coral emphasis, and sticky behavior from `ProjectServiceCard.astro`, but it does not duplicate technologies or external-link sections.

Where article metadata already maps naturally to one of the seven typed service slugs, a related-service action may be added at the bottom of the rail in a later content-focused iteration. It is not part of this visual-alignment implementation because the content model currently has no explicit article-to-service field and heuristic matching would be unreliable.

The existing shared article `ConversionCta` remains the primary conversion mechanism.

## Localization

Add equivalent Spanish and English labels for:

- Archive scroll action.
- Card “Read article” action.
- Active-navigation current-section prefix when needed by assistive text.

Reuse existing localized labels where they already express the correct intent. Do not rewrite article bodies or descriptions as part of this redesign.

## Accessibility

- Preserve one `h1` per route and a valid heading hierarchy.
- Full-card links must have visible `focus-visible` treatment and must not contain nested interactive controls.
- Active table-of-contents links use `aria-current="location"`.
- Pagination uses `aria-current="page"` and semantically unavailable disabled states.
- Decorative icons use `aria-hidden="true"`.
- `details` and `summary` remain native on mobile.
- Scroll tracking is progressive enhancement; content and navigation work without JavaScript.
- Respect `prefers-reduced-motion` for hover translations and smooth scrolling.
- Ensure light and dark theme contrast for default, hover, focus, and active states.

## Component boundaries

- `BlogPostCard.astro`: compact project-style archive card and card-level action row.
- `BlogFeaturedPost.astro`: first-page featured composition and featured action row.
- `BlogArticleToc.astro`: semantic desktop/mobile navigation, scroll tracking, and active state.
- `BlogPagination.astro`: archive pagination appearance and semantics.
- `BlogPostLayout.astro`: article page marker, hero, reading grid, CTA, and footer composition.
- Blog archive route files: page marker, hero composition, grid, labels, and data flow.
- `global.css`: shared shell opt-in and blog page-level tokens/selectors only.
- `prose.css`: article content typography, link, focus, and component surfaces.
- Localized JSON files: equivalent action/navigation labels.
- `verify-blog-redesign.mjs`: structural assertions for the aligned design and navigation behavior.

Do not extract a generic card or sidebar framework in this iteration. The existing Project components remain unchanged.

## Responsive acceptance criteria

Verify representative Spanish and English routes at `390 × 844`, `768 × 1024`, `1440 × 900`, and a wide desktop viewport of at least `1728px`:

- Archive and article pages use the same perceived outer width as Home, About, and Projects.
- No horizontal overflow occurs.
- Featured content and article heroes stack in a logical order on narrow screens.
- Cards remain equal-height within each grid row and action rows align.
- The article body keeps a comfortable line length on wide screens.
- The desktop navigation remains sticky without overlapping the header or footer.
- Active navigation follows the visible `h2` section in both languages.
- Mobile navigation shows the current section and remains usable with JavaScript disabled.
- Light and dark themes preserve clear contrast and the same visual hierarchy.

## Verification strategy

Extend the focused blog verifier to assert:

- Archive and article marker classes opt into the `88rem` shell.
- Blog cards contain image, content, and separated action regions with localized labels.
- Blog card and featured actions use arrow icons and accessible full-card links.
- Article layout uses the new return-link treatment and wider reading grid.
- The table of contents contains semantic navigation, native mobile disclosure, `IntersectionObserver`, and `aria-current="location"` behavior.
- Pagination exposes `aria-current="page"` and disabled controls correctly.
- The existing 54-entry/27-cover guarantees remain intact.
- Shared conversion CTAs remain present and unchanged in purpose.

Run:

- `pnpm run format`
- `pnpm run check`
- `pnpm run lint`
- `pnpm run format:check`
- `node scripts/verify-blog-redesign.mjs`
- `pnpm run verify:conversion-cta`
- `pnpm run verify:project-pages`
- `pnpm run build`

Manually inspect archive, paginated archive, and individual article routes in Spanish and English, light and dark themes, at all acceptance viewports. Test the active navigation by scrolling, following hash links, using the keyboard, and disabling JavaScript.

## Out of scope

- Changing article URLs, translation pairings, pagination size, or cover artwork.
- Rewriting article copy or adding new content sections.
- Adding blog search, tag filters, carousels, comments, reactions, or social sharing.
- Making the global header respond to article scroll position.
- Refactoring Project cards or `ProjectServiceCard.astro`.
- Inferring related services from tags without an explicit content field.
