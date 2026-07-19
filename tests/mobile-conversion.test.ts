import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const readSource = (path: string) =>
	readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("keeps header utility controls at least 44 by 44 CSS pixels", async () => {
	const [theme, language] = await Promise.all([
		readSource("src/components/common/ThemeToggle.astro"),
		readSource("src/components/common/LanguageToggle.astro"),
	]);
	assert.match(theme, /min-h-11/);
	assert.match(theme, /min-w-11/);
	assert.match(language, /min-h-11/);
});

test("moves the primary homepage action ahead of supporting proof on small screens", async () => {
	const hero = await readSource("src/components/home/HomeHero.astro");
	assert.match(hero, /\.consultancy-pitch\s*{[\s\S]*?display:\s*flex/);
	assert.match(hero, /\.consultancy-pitch__actions\s*{[\s\S]*?order:\s*2/);
	assert.match(hero, /\.consultancy-pitch__evidence\s*{[\s\S]*?order:\s*4/);
});
