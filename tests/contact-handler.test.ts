import assert from "node:assert/strict";
import { test } from "node:test";

import {
	CONTACT_FAILURE_COOLDOWN_MS,
	CONTACT_RATE_LIMIT_WINDOW_MS,
	FixedWindowContactRateLimiter,
	createContactHandler,
	createContactRateLimitIdentity,
	mapResendTransportError,
	readContactEnvironment,
	sendContactEmail,
	type ContactEmailMessage,
	type ContactEmailTransport,
	type ContactRateLimiter,
} from "../src/lib/contact-handler.ts";
import type { ContactInput } from "../src/lib/contact-input.ts";

const environment = {
	apiKey: "re_test_secret",
	from: "Website <contact@example.com>",
	to: "owner@example.com",
};

test("reads all required mail settings or rejects the configuration", () => {
	assert.deepEqual(
		readContactEnvironment({
			RESEND_API_KEY: " re_test_secret ",
			CONTACT_FROM: " Website <contact@example.com> ",
			CONTACT_TO: " owner@example.com ",
		}),
		environment,
	);
	assert.equal(
		readContactEnvironment({
			RESEND_API_KEY: "re_test_secret",
			CONTACT_FROM: "Website <contact@example.com>",
		}),
		null,
	);
});

test("suppresses duplicate idempotency conflicts but not concurrent sends", () => {
	assert.equal(
		mapResendTransportError("invalid_idempotent_request"),
		"suppressed",
	);
	assert.equal(
		mapResendTransportError("concurrent_idempotent_requests"),
		"failed",
	);
	assert.equal(mapResendTransportError("rate_limit_exceeded"), "failed");
});

const validForm = (overrides: Record<string, string> = {}) => {
	const form = new FormData();
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

	for (const [key, value] of Object.entries(values)) form.set(key, value);
	return form;
};

const requestFor = (form: FormData, headers?: HeadersInit) =>
	new Request("https://www.jomiferse.com/api/contact", {
		method: "POST",
		body: form,
		headers,
	});

const makeHarness = (
	options: {
		transportStatus?: "sent" | "suppressed" | "failed";
		transport?: ContactEmailTransport;
		environment?: typeof environment | null;
		limited?: boolean;
		rateLimiter?: ContactRateLimiter;
		now?: () => number;
	} = {},
) => {
	const messages: ContactEmailMessage[] = [];
	let rateReservations = 0;
	let failureCooldowns = 0;
	const defaultTransport: ContactEmailTransport = {
		async send(message) {
			messages.push(message);
			return options.transportStatus ?? "sent";
		},
	};
	const handler = createContactHandler({
		allowedServices: new Set(["assessment", "business-website"]),
		getEnvironment: () =>
			options.environment === undefined ? environment : options.environment,
		transport: options.transport ?? defaultTransport,
		rateLimiter: options.rateLimiter ?? {
			acquire: () => {
				if (options.limited) return false;
				rateReservations += 1;
				return true;
			},
			recordFailure: () => {
				failureCooldowns += 1;
			},
		},
		getRateLimitIdentity: async () => ({
			key: "hashed-client",
			idempotencyKey: "contact/123/hashed-client",
		}),
		getSelectionLabels: (input) => ({
			service: input.service === "business-website" ? "Business website" : "-",
			scope: input.scope === "project" ? "Complete project" : "-",
		}),
		now: options.now ?? (() => 1_000),
	});

	return {
		handler,
		messages,
		get rateReservations() {
			return rateReservations;
		},
		get failureCooldowns() {
			return failureCooldowns;
		},
	};
};

test("redirects a valid submission to success and preserves its selection", async () => {
	const harness = makeHarness();
	const response = await harness.handler(requestFor(validForm()));

	assert.equal(response.status, 303);
	assert.equal(
		response.headers.get("location"),
		"/en/contact?sent=1&service=business-website&scope=project#contact-status-sent",
	);
	assert.equal(harness.messages.length, 1);
	assert.equal(harness.messages[0]?.from, environment.from);
	assert.equal(harness.messages[0]?.to, environment.to);
	assert.equal(
		harness.messages[0]?.idempotencyKey,
		"contact/123/hashed-client",
	);
	assert.equal(harness.rateReservations, 1);
});

