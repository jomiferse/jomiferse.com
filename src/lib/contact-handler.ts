import {
	MAX_CONTACT_BODY_BYTES,
	parseContactFormData,
	type ContactInput,
	type ContactRedirectContext,
} from "./contact-input.ts";

export const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1_000;
export const CONTACT_FAILURE_COOLDOWN_MS = 30 * 1_000;

export interface ContactEnvironment {
	apiKey: string;
	from: string;
	to: string;
}

const isConfiguredAddress = (value: string) => {
	if (/[\r\n]/.test(value) || value.length > 320) return false;
	const bracketed = value.match(/<([^<>]+)>$/)?.[1];
	const address = bracketed ?? value;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address);
};

export function readContactEnvironment(
	values: Record<string, string | undefined>,
): ContactEnvironment | null {
	const apiKey = values.RESEND_API_KEY?.trim() ?? "";
	const from = values.CONTACT_FROM?.trim() ?? "";
	const to = values.CONTACT_TO?.trim() ?? "";

	if (!apiKey || !isConfiguredAddress(from) || !isConfiguredAddress(to)) {
		return null;
	}

	return { apiKey, from, to };
}

export interface ContactEmailMessage {
	from: string;
	to: string;
	replyTo: string;
	subject: string;
	text: string;
	idempotencyKey: string;
}

export type ContactEmailTransportStatus = "sent" | "suppressed" | "failed";

export const mapResendTransportError = (
	name: string,
): ContactEmailTransportStatus =>
	name === "invalid_idempotent_request" ? "suppressed" : "failed";

export interface ContactEmailTransport {
	send(
		message: ContactEmailMessage,
		apiKey: string,
	): Promise<ContactEmailTransportStatus>;
}

export interface ContactRateLimitIdentity {
	key: string;
	idempotencyKey: string;
}

export interface ContactRateLimiter {
	acquire(key: string, now: number): boolean;
	recordFailure(key: string, now: number): void;
}

export interface ContactHandlerDependencies {
	allowedServices: ReadonlySet<string>;
	getEnvironment: () => ContactEnvironment | null;
	transport: ContactEmailTransport;
	rateLimiter: ContactRateLimiter;
	getRateLimitIdentity: (
		request: Request,
		secret: string,
		now: number,
	) => Promise<ContactRateLimitIdentity>;
	getSelectionLabels: (input: ContactInput) => {
		service: string;
		scope: string;
	};
	now: () => number;
}

const lineValue = (value: string) =>
	value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

const messageValue = (value: string) =>
	value
		.replace(/\r\n?/g, "\n")
		.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
		.trim();

export async function sendContactEmail(
	input: ContactInput,
	transport: ContactEmailTransport,
	environment: ContactEnvironment,
	options: {
		idempotencyKey: string;
		serviceLabel: string;
		scopeLabel: string;
	},
): Promise<ContactEmailTransportStatus> {
	const source = `${input.source.category}${
		input.source.path ? ` (${input.source.path})` : ""
	}`;
	const text = [
		`Name: ${lineValue(input.name)}`,
		`Email: ${lineValue(input.email)}`,
		`Service: ${lineValue(options.serviceLabel) || "-"}`,
		`Scope: ${lineValue(options.scopeLabel) || "-"}`,
		`Locale: ${input.locale}`,
		`Source: ${lineValue(source)}`,
		"",
		messageValue(input.message),
	].join("\n");

	return transport.send(
		{
			from: environment.from,
			to: environment.to,
			replyTo: lineValue(input.email),
			subject: `Website enquiry (${input.locale})`,
			text,
			idempotencyKey: options.idempotencyKey,
		},
		environment.apiKey,
	);
}

const redirectToContact = (
	redirect: ContactRedirectContext,
	status: { sent?: "1"; error?: "missing" | "send" },
) => {
	const params = new URLSearchParams();
	if (status.sent) params.set("sent", status.sent);
	if (status.error) params.set("error", status.error);
	if (redirect.service) params.set("service", redirect.service);
	if (redirect.scope) params.set("scope", redirect.scope);

	const statusTarget = status.sent
		? "sent"
		: status.error === "missing"
			? "missing"
			: "send";

	return new Response(null, {
		status: 303,
		headers: {
			Location: `/${redirect.locale}/contact?${params.toString()}#contact-status-${statusTarget}`,
		},
	});
};

const defaultRedirect: ContactRedirectContext = {
	locale: "es",
	service: "",
	scope: "",
};

