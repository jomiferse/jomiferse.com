import assert from "node:assert/strict";
import { test } from "node:test";
import {
	EXIT_INTENT_SESSION_KEY,
	canShowExitIntent,
	getExitIntentContext,
	isExitIntentRouteExcluded,
	type ExitIntentEligibility,
} from "../src/lib/exit-intent.ts";

test("uses one stable session key for the whole site", () => {
	assert.equal(EXIT_INTENT_SESSION_KEY, "jomiferse.exit-intent.v2");
});

test("excludes contact and privacy routes only", () => {
	assert.equal(isExitIntentRouteExcluded("/es/contact"), true);
	assert.equal(isExitIntentRouteExcluded("/en/privacy/"), true);
	assert.equal(isExitIntentRouteExcluded("/es/services"), false);
});

test("resolves contextual detail routes", () => {
	assert.equal(
		getExitIntentContext("/es/services/business-website"),
		"service",
	);
	assert.equal(getExitIntentContext("/es/projects/betx"), "project");
	assert.equal(
		getExitIntentContext("/es/blog/usar-ia-en-tu-producto-sin-humo"),
		"article",
	);
	assert.equal(getExitIntentContext("/es/about"), "generic");
});

const eligibleFinePointer: ExitIntentEligibility = {
	pointerCoarse: false,
	elapsedMs: 15_000,
	scrollRatio: 0,
	sessionShown: false,
	hasOpenDialog: false,
	cookieBannerVisible: false,
	documentHidden: false,
};

test("blocks exit intent when another surface or the document prevents it", () => {
	for (const override of [
		{ sessionShown: true },
		{ hasOpenDialog: true },
		{ cookieBannerVisible: true },
		{ documentHidden: true },
	]) {
		assert.equal(
			canShowExitIntent({ ...eligibleFinePointer, ...override }),
			false,
		);
	}
});

test("requires either 15 seconds or 25 percent scroll on fine pointers", () => {
	assert.equal(canShowExitIntent(eligibleFinePointer), true);
	assert.equal(
		canShowExitIntent({
			...eligibleFinePointer,
			elapsedMs: 0,
			scrollRatio: 0.25,
		}),
		true,
	);
	assert.equal(
		canShowExitIntent({
			...eligibleFinePointer,
			elapsedMs: 14_999,
			scrollRatio: 0.249,
		}),
		false,
	);
});

test("requires both 25 seconds and 50 percent scroll on coarse pointers", () => {
	const coarse = {
		...eligibleFinePointer,
		pointerCoarse: true,
		elapsedMs: 25_000,
		scrollRatio: 0.5,
	};
	assert.equal(canShowExitIntent(coarse), true);
	assert.equal(canShowExitIntent({ ...coarse, elapsedMs: 24_999 }), false);
	assert.equal(canShowExitIntent({ ...coarse, scrollRatio: 0.499 }), false);
});
