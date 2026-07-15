import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const component = await readFile(
	new URL("../src/components/common/SectionToc.astro", import.meta.url),
	"utf8",
);

test("derives the mobile current label from the active navigation link", () => {
	assert.match(
		component,
		/current\?\.replaceChildren\(activeLink\?\.textContent\?\.trim\(\) \?\? ""\)/,
	);
	assert.doesNotMatch(
		component,
		/current\?\.replaceChildren\(sections\[index\]\?\.textContent/,
	);
});
