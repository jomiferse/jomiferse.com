import assert from "node:assert/strict";
import { test } from "node:test";

import { buildBlogPosting, getSeoEntityIds } from "../src/lib/seo.ts";

test("uses stable website, person and page entity identifiers", () => {
	assert.deepEqual(
		getSeoEntityIds("https://www.jomiferse.com", "/en/blog/example/"),
		{
			website: "https://www.jomiferse.com/#website",
			person: "https://www.jomiferse.com/#person",
			page: "https://www.jomiferse.com/en/blog/example/#webpage",
		},
	);
});

test("connects a blog posting to its author, page and real cover", () => {
	const schema = buildBlogPosting({
		site: "https://www.jomiferse.com",
		locale: "en",
		path: "/en/blog/example/",
		title: "Example",
		description: "A useful example.",
		datePublished: new Date("2026-07-15T00:00:00.000Z"),
		author: "José Miguel Fernández",
		image: "/images/blog/example.webp",
	});

	assert.equal(
		schema["@id"],
		"https://www.jomiferse.com/en/blog/example/#article",
	);
	assert.deepEqual(schema.mainEntityOfPage, {
		"@id": "https://www.jomiferse.com/en/blog/example/#webpage",
	});
	assert.deepEqual(schema.author, {
		"@id": "https://www.jomiferse.com/#person",
	});
	assert.equal(
		schema.image,
		"https://www.jomiferse.com/images/blog/example.webp",
	);
});
