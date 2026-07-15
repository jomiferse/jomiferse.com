import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const component = await readFile(
	new URL("../src/components/common/NotFoundPage.astro", import.meta.url),
	"utf8",
);
const globalStyles = await readFile(
	new URL("../src/styles/global.css", import.meta.url),
	"utf8",
);
const es = JSON.parse(
	await readFile(new URL("../src/i18n/es.json", import.meta.url), "utf8"),
);
const en = JSON.parse(
	await readFile(new URL("../src/i18n/en.json", import.meta.url), "utf8"),
);

test("uses the editorial 404 structure instead of legacy cards", () => {
	assert.match(component, /not-found__code/);
	assert.match(component, /not-found__destinations/);
	assert.doesNotMatch(component, /dark-card/);
});

test("keeps one primary recovery action and a secondary contact link", () => {
	assert.match(component, /class="button-action"/);
	assert.match(component, /not-found__contact/);
	assert.doesNotMatch(component, /button-primary|button-secondary/);
});

test("defines three equivalent recovery destinations in each locale", () => {
	for (const locale of [es, en]) {
		const page = locale.notFound.page;
		assert.equal(page.destinations.length, 3);
		assert.deepEqual(
			page.destinations.map((item: { href: string }) => item.href),
			["services", "projects", "blog"],
		);
		assert.equal(typeof page.actions.home, "string");
		assert.equal(typeof page.actions.contact, "string");
	}
});

test("uses the commercial page width and a prominent destination heading", () => {
	assert.match(
		globalStyles,
		/body:has\(\.not-found\) main\.site-shell\s*{\s*max-width: 88rem;/,
	);
	assert.match(
		component,
		/\.not-found__destinations h2\s*{[\s\S]*font-size: clamp\(2\.2rem, 4vw, 3\.6rem\);/,
	);
	assert.match(
		component,
		/\.not-found__destinations h2\s*{[\s\S]*padding-inline: clamp\(0\.5rem, 2vw, 1\.5rem\);/,
	);
});
