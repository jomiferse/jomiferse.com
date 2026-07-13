import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const contentRoot = join(root, "src", "content", "blog");

const readEntries = async (locale) => {
	const directory = join(contentRoot, locale);
	const files = (await readdir(directory)).filter((file) =>
		file.endsWith(".md"),
	);

	return Promise.all(
		files.map(async (file) => ({
			locale,
			file,
			source: await readFile(join(directory, file), "utf8"),
		})),
	);
};

const entries = [...(await readEntries("es")), ...(await readEntries("en"))];
const field = (source, name) =>
	source.match(new RegExp(`^${name}: ["']?([^"'\\n]+)`, "m"))?.[1]?.trim();
const nestedField = (source, name) =>
	source.match(new RegExp(`^  ${name}: ["']([^"']+)["']`, "m"))?.[1];

if (entries.length !== 54) {
	failures.push(`expected 54 entries, found ${entries.length}`);
}

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

const englishEntries = new Map(
	entries
		.filter(({ locale }) => locale === "en")
		.map((entry) => [entry.file.replace(/\.md$/, ""), entry]),
);

for (const spanishEntry of entries.filter(({ locale }) => locale === "es")) {
	const translationSlug = field(spanishEntry.source, "translationSlug");
	const englishEntry = englishEntries.get(translationSlug);

	if (!translationSlug || !englishEntry) {
		failures.push(
			`es/${spanishEntry.file}: missing matching English translation`,
		);
		continue;
	}

	const spanishCover = nestedField(spanishEntry.source, "src");
	const englishCover = nestedField(englishEntry.source, "src");
	if (spanishCover && englishCover && spanishCover !== englishCover) {
		failures.push(
			`es/${spanishEntry.file}: cover does not match en/${englishEntry.file}`,
		);
	}
}

const coverPaths = new Set(
	entries.map(({ source }) => nestedField(source, "src")).filter(Boolean),
);

if (coverPaths.size !== 27) {
	failures.push(`expected 27 unique cover paths, found ${coverPaths.size}`);
}

for (const coverPath of coverPaths) {
	const assetPath = join(root, "public", coverPath.replace(/^\//, ""));
	try {
		await access(assetPath);
		const metadata = await sharp(assetPath).metadata();
		if (
			metadata.format !== "heif" ||
			metadata.width !== 1600 ||
			metadata.height !== 900
		) {
			failures.push(
				`${coverPath}: expected 1600x900 AVIF, found ${metadata.width}x${metadata.height} ${metadata.format}`,
			);
		}
	} catch {
		failures.push(`${coverPath}: cover asset is missing or unreadable`);
	}
}

const schema = await readFile(join(root, "src", "content.config.ts"), "utf8");
for (const marker of [
	"cover: z.object",
	"src: z.string()",
	"alt: z.string()",
]) {
	if (!schema.includes(marker)) {
		failures.push(`content schema is missing ${marker}`);
	}
}

const archive = await readFile(
	join(root, "src/pages/[locale]/blog/index.astro"),
	"utf8",
);
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
const blogCarousel = await readFile(
	join(root, "src/components/common/BlogCarousel.astro"),
	"utf8",
).catch(() => "");

for (const marker of ["BlogFeaturedPost", "primaryFeatured", "archivePosts"]) {
	if (!archive.includes(marker)) failures.push(`archive: missing ${marker}`);
}
if (paginated.includes("BlogFeaturedPost")) {
	failures.push("pagination: featured story must not repeat");
}
for (const marker of [
	"data-blog-card",
	"data-blog-card-action",
	"aspect-[16/9]",
	"cover.src",
	"cover.alt",
	"line-clamp-2",
	"line-clamp-3",
	'name="calendar"',
	'name="arrow-right"',
	"readLabel",
]) {
	if (!card.includes(marker)) failures.push(`card: missing ${marker}`);
}
for (const marker of ["cleanTags", "tag-pill"]) {
	if (card.includes(marker)) failures.push(`card: must not render ${marker}`);
}
for (const marker of [
	"data-blog-carousel",
	"data-carousel-track",
	"data-blog-slide",
	"snap-mandatory",
	"sm:grid",
	"data-carousel-previous",
	"data-carousel-next",
	"prefers-reduced-motion",
]) {
	if (!blogCarousel.includes(marker)) {
		failures.push(`blog carousel: missing ${marker}`);
	}
}
for (const [name, source] of [
	["archive", archive],
	["pagination", paginated],
]) {
	if (!source.includes("BlogCarousel")) {
		failures.push(`${name}: missing mobile BlogCarousel`);
	}
}
for (const marker of [
	"data-blog-featured",
	"data-blog-featured-action",
	'name="calendar"',
	'name="arrow-right"',
	"cover.src",
	"readLabel",
]) {
	if (!featured.includes(marker)) failures.push(`featured: missing ${marker}`);
}

for (const [name, source] of [
	["archive", archive],
	["pagination", paginated],
]) {
	if (!source.includes("copy={page}")) {
		failures.push(`${name}: carousel is missing localized copy`);
	}
}

const blogPagination = await readFile(
	join(root, "src", "components", "common", "BlogPagination.astro"),
	"utf8",
);

for (const marker of [
	"data-blog-pagination",
	'aria-current="page"',
	'aria-disabled="true"',
	'name="arrow-left"',
	'name="arrow-right"',
	"button-action w-full sm:w-auto",
	"var(--action)",
]) {
	if (!blogPagination.includes(marker)) {
		failures.push(`pagination component: missing ${marker}`);
	}
}

const articleRoute = await readFile(
	join(root, "src/pages/[locale]/blog/[...slug].astro"),
	"utf8",
);
const articleLayout = await readFile(
	join(root, "src/layouts/BlogPostLayout.astro"),
	"utf8",
);
const toc = await readFile(
	join(root, "src/components/common/BlogArticleToc.astro"),
	"utf8",
).catch(() => "");

for (const marker of [
	"headings",
	"image={post.data.cover.src}",
	"imageAlt={post.data.cover.alt}",
]) {
	if (!articleRoute.includes(marker)) {
		failures.push(`article route: missing ${marker}`);
	}
}

for (const marker of [
	"BlogArticleToc",
	'class="blog-article-page"',
	"data-blog-article-hero",
	"frontmatter.cover.src",
	"frontmatter.cover.alt",
	'name="arrow-left"',
	"lg:grid-cols-[22rem_minmax(0,52rem)]",
	"lg:gap-10",
	"md:py-14",
	"prose-wrapper max-w-[50rem]",
	"currentLabel={postCopy.tocCurrent}",
	"ConversionCta",
]) {
	if (!articleLayout.includes(marker)) {
		failures.push(`article layout: missing ${marker}`);
	}
}

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
		(position, index) =>
			index > 0 && position <= articleHeroPositions[index - 1],
	)
) {
	failures.push("article layout: pyramid hero order is incorrect");
}

