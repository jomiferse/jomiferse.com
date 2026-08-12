import assert from "node:assert/strict";
import { test } from "node:test";

import { selectHomeFeaturedBlogPosts } from "../src/lib/blog-home-featured.ts";

const post = (id: string, homeFeatured?: number) => ({
	id,
	data: { homeFeatured },
});

test("selects and orders only explicitly featured posts", () => {
	const result = selectHomeFeaturedBlogPosts([
		post("latest-unselected"),
		post("automation", 3),
		post("website-cost", 1),
		post("redesign", 2),
	]);

	assert.deepEqual(
		result.map((entry) => entry.id),
		["website-cost", "redesign", "automation"],
	);
});

test("rejects duplicate editorial positions", () => {
	assert.throws(
		() =>
			selectHomeFeaturedBlogPosts([
				post("website-cost", 1),
				post("redesign", 1),
			]),
		/Home featured blog positions must be unique/,
	);
});
