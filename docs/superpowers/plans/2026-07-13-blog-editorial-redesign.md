# Blog Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the localized blog archive and article pages around a required system of 27 editorial covers shared by Spanish and English article pairs.

**Architecture:** Required `cover` metadata lives in each blog entry while one physical AVIF asset is shared by its translated pair. Focused Astro components render the featured archive story, compact cards, and responsive article table of contents; route files remain responsible for content selection, pagination, and SEO metadata.

**Tech Stack:** Astro 7, TypeScript 5.9, Tailwind CSS 4, Astro content collections, Astro Icon, Sharp, Node.js 24, pnpm, image generation.

## Global Constraints

- Work directly on `main`; do not create a worktree or feature branch.
- Generate exactly 27 new 1600 × 900 AVIF covers under `public/images/blog/covers/`.
- Spanish and English translations share one cover path and use localized alternative text.
- Covers use the approved technical-editorial direction: warm paper, fine grid, navy ink, coral accents, topic-specific diagrams, no embedded text, no logos, and no generic glossy 3D treatment.
- Preserve all existing article body copy, inline images, diagrams, URLs, pagination rules, and translation relationships.
- Keep `ConversionCta` on article pages and keep the home-specific CTA unchanged.
- Use a normal one/two/three-column archive grid; do not add a carousel, search, filters, comments, reactions, or share widgets.
- Use `PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"` for every Node or pnpm command.
- Use `apply_patch` for source edits; image generation and mechanical image conversion may use their dedicated tools.

---

## Cover manifest

Use the English translation slug as the neutral filename. Apply the exact shared style above plus the following subject concept:

| Cover filename | Subject concept |
| --- | --- |
| `right-sizing-kubernetes-pods-requests-limits.avif` | Kubernetes pod blocks balanced against CPU and memory gauges |
| `excel-alternatives-operational-workflows.avif` | Spreadsheet grid transforming into a structured operational workflow |
| `idempotent-apis-that-survive-retries.avif` | API request loop passing safely through a single guarded transaction |
| `hexagonal-architecture-what-it-is-how-to-apply-backend-projects.avif` | Hexagonal core with ports and adapters arranged around it |
| `astro-7-what-changed-performance-modern-web.avif` | Lightweight web page layers moving through a fast build pipeline |
| `backend-audit-before-rewrite.avif` | Backend system opened as an inspection blueprint with diagnostic markers |
| `when-business-process-automation-is-worth-it.avif` | Manual business steps crossing a threshold into an automated flow |
| `how-i-built-an-automated-betting-system-in-java.avif` | Odds signals flowing into a Java backend and controlled ledger |
| `hire-freelance-web-developer-business.avif` | Business brief connecting directly to a developer workbench |
| `building-cv-studio.avif` | Modular CV document blocks assembled inside a focused editor |
| `when-to-build-an-internal-tool-instead-of-using-excel.avif` | Spreadsheet sheet evolving into a dedicated internal dashboard |
| `when-should-a-company-migrate-a-legacy-backend-to-java-spring-boot.avif` | Legacy server moving across a staged bridge into a Spring backend |
| `when-should-you-use-kafka-rabbitmq-or-just-a-database.avif` | Three distinct messaging paths branching toward log, queue, and database |
| `when-company-needs-spring-boot-maintenance.avif` | Spring backend engine receiving measured maintenance and observability |
| `cost-to-automate-administrative-process.avif` | Administrative documents moving through a cost and time calculator |
| `how-much-does-a-custom-internal-tool-cost.avif` | Internal tool modules arranged beside scope, time, and cost scales |
| `automation-examples-small-businesses.avif` | Small-business tasks connected by practical automation nodes |
| `evaluate-custom-software-proposal.avif` | Software proposal sheets evaluated against scope, risk, and delivery |
| `integrate-crm-forms-payments.avif` | Form, CRM, and payment nodes connected by a reliable data path |
| `mcp-for-developers-ai-coding-tools-protocol.avif` | AI coding tools connecting through one shared protocol hub |
| `legacy-backend-modernization-cost-risks-phases.avif` | Legacy monolith decomposed across explicit modernization phases |
| `modular-monolith-vs-microservices.avif` | One modular structure compared with a distributed service constellation |
| `what-a-professional-website-needs-to-get-clients.avif` | Professional website sections guiding a visitor toward a contact action |
| `what-ai-automation-project-should-include.avif` | AI automation project blueprint with data, review, controls, and outcomes |
| `spring-boot-performance-tuning.avif` | Spring backend pipeline tuned through measured performance controls |
| `spring-boot-production-devops-checklist.avif` | Production release path passing a sequence of operational checkpoints |
| `using-ai-in-your-product-without-hype.avif` | Useful product workflow separated from an inflated AI presentation bubble |

