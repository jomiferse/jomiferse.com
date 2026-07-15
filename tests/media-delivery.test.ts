import assert from "node:assert/strict";
import { test } from "node:test";

import {
	getEditorialImageAttributes,
	loadHoverPreviews,
} from "../src/lib/media-delivery.ts";

test("builds a stable lazy-loading contract for editorial images", () => {
	assert.deepEqual(getEditorialImageAttributes(1600, 900), {
		width: 1600,
		height: 900,
		loading: "lazy",
		decoding: "async",
		sizes: "(max-width: 56rem) calc(100vw - 2rem), 50rem",
	});
});

test("loads hover previews only on capable connections and pointers", () => {
	const preview = {
		dataset: { hoverSrc: "/preview.avif" },
		hasAttribute: () => false,
		setAttribute(name: string, value: string) {
			assert.equal(name, "src");
			assert.equal(value, "/preview.avif");
			this.loaded = true;
		},
		loaded: false,
	};
	const root = {
		querySelectorAll: () => [preview],
	};

	assert.equal(loadHoverPreviews(root, { hover: false, saveData: false }), 0);
	assert.equal(preview.loaded, false);
	assert.equal(loadHoverPreviews(root, { hover: true, saveData: true }), 0);
	assert.equal(loadHoverPreviews(root, { hover: true, saveData: false }), 1);
	assert.equal(preview.loaded, true);
});
