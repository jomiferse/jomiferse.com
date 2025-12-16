import en from "./en.json";
import es from "./es.json";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

const dict = { en, es } as const;

export function getLocaleFromPath(pathname: string): Locale {
	return pathname.startsWith("/es") ? "es" : "en";
}

export function t(locale: Locale, key: string): string {
	const parts = key.split(".");
	let cur: any = dict[locale];

	for (const p of parts) cur = cur?.[p];

	if (typeof cur === "string") return cur;

	return key;
}
