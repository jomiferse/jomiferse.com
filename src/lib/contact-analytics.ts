import {
	parseContactSubmissionResult,
	type ContactSubmissionResult,
} from "./contact-submission.ts";

type Gtag = (...args: unknown[]) => void;

type ContactLeadTrackingOptions = {
	analyticsEnabled: boolean;
	gtag?: Gtag;
};

export function trackContactLead(
	result: ContactSubmissionResult,
	gtag?: Gtag,
): boolean {
	if (result !== "success" || !gtag) return false;

	gtag("event", "generate_lead");
	return true;
}

export function consumeContactLeadRedirect(
	locationHref: string,
	options: ContactLeadTrackingOptions,
): string | null {
	if (!options.analyticsEnabled) return null;

	const url = new URL(locationHref, "https://www.jomiferse.com");
	const result = parseContactSubmissionResult(url.toString());
	if (!trackContactLead(result, options.gtag)) return null;

	url.searchParams.delete("sent");
	url.searchParams.delete("error");
	return `${url.pathname}${url.search}${url.hash}`;
}
