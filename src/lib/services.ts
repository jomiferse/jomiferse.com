import { getServiceItems, type Locale } from "@/i18n";

export type ServiceSlug =
	| "business-website"
	| "website-redesign"
	| "custom-web-application"
	| "internal-tools"
	| "automation-workflows"
	| "api-integrations";

export interface ServiceItem {
	slug: ServiceSlug;
	number: string;
	title: string;
	shortTitle: string;
	description: string;
	metaTitle: string;
	metaDescription: string;
	problem: string;
	whoFor: string[];
	builds: string[];
	process: string[];
	faq: Array<{
		question: string;
		answer: string;
	}>;
}

const serviceSlugs = [
	"business-website",
	"website-redesign",
	"custom-web-application",
	"internal-tools",
	"automation-workflows",
	"api-integrations",
] as const satisfies readonly ServiceSlug[];

export const getServices = (locale: Locale): ServiceItem[] => {
	const serviceItems = getServiceItems(locale);

	return serviceSlugs.map((slug, index) => ({
		slug,
		number: String(index + 1).padStart(2, "0"),
		...serviceItems[slug],
	}));
};

export const getService = (locale: Locale, slug: string) =>
	getServices(locale).find((service) => service.slug === slug);
