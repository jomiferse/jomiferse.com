import assert from "node:assert/strict";
import { test } from "node:test";

import {
	getCommercialLanding,
	getCommercialLandingAlternatePaths,
} from "../src/lib/commercial-landings.ts";

test("publishes one bilingual Granada web design landing", () => {
	const spanish = getCommercialLanding("es", "diseno-web-granada");
	const english = getCommercialLanding("en", "web-design-granada");

	assert.ok(spanish);
	assert.ok(english);
	assert.equal(spanish.translationKey, "local-web-design");
	assert.equal(english.translationKey, "local-web-design");
	assert.equal(spanish.title, "Diseño web en Granada para captar clientes");
	assert.equal(english.title, "Web design in Granada for businesses");
	assert.equal(spanish.schema.areaServed, "Granada, España y remoto");
	assert.equal(english.schema.areaServed, "Granada, Spain and remote");
	assert.deepEqual(getCommercialLandingAlternatePaths("es", spanish), {
		es: "/es/diseno-web-granada/",
		en: "/en/web-design-granada/",
	});
});

test("removes the replaced freelance landing definitions", () => {
	assert.equal(
		getCommercialLanding("es", "desarrollador-freelance-espana"),
		undefined,
	);
	assert.equal(
		getCommercialLanding("en", "freelance-developer-spain"),
		undefined,
	);
});

test("keeps the Granada landing focused on a concrete web project", () => {
	const page = getCommercialLanding("es", "diseno-web-granada");
	assert.ok(page);
	assert.match(page.metaTitle, /^Diseño web Granada/);
	assert.match(page.metaDescription, /negocios de Granada/i);
	assert.match(page.intro, /WordPress|Astro/);
	assert.match(page.cta.button, /proyecto|web/i);
	assert.doesNotMatch(page.title, /agencia/i);
});

test("answers four purchase questions on both Granada landings", () => {
	for (const [locale, slug] of [
		["es", "diseno-web-granada"],
		["en", "web-design-granada"],
	] as const) {
		const page = getCommercialLanding(locale, slug);
		assert.ok(page);
		assert.equal(page.faq.length, 4);
		assert.match(page.faq.at(-1)?.question ?? "", /tiempo|long/i);
	}
});
