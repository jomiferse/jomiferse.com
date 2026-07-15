import assert from "node:assert/strict";
import { test } from "node:test";

import { createResendContactTransport } from "../src/lib/resend-contact-transport.ts";
import type { ContactEmailMessage } from "../src/lib/contact-handler.ts";

const message: ContactEmailMessage = {
	from: "Website <contact@example.com>",
	to: "owner@example.com",
	replyTo: "visitor@example.com",
	subject: "Website enquiry (en)",
	text: "Hello",
	idempotencyKey: "contact/1/hash",
};

test("maps Resend outcomes without contacting the provider", async () => {
	const success = createResendContactTransport(async () => null);
	const duplicate = createResendContactTransport(
		async () => "invalid_idempotent_request",
	);
	const concurrent = createResendContactTransport(
		async () => "concurrent_idempotent_requests",
	);
	const failure = createResendContactTransport(
		async () => "rate_limit_exceeded",
	);

	assert.equal(await success.send(message, "re_test"), "sent");
	assert.equal(await duplicate.send(message, "re_test"), "suppressed");
	assert.equal(await concurrent.send(message, "re_test"), "failed");
	assert.equal(await failure.send(message, "re_test"), "failed");
});

test("passes configuration and the normalized message to the Resend boundary", async () => {
	let captured: { message: ContactEmailMessage; apiKey: string } | undefined;
	const transport = createResendContactTransport(async (sent, apiKey) => {
		captured = { message: sent, apiKey };
		return null;
	});

	await transport.send(message, "re_test");
	assert.deepEqual(captured, { message, apiKey: "re_test" });
});