if (
	!articleLayout.includes(
		'data-blog-article-cover\n\t\t\tclass="mx-auto mt-8 max-w-4xl',
	)
) {
	failures.push("article layout: pyramid cover must use the compact width");
}

for (const marker of ["text-[clamp(2.5rem,11vw,3.5rem)]", "md:text-7xl"]) {
	if (!articleLayout.includes(marker)) {
		failures.push(`article layout: title is missing ${marker}`);
	}
}

if (!articleLayout.includes("data-blog-article-meta-separator")) {
	failures.push("article layout: metadata separators are missing");
}

if (
	articleLayout.includes("frontmatter.tags?.length") ||
	articleLayout.includes('class="tag-pill"')
) {
	failures.push("article layout: visible tag pills must be removed");
}

const proseStyles = await readFile(
	join(root, "src", "styles", "prose.css"),
	"utf8",
);
for (const marker of ["var(--home-navy)", "var(--action)", ":focus-visible"]) {
	if (!proseStyles.includes(marker)) failures.push(`prose: missing ${marker}`);
}

for (const marker of [
	"<nav",
	"<details",
	"<summary",
	"heading.slug",
	"data-article-toc",
	'class="lg:sticky lg:top-24"',
	"data-toc-link",
	"data-toc-current",
	"data-toc-scroll",
	"max-h-[calc(100svh-7.5rem)]",
	"overflow-y-auto",
	'"aria-current", "location"',
	"IntersectionObserver",
	'rootMargin: "-112px 0px -65% 0px"',
	'addEventListener("astro:page-load"',
	'addEventListener("hashchange"',
	"decodeURIComponent(link.hash.slice(1))",
	"activeLink.getBoundingClientRect()",
	"list.scrollTo",
	'name="book-open"',
]) {
	if (!toc.includes(marker)) failures.push(`article TOC: missing ${marker}`);
}

if (toc.includes("history.replaceState")) {
	failures.push("article TOC: scroll tracking must not rewrite the URL");
}

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
	[
		"es",
		spanishTranslations,
		[
			'"browseArticles": "Ver artículos"',
			'"tocCurrent": "Sección actual"',
			'"carouselPrevious": "Ver artículo anterior"',
			'"carouselNext": "Ver artículo siguiente"',
			'"carouselPosition": "Artículo {current} de {total}"',
		],
	],
	[
		"en",
		englishTranslations,
		[
			'"browseArticles": "Browse articles"',
			'"tocCurrent": "Current section"',
			'"carouselPrevious": "View previous article"',
			'"carouselNext": "View next article"',
			'"carouselPosition": "Article {current} of {total}"',
		],
	],
]) {
	for (const marker of expected) {
		if (!source.includes(marker)) {
			failures.push(`${locale} translations: missing ${marker}`);
		}
	}
}

if (!archive.includes('class="blog-page"')) {
	failures.push("archive: missing blog-page marker");
}
if (!paginated.includes('class="blog-page"')) {
	failures.push("pagination: missing blog-page marker");
}

if (failures.length > 0) {
	console.error("Blog editorial redesign verification failed:\n");
	for (const failure of failures) console.error(`- ${failure}`);
	process.exit(1);
}

console.warn("Blog editorial redesign verification passed.");
