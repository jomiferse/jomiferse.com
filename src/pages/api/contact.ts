import type { APIRoute } from "astro";
import { Resend } from "resend";
import { getCv } from "@cv";
import { getTranslations, type Locale } from "@/i18n";
import { normalizeContactSource } from "@/lib/contact-source";
import { pricingKeys, type PricingKey } from "@/lib/service-commercial";
import { getServicePages } from "@/lib/services";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const MAX_PDF_BYTES = 4 * 1024 * 1024;

const isLocale = (v: string): v is Locale => v === "en" || v === "es";
const isPricingKey = (value: string): value is PricingKey =>
	pricingKeys.some((key) => key === value);

export const POST: APIRoute = async ({ request }) => {
	const form = await request.formData();

	const localeRaw = String(form.get("locale") ?? "es");
	const locale: Locale = isLocale(localeRaw) ? localeRaw : "es";
	const cv = getCv(locale);

	const name = String(form.get("name") ?? "").trim();
	const email = String(form.get("email") ?? "").trim();
	const projectType = String(form.get("projectType") ?? "").trim();
	const message = String(form.get("message") ?? "").trim();
	const serviceRaw = String(form.get("service") ?? "").trim();
	const scopeRaw = String(form.get("scope") ?? "").trim();
	const source = normalizeContactSource(
		String(form.get("sourceCategory") ?? "direct").trim(),
		String(form.get("sourcePath") ?? "").trim(),
	);

	if (!name || !email || !projectType || !message) {
		return new Response("Missing fields", { status: 400 });
	}
	if (scopeRaw && !isPricingKey(scopeRaw)) {
		return new Response("Invalid scope", { status: 400 });
	}

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

	const subject = `Website contact from ${email}`;

	let attachments: { filename: string; content: Buffer }[] = [];
	const file = form.get("attachment");

	if (file && typeof file === "object" && "arrayBuffer" in file) {
		const f = file as {
			size: number;
			type?: string;
			name?: string;
			arrayBuffer: () => Promise<ArrayBuffer>;
		};

		if (f.size > 0) {
			const filename = (f.name ?? "attachment.pdf").toString();
			const type = (f.type ?? "").toString();

			if (
				type &&
				type !== "application/pdf" &&
				!filename.toLowerCase().endsWith(".pdf")
			) {
				return new Response("Only PDF files allowed", { status: 400 });
			}

			if (f.size > MAX_PDF_BYTES) {
				return new Response("PDF too large (max 4MB)", { status: 400 });
			}

			const buffer = Buffer.from(await f.arrayBuffer());
			attachments.push({ filename, content: buffer });
		}
	}

	await resend.emails.send({
		from: "Website <onboarding@resend.dev>",
		to: cv.email,
		replyTo: email,
		subject,
		text: `Name: ${name}\nEmail: ${email}\nProject type: ${projectType}\nService: ${selectedServiceLabel ?? "-"}\nScope: ${selectedScopeLabel ?? "-"}\nLocale: ${locale}\nSource: ${source.category}${source.path ? ` (${source.path})` : ""}\n\n${message}`,
		attachments,
	});

	const redirectParams = new URLSearchParams({ sent: "1" });
	if (selectedService) redirectParams.set("service", selectedService);
	if (selectedScope) redirectParams.set("scope", selectedScope);

	return new Response(null, {
		status: 303,
		headers: { Location: `/${locale}/contact?${redirectParams.toString()}` },
	});
};
