import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const servicesSource = await readFile(
	new URL("../src/lib/services.ts", import.meta.url),
	"utf8",
);

const getSpanishMeta = (translationKey: string) => {
	const escapedKey = translationKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const match = servicesSource.match(
		new RegExp(
			`"${escapedKey}": \\{[\\s\\S]*?title:\\s*"([^"]+)"[\\s\\S]*?description:\\s*"([^"]+)"`,
		),
	);
	assert.ok(match, `Missing Spanish metadata: ${translationKey}`);
	return { title: match[1], description: match[2] };
};

test("keeps priority service titles aligned with buyer searches", () => {
	assert.match(getSpanishMeta("web-wordpress:0").title, /^Diseño web WordPress/);
	assert.match(getSpanishMeta("it-consulting:3").title, /^Software a medida/);

	const maintenance = getSpanishMeta("web-wordpress:1");
	assert.match(maintenance.title, /^Servicio de mantenimiento WordPress/);
	assert.match(maintenance.description, /precio|plan|mensual/i);
});

test("frames AI and automation services for companies", () => {
	for (const translationKey of [
		"ai-automation:1",
		"ai-automation:3",
		"it-consulting:5",
	]) {
		const meta = getSpanishMeta(translationKey);
		assert.match(`${meta.title} ${meta.description}`, /empresas/i);
	}
});

test("keeps priority descriptions useful in a search result", () => {
	for (const translationKey of [
		"web-wordpress:0",
		"it-consulting:3",
		"web-wordpress:1",
		"ai-automation:1",
		"ai-automation:3",
		"it-consulting:5",
	]) {
		const description = getSpanishMeta(translationKey).description;
		assert.ok(
			description.length >= 100 && description.length <= 160,
			`${translationKey} description length is ${description.length}`,
		);
	}
});
