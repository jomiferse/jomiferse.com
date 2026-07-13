# Blog Visual Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the localized blog archive and article pages with the 88rem Home/About/Projects design system, including project-style cards and an active contextual article navigation.

**Architecture:** Keep blog components focused instead of extracting a generic card framework. Archive routes compose project-inspired blog cards, `BlogPostLayout.astro` owns the wide article shell and reading grid, and `BlogArticleToc.astro` progressively enhances semantic anchor navigation with `IntersectionObserver` while remaining usable without JavaScript.

**Tech Stack:** Astro 7, TypeScript 5.9, Tailwind CSS 4, Astro Icon, localized JSON content, Node 24 verification scripts.

## Global Constraints

- Work directly on `main`; do not create a worktree unless the user explicitly requests one.
- Use Node `>=24.0.0` and `pnpm` with `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"` when required.
- Preserve all blog URLs, pagination behavior, 27 shared AVIF covers, 54 localized entries, article bodies, and translation relationships.
- Preserve the shared `ConversionCta`; do not infer related services from tags or add a new article-to-service content field.
- Do not modify `ProjectArchiveCard.astro` or `ProjectServiceCard.astro`; copy their established visual language into focused blog components.
- Add localized public copy in parallel to `src/i18n/es.json` and `src/i18n/en.json` with equivalent intent.
- The active scroll state applies only to the article table of contents, never to the global header.
- All scroll tracking is progressive enhancement: anchors and the mobile native disclosure must work without JavaScript.
- Preserve one `h1`, semantic heading order, visible keyboard focus, light/dark contrast, and reduced-motion behavior.
- Use `apply_patch` for hand edits and keep commits focused with Conventional Commit messages.

---

## File map

**Modified production files**

- `src/styles/global.css`: opt blog routes into the 88rem shell and provide page-level blog selectors only.
- `src/styles/prose.css`: align article links, headings, lists, callouts, and focus states with navy/coral tokens.
- `src/i18n/es.json`: Spanish archive scroll and current-section labels.
- `src/i18n/en.json`: equivalent English labels.
- `src/pages/[locale]/blog/index.astro`: wide archive marker, project-style hero, archive anchor, and card action props.
- `src/pages/[locale]/blog/page/[page].astro`: same shell/hero/card contract for paginated routes.
- `src/components/cards/BlogPostCard.astro`: compact project-style article card.
- `src/components/cards/BlogFeaturedPost.astro`: project-style featured article.
- `src/components/common/BlogPagination.astro`: icons, action styling, current/disabled semantics.
- `src/layouts/BlogPostLayout.astro`: wide article marker, project-style hero, reading grid, and return actions.
- `src/components/common/BlogArticleToc.astro`: related-service-inspired visual treatment and active scroll tracking.
- `scripts/verify-blog-redesign.mjs`: structural regression checks for the aligned design.

**Modified documentation**

- `docs/superpowers/specs/2026-07-13-blog-visual-alignment-design.md`: resolve the source-order/mobile-disclosure wording so navigation precedes the article body consistently.

No new runtime dependency or content schema field is required.

---

### Task 1: Lock the wide-shell and localization contract

**Files:**

- Modify: `scripts/verify-blog-redesign.mjs:111-191`
- Modify: `src/styles/global.css:208-237`
- Modify: `src/i18n/es.json:778-821`
- Modify: `src/i18n/en.json:778-821`
- Modify: `src/pages/[locale]/blog/index.astro:43-111`
- Modify: `src/pages/[locale]/blog/page/[page].astro:68-126`

**Interfaces:**

- Consumes: existing `BaseLayout` shell and `getTranslations(locale).blog` objects.
- Produces: `.blog-page` archive marker, `blog.page.browseArticles: string`, and `blog.post.tocCurrent: string` for later tasks.

- [ ] **Step 1: Add failing wide-shell and localization assertions**

Append these reads and assertions before the final `if (failures.length > 0)` block in `scripts/verify-blog-redesign.mjs`:

```js
const globalStyles = await readFile(
	join(root, "src", "styles", "global.css"),
	"utf8",
);
const spanishTranslations = await readFile(
	join(root, "src", "i18n", "es.json"),
	"utf8",
);
const englishTranslations = await readFile(
	join(root, "src", "i18n", "en.json"),
	"utf8",
);

for (const marker of [
	"body:has(.blog-page) main.site-shell",
	"body:has(.blog-article-page) main.site-shell",
]) {
	if (!globalStyles.includes(marker)) failures.push(`shell: missing ${marker}`);
}

for (const [locale, source, expected] of [
	["es", spanishTranslations, ['"browseArticles": "Ver artículos"', '"tocCurrent": "Sección actual"']],
	["en", englishTranslations, ['"browseArticles": "Browse articles"', '"tocCurrent": "Current section"']],
]) {
	for (const marker of expected) {
		if (!source.includes(marker)) failures.push(`${locale} translations: missing ${marker}`);
	}
}

if (!archive.includes('class="blog-page"')) {
	failures.push("archive: missing blog-page marker");
}
if (!paginated.includes('class="blog-page"')) {
	failures.push("pagination: missing blog-page marker");
}
```

