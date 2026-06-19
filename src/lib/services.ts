import { getServiceItems, getTranslations, type Locale } from "@/i18n";

export type ServiceSlug =
	| "business-website"
	| "website-redesign"
	| "custom-web-application"
	| "internal-tools"
	| "automation-workflows"
	| "api-integrations"
	| "backend-spring-boot";

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

export type ServiceGroupSlug =
	| "websites"
	| "web-apps"
	| "internal-operations"
	| "backend-integrations";

export interface ServiceGroup {
	slug: ServiceGroupSlug;
	number: string;
	title: string;
	description: string;
	bullets: string[];
	primaryService: ServiceItem;
	services: ServiceItem[];
}

const serviceSlugs = [
	"business-website",
	"website-redesign",
	"custom-web-application",
	"internal-tools",
	"automation-workflows",
	"api-integrations",
	"backend-spring-boot",
] as const satisfies readonly ServiceSlug[];

const serviceGroups = [
	{
		slug: "websites",
		primaryService: "business-website",
		services: ["business-website", "website-redesign"],
	},
	{
		slug: "web-apps",
		primaryService: "custom-web-application",
		services: ["custom-web-application"],
	},
	{
		slug: "internal-operations",
		primaryService: "internal-tools",
		services: ["internal-tools", "automation-workflows"],
	},
	{
		slug: "backend-integrations",
		primaryService: "api-integrations",
		services: ["api-integrations", "backend-spring-boot"],
	},
] as const satisfies ReadonlyArray<{
	slug: ServiceGroupSlug;
	primaryService: ServiceSlug;
	services: readonly ServiceSlug[];
}>;

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

export const getServiceGroups = (locale: Locale): ServiceGroup[] => {
	const services = getServices(locale);
	const groupItems = getTranslations(locale).services.hub.groups;

	return serviceGroups.map((group, index) => {
		const includedServices = group.services.map((slug) => {
			const service = services.find((item) => item.slug === slug);
			if (!service) throw new Error(`Service not found in group: ${slug}`);
			return service;
		});
		const primaryService = includedServices.find(
			(service) => service.slug === group.primaryService,
		);
		if (!primaryService) {
			throw new Error(`Primary service not found in group: ${group.slug}`);
		}

		return {
			slug: group.slug,
			number: String(index + 1).padStart(2, "0"),
			...groupItems[group.slug],
			primaryService,
			services: includedServices,
		};
	});
};