test("redirects empty, malformed and excessive bodies to validation", async () => {
	const harness = makeHarness();
	const empty = await harness.handler(
		new Request("https://www.jomiferse.com/api/contact", {
			method: "POST",
			body: new URLSearchParams(),
		}),
	);
	const malformed = await harness.handler(
		new Request("https://www.jomiferse.com/api/contact", {
			method: "POST",
			body: "not form data",
			headers: { "content-type": "text/plain" },
		}),
	);
	const excessive = await harness.handler(
		requestFor(validForm(), { "content-length": "32769" }),
	);
	const excessiveWithoutHeader = await harness.handler(
		requestFor(validForm({ message: "M".repeat(40_000) })),
	);

	for (const response of [
		empty,
		malformed,
		excessive,
		excessiveWithoutHeader,
	]) {
		assert.equal(response.status, 303);
		assert.equal(
			response.headers.get("location"),
			"/es/contact?error=missing#contact-status-missing",
		);
	}
	assert.equal(harness.messages.length, 0);
});

test("returns neutral success without sending when the honeypot is filled", async () => {
	const harness = makeHarness();
	const response = await harness.handler(
		requestFor(validForm({ website: "https://spam.test" })),
	);

	assert.equal(response.status, 303);
	assert.equal(
		response.headers.get("location"),
		"/en/contact?sent=1&service=business-website&scope=project#contact-status-sent",
	);
	assert.equal(harness.messages.length, 0);
});

test("returns the same neutral success when the client is rate limited", async () => {
	const harness = makeHarness({ limited: true });
	const response = await harness.handler(requestFor(validForm()));

	assert.equal(response.status, 303);
	assert.equal(
		response.headers.get("location"),
		"/en/contact?sent=1&service=business-website&scope=project#contact-status-sent",
	);
	assert.equal(harness.messages.length, 0);
});

test("redirects controlled configuration and provider failures", async () => {
	const missingConfig = makeHarness({ environment: null });
	const providerFailure = makeHarness({ transportStatus: "failed" });
	const responses = await Promise.all([
		missingConfig.handler(requestFor(validForm())),
		providerFailure.handler(requestFor(validForm())),
	]);

	for (const response of responses) {
		assert.equal(response.status, 303);
		assert.equal(
			response.headers.get("location"),
			"/en/contact?error=send&service=business-website&scope=project#contact-status-send",
		);
	}
	assert.equal(missingConfig.messages.length, 0);
	assert.equal(providerFailure.rateReservations, 1);
	assert.equal(providerFailure.failureCooldowns, 1);
});

test("normalizes user-controlled email text and keeps the subject fixed", async () => {
	let sentMessage: ContactEmailMessage | undefined;
	const transport: ContactEmailTransport = {
		async send(message) {
			sentMessage = message;
			return "sent";
		},
	};
	const input: ContactInput = {
		locale: "en",
		name: "Ada\r\nBcc: target@example.com",
		email: "ada@example.com\r\nInjected: yes",
		message: "First line\u0000\r\nSecond line",
		service: "business-website",
		scope: "project",
		source: { category: "service", path: "/en/services/business-website/" },
		honeypot: "",
	};

	const result = await sendContactEmail(input, transport, environment, {
		idempotencyKey: "contact/123/hash",
		serviceLabel: "Business website\r\nBcc: target@example.com",
		scopeLabel: "Complete project",
	});

	assert.equal(result, "sent");
	assert.equal(sentMessage?.subject, "Website enquiry (en)");
	assert.doesNotMatch(sentMessage?.text ?? "", /\r|\u0000/);
	assert.match(sentMessage?.text ?? "", /Name: Ada Bcc:/);
});

test("uses only Vercel's protected forwarding header for rate identity", async () => {
	const now = Date.UTC(2026, 6, 15, 12, 0, 0);
	const requestA = new Request("https://site.test/api/contact", {
		headers: {
			"x-vercel-forwarded-for": "203.0.113.10",
			"x-client-ip": "198.51.100.1",
			"x-forwarded-for": "198.51.100.2",
		},
	});
	const requestB = new Request("https://site.test/api/contact", {
		headers: {
			"x-vercel-forwarded-for": "203.0.113.10",
			"x-client-ip": "192.0.2.50",
			"x-forwarded-for": "192.0.2.51",
		},
	});
	const requestC = new Request("https://site.test/api/contact", {
		headers: { "x-vercel-forwarded-for": "203.0.113.11" },
	});

	const [identityA, identityB, identityC] = await Promise.all([
		createContactRateLimitIdentity(requestA, environment.apiKey, now),
		createContactRateLimitIdentity(requestB, environment.apiKey, now),
		createContactRateLimitIdentity(requestC, environment.apiKey, now),
	]);

	assert.deepEqual(identityA, identityB);
	assert.notEqual(identityA.key, identityC.key);
	assert.doesNotMatch(identityA.key, /203\.0\.113\.10/);
	assert.equal(
		identityA.idempotencyKey.split("/")[1],
		String(Math.floor(now / CONTACT_RATE_LIMIT_WINDOW_MS)),
	);
});