- [ ] **Step 2: Run the focused verifier and confirm the contract fails**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
```

Expected: exit code `1` with failures for both shell selectors, both localized labels, and the two route markers.

- [ ] **Step 3: Opt archive and article markers into the 88rem shell**

Add after the existing Projects shell rule in `src/styles/global.css`:

```css
body:has(.blog-page) main.site-shell,
body:has(.blog-article-page) main.site-shell {
	max-width: 88rem;
}

.blog-page .eyebrow,
.blog-article-page .eyebrow {
	color: var(--action);
}

.blog-page h1,
.blog-page h2,
.blog-article-page h1,
.blog-article-page h2,
.blog-article-page h3 {
	color: var(--home-navy);
}
```

- [ ] **Step 4: Add equivalent localized labels**

Add to `blog.page` and `blog.post` in each JSON file:

In `src/i18n/es.json` add:

```json
"browseArticles": "Ver artículos",
"tocCurrent": "Sección actual"
```

In `src/i18n/en.json` add:

```json
"browseArticles": "Browse articles",
"tocCurrent": "Current section"
```

Place `browseArticles` immediately after `readArticle`, and `tocCurrent` immediately after `toc`, preserving valid JSON commas.

- [ ] **Step 5: Add the archive marker and project-style hero contract to both route files**

Import `Icon` in both archive route files:

```astro
import { Icon } from "astro-icon/components";
```

Wrap all route content inside `<div class="blog-page">...</div>` and replace each archive hero with:

```astro
<section
	class="section-reveal grid gap-8 pt-5 pb-12 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)] md:items-end md:pt-8 md:pb-16"
>
	<div>
		<p class="eyebrow text-[var(--action)]">{page.eyebrow}</p>
		<h1
			class="mt-4 max-w-5xl text-5xl leading-[0.98] font-black text-[var(--home-navy)] sm:text-6xl md:text-7xl"
		>
			{page.title}{" "}{page.titleAccent}
		</h1>
	</div>
	<div>
		<p class="muted-copy text-lg leading-8">{page.intro}</p>
		<a href="#blog-archive" class="button-action mt-6">
			{page.browseArticles}
			<Icon name="arrow-right" class="h-4 w-4 rotate-90" aria-hidden="true" />
		</a>
	</div>
</section>
```

Add `id="blog-archive"` to the latest-post section on page one and paginated pages. Do not add the ID to the featured section, because the button promises the article archive.

- [ ] **Step 6: Re-run the focused verifier**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
```

Expected: the new shell/localization assertions pass; existing checks still pass.

- [ ] **Step 7: Format, validate JSON/Astro, and commit**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier --write src/styles/global.css src/i18n/es.json src/i18n/en.json 'src/pages/[locale]/blog/index.astro' 'src/pages/[locale]/blog/page/[page].astro' scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
git add src/styles/global.css src/i18n/es.json src/i18n/en.json 'src/pages/[locale]/blog/index.astro' 'src/pages/[locale]/blog/page/[page].astro' scripts/verify-blog-redesign.mjs
git commit -m "refactor(blog): align archive shell and hero"
```

Expected: Astro reports `0 errors`, and the commit contains only shell, hero, translation, and verifier changes.

---

### Task 2: Rebuild blog cards with the Projects visual language

**Files:**

- Modify: `scripts/verify-blog-redesign.mjs:119-145`
- Modify: `src/components/cards/BlogPostCard.astro:1-65`
- Modify: `src/components/cards/BlogFeaturedPost.astro:1-68`
- Modify: `src/pages/[locale]/blog/index.astro:63-99`
- Modify: `src/pages/[locale]/blog/page/[page].astro:88-113`

**Interfaces:**

- Consumes: `blog.page.readArticle`, existing cover/date/reading-time props, and icons `calendar`, `clock`, `arrow-right`.
- Produces: `BlogPostCard` prop `readLabel: string`, `data-blog-card`, `data-blog-card-action`, and a project-style featured action row.

- [ ] **Step 1: Tighten card structure assertions before changing components**

Replace the current card/featured marker loops in `scripts/verify-blog-redesign.mjs` with:

```js
for (const marker of [
	"data-blog-card",
	"data-blog-card-action",
	"aspect-[16/9]",
	"cover.src",
	"cover.alt",
	"line-clamp-2",
	"line-clamp-3",
	'Icon name="calendar"',
	'Icon name="arrow-right"',
	"readLabel",
]) {
	if (!card.includes(marker)) failures.push(`card: missing ${marker}`);
}

for (const marker of [
	"data-blog-featured",
	"data-blog-featured-action",
	'Icon name="calendar"',
	'Icon name="arrow-right"',
	"cover.src",
	"readLabel",
]) {
	if (!featured.includes(marker)) failures.push(`featured: missing ${marker}`);
}

