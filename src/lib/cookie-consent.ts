export const CONSENT_STORAGE_KEY = "jomiferse.cookie-consent.v1";

export type CookieConsentPreferences = {
	analytics: boolean;
};

export type ConsentModeValue = "granted" | "denied";

export type ConsentModeState = {
	analytics_storage: ConsentModeValue;
	ad_storage: "denied";
	ad_user_data: "denied";
	ad_personalization: "denied";
};

export function parseStoredCookieConsent(
	value: string | null,
): CookieConsentPreferences | null {
	if (!value) return null;

	try {
		const parsed = JSON.parse(value) as Partial<CookieConsentPreferences>;
		if (typeof parsed.analytics !== "boolean") return null;

		return { analytics: parsed.analytics };
	} catch {
		return null;
	}
}

export function serializeCookieConsent(
	preferences: CookieConsentPreferences,
): string {
	return JSON.stringify({ analytics: preferences.analytics });
}

export function buildConsentModeState(analytics: boolean): ConsentModeState {
	return {
		analytics_storage: analytics ? "granted" : "denied",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
	};
}

export function getShouldLoadAnalytics(
	preferences: CookieConsentPreferences | null,
	measurementId: string,
): boolean {
	return Boolean(preferences?.analytics && measurementId.trim());
}

export function getInitialAnalyticsPreference(
	preferences: CookieConsentPreferences | null,
): boolean {
	return preferences?.analytics ?? false;
}
