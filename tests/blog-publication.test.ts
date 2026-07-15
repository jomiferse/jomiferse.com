import assert from "node:assert/strict";
import { test } from "node:test";

import { isPublishedBlogPost } from "../src/lib/blog-publication.ts";

test("publishes posts unless they are explicitly drafts", () => {
	assert.equal(isPublishedBlogPost({ draft: undefined }), true);
	assert.equal(isPublishedBlogPost({ draft: false }), true);
	assert.equal(isPublishedBlogPost({ draft: true }), false);
});