for (const [name, source] of [
	["archive", archive],
	["pagination", paginated],
]) {
	if (!source.includes("readLabel={page.readArticle}")) {
		failures.push(`${name}: cards are missing localized readLabel`);
	}
}
```

- [ ] **Step 2: Run the verifier and confirm card assertions fail**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
```

Expected: exit code `1` listing missing project-style card/action markers and missing `readLabel` props.

- [ ] **Step 3: Replace `BlogPostCard.astro` with the project-style card**

Use this complete component contract and structure:

```astro
---
import { Icon } from "astro-icon/components";

interface Props {
	href: string;
	title: string;
	description: string;
	dateLabel: string;
	readLabel: string;
	tags?: string[];
	readingTime?: string;
	cover: { src: string; alt: string };
}

const {
	href,
	title,
	description,
	dateLabel,
	readLabel,
	tags = [],
	readingTime,
	cover,
} = Astro.props as Props;
const cleanTags = tags.filter((tag) => tag !== "featured").slice(0, 2);
---

<article data-blog-card class="group h-full">
	<a
		href={href}
		class="flex h-full flex-col overflow-hidden rounded-[1.15rem] border border-[var(--surface-border)] bg-[var(--surface)] shadow-[0_12px_35px_rgba(20,35,52,0.05)] transition duration-300 motion-safe:hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--action)_42%,var(--surface-border))] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--action)]"
	>
		<div class="aspect-[16/9] overflow-hidden bg-[var(--bg-band)]">
			<img
				src={cover.src}
				alt={cover.alt}
				width="1600"
				height="900"
				loading="lazy"
				class="h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.025]"
			/>
		</div>

		<div class="flex flex-1 flex-col p-4 sm:p-5">
			<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-[var(--text-muted)]">
				<span class="inline-flex items-center gap-1.5">
					<Icon name="calendar" class="h-3.5 w-3.5 text-[var(--action)]" aria-hidden="true" />
					<time>{dateLabel}</time>
				</span>
				{readingTime ? (
					<span class="inline-flex items-center gap-1.5">
						<Icon name="clock" class="h-3.5 w-3.5 text-[var(--action)]" aria-hidden="true" />
						{readingTime}
					</span>
				) : null}
			</div>

			<h2 class="mt-4 line-clamp-2 text-xl leading-tight font-black text-[var(--home-navy)]">
				{title}
			</h2>
			<p class="muted-copy mt-3 line-clamp-3 text-sm leading-6">{description}</p>

			{cleanTags.length ? (
				<div class="mt-4 flex flex-wrap gap-2">
					{cleanTags.map((tag) => <span class="tag-pill">{tag}</span>)}
				</div>
			) : null}

			<span
				data-blog-card-action
				class="mt-auto inline-flex items-center gap-2 border-t border-[var(--surface-border)] pt-4 text-sm font-black text-[var(--text)] group-hover:text-[var(--action)]"
			>
				{readLabel}
				<Icon name="arrow-right" class="h-4 w-4" aria-hidden="true" />
			</span>
		</div>
	</a>
</article>
```

- [ ] **Step 4: Restyle `BlogFeaturedPost.astro` without turning the action into a pill**

Import `Icon` and retain the existing props. Replace the linked article structure with:

```astro
<article data-blog-featured class="group">
	<a
		href={href}
		class="grid overflow-hidden rounded-[1.35rem] border border-[var(--surface-border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition duration-300 motion-safe:hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--action)_42%,var(--surface-border))] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--action)] lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)]"
	>
		<div class="overflow-hidden border-b border-[var(--surface-border)] lg:border-r lg:border-b-0">
			<img src={cover.src} alt={cover.alt} width="1600" height="900" loading="eager" fetchpriority="high" class="aspect-[16/9] h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.025]" />
		</div>
		<div class="flex min-w-0 flex-col p-6 md:p-8 lg:p-10">
			<p class="eyebrow text-[var(--action)]">{featuredLabel}</p>
			<div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-[var(--text-muted)]">
				<span class="inline-flex items-center gap-2"><Icon name="calendar" class="h-4 w-4 text-[var(--action)]" aria-hidden="true" /><time>{dateLabel}</time></span>
				{readingTime ? <span class="inline-flex items-center gap-2"><Icon name="clock" class="h-4 w-4 text-[var(--action)]" aria-hidden="true" />{readingTime}</span> : null}
			</div>
			<h2 class="mt-4 text-3xl leading-tight font-black text-[var(--home-navy)] md:text-4xl">{title}</h2>
			<p class="muted-copy mt-4 line-clamp-3 leading-7">{description}</p>
			<span data-blog-featured-action class="mt-auto inline-flex items-center gap-2 border-t border-[var(--surface-border)] pt-6 text-sm font-black text-[var(--text)] group-hover:text-[var(--action)]">
				{readLabel}<Icon name="arrow-right" class="h-4 w-4" aria-hidden="true" />
			</span>
		</div>
	</a>
</article>
```

