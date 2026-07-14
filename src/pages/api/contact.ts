import type { APIRoute } from "astro";
import { Resend } from "resend";
import { getCv } from "@cv";
import { getTranslations, type Locale } from "@/i18n";
import { normalizeContactSource } from "@/lib/contact-source";
import { pricingKeys, type PricingKey } from "@/lib/service-commercial";
import { getServicePages } from "@/lib/services";

export const prerender = false;

const isLocale = (v: string): v is Locale => v === "en" || v === "es";
const isPricingKey = (value: string): value is PricingKey =>
	pricingKeys.some((key) => key === value);
const isValidEmail = (value: string) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const redirectToContact = (
	locale: Locale,
	status: { sent?: "1"; error?: "missing" | "send" },
	selectedService: string,
	selectedScope: string,
) => {
	const params = new URLSearchParams();
	if (status.sent) params.set("sent", status.sent);
	if (status.error) params.set("error", status.error);
	if (selectedService) params.set("service", selectedService);
	if (selectedScope) params.set("scope", selectedScope);

	return new Response(null, {
		status: 303,
		headers: { Location: `/${locale}/contact?${params.toString()}` },
	});
};

export const POST: APIRoute = async ({ request }) => {
	const form = await request.formData();

	const localeRaw = String(form.get("locale") ?? "es");
	const locale: Locale = isLocale(localeRaw) ? localeRaw : "es";
	const cv = getCv(locale);

	const name = String(form.get("name") ?? "").trim();
	const email = String(form.get("email") ?? "").trim();
	const message = String(form.get("message") ?? "").trim();
	const serviceRaw = String(form.get("service") ?? "").trim();
	const scopeRaw = String(form.get("scope") ?? "").trim();
	const source = normalizeContactSource(
		String(form.get("sourceCategory") ?? "direct").trim(),
		String(form.get("sourcePath") ?? "").trim(),
	);

	const servicePage = getServicePages(locale).find(
		(service) => service.slug === serviceRaw,
	);
	const selectedService =
		serviceRaw === "assessment" || servicePage ? serviceRaw : "";
	const selectedScope =
		selectedService && scopeRaw && isPricingKey(scopeRaw) ? scopeRaw : "";
	const contactCopy = getTranslations(locale).contactForm;
	const selectedServiceLabel =
		selectedService === "assessment"
			? contactCopy.assessmentLabel
			: servicePage?.title;
	const selectedScopeLabel = selectedScope
		? contactCopy.scopes[selectedScope]
		: undefined;

	if (!name || !email || !isValidEmail(email) || !message) {
		return redirectToContact(
			locale,
			{ error: "missing" },
			selectedService,
			selectedScope,
		);
	}

	try {
		const resend = new Resend(import.meta.env.RESEND_API_KEY);
		const result = await resend.emails.send({
			from: "Website <onboarding@resend.dev>",
			to: cv.email,
			replyTo: email,
			subject: `Website contact from ${email}`,
			text: `Name: ${name}\nEmail: ${email}\nService: ${selectedServiceLabel ?? "-"}\nScope: ${selectedScopeLabel ?? "-"}\nLocale: ${locale}\nSource: ${source.category}${source.path ? ` (${source.path})` : ""}\n\n${message}`,
		});

		if (result.error) {
			return redirectToContact(
				locale,
				{ error: "send" },
				selectedService,
				selectedScope,
			);
		}
	} catch {
		return redirectToContact(
			locale,
			{ error: "send" },
			selectedService,
			selectedScope,
		);
	}

	return redirectToContact(
		locale,
		{ sent: "1" },
		selectedService,
		selectedScope,
	);
};