For each Spanish entry use `alt: "Ilustración editorial sobre {Spanish title}"`. For each English entry use `alt: "Technical editorial illustration about {English title}"`.

---

### Task 1: Enforce and populate the cover system

**Files:**

- Create: `scripts/verify-blog-redesign.mjs`
- Create: `public/images/blog/covers/*.avif` (27 files from the manifest)
- Modify: `src/content.config.ts`
- Modify: `src/content/blog/es/*.md` (27 files)
- Modify: `src/content/blog/en/*.md` (27 files)

**Interfaces:**

- Produces required frontmatter shape `cover: { src: string; alt: string }`.
- Produces 27 shared physical cover paths used by archive and article components.
- Produces verifier command `node scripts/verify-blog-redesign.mjs`.

- [ ] **Step 1: Create the failing cover verifier**

Create `scripts/verify-blog-redesign.mjs` with these behaviors:

```js
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const contentRoot = join(root, "src", "content", "blog");

const readEntries = async (locale) => {
	const directory = join(contentRoot, locale);
	const files = (await readdir(directory)).filter((file) => file.endsWith(".md"));
	return Promise.all(
		files.map(async (file) => ({
			locale,
			file,
			source: await readFile(join(directory, file), "utf8"),
		})),
	);
};

const entries = [
	...(await readEntries("es")),
	...(await readEntries("en")),
];

const field = (source, name) =>
	source.match(new RegExp(`^${name}: ["']?([^"'\\n]+)`, "m"))?.[1]?.trim();
const nestedField = (source, name) =>
	source.match(new RegExp(`^  ${name}: ["']([^"']+)["']`, "m"))?.[1];

if (entries.length !== 54) failures.push(`expected 54 entries, found ${entries.length}`);

for (const entry of entries) {
	if (!entry.source.includes("\ncover:\n")) {
		failures.push(`${entry.locale}/${entry.file}: missing cover object`);
	}
	if (!nestedField(entry.source, "src")) {
		failures.push(`${entry.locale}/${entry.file}: missing cover.src`);
	}
	if (!nestedField(entry.source, "alt")) {
		failures.push(`${entry.locale}/${entry.file}: missing cover.alt`);
	}
}
```

Group Spanish entries by `translationSlug`, find the matching English filename, require equal `cover.src`, then require exactly 27 unique paths. For every unique path, call `access()` on `public${src}` and inspect it with `sharp`; require `format === "heif"`, width `1600`, and height `900`.

Also read `src/content.config.ts` and require the exact markers `cover: z.object`, `src: z.string()`, and `alt: z.string()`.

End with the same failure/exit pattern as the existing project verifier and print `Blog editorial redesign verification passed.` on success.

- [ ] **Step 2: Confirm the RED state**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
```

Expected: exit 1 with missing schema, missing cover metadata, and fewer than 27 physical covers.

- [ ] **Step 3: Add the required content schema**

Add this required field to the existing blog schema in `src/content.config.ts`:

```ts
cover: z.object({
	src: z.string(),
	alt: z.string(),
}),
```

- [ ] **Step 4: Generate and normalize all cover assets**

For every row in the manifest, generate one landscape raster image using the common technical-editorial direction plus the row's subject concept. Do not include text or logos.

Normalize every generated source with Sharp:

```js
await sharp(sourcePath)
	.resize(1600, 900, { fit: "cover", position: "centre" })
	.avif({ quality: 72, effort: 6 })
	.toFile(targetPath);
```

Visually inspect each cover before accepting it. Regenerate any asset containing text, indistinct subject matter, inconsistent palette, or unsafe edge detail.

- [ ] **Step 5: Add localized cover metadata to all entries**

For each Spanish filename, use its `translationSlug` to select `/images/blog/covers/{translationSlug}.avif`. For the English entry, use its own filename as the same cover filename. Insert the required object after `translationSlug`:

```yaml
cover:
  src: "/images/blog/covers/{english-slug}.avif"
  alt: "Ilustración editorial sobre {Spanish title}"
```

```yaml
cover:
  src: "/images/blog/covers/{english-slug}.avif"
  alt: "Technical editorial illustration about {English title}"
```

- [ ] **Step 6: Confirm the GREEN state and content validation**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
```

Expected: verifier passes; Astro reports zero errors, warnings, and hints.

- [ ] **Step 7: Commit the cover system**

```bash
git add scripts/verify-blog-redesign.mjs src/content.config.ts src/content/blog public/images/blog/covers
git commit -m "feat(blog): add editorial cover system"
```

---

### Task 2: Redesign the blog archive

**Files:**

- Create: `src/components/cards/BlogFeaturedPost.astro`
- Modify: `src/components/cards/BlogPostCard.astro`
- Modify: `src/lib/blog.ts`
- Modify: `src/pages/[locale]/blog/index.astro`
- Modify: `src/pages/[locale]/blog/page/[page].astro`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Modify: `scripts/verify-blog-redesign.mjs`

**Interfaces:**

- `BlogFeaturedPost` consumes `{ href, title, description, dateLabel, readingTime?, cover, featuredLabel, readLabel }`.
- `BlogPostCard` adds required prop `cover: { src: string; alt: string }`.
- `getBlogPostGroups(posts)` produces `{ primaryFeatured, archivePosts }` where only the newest featured post is removed from the archive.

- [ ] **Step 1: Extend the verifier for the archive RED state**

Require:

```js
const archive = await readFile(join(root, "src/pages/[locale]/blog/index.astro"), "utf8");
const paginated = await readFile(
	join(root, "src/pages/[locale]/blog/page/[page].astro"),
	"utf8",
);
const featured = await readFile(
	join(root, "src/components/cards/BlogFeaturedPost.astro"),
	"utf8",
).catch(() => "");
const card = await readFile(
	join(root, "src/components/cards/BlogPostCard.astro"),
	"utf8",
);

for (const marker of ["BlogFeaturedPost", "primaryFeatured", "archivePosts"]) {
	if (!archive.includes(marker)) failures.push(`archive: missing ${marker}`);
}
if (paginated.includes("BlogFeaturedPost")) {
	failures.push("pagination: featured story must not repeat");
}
for (const marker of ["aspect-[16/9]", "cover.src", "cover.alt", "line-clamp-2"]) {
	if (!card.includes(marker)) failures.push(`card: missing ${marker}`);
}
for (const marker of ["data-blog-featured", "button-action", "cover.src"]) {
	if (!featured.includes(marker)) failures.push(`featured: missing ${marker}`);
}
```

Run the verifier and expect failures for the missing featured component and image-first card contract.

- [ ] **Step 2: Add the featured component**

Create `BlogFeaturedPost.astro` as a semantic linked article with:

- `data-blog-featured` marker.
- `lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)]`.
- A 1600 × 900 `<img>` using `cover.src` and `cover.alt`.
- Localized metadata, title, description, and `button-action` read link.
- A stacked image-first mobile layout.

- [ ] **Step 3: Redesign the compact card**

Change the `BlogPostCard` props to require `cover`. Render the cover before metadata:

```astro
<img
	src={cover.src}
	alt={cover.alt}
	width="1600"
	height="900"
	loading="lazy"
	class="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
