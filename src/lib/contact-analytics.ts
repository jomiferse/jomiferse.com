import {
	parseContactSubmissionResult,
	type ContactSubmissionResult,
} from "./contact-submission.ts";

type Gtag = (...args: unknown[]) => void;

export type ContactLeadContext = {
	service?: string;
	locale?: string;
	scope?: string;
};

type ContactLeadTrackingOptions = {
	analyticsEnabled: boolean;
	leadContext: ContactLeadContext;
	gtag?: Gtag;
};

const leadValue = (value: string | undefined) => value?.trim() || "unspecified";

export function trackContactLead(
	result: ContactSubmissionResult,
	context: ContactLeadContext,
	gtag?: Gtag,
): boolean {
	if (result !== "success" || !gtag) return false;

	gtag("event", "generate_lead", {
		lead_service: leadValue(context.service),
		lead_locale: leadValue(context.locale),
		lead_scope: leadValue(context.scope),
	});
	return true;
}

export function consumeContactLeadRedirect(
	locationHref: string,
	options: ContactLeadTrackingOptions,
): string | null {
	if (!options.analyticsEnabled) return null;

	const url = new URL(locationHref, "https://www.jomiferse.com");
	const result = parseContactSubmissionResult(url.toString());
	if (!trackContactLead(result, options.leadContext, options.gtag)) return null;

	url.searchParams.delete("sent");
	url.searchParams.delete("error");
	return `${url.pathname}${url.search}${url.hash}`;
}
