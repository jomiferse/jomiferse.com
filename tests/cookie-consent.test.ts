import assert from "node:assert/strict";
import { test } from "node:test";

import {
	CONSENT_STORAGE_KEY,
	buildConsentModeState,
	getInitialAnalyticsPreference,
	getShouldLoadAnalytics,
	parseStoredCookieConsent,
	serializeCookieConsent,
} from "../src/lib/cookie-consent.ts";

test("uses a stable localStorage key for cookie preferences", () => {
	assert.equal(CONSENT_STORAGE_KEY, "jomiferse.cookie-consent.v1");
});

test("parses valid stored analytics consent", () => {
	assert.deepEqual(parseStoredCookieConsent('{"analytics":true}'), {
		analytics: true,
	});
	assert.deepEqual(parseStoredCookieConsent('{"analytics":false}'), {
		analytics: false,
	});
});

test("ignores missing or invalid stored consent", () => {
	assert.equal(parseStoredCookieConsent(null), null);
	assert.equal(parseStoredCookieConsent(""), null);
	assert.equal(parseStoredCookieConsent("{bad json"), null);
	assert.equal(parseStoredCookieConsent('{"analytics":"yes"}'), null);
});

test("serializes only the preference surface needed by the browser", () => {
	assert.equal(
		serializeCookieConsent({ analytics: true }),
		'{"analytics":true}',
	);
	assert.equal(
		serializeCookieConsent({ analytics: false }),
		'{"analytics":false}',
	);
});

test("keeps advertising consent denied in every consent mode state", () => {
	assert.deepEqual(buildConsentModeState(true), {
		analytics_storage: "granted",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
	});
	assert.deepEqual(buildConsentModeState(false), {
		analytics_storage: "denied",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
	});
});

test("loads analytics only when both consent and a measurement id exist", () => {
	assert.equal(getShouldLoadAnalytics({ analytics: true }, "G-ABC123"), true);
	assert.equal(getShouldLoadAnalytics({ analytics: true }, ""), false);
	assert.equal(getShouldLoadAnalytics({ analytics: false }, "G-ABC123"), false);
	assert.equal(getShouldLoadAnalytics(null, "G-ABC123"), false);
});

test("keeps analytics disabled until the user opts in", () => {
	assert.equal(getInitialAnalyticsPreference(null), false);
	assert.equal(getInitialAnalyticsPreference({ analytics: true }), true);
	assert.equal(getInitialAnalyticsPreference({ analytics: false }), false);
});
