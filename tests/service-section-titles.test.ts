import assert from "node:assert/strict";
import { test } from "node:test";

import {
	getEnglishIndefiniteArticle,
	getServicePresentation,
	getServiceSectionTitles,
} from "../src/lib/service-section-titles.ts";

test("turns repeated template headings into service-specific buyer questions", () => {
	const website = getServiceSectionTitles(
		"en",
		"web-wordpress:0",
		"WordPress web design",
	);
	const backend = getServiceSectionTitles(
		"en",
		"base:backend-spring-boot",
		"Spring Boot backend",
	);

	assert.notDeepEqual(website, backend);
	assert.match(website.pricing, /WordPress web design/);
	assert.match(backend.scope, /Spring Boot backend/);
	assert.match(
		getServiceSectionTitles(
			"es",
			"base:automation-workflows",
			"Automatización de procesos",
		).faq,
		/Automatización de procesos/,
	);
});

test("defines distinct decision profiles for the five priority services", () => {
	const keys = [
		"it-consulting:1",
		"it-consulting:4",
		"it-consulting:5",
		"ai-automation:3",
		"base:internal-tools",
	];
	for (const locale of ["es", "en"] as const) {
		const profiles = keys.map((key) => getServicePresentation(locale, key));
		assert.ok(profiles.every(Boolean));
		assert.equal(new Set(profiles.map((profile) => profile?.title)).size, 5);
		assert.ok(
			profiles.every(
				(profile) =>
					profile?.failureModes.length === 3 &&
					profile.acceptanceCriteria.length === 3,
			),
		);
	}
});

test("selects the English article from the service title", () => {
	assert.equal(getEnglishIndefiniteArticle("API integrations"), "an");
	assert.equal(getEnglishIndefiniteArticle("AI agents"), "an");
	assert.equal(getEnglishIndefiniteArticle("internal tools"), "an");
	assert.equal(getEnglishIndefiniteArticle("user research"), "a");
	assert.equal(getEnglishIndefiniteArticle("website redesign"), "a");
	assert.equal(
		getServiceSectionTitles("en", "base:api-integrations", "API integrations")
			.scope,
		"What an API integrations project includes",
	);
});