- [ ] **Step 5: Pass the localized action to every compact card**

Add this prop to every `BlogPostCard` call in both route files:

```astro
readLabel={page.readArticle}
```

Keep the archive grid at `grid gap-5 sm:grid-cols-2 lg:grid-cols-3`; the component’s full-height anchor supplies row alignment.

- [ ] **Step 6: Verify, format, check, and commit**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier --write src/components/cards/BlogPostCard.astro src/components/cards/BlogFeaturedPost.astro 'src/pages/[locale]/blog/index.astro' 'src/pages/[locale]/blog/page/[page].astro' scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
git add src/components/cards/BlogPostCard.astro src/components/cards/BlogFeaturedPost.astro 'src/pages/[locale]/blog/index.astro' 'src/pages/[locale]/blog/page/[page].astro' scripts/verify-blog-redesign.mjs
git commit -m "refactor(blog): align article cards with projects"
```

Expected: verifier passes, Astro reports `0 errors`, and both languages receive the action label from JSON rather than hardcoded text.

---

### Task 3: Align pagination controls and semantics

**Files:**

- Modify: `scripts/verify-blog-redesign.mjs:111-191`
- Modify: `src/components/common/BlogPagination.astro:1-91`

**Interfaces:**

- Consumes: existing `locale`, `currentPage`, `totalPages`, and localized pagination labels.
- Produces: `data-blog-pagination`, icon-based previous/next actions, `aria-current="page"`, and non-interactive disabled spans.

- [ ] **Step 1: Add failing pagination assertions**

Read the component and add marker checks:

```js
const blogPagination = await readFile(
	join(root, "src", "components", "common", "BlogPagination.astro"),
	"utf8",
);

for (const marker of [
	"data-blog-pagination",
	'aria-current="page"',
	'aria-disabled="true"',
	'Icon name="arrow-left"',
	'Icon name="arrow-right"',
	"var(--action)",
]) {
	if (!blogPagination.includes(marker)) {
		failures.push(`pagination component: missing ${marker}`);
	}
}
```

- [ ] **Step 2: Run the verifier and confirm icon/marker failures**

Run the focused verifier. Expected: it reports missing `data-blog-pagination` and arrow icons while retaining the existing `aria-current` and disabled assertions.

- [ ] **Step 3: Restyle pagination using shared action behavior**

Import `Icon` and make these exact structural changes:

```astro
<nav
	data-blog-pagination
	class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--surface-border)] pt-7 sm:flex-row"
	aria-label={labels.ariaLabel}
>
```

Use this linked previous action and mirror it for next with `arrow-right` after the label:

```astro
<a href={getBlogPagePath(locale, previousPage)} class="button-secondary w-full sm:w-auto">
	<Icon name="arrow-left" class="h-4 w-4" aria-hidden="true" />
	{labels.previous}
</a>
```

Use the same content inside disabled spans, keeping `pointer-events-none`, `opacity-45`, and `aria-disabled="true"`. Restyle numbered pages with action tokens:

```astro
class="flex size-11 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-sm font-bold text-[var(--text-muted)] transition motion-safe:hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--action)_42%,var(--surface-border))] hover:text-[var(--action)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--action)]"
```

Use this current-page treatment:

```astro
class="flex size-11 items-center justify-center rounded-full border border-[var(--action)] bg-[color-mix(in_srgb,var(--action)_12%,var(--surface))] text-sm font-black text-[var(--action)]"
```

- [ ] **Step 4: Verify, format, check, and commit**

Run the focused verifier, Prettier on the component and verifier, then `pnpm run check`. Commit:

```bash
git add src/components/common/BlogPagination.astro scripts/verify-blog-redesign.mjs
git commit -m "refactor(blog): align pagination controls"
```

Expected: pagination assertions pass and disabled controls remain spans rather than focusable anchors.

---

### Task 4: Recompose the article hero and reading grid

**Files:**

- Modify: `scripts/verify-blog-redesign.mjs:146-183`
- Modify: `src/layouts/BlogPostLayout.astro:1-170`
- Modify: `src/styles/prose.css:1-365`

**Interfaces:**

- Consumes: `postCopy.toc`, `postCopy.tocCurrent`, existing frontmatter, headings, shared CTA, icons `arrow-left`, `calendar`, and `clock`.
- Produces: `.blog-article-page`, project-style return/hero treatments, a 19rem contextual rail plus readable body, and action-colored prose links.

- [ ] **Step 1: Replace obsolete layout marker assertions**

Replace the article-layout marker list in the verifier with:

```js
for (const marker of [
	"BlogArticleToc",
	'class="blog-article-page"',
	"frontmatter.cover.src",
	"frontmatter.cover.alt",
	'Icon name="arrow-left"',
	"lg:grid-cols-[19rem_minmax(0,48rem)]",
	"currentLabel={postCopy.tocCurrent}",
	"ConversionCta",
]) {
	if (!articleLayout.includes(marker)) {
		failures.push(`article layout: missing ${marker}`);
	}
}
```

Read `src/styles/prose.css` and assert these tokens:

```js
const proseStyles = await readFile(
	join(root, "src", "styles", "prose.css"),
	"utf8",
);
for (const marker of ["var(--home-navy)", "var(--action)", ":focus-visible"]) {
	if (!proseStyles.includes(marker)) failures.push(`prose: missing ${marker}`);
}
```

- [ ] **Step 2: Run the verifier and confirm the article layout fails**

Expected: failures for `.blog-article-page`, return icon, new grid, current-label prop, and prose action/focus tokens.

- [ ] **Step 3: Add project-style article composition**

Import `Icon` at the top of `BlogPostLayout.astro` and wrap the entire article:

```astro
<article class="blog-article-page">
```

Replace the top navigation with:

```astro
<a
	href={blogPath}
	class="inline-flex items-center gap-2 text-sm font-black text-[var(--text)] hover:text-[var(--action)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--action)]"
