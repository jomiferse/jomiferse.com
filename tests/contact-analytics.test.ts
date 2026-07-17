import assert from "node:assert/strict";
import { test } from "node:test";

import {
	consumeContactLeadRedirect,
	trackContactLead,
} from "../src/lib/contact-analytics.ts";

test("tracks a generated lead after a successful contact delivery", () => {
	const calls: unknown[][] = [];

	const tracked = trackContactLead("success", (...args) => calls.push(args));

	assert.equal(tracked, true);
	assert.deepEqual(calls, [["event", "generate_lead"]]);
});

test("does not track a lead after validation or delivery failures", () => {
	const calls: unknown[][] = [];
	const record = (...args: unknown[]) => calls.push(args);

	assert.equal(trackContactLead("validation", record), false);
	assert.equal(trackContactLead("delivery", record), false);
	assert.deepEqual(calls, []);
});

test("keeps successful submissions working when analytics is unavailable", () => {
	assert.equal(trackContactLead("success"), false);
});

test("tracks a confirmed contact redirect and returns a refresh-safe URL", () => {
	const calls: unknown[][] = [];
	const record = (...args: unknown[]) => calls.push(args);
	const redirectUrl =
		"https://www.jomiferse.com/es/contact?sent=1&service=assessment&sourceCategory=landing&sourcePath=%2Fes%2Fdiseno-web-granada#contact-status-sent";

	const cleanUrl = consumeContactLeadRedirect(redirectUrl, {
		analyticsEnabled: true,
		gtag: record,
	});

	assert.equal(
		cleanUrl,
		"/es/contact?service=assessment&sourceCategory=landing&sourcePath=%2Fes%2Fdiseno-web-granada#contact-status-sent",
	);
	assert.deepEqual(calls, [["event", "generate_lead"]]);
	assert.equal(
		consumeContactLeadRedirect(cleanUrl, {
			analyticsEnabled: true,
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
			gtag: record,
		}),
		null,
	);
	assert.equal(
		consumeContactLeadRedirect("/es/contact?error=send", {
			analyticsEnabled: true,
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
		}),
		null,
	);
});

test("keeps a confirmed redirect available when analytics consent is denied", () => {
	const calls: unknown[][] = [];

	assert.equal(
		consumeContactLeadRedirect("/es/contact?sent=1", {
			analyticsEnabled: false,
			gtag: (...args) => calls.push(args),
		}),
		null,
	);
	assert.deepEqual(calls, []);
});
