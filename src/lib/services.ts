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
	slug: string;
	number: string;
	title: string;
	shortTitle: string;
	description: string;
	metaTitle: string;
	metaDescription: string;
	pricing: {
		label: string;
		price: string;
		note: string;
		scope: string[];
	};
	problem: string;
	whoFor: string[];
	builds: string[];
	process: string[];
	faq: Array<{
		question: string;
		answer: string;
	}>;
	canonicalSlug?: ServiceSlug;
	isOffering?: boolean;
}

export type ServiceGroupSlug =
	| "it-consulting"
	| "web-wordpress"
	| "ai-automation";

export interface ServiceGroup {
	slug: ServiceGroupSlug;
	number: string;
	title: string;
	description: string;
	bullets: string[];
	offerings: Array<{
		slug: string;
		title: string;
		description: string;
		service: ServiceItem;
	}>;
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

const slugifyService = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

const getOfferingMetaTitle = (locale: Locale, title: string) =>
	locale === "es"
		? `${title} - José Miguel Fernández`
		: `${title} - José Miguel Fernández`;

const getOfferingMetaDescription = (locale: Locale, description: string) =>
	locale === "es"
		? `${description} Servicio freelance con criterio técnico, alcance claro y ejecución directa.`
		: `${description} Freelance service with technical judgment, clear scope and direct execution.`;

const serviceGroups = [
	{
		slug: "it-consulting",
		primaryService: "custom-web-application",
		services: [
			"custom-web-application",
			"api-integrations",
			"automation-workflows",
			"backend-spring-boot",
			"website-redesign",
		],
	},
	{
		slug: "web-wordpress",
		primaryService: "business-website",
		services: ["business-website", "website-redesign", "api-integrations"],
	},
	{
		slug: "ai-automation",
		primaryService: "automation-workflows",
		services: ["automation-workflows", "internal-tools", "api-integrations"],
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
		canonicalSlug: slug,
		number: String(index + 1).padStart(2, "0"),
		...serviceItems[slug],
	}));
};

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
			offerings: groupItems[group.slug].offerings.map((offering) => {
				const service = services.find((item) => item.slug === offering.service);
				if (!service) {
					throw new Error(`Offering service not found: ${offering.service}`);
				}

				return {
					slug: slugifyService(offering.title),
					title: offering.title,
					description: offering.description,
					service,
				};
			}),
			primaryService,
			services: includedServices,
		};
	});
};

export const getServicePages = (locale: Locale): ServiceItem[] => {
	const pagesBySlug = new Map<string, ServiceItem>();

	for (const service of getServices(locale)) {
		pagesBySlug.set(service.slug, service);
	}

	for (const group of getServiceGroups(locale)) {
		for (const offering of group.offerings) {
			if (pagesBySlug.has(offering.slug)) continue;

			pagesBySlug.set(offering.slug, {
				...offering.service,
				slug: offering.slug,
				number: offering.service.number,
				title: offering.title,
				shortTitle: offering.title,
				description: offering.description,
				metaTitle: getOfferingMetaTitle(locale, offering.title),
				metaDescription: getOfferingMetaDescription(
					locale,
					offering.description,
				),
				canonicalSlug: offering.service.canonicalSlug,
				isOffering: true,
			});
		}
	}

	return Array.from(pagesBySlug.values());
};

export const getService = (locale: Locale, slug: string) =>
	getServicePages(locale).find((service) => service.slug === slug);
