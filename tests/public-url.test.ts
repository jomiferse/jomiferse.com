import assert from "node:assert/strict";
import { test } from "node:test";

import {
	canonicalPublicHref,
	normalizeInternalHtmlHrefs,
} from "../src/lib/public-url.ts";

test("adds a trailing slash before a query string or fragment", () => {
	assert.equal(
		canonicalPublicHref("/en/contact?service=assessment"),
		"/en/contact/?service=assessment",
	);
	assert.equal(
		canonicalPublicHref("/es/projects#selected"),
		"/es/projects/#selected",
	);
});

test("leaves roots, files, APIs and external hrefs unchanged", () => {
	for (const href of [
		"/",
		"/api/contact",
		"/_astro/app.js",
		"/images/avatar.avif",
		"https://example.com/path",
		"mailto:test@example.com",
	]) {
		assert.equal(canonicalPublicHref(href), href);
	}
});

test("normalizes only internal public href attributes in rendered HTML", () => {
	assert.equal(
		normalizeInternalHtmlHrefs(
			'<a href="/es/services">Services</a><a href="https://example.com/x">External</a>',
		),
		'<a href="/es/services/">Services</a><a href="https://example.com/x">External</a>',
	);
});
