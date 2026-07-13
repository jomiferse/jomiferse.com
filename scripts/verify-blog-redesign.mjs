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

for (const marker of ["BlogFeaturedPost", "primaryFeatured", "archivePosts"]) {
	if (!archive.includes(marker)) failures.push(`archive: missing ${marker}`);
}
if (paginated.includes("BlogFeaturedPost")) {
	failures.push("pagination: featured story must not repeat");
}
for (const marker of [
	"aspect-[16/9]",
	"cover.src",
	"cover.alt",
	"line-clamp-2",
]) {
	if (!card.includes(marker)) failures.push(`card: missing ${marker}`);
}
for (const marker of ["data-blog-featured", "button-action", "cover.src"]) {
	if (!featured.includes(marker)) failures.push(`featured: missing ${marker}`);
}

if (failures.length > 0) {
	console.error("Blog editorial redesign verification failed:\n");
	for (const failure of failures) console.error(`- ${failure}`);
	process.exit(1);
}

console.warn("Blog editorial redesign verification passed.");
