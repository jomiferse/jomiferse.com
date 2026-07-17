import assert from "node:assert/strict";
import { test } from "node:test";

import { trackContactLead } from "../src/lib/contact-analytics.ts";

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
