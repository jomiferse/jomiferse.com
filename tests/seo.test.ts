import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
	buildBlogPosting,
	buildBreadcrumbList,
	buildCollectionPage,
	buildCreativeWork,
	buildProfilePage,
	getSeoEntityIds,
} from "../src/lib/seo.ts";

const baseLayout = await readFile(
	new URL("../src/layouts/BaseLayout.astro", import.meta.url),
	"utf8",
);

test("does not expose the obsolete meta keywords contract", () => {
	assert.doesNotMatch(baseLayout, /name="keywords"/);
	assert.doesNotMatch(baseLayout, /keywords\?:/);
});

test("uses stable website, person and page entity identifiers", () => {
	assert.deepEqual(
		getSeoEntityIds("https://www.jomiferse.com", "/en/blog/example"),
		{
			website: "https://www.jomiferse.com/#website",
			person: "https://www.jomiferse.com/#person",
			page: "https://www.jomiferse.com/en/blog/example/#webpage",
		},
	);
});

test("uses the canonical page identifier for collection pages", () => {
	const schema = buildCollectionPage(
		"https://www.jomiferse.com",
		"/es/blog",
		"Blog",
		"Artículos",
	);

	assert.equal(schema["@id"], "https://www.jomiferse.com/es/blog/#webpage");
	assert.equal(schema.url, "https://www.jomiferse.com/es/blog/");
});

test("rejects breadcrumb trails that cannot describe a hierarchy", () => {
	assert.throws(
		() =>
			buildBreadcrumbList("https://www.jomiferse.com", [
				{ name: "Inicio", path: "/es/" },
			]),
		/items must contain at least two entries/,
	);
});

test("links a profile page to the stable person entity", () => {
	const schema = buildProfilePage("https://www.jomiferse.com", "es", {
		name: "José Miguel Fernández",
		description: "Desarrollador full-stack.",
		email: "jomiferse@gmail.com",
		location: "Granada, España",
		links: {
			linkedin: "https://www.linkedin.com/in/jomiferse/",
			github: "https://github.com/jomiferse/",
		},
	});

	assert.equal(schema["@id"], "https://www.jomiferse.com/es/about/#webpage");
	assert.deepEqual(schema.mainEntity, {
		"@type": "Person",
		"@id": "https://www.jomiferse.com/#person",
	});
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

test("links creative work to its canonical entity and stable creator", () => {
	const schema = buildCreativeWork("https://www.jomiferse.com", {
		name: "CV Studio",
		description: "Editor de currículums.",
		path: "/es/projects/cv-studio",
	});

	assert.equal(
		schema["@id"],
		"https://www.jomiferse.com/es/projects/cv-studio/#creative-work",
	);
	assert.equal(schema.url, "https://www.jomiferse.com/es/projects/cv-studio/");
	assert.deepEqual(schema.creator, {
		"@id": "https://www.jomiferse.com/#person",
	});
});
