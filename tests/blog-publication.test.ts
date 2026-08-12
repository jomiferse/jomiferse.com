import assert from "node:assert/strict";
import { test } from "node:test";

import {
	isPublishedBlogPost,
	isPublishedBlogPostForAudience,
} from "../src/lib/blog-publication.ts";

test("publishes posts unless they are explicitly drafts", () => {
	assert.equal(isPublishedBlogPost({ draft: undefined }), true);
	assert.equal(isPublishedBlogPost({ draft: false }), true);
	assert.equal(isPublishedBlogPost({ draft: true }), false);
});

test("separates published posts by their declared audience", () => {
	const businessPost = {
		draft: false,
		commercial: { audience: "business" as const },
	};
	const technicalPost = {
		draft: false,
		commercial: { audience: "technical" as const },
	};

	assert.equal(isPublishedBlogPostForAudience(businessPost, "business"), true);
	assert.equal(
		isPublishedBlogPostForAudience(businessPost, "technical"),
		false,
	);
	assert.equal(
		isPublishedBlogPostForAudience(technicalPost, "technical"),
		true,
	);
	assert.equal(
		isPublishedBlogPostForAudience(technicalPost, "business"),
		false,
	);
	assert.equal(
		isPublishedBlogPostForAudience(
			{ ...businessPost, draft: true },
			"business",
		),
		false,
	);
});