>
	<Icon name="arrow-left" class="h-4 w-4" aria-hidden="true" />
	{t(locale, "blog.post.back")}
</a>
```

Use this hero shell around the existing title, description, tags, and cover:

```astro
<header class="section-reveal grid gap-9 py-10 md:py-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(24rem,1.08fr)] lg:items-center lg:gap-14">
```

Replace the hero metadata row with this exact structure, retaining the existing `wasUpdated` and `dateLocale` values:

```astro
<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-[var(--text-muted)]">
	<span class="inline-flex items-center gap-2">
		<Icon name="calendar" class="h-4 w-4 text-[var(--action)]" aria-hidden="true" />
		<time datetime={frontmatter.date.toISOString()}>
			{frontmatter.date.toLocaleDateString(dateLocale, {
				year: "numeric",
				month: "long",
				day: "numeric",
			})}
		</time>
	</span>
	{wasUpdated ? (
		<time datetime={frontmatter.dateModified?.toISOString()}>
			{locale === "es" ? "Actualizado" : "Updated"}{" "}
			{frontmatter.dateModified?.toLocaleDateString(dateLocale, {
				year: "numeric",
				month: "long",
				day: "numeric",
			})}
		</time>
	) : null}
	{frontmatter.readingTime ? (
		<span class="inline-flex items-center gap-2">
			<Icon name="clock" class="h-4 w-4 text-[var(--action)]" aria-hidden="true" />
			{frontmatter.readingTime}
		</span>
	) : null}
	{frontmatter.author ? (
		<a href={`/${locale}/about`} class="hover:text-[var(--action)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--action)]">
			{frontmatter.author}
		</a>
	) : null}
</div>
```

Style the title with:

```astro
class="mt-5 max-w-4xl text-5xl leading-[0.98] font-black text-[var(--home-navy)] sm:text-6xl md:text-7xl"
```

Style the cover frame like the Project detail hero:

```astro
class="overflow-hidden rounded-[1.35rem] border border-[var(--surface-border)] bg-[radial-gradient(circle_at_20%_10%,color-mix(in_srgb,var(--action)_12%,transparent),transparent_46%),var(--bg-band)] shadow-[var(--shadow-card)]"
```

- [ ] **Step 4: Replace the centered reading grid**

Use navigation first in source order so the native mobile disclosure appears before the article body:

```astro
<div
	class="grid items-start gap-8 border-t border-[var(--surface-border)] py-14 md:py-18 lg:grid-cols-[19rem_minmax(0,48rem)] lg:justify-center lg:gap-12 xl:gap-16"
>
	<BlogArticleToc
		headings={headings}
		label={postCopy.toc}
		currentLabel={postCopy.tocCurrent}
	/>
	<div class="prose-wrapper min-w-0 max-w-3xl">
		<slot />
	</div>
</div>
```

Keep the existing `ConversionCta` and footer after the grid. Add an `arrow-left` icon to the footer’s back-to-list link and use `var(--action)` for hover/focus.

- [ ] **Step 5: Align prose color and focus treatments**

Apply these targeted replacements in `src/styles/prose.css`:

```css
.prose-wrapper h1,
.prose-wrapper h2,
.prose-wrapper h3,
.prose-wrapper h4,
.prose-wrapper h5,
.prose-wrapper h6 {
	color: var(--home-navy);
	font-weight: 900;
	line-height: 1.15;
	scroll-margin-top: 5.75rem;
}

.prose-wrapper a {
	color: var(--action);
	font-weight: 700;
	overflow-wrap: anywhere;
	word-break: break-word;
	text-decoration-line: underline;
	text-decoration-color: color-mix(in srgb, var(--action) 48%, transparent);
	text-decoration-thickness: 0.12em;
	text-underline-offset: 0.18em;
}

.prose-wrapper a:hover {
	color: var(--home-navy);
	text-decoration-color: var(--action);
}