test("reserves a hash atomically and shortens failed attempts to a cooldown", () => {
	const limiter = new FixedWindowContactRateLimiter();
	const key = "already-hashed-client";

	assert.equal(limiter.acquire(key, 1_000), true);
	assert.equal(limiter.acquire(key, 1_001), false);
	limiter.recordFailure(key, 1_001);
	assert.equal(
		limiter.acquire(key, 1_001 + CONTACT_FAILURE_COOLDOWN_MS - 1),
		false,
	);
	assert.equal(limiter.acquire(key, 1_001 + CONTACT_FAILURE_COOLDOWN_MS), true);
	assert.equal(
		limiter.acquire(
			key,
			1_001 + CONTACT_FAILURE_COOLDOWN_MS + CONTACT_RATE_LIMIT_WINDOW_MS - 1,
		),
		false,
	);
});

test("sweeps expired successful reservations while acquiring new identities", () => {
	const limiter = new FixedWindowContactRateLimiter();
	for (let index = 0; index <= 1_000; index += 1) {
		assert.equal(limiter.acquire(`client-${index}`, 0), true);
	}

	assert.equal(
		limiter.acquire("current-client", CONTACT_RATE_LIMIT_WINDOW_MS),
		true,
	);
	const records = Reflect.get(limiter, "records") as Map<string, number>;
	assert.ok(records.size <= 1_000);
});

test("reserves before transport so concurrent submissions send only once", async () => {
	let releaseTransport: (() => void) | undefined;
	let transportStarted: (() => void) | undefined;
	const started = new Promise<void>((resolve) => {
		transportStarted = resolve;
	});
	const release = new Promise<void>((resolve) => {
		releaseTransport = resolve;
	});
	let sendCount = 0;
	const harness = makeHarness({
		rateLimiter: new FixedWindowContactRateLimiter(),
		transport: {
			async send() {
				sendCount += 1;
				transportStarted?.();
				await release;
				return "sent";
			},
		},
	});

	const first = harness.handler(requestFor(validForm()));
	await started;
	const second = await harness.handler(requestFor(validForm()));
	releaseTransport?.();
	await first;

	assert.equal(sendCount, 1);
	assert.match(second.headers.get("location") ?? "", /sent=1/);
});

test("retains a failure cooldown before allowing another provider attempt", async () => {
	let now = 1_000;
	let sendCount = 0;
	let releaseFirstFailure: (() => void) | undefined;
	let firstTransportStarted: (() => void) | undefined;
	const firstStarted = new Promise<void>((resolve) => {
		firstTransportStarted = resolve;
	});
	const firstFailure = new Promise<void>((resolve) => {
		releaseFirstFailure = resolve;
	});
	const harness = makeHarness({
		now: () => now,
		rateLimiter: new FixedWindowContactRateLimiter(),
		transport: {
			async send() {
				sendCount += 1;
				if (sendCount === 1) {
					firstTransportStarted?.();
					await firstFailure;
				}
				return "failed";
			},
		},
	});

	const firstPending = harness.handler(requestFor(validForm()));
	await firstStarted;
	now += 5_000;
	releaseFirstFailure?.();
	const first = await firstPending;
	const repeated = await harness.handler(requestFor(validForm()));
	now = 1_000 + CONTACT_FAILURE_COOLDOWN_MS;
	const beforeFailureCooldown = await harness.handler(requestFor(validForm()));
	now = 6_000 + CONTACT_FAILURE_COOLDOWN_MS;
	const afterCooldown = await harness.handler(requestFor(validForm()));

	assert.match(first.headers.get("location") ?? "", /error=send/);
	assert.match(repeated.headers.get("location") ?? "", /sent=1/);
	assert.match(beforeFailureCooldown.headers.get("location") ?? "", /sent=1/);
	assert.match(afterCooldown.headers.get("location") ?? "", /error=send/);
	assert.equal(sendCount, 2);
});
