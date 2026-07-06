import assert from "node:assert/strict";
import { test } from "node:test";

import {
	CONSENT_STORAGE_KEY,
	buildConsentModeState,
	getInitialAnalyticsPreference,
	getShouldLoadTagManager,
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

test("loads Tag Manager only when both consent and a container id exist", () => {
	assert.equal(
		getShouldLoadTagManager({ analytics: true }, "GTM-ABC123"),
		true,
	);
	assert.equal(getShouldLoadTagManager({ analytics: true }, ""), false);
	assert.equal(
		getShouldLoadTagManager({ analytics: false }, "GTM-ABC123"),
		false,
	);
	assert.equal(getShouldLoadTagManager(null, "GTM-ABC123"), false);
});

test("shows analytics enabled by default before the user saves preferences", () => {
	assert.equal(getInitialAnalyticsPreference(null), true);
	assert.equal(getInitialAnalyticsPreference({ analytics: true }), true);
	assert.equal(getInitialAnalyticsPreference({ analytics: false }), false);
});
