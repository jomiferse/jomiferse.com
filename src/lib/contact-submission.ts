export type ContactSubmissionResult = "success" | "validation" | "delivery";

export function parseContactSubmissionResult(
	responseUrl: string,
): ContactSubmissionResult {
	const params = new URL(responseUrl, "https://www.jomiferse.com").searchParams;

	if (params.get("sent") === "1") return "success";
	if (params.get("error") === "missing") return "validation";

	return "delivery";
}