.prose-wrapper a:focus-visible {
	border-radius: 0.2rem;
	outline: 2px solid var(--action);
	outline-offset: 3px;
}

.prose-wrapper li::marker {
	color: var(--action);
	font-weight: 800;
}
```

Complete the prose alignment with these exact token rules:

- Replace every remaining `var(--accent-strong)` and `var(--accent)` occurrence in `prose.css` with `var(--action)` for links, list markers, inline code, summary hover, checkbox accent, and marked text.
- Replace the `var(--accent-line)` border used by `.prose-wrapper blockquote`, `.prose-wrapper :not(pre) > code`, and the info/success callout with `color-mix(in srgb, var(--action) 32%, var(--surface-border))`.
- Replace the inline-link underline mix input `var(--accent-line)` with `var(--action)` and keep its explicit transparent percentage.
- Do not change any plain `var(--surface-border)` declaration used by tables, figures, details, or separators.

- [ ] **Step 6: Verify, format, check, and commit**

Run focused verification, Prettier, `pnpm run check`, and `pnpm run lint`. Commit:

```bash
git add src/layouts/BlogPostLayout.astro src/styles/prose.css scripts/verify-blog-redesign.mjs
git commit -m "refactor(blog): align article reading layout"
```

Expected: article structural assertions pass, Astro reports no diagnostics, and ESLint emits no warnings.

---

### Task 5: Add active contextual article navigation

**Files:**

- Modify: `scripts/verify-blog-redesign.mjs:154-183`
- Modify: `src/components/common/BlogArticleToc.astro:1-63`

**Interfaces:**

- Consumes: `headings: Heading[]`, `label: string`, `currentLabel: string`, existing heading IDs, and the `book-open` icon.
- Produces: semantic desktop/mobile navigation, `data-article-toc`, `data-toc-link`, `data-toc-current`, `aria-current="location"`, and active-section/progress enhancement.

- [ ] **Step 1: Define the failing navigation behavior contract**

Replace the table-of-contents verifier loop with:

```js
for (const marker of [
	"<nav",
	"<details",
	"<summary",
	"heading.slug",
	"data-article-toc",
	"data-toc-link",
	"data-toc-current",
	'"aria-current", "location"',
	"IntersectionObserver",
	'rootMargin: "-112px 0px -65% 0px"',
	'addEventListener("astro:page-load"',
	'Icon name="book-open"',
]) {
	if (!toc.includes(marker)) failures.push(`article TOC: missing ${marker}`);
}

if (toc.includes("history.replaceState")) {
	failures.push("article TOC: scroll tracking must not rewrite the URL");
}
```

- [ ] **Step 2: Run the verifier and confirm the active-navigation contract fails**

Expected: failures for data hooks, `IntersectionObserver`, active ARIA state, page-load reinitialization, and icon treatment.

- [ ] **Step 3: Extend the component props and visual structure**

Update the prop contract:

```ts
interface Props {
	headings: Heading[];
	label: string;
	currentLabel: string;
}

const { headings, label, currentLabel } = Astro.props as Props;
```

Import `Icon` and wrap the rendered navigation variants in:

```astro
<div data-article-toc data-current-label={currentLabel}>
```

Use this desktop shell:

```astro
<nav
	aria-label={label}
	class="relative isolate hidden h-fit overflow-hidden rounded-[1.15rem] border border-[color-mix(in_srgb,var(--action)_26%,var(--surface-border))] bg-[radial-gradient(circle_at_100%_0%,color-mix(in_srgb,var(--action)_12%,transparent),transparent_11rem),var(--surface)] p-5 shadow-[var(--shadow-card)] lg:sticky lg:top-24 lg:block"
>
	<div class="flex items-center gap-3">
		<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--action)_28%,transparent)] bg-[color-mix(in_srgb,var(--action)_12%,var(--surface))] text-[var(--action)]">
			<Icon name="book-open" class="h-5 w-5" aria-hidden="true" />
		</span>
		<p class="eyebrow text-[var(--action)]">{label}</p>
	</div>
	<div class="mt-5 h-1 overflow-hidden rounded-full bg-[var(--surface-border)]" aria-hidden="true">
		<span data-toc-progress class="block h-full origin-left scale-x-0 rounded-full bg-[var(--action)] transition-transform"></span>
	</div>
	<ol class="mt-4 space-y-1.5">
		{sectionHeadings.map((heading) => (
			<li>
				<a data-toc-link href={`#${heading.slug}`} class="relative block rounded-xl border border-transparent px-3 py-2.5 text-sm leading-5 font-bold text-[var(--text-muted)] transition hover:bg-[color-mix(in_srgb,var(--action)_8%,transparent)] hover:text-[var(--action)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--action)] data-[active]:border-[color-mix(in_srgb,var(--action)_18%,transparent)] data-[active]:bg-[color-mix(in_srgb,var(--action)_10%,var(--surface))] data-[active]:text-[var(--home-navy)]">
					<span class="absolute inset-y-2 left-0 hidden w-0.5 rounded-full bg-[var(--action)] [[data-active]_&]:block" aria-hidden="true"></span>
					{heading.text}
				</a>
			</li>
		))}
	</ol>
