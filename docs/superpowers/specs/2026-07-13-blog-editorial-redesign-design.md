# Blog editorial redesign

## Objective

Redesign the localized blog archive and article pages so they share the commercial, professional visual language established on the home, About, and project pages. The archive should feel like a curated publication rather than a flat list, while individual articles should combine a strong visual opening with a comfortable long-form reading experience.

Every published article must have a dedicated editorial cover. Spanish and English translations share one image asset but keep localized alternative text.

## Current inventory

The blog contains 27 Spanish articles and 27 English articles arranged as 27 translated pairs through `translationSlug`. The content schema currently has no cover field. Existing images under `public/images/blog/` are diagrams, screenshots, and inline article illustrations; they remain part of their articles and are not treated as the new cover system.

## Selected visual direction

The approved cover direction is **technical editorial**:

- Warm paper-like backgrounds.
- Fine structural grids.
- Navy ink and coral action accents from the site palette.
- Topic-specific diagrams, systems, objects, and visual metaphors.
- Restrained depth and texture rather than glossy SaaS mockups or generic 3D forms.
- No embedded title, paragraph, logo, code listing, or language-specific text.

Each cover must communicate the concrete article subject. Repeating one generic composition with different colors is not acceptable.

## Cover asset system

Generate 27 new landscape covers, one for each translated article pair. Store them in `public/images/blog/covers/` with descriptive neutral filenames and convert them to AVIF at 1600 × 900 pixels.

The Spanish and English versions of one article use the same `src`. Each version provides an equivalent localized `alt` description. Covers are generated as raster editorial artwork; existing SVG diagrams and screenshots remain unchanged inside article bodies.

The generated covers must:

- Use a consistent palette, grid density, border treatment, and illustration weight.
- Preserve a safe central composition that survives responsive `object-fit: cover` cropping.
- Avoid small details that disappear on compact cards.
- Contain no text or recognizable third-party trademarks.
- Remain legible in light and dark page themes because the asset itself is theme-independent.

## Content model

Add a required `cover` object to the blog content schema:

```ts
cover: z.object({
	src: z.string(),
	alt: z.string(),
});
```

Every Spanish and English frontmatter entry receives:

```yaml
cover:
  src: "/images/blog/covers/backend-legacy-modernization.avif"
  alt: "Localized description of the editorial cover"
```

The field is required rather than optional. Missing cover metadata or a missing physical asset is a build/verification failure; cards and article heroes do not silently render a placeholder.

## Blog archive

The selected archive composition is **featured story plus compact archive**.

### Header

Use a concise editorial hero aligned with the wider 88rem commercial shell. It includes the existing localized eyebrow, a more intentional display heading, and the short supporting introduction. The header remains content-first and does not introduce a decorative SaaS hero panel.

### Featured story

On the first archive page, the primary featured article appears in a horizontal editorial feature:

- Cover on the left and content on the right at desktop widths.
- Localized featured eyebrow, title, summary, publication metadata, and a clear read action.
- One stacked card on mobile, with the image before the copy.
- Stable 16:9 image dimensions and no layout shift.

If more than one article is marked `featured`, use the newest featured article as the primary feature and include the remaining published articles in the archive grid. Paginated archive pages do not repeat the primary feature.

### Article cards

Update `BlogPostCard.astro` to use the same disciplined image-first hierarchy as project cards while remaining visually smaller:

- 16:9 cover at the top.
- Date and reading time in a compact metadata line.
- Title with a stable line clamp.
- Short description with a stable line clamp.
- At most two visible tags.
- Subtle action-colored hover treatment and accessible focus state.

Use three columns on large screens, two on tablet, and one on mobile. Keep standard page scrolling and existing pagination; do not hide articles inside a carousel.

The first archive page shows the featured story followed by the remaining archive. Later pages show the archive grid only.

## Individual article page

The selected article composition is **split editorial hero**.

### Article hero

At desktop widths, use two balanced columns:

