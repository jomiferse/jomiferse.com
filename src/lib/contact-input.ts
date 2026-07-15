export const MAX_CONTACT_BODY_BYTES = 32_768;
export const MAX_CONTACT_SOURCE_PATH_LENGTH = 2_048;

export const contactLocales = ["en", "es"] as const;
export type ContactLocale = (typeof contactLocales)[number];

export const contactScopes = ["intervention", "project", "support"] as const;
export type ContactScope = (typeof contactScopes)[number];

export const contactSourceCategories = [
	"direct",
	"service",
	"landing",
	"article",
	"project",
] as const;
export type ContactSourceCategory = (typeof contactSourceCategories)[number];

export interface ContactInput {
	locale: ContactLocale;
	name: string;
	email: string;
	message: string;
	service: string;
	scope: ContactScope | "";
	source: {
		category: ContactSourceCategory;
		path: string | null;
	};
	honeypot: string;
}

export interface ContactRedirectContext {
	locale: ContactLocale;
	service: string;
	scope: ContactScope | "";
}

export type ContactInputResult =
	| {
			ok: true;
			input: ContactInput;
			redirect: ContactRedirectContext;
	  }
	| {
			ok: false;
			redirect: ContactRedirectContext;
	  };

const isOneOf = <T extends string>(
	value: string,
	values: readonly T[],
): value is T => values.includes(value as T);

const readString = (form: FormData, key: string) => {
	const value = form.get(key);
	return typeof value === "string" ? value.trim() : null;
};

const isEmail = (value: string) =>
	value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isPublicLocalizedPath = (value: string, locale: ContactLocale) =>
	value.length <= MAX_CONTACT_SOURCE_PATH_LENGTH &&
	new RegExp(`^/${locale}(?:/[a-z0-9-]+)*/?$`).test(value) &&
	!value.startsWith(`/${locale}/api/`);

export function parseContactFormData(
	form: FormData,
	allowedServices: ReadonlySet<string>,
): ContactInputResult {
	const localeRaw = readString(form, "locale") ?? "";
	const locale: ContactLocale = isOneOf(localeRaw, contactLocales)
		? localeRaw
		: "es";
	const serviceEnhanced = readString(form, "service") ?? "";
	const serviceFallback = readString(form, "serviceFallback");
	const scopeEnhanced = readString(form, "scope") ?? "";
	const scopeFallback = readString(form, "scopeFallback");
	const serviceRaw = serviceFallback ?? serviceEnhanced;
	const scopeRaw = scopeFallback ?? scopeEnhanced;
	const safeService = allowedServices.has(serviceRaw) ? serviceRaw : "";
	const safeScope = isOneOf(scopeRaw, contactScopes) ? scopeRaw : "";
	const redirect = {
		locale,
		service: safeService,
		scope: safeService ? safeScope : "",
	} satisfies ContactRedirectContext;

	const name = readString(form, "name");
	const email = readString(form, "email");
	const message = readString(form, "message");
	const sourceCategoryRaw = readString(form, "sourceCategory") ?? "direct";
	const sourcePathRaw = readString(form, "sourcePath") ?? "";
	const honeypot = readString(form, "website");

	const validLocale = isOneOf(localeRaw, contactLocales);
	const validService = serviceRaw === "" || allowedServices.has(serviceRaw);
	const validScope =
		scopeRaw === "" ||
		(Boolean(serviceRaw) && isOneOf(scopeRaw, contactScopes));
	const sourceCategory = isOneOf(sourceCategoryRaw, contactSourceCategories)
		? sourceCategoryRaw
		: null;
	const validSourcePath = sourceCategory
		? sourceCategory === "direct"
			? sourcePathRaw === "" || isPublicLocalizedPath(sourcePathRaw, locale)
			: isPublicLocalizedPath(sourcePathRaw, locale)
		: false;

	if (
		!validLocale ||
		!validService ||
		!validScope ||
		sourceCategory === null ||
		!validSourcePath ||
		name === null ||
		name.length < 2 ||
		name.length > 100 ||
		email === null ||
		!isEmail(email) ||
		message === null ||
		message.length < 20 ||
		message.length > 5_000 ||
		honeypot === null
	) {
		return { ok: false, redirect };
	}

	return {
		ok: true,
		input: {
			locale,
			name,
			email,
			message,
			service: serviceRaw,
			scope: safeScope,
			source: {
				category: sourceCategory,
				path: sourceCategory === "direct" ? null : sourcePathRaw,
			},
			honeypot,
		},
		redirect,
	};
}
