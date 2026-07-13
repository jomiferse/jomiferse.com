# Blog Article Pyramid Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the split blog article hero with a centered title → cover → metadata → description stack and remove visible tag pills without removing tag data.

**Architecture:** Keep the change isolated to `BlogPostLayout.astro` and the focused blog verifier. Preserve the existing `Frontmatter.tags` field and all route-level SEO/structured-data behavior; only the hero markup and its structural contract change.

**Tech Stack:** Astro 6, TypeScript, Tailwind CSS 4, Node.js structural verifier, pnpm.

## Global Constraints

- Keep the back-to-blog link above the article header.
- Preserve one semantic `h1`, the cover `alt`, intrinsic dimensions, eager loading, fetch priority, `time` elements, metadata icons, and author focus treatment.
- Render the hero in the same source and visual order at every breakpoint: title, cover, metadata, description.
- Do not render tag pills, but preserve `frontmatter.tags` and all existing SEO/structured-data consumers.
- Do not change article content, cover assets, archive cards, pagination, article navigation, conversion CTA, structured-data builders, or localization.
- Keep the current navy/coral design tokens and cover frame treatment.

---

### Task 1: Replace the split article hero with the pyramid stack

**Files:**
- Modify: `scripts/verify-blog-redesign.mjs`
- Modify: `src/layouts/BlogPostLayout.astro`

**Interfaces:**
- Consumes: the existing `Frontmatter` interface and `frontmatter.title`, `frontmatter.cover`, `frontmatter.date`, `frontmatter.dateModified`, `frontmatter.readingTime`, `frontmatter.author`, and `frontmatter.description` values.
- Produces: stable `data-blog-article-hero`, `data-blog-article-title`, `data-blog-article-cover`, `data-blog-article-meta`, and `data-blog-article-description` markers for structural verification.
- Preserves: `Frontmatter.tags` for route metadata and `BlogPosting` structured data, although the layout no longer renders the values.

- [ ] **Step 1: Add a failing structural regression check**

Extend the article-layout section of `scripts/verify-blog-redesign.mjs` with an ordered-marker check and a visible-tag guard:

```js
const articleHeroMarkers = [
	"data-blog-article-title",
	"data-blog-article-cover",
	"data-blog-article-meta",
	"data-blog-article-description",
];
const articleHeroPositions = articleHeroMarkers.map((marker) =>
	articleLayout.indexOf(marker),
);

if (articleHeroPositions.some((position) => position === -1)) {
	failures.push("article layout: pyramid hero markers are incomplete");
} else if (
	articleHeroPositions.some(
		(position, index) => index > 0 && position <= articleHeroPositions[index - 1],
	)
) {
	failures.push("article layout: pyramid hero order is incorrect");
}

if (
	articleLayout.includes("frontmatter.tags?.length") ||
	articleLayout.includes('class="tag-pill"')
) {
	failures.push("article layout: visible tag pills must be removed");
}
```

Also add `"data-blog-article-hero"` to the existing required article-layout marker array.

- [ ] **Step 2: Run the focused verifier and confirm the expected failure**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
```

Expected: exit code `1` with failures for missing pyramid hero markers and visible tag pills.

- [ ] **Step 3: Reorder the article hero markup**

In `src/layouts/BlogPostLayout.astro`, replace the current two-column `<header>` with this single-column structure. Retain the existing metadata conditions and localized date formatting inside the indicated metadata container.

```astro
<header
	data-blog-article-hero
	class="section-reveal py-10 md:py-14"