const hasAcceptableContentLength = (request: Request) => {
	const value = request.headers.get("content-length");
	if (value === null) return true;
	if (!/^\d+$/.test(value)) return false;
	return Number(value) <= MAX_CONTACT_BODY_BYTES;
};

const readBoundedFormData = async (request: Request) => {
	if (!request.body) return null;

	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let totalBytes = 0;

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		totalBytes += value.byteLength;
		if (totalBytes > MAX_CONTACT_BODY_BYTES) {
			return null;
		}
		chunks.push(value);
	}

	const body = new Uint8Array(totalBytes);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}

	const headers = new Headers(request.headers);
	headers.delete("content-length");
	return new Request(request.url, {
		method: "POST",
		headers,
		body,
	}).formData();
};

export function createContactHandler(deps: ContactHandlerDependencies) {
	return async (request: Request): Promise<Response> => {
		if (!hasAcceptableContentLength(request)) {
			return redirectToContact(defaultRedirect, { error: "missing" });
		}

		let form: FormData;
		try {
			const boundedForm = await readBoundedFormData(request);
			if (!boundedForm) {
				return redirectToContact(defaultRedirect, { error: "missing" });
			}
			form = boundedForm;
		} catch {
			return redirectToContact(defaultRedirect, { error: "missing" });
		}

		const parsed = parseContactFormData(form, deps.allowedServices);
		if (!parsed.ok) {
			return redirectToContact(parsed.redirect, { error: "missing" });
		}

		if (parsed.input.honeypot) {
			return redirectToContact(parsed.redirect, { sent: "1" });
		}

		const environment = deps.getEnvironment();
		if (!environment) {
			return redirectToContact(parsed.redirect, { error: "send" });
		}

		let acquiredKey: string | undefined;
		try {
			const now = deps.now();
			const identity = await deps.getRateLimitIdentity(
				request,
				environment.apiKey,
				now,
			);
			if (!deps.rateLimiter.acquire(identity.key, now)) {
				return redirectToContact(parsed.redirect, { sent: "1" });
			}
			acquiredKey = identity.key;

			const labels = deps.getSelectionLabels(parsed.input);
			const result = await sendContactEmail(
				parsed.input,
				deps.transport,
				environment,
				{
					idempotencyKey: identity.idempotencyKey,
					serviceLabel: labels.service,
					scopeLabel: labels.scope,
				},
			);

			if (result === "failed") {
				deps.rateLimiter.recordFailure(identity.key, deps.now());
				return redirectToContact(parsed.redirect, { error: "send" });
			}

			return redirectToContact(parsed.redirect, { sent: "1" });
		} catch {
			if (acquiredKey !== undefined) {
				deps.rateLimiter.recordFailure(acquiredKey, deps.now());
			}
			return redirectToContact(parsed.redirect, { error: "send" });
		}
	};
}

const bytesToHex = (bytes: Uint8Array) =>
	Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

export async function createContactRateLimitIdentity(
	request: Request,
	secret: string,
	now: number,
): Promise<ContactRateLimitIdentity> {
	const forwardedFor = request.headers
		.get("x-vercel-forwarded-for")
		?.split(",", 1)[0]
		?.trim()
		.slice(0, 128);
	const clientAddress = forwardedFor || "unknown-client";
	const key = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const signature = await crypto.subtle.sign(
		"HMAC",
		key,
		new TextEncoder().encode(clientAddress),
	);
	const digest = bytesToHex(new Uint8Array(signature)).slice(0, 32);
	const bucket = Math.floor(now / CONTACT_RATE_LIMIT_WINDOW_MS);

	return {
		key: `contact:${digest}`,
		idempotencyKey: `contact/${bucket}/${digest}`,
	};
}

export class FixedWindowContactRateLimiter implements ContactRateLimiter {
	private readonly records = new Map<string, number>();

	acquire(key: string, now: number) {
		if (this.records.size > 1_000) {
			for (const [recordKey, expiresAt] of this.records) {
				if (expiresAt <= now) this.records.delete(recordKey);
			}
		}
		const expiresAt = this.records.get(key);
		if (expiresAt !== undefined && expiresAt > now) {
			return false;
		}
		this.records.set(key, now + CONTACT_RATE_LIMIT_WINDOW_MS);
		return true;
	}

	recordFailure(key: string, now: number) {
		this.records.set(key, now + CONTACT_FAILURE_COOLDOWN_MS);
	}
}
