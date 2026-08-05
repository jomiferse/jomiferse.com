import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
	expectedServiceUrls,
	verifyAiSeoSources,
} from "../scripts/verify-ai-seo.mjs";

const validSources = {
	robots: [
		"User-agent: OAI-SearchBot",
		"Allow: /",
		"User-agent: ChatGPT-User",
		"Allow: /",
	].join("\n"),
	llms: expectedServiceUrls.join("\n"),
	seo: [
		'"@type": "ProfessionalService"',
		'"@type": "OfferCatalog"',
		"makesOffer: offers",
	].join("\n"),
};

test("accepts the complete AI discovery and commercial schema contract", () => {
	assert.deepEqual(verifyAiSeoSources(validSources), []);
});

test("reports every missing crawler, service URL and schema signal", () => {
	const issues = verifyAiSeoSources({ robots: "", llms: "", seo: "" });

	assert.equal(issues.length, 2 + expectedServiceUrls.length + 3);
	assert.ok(issues.some((issue) => issue.includes("OAI-SearchBot")));
	assert.ok(issues.some((issue) => issue.includes("ChatGPT-User")));
	assert.ok(issues.some((issue) => issue.includes(expectedServiceUrls[0])));
	assert.ok(issues.some((issue) => issue.includes("ProfessionalService")));
	assert.ok(issues.some((issue) => issue.includes("OfferCatalog")));
	assert.ok(issues.some((issue) => issue.includes("makesOffer")));
});

test("rejects HowTo schema", () => {
	const issues = verifyAiSeoSources({
		...validSources,
		seo: `${validSources.seo}\n"@type": "HowTo"`,
	});

	assert.deepEqual(issues, ["HowTo schema must not be present"]);
});

test("exposes the repository verification command", async () => {
	const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
		scripts?: Record<string, string>;
	};

	assert.equal(
		packageJson.scripts?.["verify:ai-seo"],
		"node scripts/verify-ai-seo.mjs",
	);
});