- Left: back link, topic metadata, publication date, reading time, localized title, and description.
- Right: required 16:9 cover.

At mobile widths, stack the text and cover without horizontal overflow. The title remains the only `h1`.

Pass the cover to `BaseLayout` as `image` and `imageAlt` so Open Graph and Twitter metadata use the article-specific artwork instead of the portfolio fallback.

### Reading layout

Keep the article body in a comfortable, narrow reading column. Generate a table of contents from rendered `h2` headings:

- A quiet sticky rail beside the article on large screens.
- A native collapsible `details` block before the body on smaller screens.
- Links use heading slugs already generated by Astro; no client JavaScript is required.
- Do not show an empty table of contents when an article has no `h2` headings.

Extract the navigation into a focused `BlogArticleToc.astro` component. `BlogPostLayout.astro` remains responsible for the article hero, reading grid, existing inline content slot, shared conversion CTA, and article footer.

Existing inline images, diagrams, links, and Markdown content remain unchanged.

### Conversion and footer

Retain the shared `ConversionCta` at the end of each article with the existing localized service and contact destinations. Keep the back-to-blog footer after the CTA.

## Localization

Keep current Spanish and English archive/article copy unless a small label is required for the new table of contents or featured-story treatment. New labels must be added in parallel with equivalent intent.

Alternative text is localized per frontmatter entry. Image filenames stay neutral and shared between translations.

## Accessibility

- Every cover image has meaningful localized alternative text.
- Cover images declare stable width and height.
- Linked cards have one clear accessible name and visible keyboard focus.
- Table-of-contents links use semantic navigation with a localized label.
- Mobile disclosure uses native `details` and `summary`.
- Heading order remains valid and the page contains one `h1`.
- Animation is limited to existing restrained hover/reveal behavior and respects reduced motion.
- Text never depends on the cover artwork for meaning.

## Responsive behavior

Verify at 390 × 844 and 1440 × 900:

- Archive feature stacks cleanly on mobile.
- Card images retain 16:9 dimensions.
- Grid changes from one to two to three columns without clipped copy.
- Article hero stacks without reordering title semantics.
- Desktop table of contents remains within the viewport and does not overlap the header.
- Mobile table of contents is collapsible and keyboard-accessible.
- No route creates horizontal overflow.

## Component boundaries

- `BlogPostCard.astro`: compact archive card only.
- `BlogFeaturedPost.astro`: primary archive feature only.
- `BlogArticleToc.astro`: desktop and mobile heading navigation only.
- `BlogPostLayout.astro`: article page composition and reading layout.
- Archive route files: data selection, pagination, localized paths, and composition of archive components.
- Content frontmatter: cover source and localized alternative text.

Do not create a generic configurable card system or expose arbitrary layout classes. The blog components have focused roles and use the site's shared color and button primitives.

## Verification

Add a focused blog redesign verifier that checks:

- The required cover schema.
- All 54 published frontmatter entries contain `cover.src` and `cover.alt`.
- There are exactly 27 translated cover paths and every ES/EN pair shares one path.
- Every referenced cover exists under `public/images/blog/covers/` and has AVIF dimensions of 1600 × 900.
- Archive routes use `BlogFeaturedPost` and image-enabled `BlogPostCard` appropriately.
- Article routes pass headings and cover metadata to `BlogPostLayout` and `BaseLayout`.
- The table of contents uses semantic navigation and native mobile disclosure.
- The home-specific CTA remains unchanged and article pages retain `ConversionCta`.

Run formatting, Astro checks, lint, existing blog/content checks, the shared CTA verifier, the focused redesign verifier, and a production build. Inspect representative Spanish and English archive and article routes in both themes at mobile and desktop sizes.

## Out of scope

- Rewriting article body copy.
- Replacing existing inline diagrams or screenshots.
- Adding search, tag-filtering JavaScript, a carousel, comments, reactions, or social share widgets.
- Changing blog URLs, pagination rules, or translation relationships.
- Redesigning non-blog pages beyond compatibility with the shared CTA.