</nav>
```

Use this complete native mobile disclosure with the same `data-toc-link` contract:

```astro
<details class="rounded-[1.15rem] border border-[color-mix(in_srgb,var(--action)_26%,var(--surface-border))] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:hidden">
	<summary class="cursor-pointer list-none text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--action)]">
		<span class="flex items-center gap-3">
			<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--action)_28%,transparent)] bg-[color-mix(in_srgb,var(--action)_12%,var(--surface))] text-[var(--action)]">
				<Icon name="book-open" class="h-5 w-5" aria-hidden="true" />
			</span>
			<span>
				<span class="eyebrow block text-[var(--action)]">{label}</span>
				<span class="mt-1 block text-xs font-semibold text-[var(--text-muted)]">
					<span class="sr-only">{currentLabel}: </span>
					<span data-toc-current>{sectionHeadings[0]?.text}</span>
				</span>
			</span>
		</span>
	</summary>
	<nav aria-label={label} class="mt-4 border-t border-[var(--surface-border)] pt-4">
		<ol class="space-y-1.5">
			{sectionHeadings.map((heading) => (
				<li>
					<a
						data-toc-link
						href={`#${heading.slug}`}
						class="block rounded-xl border border-transparent px-3 py-2.5 text-sm leading-5 font-bold text-[var(--text-muted)] hover:bg-[color-mix(in_srgb,var(--action)_8%,transparent)] hover:text-[var(--action)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--action)] data-[active]:border-[color-mix(in_srgb,var(--action)_18%,transparent)] data-[active]:bg-[color-mix(in_srgb,var(--action)_10%,var(--surface))] data-[active]:text-[var(--home-navy)]"
					>
						{heading.text}
					</a>
				</li>
			))}
		</ol>
	</nav>
</details>
```

- [ ] **Step 4: Add progressive active-section tracking**

Place this component-owned script after the markup:

```astro
<script>
	const setupArticleToc = () => {
		document.querySelectorAll<HTMLElement>("[data-article-toc]").forEach((toc) => {
			if (toc.dataset.enhanced === "true") return;
			toc.dataset.enhanced = "true";

			const links = Array.from(
				toc.querySelectorAll<HTMLAnchorElement>("[data-toc-link]"),
			);
			const ids = [...new Set(links.map((link) => link.hash.slice(1)))];
			const headings = ids
				.map((id) => document.getElementById(id))
				.filter((heading): heading is HTMLElement => Boolean(heading));
			const current = toc.querySelector<HTMLElement>("[data-toc-current]");
			const progress = toc.querySelector<HTMLElement>("[data-toc-progress]");
			const disclosure = toc.querySelector<HTMLDetailsElement>("details");

			if (!headings.length) return;

			const setActive = (id: string) => {
				links.forEach((link) => {
					const isActive = link.hash === `#${id}`;
					link.toggleAttribute("data-active", isActive);
					if (isActive) link.setAttribute("aria-current", "location");
					else link.removeAttribute("aria-current");
				});

				const index = headings.findIndex((heading) => heading.id === id);
				current?.replaceChildren(headings[index]?.textContent?.trim() ?? "");
				const ratio = headings.length === 1 ? 1 : index / (headings.length - 1);
				progress?.style.setProperty("transform", `scaleX(${ratio})`);
			};

			const updateActive = () => {
				const threshold = 128;
				const passed = headings.filter(
					(heading) => heading.getBoundingClientRect().top <= threshold,
				);
				const atEnd =
					window.innerHeight + window.scrollY >=
					document.documentElement.scrollHeight - 2;
				const active = atEnd ? headings.at(-1) : (passed.at(-1) ?? headings[0]);
				if (active) setActive(active.id);
			};

			const observer = new IntersectionObserver(updateActive, {
				rootMargin: "-112px 0px -65% 0px",
				threshold: [0, 1],
			});
			headings.forEach((heading) => observer.observe(heading));
			window.addEventListener("scroll", updateActive, { passive: true });
			links.forEach((link) =>
				link.addEventListener("click", () => disclosure?.removeAttribute("open")),
			);
			updateActive();
		});
	};

	document.addEventListener("astro:page-load", setupArticleToc);
	setupArticleToc();
</script>
```

Do not add `history.replaceState`, custom keyboard handlers, or a client framework.

- [ ] **Step 5: Verify static behavior and type-check the script**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm exec prettier --write src/components/common/BlogArticleToc.astro scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
```

Expected: all commands exit `0`; Astro accepts the DOM typings and no ESLint warning is introduced.

- [ ] **Step 6: Commit the contextual navigation**

```bash
git add src/components/common/BlogArticleToc.astro scripts/verify-blog-redesign.mjs
git commit -m "feat(blog): track active article section"
```