>
	<h1
		data-blog-article-title
		class="mx-auto max-w-5xl text-center text-5xl leading-[0.98] font-black text-[var(--home-navy)] sm:text-6xl md:text-7xl"
	>
		{frontmatter.title}
	</h1>

	<div
		data-blog-article-cover
		class="mx-auto mt-8 max-w-6xl overflow-hidden rounded-[1.35rem] border border-[var(--surface-border)] bg-[radial-gradient(circle_at_20%_10%,color-mix(in_srgb,var(--action)_12%,transparent),transparent_46%),var(--bg-band)] shadow-[var(--shadow-card)] md:mt-10"
	>
		<img
			src={frontmatter.cover.src}
			alt={frontmatter.cover.alt}
			width="1600"
			height="900"
			loading="eager"
			fetchpriority="high"
			class="aspect-[16/9] h-full w-full object-cover"
		/>
	</div>

	<div
		data-blog-article-meta
		class="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm font-bold text-[var(--text-muted)]"
	>
		<span class="inline-flex items-center gap-2">
			<Icon
				name="calendar"
				class="h-4 w-4 text-[var(--action)]"
				aria-hidden="true"
			/>
			<time datetime={frontmatter.date.toISOString()}>
				{
					frontmatter.date.toLocaleDateString(dateLocale, {
						year: "numeric",
						month: "long",
						day: "numeric",
					})
				}
			</time>
		</span>
		{
			wasUpdated ? (
				<time datetime={frontmatter.dateModified?.toISOString()}>
					{locale === "es" ? "Actualizado" : "Updated"}{" "}
					{frontmatter.dateModified?.toLocaleDateString(dateLocale, {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</time>
			) : null
		}
		{
			frontmatter.readingTime ? (
				<span class="inline-flex items-center gap-2">
					<Icon
						name="clock"
						class="h-4 w-4 text-[var(--action)]"
						aria-hidden="true"
					/>
					{frontmatter.readingTime}
				</span>
			) : null
		}
		{
			frontmatter.author ? (
				<a
					href={`/${locale}/about`}
					class="hover:text-[var(--action)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--action)]"
				>
					{frontmatter.author}
				</a>
			) : null
		}
	</div>

	{
		frontmatter.description ? (
			<p
				data-blog-article-description
				class="muted-copy mx-auto mt-5 max-w-3xl text-left text-lg leading-8 sm:text-center"
			>
				{frontmatter.description}
			</p>
		) : null
	}
</header>
```

Delete the visible tags block entirely:

```astro
{
	frontmatter.tags?.length ? (
		<div class="mt-6 flex flex-wrap gap-2">
			{frontmatter.tags.map((tag) => (
				<span class="tag-pill">{tag}</span>
			))}
		</div>
	) : null
}
```

Do not remove `tags?: string[]` from the local `Frontmatter` interface because tags remain part of the content contract and are used outside the layout.

- [ ] **Step 4: Format and run the focused checks**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier --write src/layouts/BlogPostLayout.astro scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: the blog verifier passes and Astro reports `0 errors`, `0 warnings`, and `0 hints`.

- [ ] **Step 5: Verify the design manually**

Use the local site to inspect both:

- `/es/blog/cuanto-cuesta-crear-herramienta-interna-a-medida/`
- `/en/blog/how-much-does-a-custom-internal-tool-cost/`

Check at `390 × 844`, `768 × 1024`, and `1440 × 900` in both light and dark themes:

- Source and visual order is title, cover, metadata, description.
- The back link remains above the hero.
- The long title wraps cleanly and the cover stays 16:9.
- Metadata wraps without horizontal overflow.
- The description block remains readable.
- No topic pills appear.
- The table of contents and article body begin below the unchanged divider.

- [ ] **Step 6: Run the complete validation set**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
git diff --check
```

Expected: all commands exit with code `0`; the production build completes and all localized blog routes prerender.

- [ ] **Step 7: Commit the implementation**

```bash
git add scripts/verify-blog-redesign.mjs src/layouts/BlogPostLayout.astro
git commit -m "refactor(blog): stack article hero content"
```

### Task 2: Tighten the pyramid scale for long mobile titles

**Files:**
- Modify: `scripts/verify-blog-redesign.mjs`
- Modify: `src/layouts/BlogPostLayout.astro`

**Interfaces:**
- Consumes: the existing `data-blog-article-title` and `data-blog-article-cover` markers.
- Produces: a compact desktop cover frame and a fluid mobile title scale without changes to the semantic hero order.
- Preserves: the 16:9 cover, desktop display typography, metadata, description, and all SEO data.

- [ ] **Step 1: Write the failing structural regression check**

Require the cover class to start with `mx-auto mt-8 max-w-4xl` and require the title class to contain the mobile-first fluid size `text-[clamp(2.5rem,11vw,3.5rem)]` plus the desktop `md:text-7xl` size.

- [ ] **Step 2: Run the focused verifier and confirm the expected failure**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
```

Expected: exit code `1` reporting the missing compact cover and mobile title scale.

- [ ] **Step 3: Apply the minimal visual adjustment**

In `src/layouts/BlogPostLayout.astro`, use these class prefixes:

```astro
class="mx-auto max-w-5xl text-center text-[clamp(2.5rem,11vw,3.5rem)] leading-[0.98] font-black text-[var(--home-navy)] sm:text-6xl md:text-7xl"
```

```astro
class="mx-auto mt-8 max-w-4xl overflow-hidden ... md:mt-10"
```

This caps long titles below the prior 3rem mobile baseline while retaining the established desktop hierarchy. It makes the cover 896px wide at large breakpoints while leaving the image ratio unchanged.

- [ ] **Step 4: Verify behavior and format**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier --write src/layouts/BlogPostLayout.astro scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: the focused verifier passes and Astro reports `0 errors`, `0 warnings`, and `0 hints`.

- [ ] **Step 5: Commit the adjustment**

```bash
git add scripts/verify-blog-redesign.mjs src/layouts/BlogPostLayout.astro
git commit -m "style(blog): compact article hero scale"
```