/>
```

Use `line-clamp-2` for title and description, at most two clean tags, and a stable flex-column card body. Remove the old gradient-only featured card treatment from this component.

- [ ] **Step 4: Update grouping and archive routes**

Change `getBlogPostGroups` to:

```ts
export function getBlogPostGroups(posts: BlogPost[]) {
	const primaryFeatured = posts.find((post) => post.data.featured);
	return {
		primaryFeatured,
		archivePosts: posts.filter((post) => post.id !== primaryFeatured?.id),
	};
}
```

On page 1, render `BlogFeaturedPost` when present and paginate `archivePosts`. On page 2+, paginate the same `archivePosts` but do not import or render `BlogFeaturedPost`. Pass `post.data.cover` to every `BlogPostCard`.

Use archive grid classes `grid gap-5 sm:grid-cols-2 lg:grid-cols-3` and keep the existing `BlogPagination` behavior.

- [ ] **Step 5: Add required bilingual labels**

Add under `blog.page`:

```json
"featuredEyebrow": "Artículo destacado",
"readArticle": "Leer artículo"
```

and the English equivalents:

```json
"featuredEyebrow": "Featured article",
"readArticle": "Read article"
```

- [ ] **Step 6: Verify and commit the archive**

Run the blog verifier, Astro check, lint, and Prettier check. Expected: all pass.

```bash
git add scripts/verify-blog-redesign.mjs src/components/cards/BlogFeaturedPost.astro src/components/cards/BlogPostCard.astro src/lib/blog.ts 'src/pages/[locale]/blog/index.astro' 'src/pages/[locale]/blog/page/[page].astro' src/i18n/en.json src/i18n/es.json
git commit -m "feat(blog): redesign editorial archive"
```

---

### Task 3: Redesign the article layout and table of contents

**Files:**

- Create: `src/components/common/BlogArticleToc.astro`
- Modify: `src/layouts/BlogPostLayout.astro`
- Modify: `src/pages/[locale]/blog/[...slug].astro`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/en.json`
- Modify: `scripts/verify-blog-redesign.mjs`

