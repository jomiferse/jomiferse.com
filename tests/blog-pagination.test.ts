import assert from "node:assert/strict";
import { test } from "node:test";

import {
	BLOG_POSTS_PER_PAGE,
	getBlogPagePath,
	getPageItems,
	getTotalPages,
} from "../src/lib/blog-pagination.ts";
import { getTranslatedBlogPath } from "../src/lib/blog-translation.ts";

const posts = Array.from({ length: 13 }, (_, index) => `post-${index + 1}`);

test("uses six posts per page", () => {
	assert.equal(BLOG_POSTS_PER_PAGE, 6);
});

test("returns the correct page count for recent posts", () => {
	assert.equal(getTotalPages(posts.length), 3);
	assert.equal(getTotalPages(0), 1);
});

test("returns the slice for a requested page", () => {
	assert.deepEqual(getPageItems(posts, 1), posts.slice(0, 6));
	assert.deepEqual(getPageItems(posts, 2), posts.slice(6, 12));
	assert.deepEqual(getPageItems(posts, 3), posts.slice(12, 18));
});

test("keeps the first blog page at the base path", () => {
	assert.equal(getBlogPagePath("en", 1), "/en/blog");
	assert.equal(getBlogPagePath("es", 1), "/es/blog");
});

test("builds static paths for later pages", () => {
	assert.equal(getBlogPagePath("en", 2), "/en/blog/page/2");
	assert.equal(getBlogPagePath("es", 3), "/es/blog/page/3");
});

test("builds translated blog post paths from translation slugs", () => {
	assert.equal(
		getTranslatedBlogPath(
			"en",
			"idempotent-apis-that-survive-retries",
			"apis-idempotentes-que-sobreviven-a-reintentos",
		),
		"/es/blog/apis-idempotentes-que-sobreviven-a-reintentos",
	);
	assert.equal(
		getTranslatedBlogPath(
			"es",
			"apis-idempotentes-que-sobreviven-a-reintentos",
			"idempotent-apis-that-survive-retries",
		),
		"/en/blog/idempotent-apis-that-survive-retries",
	);
});

test("falls back to the translated blog index when a post has no translation slug", () => {
	assert.equal(
		getTranslatedBlogPath("en", "post-without-translation"),
		"/es/blog",
	);
	assert.equal(
		getTranslatedBlogPath("es", "post-without-translation"),
		"/en/blog",
	);
});
