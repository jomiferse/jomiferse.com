import type { ContactSubmissionResult } from "@/lib/contact-submission";

type Gtag = (...args: unknown[]) => void;

export function trackContactLead(
	result: ContactSubmissionResult,
	gtag?: Gtag,
): boolean {
	if (result !== "success" || !gtag) return false;

	gtag("event", "generate_lead");
	return true;
}