**Interfaces:**

- `BlogArticleToc` consumes `{ headings: { depth: number; slug: string; text: string }[]; label: string }`.
- `BlogPostLayout` consumes existing `frontmatter`, `locale`, and new `headings` prop.
- Blog route passes `post.data.cover` to `BaseLayout` as `image` and `imageAlt`.

- [ ] **Step 1: Extend the verifier for the article RED state**

Require article source markers:

```js
for (const marker of [
	"headings",
	"image={post.data.cover.src}",
	"imageAlt={post.data.cover.alt}",
]) {
	if (!articleRoute.includes(marker)) failures.push(`article route: missing ${marker}`);
}

for (const marker of [
	"BlogArticleToc",
	"frontmatter.cover.src",
	"frontmatter.cover.alt",
	"lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1.1fr)]",
	"ConversionCta",
]) {
	if (!articleLayout.includes(marker)) failures.push(`article layout: missing ${marker}`);
}

for (const marker of ["<nav", "<details", "<summary", "heading.slug"]) {
	if (!toc.includes(marker)) failures.push(`article TOC: missing ${marker}`);
}
```

Run the verifier and expect failures for headings, cover hero, and the missing TOC component.

- [ ] **Step 2: Pass headings and social cover metadata from the route**

Change render usage to:

```ts
const { Content, headings } = await render(post);
```

Pass `image={post.data.cover.src}` and `imageAlt={post.data.cover.alt}` to `BaseLayout`, and `headings={headings}` to `BlogPostLayout`.

- [ ] **Step 3: Create the responsive table of contents**

Filter headings to depth 2. When the result is empty, render nothing. Otherwise render:

- Desktop `<nav aria-label={label}>` with `hidden lg:block lg:sticky lg:top-28`.
- Mobile `<details class="lg:hidden">` with a `<summary>` using the same localized label.
- Links with `href={`#${heading.slug}`}` and visible focus styles.

No JavaScript is added.

- [ ] **Step 4: Redesign `BlogPostLayout`**

Extend `Frontmatter` with required cover metadata and accept `headings`. Build:

- Back link above the hero.
- Split hero using `lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1.1fr)]`.
- Metadata, `h1`, and description on the left.
- 1600 × 900 cover on the right with `fetchpriority="high"`.
- Reading area using a desktop TOC rail and `max-w-3xl` prose column.
- Mobile TOC before the prose.
- Existing `ConversionCta` and footer after the article.

- [ ] **Step 5: Add TOC labels**

Add `blog.post.toc: "En este artículo"` and English `blog.post.toc: "In this article"`.

- [ ] **Step 6: Verify and commit the article**

Run blog verifier, shared CTA verifier, Astro check, lint, and formatting. Expected: all pass.

```bash
git add scripts/verify-blog-redesign.mjs src/components/common/BlogArticleToc.astro src/layouts/BlogPostLayout.astro 'src/pages/[locale]/blog/[...slug].astro' src/i18n/en.json src/i18n/es.json
git commit -m "feat(blog): redesign article reading layout"
```

---

### Task 4: Production and visual verification

**Files:**

- Verify all files changed in Tasks 1–3.

- [ ] **Step 1: Run automated validation**

```bash
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run lint
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run format:check
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" node scripts/verify-blog-redesign.mjs
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run verify:conversion-cta
PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" pnpm run build
git diff --check
```

Expected: every command exits 0, Astro reports zero diagnostics, and the production build completes.

- [ ] **Step 2: Inspect all covers as a contact sheet**

Render all 27 AVIF files into a labelled local contact sheet and inspect it at original detail. Confirm consistent palette and illustration weight, distinct subject concepts, no generated text/logos, no obvious artifacts, and no unsafe edge details. Regenerate any failed cover and rerun the verifier.

- [ ] **Step 3: Inspect representative routes**

At 390 × 844 and 1440 × 900, in both light and dark themes, inspect:

- `/es/blog/`
- `/en/blog/page/2/`
- `/es/blog/modernizar-backend-legacy-coste-riesgos-fases/`
- `/en/blog/what-a-professional-website-needs-to-get-clients/`

Confirm image dimensions, archive feature hierarchy, one/two/three-column grid, split article hero, sticky desktop TOC, mobile disclosure, working anchor links, retained `ConversionCta`, and no horizontal overflow.

- [ ] **Step 4: Review repository state**

Run `git status -sb`, `git diff --stat`, and `git diff --check`. Confirm the worktree is clean apart from ignored `.superpowers` artifacts and no generated source files are left outside `public/images/blog/covers/`.