---

### Task 6: Run complete validation and visual QA

**Files:**

- Modify if a discovered regression requires it: only files listed in Tasks 1-5.
- Verify: `scripts/verify-blog-redesign.mjs`
- Verify: generated routes under `dist/client/en/blog/` and `dist/client/es/blog/`.

**Interfaces:**

- Consumes: the completed archive, card, article, pagination, and navigation changes.
- Produces: a clean production build and evidence that the approved visual/interaction criteria hold in both locales and themes.

- [ ] **Step 1: Format the complete repository**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format
```

Expected: Prettier completes without errors. Review `git diff --stat` immediately and ensure it did not touch unrelated user files.

- [ ] **Step 2: Run the complete available validation set**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:project-pages
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
git diff --check
```

Expected: every command exits `0`; Astro reports `0 errors`, `0 warnings`, `0 hints`; the production build emits all Spanish and English blog archive/article routes.

The repository instructions mention `pnpm run verify:ai-seo`, but the current `package.json` has no such script and `scripts/verify-ai-seo.mjs` does not exist. Record this as an unavailable repository check; do not invent a replacement within this visual task.

- [ ] **Step 3: Start the production output for browser inspection**

```bash
python3 -m http.server 4321 --directory dist/client
```

Expected: the static server listens at `http://localhost:4321` without modifying repository files.

- [ ] **Step 4: Inspect archive routes at all acceptance widths**

Check `/es/blog/`, `/en/blog/`, and `/es/blog/page/2/` at:

- `390 × 844`
- `768 × 1024`
- `1440 × 900`
- `1728 × 1000` or wider

For each representative route, verify:

- Perceived outer alignment matches Home, About, and Projects.
- Hero uses navy/coral hierarchy and scroll button reaches `#blog-archive`.
- Featured and compact cards have project-style borders, action rows, equal heights, and visible keyboard focus.
- Grid changes from one to two to three columns without clipped content.
- Pagination current/disabled states are clear and keyboard behavior is correct.
- No horizontal overflow or failed cover request occurs.

- [ ] **Step 5: Inspect article routes and active navigation**

Check one long Spanish article and its English translation in light and dark mode at the same widths. Verify:

- The article hero aligns with the Projects detail visual system.
- The reading measure remains comfortable at 1728px.
- Desktop navigation sticks below the header and never overlaps the CTA/footer.
- Scrolling updates one `aria-current="location"` link in each desktop/mobile navigation variant; only the visible variant is exposed at the active breakpoint.
- The final section activates at the bottom of the document.
- Clicking a TOC link changes the hash and lands below the sticky header.
- Mobile summary displays the current section and closes after a link is selected.
- With JavaScript disabled, all TOC links and native disclosure remain usable.
- Tab navigation shows visible focus on return links, prose links, TOC links, cards, pagination, and CTA controls.

- [ ] **Step 6: Check reduced motion and themes**

Enable `prefers-reduced-motion: reduce` and confirm card/featured translations do not animate. Toggle light/dark themes and confirm navy/coral/surface contrast remains legible for default, hover, focus, active, and disabled states.

- [ ] **Step 7: Commit only genuine QA fixes, if any**

If visual QA required changes, rerun Step 2 and commit only those files:

```bash
git add src/styles/global.css src/styles/prose.css src/i18n/es.json src/i18n/en.json 'src/pages/[locale]/blog/index.astro' 'src/pages/[locale]/blog/page/[page].astro' src/components/cards/BlogPostCard.astro src/components/cards/BlogFeaturedPost.astro src/components/common/BlogPagination.astro src/components/common/BlogArticleToc.astro src/layouts/BlogPostLayout.astro scripts/verify-blog-redesign.mjs
git diff --cached --name-only
git commit -m "fix(blog): polish responsive editorial layout"
```

Before committing, compare the staged file list with `git status --short` and unstage any path not changed for this redesign. If no fix was needed, do not create an empty commit.

- [ ] **Step 8: Confirm final repository state**

```bash
git status -sb
git log -6 --oneline
```

Expected: no unstaged or untracked implementation files remain; recent commits correspond to the task boundaries above.

---

## Completion checklist

- [ ] Blog archive and article pages use the 88rem shell.
- [ ] Archive hero, cards, featured story, pagination, buttons, and links match the Projects/Home/About visual language.
- [ ] Article hero and reading layout use the wider shell without widening paragraph measure.
- [ ] Contextual navigation matches the related-service card philosophy and tracks the visible `h2`.
- [ ] Active navigation is scoped to the article TOC and exposes `aria-current="location"`.
- [ ] Mobile navigation works as native disclosure with and without JavaScript.
- [ ] Spanish and English labels are equivalent and no public copy is hardcoded by locale in components.
- [ ] Existing covers, routes, content, CTA behavior, and project components remain unchanged.
- [ ] Automated validation and visual QA pass in both themes at all acceptance widths.
