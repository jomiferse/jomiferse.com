import assert from "node:assert/strict";
import { test } from "node:test";

import {
	MAX_CONTACT_BODY_BYTES,
	MAX_CONTACT_SOURCE_PATH_LENGTH,
	parseContactFormData,
} from "../src/lib/contact-input.ts";

const allowedServices = new Set(["assessment", "business-website"]);

const validForm = (overrides: Record<string, string> = {}) => {
	const values = {
		locale: "en",
		name: "Ada Lovelace",
		email: "ada@example.com",
		message: "I need help improving an internal business tool.",
		service: "business-website",
		scope: "project",
		sourceCategory: "service",
		sourcePath: "/en/services/business-website/",
		website: "",
		...overrides,
	};

	const form = new FormData();
	for (const [key, value] of Object.entries(values)) form.set(key, value);
	return form;
};

test("parses and trims a valid contact submission", () => {
	const result = parseContactFormData(
		validForm({ name: "  Ada Lovelace  " }),
		allowedServices,
	);

	assert.equal(result.ok, true);
	if (!result.ok) return;
	assert.equal(result.input.name, "Ada Lovelace");
	assert.equal(result.input.locale, "en");
	assert.equal(result.input.source.path, "/en/services/business-website/");
});

test("accepts a bounded page path for the direct global contact form", () => {
	const result = parseContactFormData(
		validForm({
			sourceCategory: "direct",
			sourcePath: "/en/blog/a-useful-article/",
		}),
		allowedServices,
	);

	assert.equal(result.ok, true);
	if (!result.ok) return;
	assert.deepEqual(result.input.source, { category: "direct", path: null });
});

test("accepts native no-JavaScript selection fields and rejects conflicts", () => {
	const fallback = validForm({ service: "", scope: "" });
	fallback.set("serviceFallback", "business-website");
	fallback.set("scopeFallback", "project");
	const result = parseContactFormData(fallback, allowedServices);

	assert.equal(result.ok, true);
	if (result.ok) {
		assert.equal(result.input.service, "business-website");
		assert.equal(result.input.scope, "project");
	}

	const conflict = validForm();
	conflict.set("serviceFallback", "assessment");
	assert.equal(parseContactFormData(conflict, allowedServices).ok, false);
});

test("rejects empty, malformed and oversized contact fields", () => {
	const invalidForms = [
		validForm({ name: "" }),
		validForm({ name: "A" }),
		validForm({ name: "N".repeat(101) }),
		validForm({ email: "not-an-email" }),
		validForm({ email: `${"a".repeat(244)}@example.com` }),
		validForm({ message: "Too short" }),
		validForm({ message: "M".repeat(5_001) }),
	];

	for (const form of invalidForms) {
		assert.equal(parseContactFormData(form, allowedServices).ok, false);
	}
});

test("rejects disallowed locale, service, scope and source values", () => {
	const invalidForms = [
		validForm({ locale: "fr" }),
		validForm({ service: "unknown-service" }),
		validForm({ scope: "enterprise" }),
		validForm({ sourceCategory: "advert" }),
		validForm({ sourcePath: "https://attacker.test/en/services/" }),
		validForm({ sourcePath: "/en/api/contact/" }),
	];

	for (const form of invalidForms) {
		assert.equal(parseContactFormData(form, allowedServices).ok, false);
	}
});

test("accepts a 2048-character source path and rejects longer paths", () => {
	const prefix = "/en/";
	const boundaryPath = `${prefix}${"a".repeat(
		MAX_CONTACT_SOURCE_PATH_LENGTH - prefix.length,
	)}`;
	const boundary = parseContactFormData(
		validForm({ sourcePath: boundaryPath }),
		allowedServices,
	);
	const excessive = parseContactFormData(
		validForm({ sourcePath: `${boundaryPath}a` }),
		allowedServices,
	);

	assert.equal(boundary.ok, true);
	assert.equal(excessive.ok, false);
});

test("exposes a conservative maximum encoded body size", () => {
	assert.equal(MAX_CONTACT_BODY_BYTES, 32_768);
});
