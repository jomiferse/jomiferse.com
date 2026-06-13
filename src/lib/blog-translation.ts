import type { Locale } from "@/i18n";

export function getOtherLocale(locale: Locale): Locale {
	return locale === "en" ? "es" : "en";
}

export function getTranslatedBlogPath(
	locale: Locale,
	_currentSlug: string,
	translationSlug?: string,
) {
	const otherLocale = getOtherLocale(locale);

	return translationSlug
		? `/${otherLocale}/blog/${translationSlug}`
		: `/${otherLocale}/blog`;
}
