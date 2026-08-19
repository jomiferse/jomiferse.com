import assert from "node:assert/strict";
import { test } from "node:test";

import {
	getEditorialImageAttributes,
	bindHoverPreviewIntent,
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

test("binds hover previews without loading them before pointer intent", () => {
	let pointerIntent: (() => void) | undefined;
	const preview = {
		dataset: {
			hoverSrc: "/preview.avif",
			hoverSrcset: "/preview-320.avif 320w, /preview-640.avif 640w",
		},
		attributes: new Map<string, string>(),
		hasAttribute(name: string) {
			return this.attributes.has(name);
		},
		setAttribute(name: string, value: string) {
			this.attributes.set(name, value);
		},
		parentElement: {
			addEventListener(
				type: "pointerenter",
				listener: () => void,
				options: { once: true; passive: true },
			) {
				assert.equal(type, "pointerenter");
				assert.deepEqual(options, { once: true, passive: true });
				pointerIntent = listener;
			},
		},
	};
	const root = {
		querySelectorAll: () => [preview],
	};

	assert.equal(
		bindHoverPreviewIntent(root, { hover: false, saveData: false }),
		0,
	);
	assert.equal(preview.attributes.has("src"), false);
	assert.equal(
		bindHoverPreviewIntent(root, { hover: true, saveData: true }),
		0,
	);
	assert.equal(
		bindHoverPreviewIntent(root, { hover: true, saveData: false }),
		1,
	);
	assert.equal(preview.attributes.has("src"), false);
	pointerIntent?.();
	assert.equal(preview.attributes.get("src"), "/preview.avif");
	assert.equal(
		preview.attributes.get("srcset"),
		"/preview-320.avif 320w, /preview-640.avif 640w",
	);
});
