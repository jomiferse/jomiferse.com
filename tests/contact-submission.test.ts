import assert from "node:assert/strict";
import { test } from "node:test";

import { parseContactSubmissionResult } from "../src/lib/contact-submission.ts";

test("maps the contact redirect to an inline success state", () => {
	assert.equal(
		parseContactSubmissionResult("https://site.test/es/contact?sent=1"),
		"success",
	);
});

test("maps a missing-fields redirect to validation", () => {
	assert.equal(
		parseContactSubmissionResult("https://site.test/es/contact?error=missing"),
		"validation",
	);
});

test("maps delivery redirects and unknown responses to delivery", () => {
	assert.equal(
		parseContactSubmissionResult("https://site.test/es/contact?error=send"),
		"delivery",
	);
	assert.equal(
		parseContactSubmissionResult("https://site.test/es/contact"),
		"delivery",
	);
});
