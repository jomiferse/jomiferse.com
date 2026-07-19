import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const titleSources = await Promise.all(
	[
		"../src/lib/services.ts",
		"../src/lib/commercial-landings.ts",
		"../src/layouts/BaseLayout.astro",
	].map(async (path) => ({
		path,
		content: await readFile(new URL(path, import.meta.url), "utf8"),
	})),
);

test("keeps the personal-name suffix out of page titles", () => {
	for (const source of titleSources) {
		assert.doesNotMatch(
			source.content,
			/ \| José Miguel Fernández/,
			`${source.path} contains the removed page-title suffix`,
		);
	}
});

test("renders source titles without conditional rewriting", () => {
	const layout = titleSources.find(({ path }) =>
		path.endsWith("BaseLayout.astro"),
	);
	assert.ok(layout);
	assert.match(layout.content, /const seoTitle = title;/);
});
