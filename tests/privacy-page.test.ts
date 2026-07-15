import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const privacy = await readFile(
	new URL("../src/pages/[locale]/privacy.astro", import.meta.url),
	"utf8",
);
const toc = await readFile(
	new URL("../src/components/common/SectionToc.astro", import.meta.url),
	"utf8",
);

test("keeps a two-column privacy summary at the required mobile width", () => {
	assert.match(
		privacy,
		/grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/,
	);
	assert.doesNotMatch(
		privacy,
		/@media \(max-width: 31rem\)[\s\S]*?grid-template-columns:\s*1fr/,
	);
});

test("supports safe wrapping for privacy values and storage keys", () => {
	assert.match(privacy, /overflow-wrap:\s*anywhere/);
	assert.match(privacy, /privacy-storage-table tbody th code/);
	assert.match(
		privacy,
		/\.privacy-summary__item p:last-child \{[\s\S]*?font-size:\s*0\.82rem/,
	);
});

test("uses an editorial section index instead of a raised card", () => {
	assert.match(toc, /section-toc-desktop/);
	assert.doesNotMatch(
		toc,
		/section-toc-desktop[^\n]*shadow-\[var\(--shadow-card\)\]/,
	);
});
