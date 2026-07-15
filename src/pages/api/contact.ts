import type { APIRoute } from "astro";
import { getTranslations } from "@/i18n";
import {
	FixedWindowContactRateLimiter,
	createContactHandler,
	createContactRateLimitIdentity,
	readContactEnvironment,
} from "@/lib/contact-handler";
import { createResendContactTransport } from "@/lib/resend-contact-transport";
import { getServicePages } from "@/lib/services";

export const prerender = false;

const locales = ["en", "es"] as const;
const allowedServices = new Set([
	"assessment",
	...locales.flatMap((locale) =>
		getServicePages(locale).map((service) => service.slug),
	),
]);
const rateLimiter = new FixedWindowContactRateLimiter();

const transport = createResendContactTransport();

const handler = createContactHandler({
	allowedServices,
	getEnvironment: () =>
		readContactEnvironment({
			RESEND_API_KEY: import.meta.env.RESEND_API_KEY,
			CONTACT_FROM: import.meta.env.CONTACT_FROM,
			CONTACT_TO: import.meta.env.CONTACT_TO,
		}),
	transport,
	rateLimiter,
	getRateLimitIdentity: createContactRateLimitIdentity,
	getSelectionLabels: (input) => {
		const copy = getTranslations(input.locale).contactForm;
		const service =
			input.service === "assessment"
				? copy.assessmentLabel
				: getServicePages(input.locale).find(
						(candidate) => candidate.slug === input.service,
					)?.title;

		return {
			service: service ?? "-",
			scope: input.scope ? copy.scopes[input.scope] : "-",
		};
	},
	now: Date.now,
});

export const POST: APIRoute = async ({ request }) => handler(request);
