import assert from "node:assert/strict";
import { test } from "node:test";

import { getServiceSectionTitles } from "../src/lib/service-section-titles.ts";

test("turns repeated template headings into service-specific buyer questions", () => {
	const website = getServiceSectionTitles("en", "WordPress web design");
	const backend = getServiceSectionTitles("en", "Spring Boot backend");

	assert.notDeepEqual(website, backend);
	assert.match(website.pricing, /WordPress web design/);
	assert.match(backend.scope, /Spring Boot backend/);
	assert.match(
		getServiceSectionTitles("es", "Automatización de procesos").faq,
		/Automatización de procesos/,
	);
});
