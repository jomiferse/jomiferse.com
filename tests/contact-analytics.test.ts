import assert from "node:assert/strict";
import { test } from "node:test";

import {
	consumeContactLeadRedirect,
	trackContactLead,
} from "../src/lib/contact-analytics.ts";

test("tracks a generated lead after a successful contact delivery", () => {
	const calls: unknown[][] = [];

	const tracked = trackContactLead(
		"success",
		{
			service: "website-redesign",
			locale: "es",
			scope: "project",
		},
		(...args) => calls.push(args),
	);

	assert.equal(tracked, true);
	assert.deepEqual(calls, [
		[
			"event",
			"generate_lead",
			{
				lead_service: "website-redesign",
				lead_locale: "es",
				lead_scope: "project",
			},
		],
	]);
});

test("tracks only the approved non-personal lead context", () => {
	const calls: unknown[][] = [];
	const context = {
		service: "internal-tools",
		locale: "en",
		scope: "support",
		name: "Private name",
		email: "private@example.com",
		message: "Private message",
		sourcePath: "/en/private-source/",
	};

	trackContactLead("success", context, (...args) => calls.push(args));

	assert.deepEqual(calls, [
		[
			"event",
			"generate_lead",
			{
				lead_service: "internal-tools",
				lead_locale: "en",
				lead_scope: "support",
			},
		],
	]);
});

test("uses unspecified for missing lead context", () => {
	const calls: unknown[][] = [];

	trackContactLead(
		"success",
		{ service: undefined, locale: "es", scope: undefined },
		(...args) => calls.push(args),
	);

	assert.deepEqual(calls, [
		[
			"event",
			"generate_lead",
			{
				lead_service: "unspecified",
				lead_locale: "es",
				lead_scope: "unspecified",
			},
		],
	]);
});

test("does not track a lead after validation or delivery failures", () => {
	const calls: unknown[][] = [];
	const record = (...args: unknown[]) => calls.push(args);

	const context = { service: "assessment", locale: "es", scope: "project" };
	assert.equal(trackContactLead("validation", context, record), false);
	assert.equal(trackContactLead("delivery", context, record), false);
	assert.deepEqual(calls, []);
});

test("keeps successful submissions working when analytics is unavailable", () => {
	assert.equal(
		trackContactLead("success", {
			service: "assessment",
			locale: "es",
			scope: "project",
		}),
		false,
	);
});

test("tracks a confirmed contact redirect and returns a refresh-safe URL", () => {
	const calls: unknown[][] = [];
	const record = (...args: unknown[]) => calls.push(args);
	const redirectUrl =
		"https://www.jomiferse.com/es/contact?sent=1&service=assessment&sourceCategory=landing&sourcePath=%2Fes%2Fdiseno-web-granada#contact-status-sent";

	const cleanUrl = consumeContactLeadRedirect(redirectUrl, {
		analyticsEnabled: true,
		leadContext: {
			service: "assessment",
			locale: "es",
			scope: undefined,
		},
		gtag: record,
	});

	assert.equal(
		cleanUrl,
		"/es/contact?service=assessment&sourceCategory=landing&sourcePath=%2Fes%2Fdiseno-web-granada#contact-status-sent",
	);
	assert.deepEqual(calls, [
		[
			"event",
			"generate_lead",
			{
				lead_service: "assessment",
				lead_locale: "es",
				lead_scope: "unspecified",
			},
		],
	]);
	assert.equal(
		consumeContactLeadRedirect(cleanUrl, {
			analyticsEnabled: true,
			leadContext: {
				service: "assessment",
				locale: "es",
				scope: undefined,
			},
			gtag: record,
		}),
		null,
	);
	assert.equal(calls.length, 1);
});

test("does not consume failed contact redirects", () => {
	const calls: unknown[][] = [];
	const record = (...args: unknown[]) => calls.push(args);

	assert.equal(
		consumeContactLeadRedirect("/es/contact?error=missing", {
			analyticsEnabled: true,
			leadContext: {
				service: undefined,
				locale: "es",
				scope: undefined,
			},
			gtag: record,
		}),
		null,
	);
	assert.equal(
		consumeContactLeadRedirect("/es/contact?error=send", {
			analyticsEnabled: true,
			leadContext: {
				service: undefined,
				locale: "es",
				scope: undefined,
			},
			gtag: record,
		}),
		null,
	);
	assert.deepEqual(calls, []);
});

test("keeps a confirmed redirect available when analytics is unavailable", () => {
	assert.equal(
		consumeContactLeadRedirect("/es/contact?sent=1", {
			analyticsEnabled: true,
			leadContext: {
				service: undefined,
				locale: "es",
				scope: undefined,
			},
		}),
		null,
	);
});

test("keeps a confirmed redirect available when analytics consent is denied", () => {
	const calls: unknown[][] = [];

	assert.equal(
		consumeContactLeadRedirect("/es/contact?sent=1", {
			analyticsEnabled: false,
			leadContext: {
				service: undefined,
				locale: "es",
				scope: undefined,
			},
			gtag: (...args) => calls.push(args),
		}),
		null,
	);
	assert.deepEqual(calls, []);
});
