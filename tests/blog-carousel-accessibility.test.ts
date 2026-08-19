import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const carouselPath = new URL(
	"../src/components/common/BlogCarousel.astro",
	import.meta.url,
);

test("keeps blog carousel slides exposed as native list items", async () => {
	const source = await readFile(carouselPath, "utf8");
	const slideTag = source.match(/<li[\s\S]*?data-blog-slide/);

	assert.ok(slideTag, "expected the blog carousel to render slides as <li>");
	assert.doesNotMatch(
		slideTag[0],
		/role=["']group["']/,
		"role=group overrides the native listitem role and breaks the parent list",
	);
});
