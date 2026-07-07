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
	translationKey: string;
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
	overview: string[];
	problem: string;
	benefits: Array<{
		title: string;
		body: string;
	}>;
	whenNeeded: string[];
	whoFor: string[];
	builds: string[];
	process: string[];
	whyMe: string[];
	faq: Array<{
		question: string;
		answer: string;
	}>;
	canonicalSlug?: ServiceSlug;
	canonicalPath?: string;
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
		translationKey: string;
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

const offeringMeta: Partial<
	Record<
		Locale,
		Record<
			string,
			{
				title: string;
				description: string;
			}
		>
	>
> = {
	es: {
		"web-wordpress:0": {
			title: "Diseño web WordPress para negocios | José Miguel Fernández",
			description:
				"Diseño web WordPress para negocios que necesitan una web clara, editable, rápida y preparada para captar contactos cualificados.",
		},
		"web-wordpress:1": {
			title:
				"Mantenimiento WordPress y soporte técnico | José Miguel Fernández",
			description:
				"Mantenimiento WordPress con actualizaciones, backups, seguridad, corrección de errores y soporte técnico para webs de negocio.",
		},
		"web-wordpress:2": {
			title:
				"Optimización WordPress, velocidad y Core Web Vitals | José Miguel Fernández",
			description:
				"Optimización WordPress para mejorar velocidad, plugins, Core Web Vitals, estructura técnica y estabilidad de una web existente.",
		},
		"web-wordpress:3": {
			title: "WooCommerce para tiendas online | José Miguel Fernández",
			description:
				"Desarrollo y mejora de tiendas WooCommerce con catálogo, pagos, envíos, rendimiento e integraciones útiles para vender mejor.",
		},
		"web-wordpress:4": {
			title:
				"Migración a WordPress sin perder claridad | José Miguel Fernández",
			description:
				"Migración a WordPress de webs antiguas o difíciles de mantener, cuidando contenido, estructura, SEO básico y base técnica.",
		},
		"it-consulting:4": {
			title: "Integraciones API para empresas | José Miguel Fernández",
			description:
				"Integraciones API para conectar webs, CRMs, pagos, formularios, ERPs y herramientas internas sin copiar datos a mano.",
		},
		"it-consulting:5": {
			title: "Automatización de procesos para empresas | José Miguel Fernández",
			description:
				"Automatización de procesos para reducir tareas manuales, mover datos entre herramientas y hacer visibles errores operativos.",
		},
		"ai-automation:0": {
			title: "IA para empresas con casos prácticos | José Miguel Fernández",
			description:
				"IA para empresas aplicada a procesos reales: clasificación, búsqueda, asistencia interna, reporting y reducción de trabajo manual.",
		},
		"ai-automation:1": {
			title: "Chatbots y asistentes para negocios | José Miguel Fernández",
			description:
				"Chatbots y asistentes para responder dudas, filtrar contactos, consultar documentación y apoyar procesos internos con control humano.",
		},
		"ai-automation:2": {
			title: "Automatizaciones con IA para empresas | José Miguel Fernández",
			description:
				"Automatizaciones con IA para emails, formularios, clasificación de mensajes, extracción de datos y reporting operativo.",
		},
		"it-consulting:3": {
			title: "Software a medida para empresas | José Miguel Fernández",
			description:
				"Software a medida para crear herramientas internas, APIs, paneles y soluciones concretas adaptadas al flujo real del negocio.",
		},
	},
	en: {
		"web-wordpress:0": {
			title: "WordPress Web Design for Businesses | José Miguel Fernández",
			description:
				"WordPress web design for businesses that need a clear, editable, fast website built to generate qualified conversations.",
		},
		"web-wordpress:1": {
			title:
				"WordPress Maintenance and Technical Support | José Miguel Fernández",
			description:
				"WordPress maintenance with updates, backups, security, bug fixing and technical support for business websites.",
		},
		"it-consulting:5": {
			title: "Process Automation for Companies | José Miguel Fernández",
			description:
				"Process automation for reducing manual tasks, moving data between tools and making operational errors visible.",
		},
	},
};

const getOfferingMetaTitle = (
	locale: Locale,
	translationKey: string,
	title: string,
) =>
	offeringMeta[locale]?.[translationKey]?.title ??
	(locale === "es"
		? `${title} para empresas | José Miguel Fernández`
		: `${title} for businesses | José Miguel Fernández`);

const getOfferingMetaDescription = (
	locale: Locale,
	translationKey: string,
	description: string,
) =>
	offeringMeta[locale]?.[translationKey]?.description ??
	(locale === "es"
		? `${description} Servicio freelance con criterio técnico, alcance claro y ejecución directa.`
		: `${description} Freelance service with technical judgment, clear scope and direct execution.`);

const canonicalOfferingByLocale: Partial<
	Record<Locale, Partial<Record<ServiceSlug, string>>>
> = {
	es: {
		"business-website": "diseno-web-wordpress",
		"custom-web-application": "software-a-medida",
		"automation-workflows": "automatizacion-de-procesos",
		"api-integrations": "integraciones-api",
	},
	en: {
		"business-website": "wordpress-web-design",
		"custom-web-application": "custom-software",
		"automation-workflows": "process-automation",
	},
};

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
		translationKey: `base:${slug}`,
		canonicalSlug: slug,
		number: String(index + 1).padStart(2, "0"),
		...serviceItems[slug],
		canonicalPath: canonicalOfferingByLocale[locale]?.[slug]
			? `/${locale}/services/${canonicalOfferingByLocale[locale][slug]}/`
			: undefined,
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
			offerings: groupItems[group.slug].offerings.map(
				(offering, offeringIndex) => {
					const service = services.find(
						(item) => item.slug === offering.service,
					);
					if (!service) {
						throw new Error(`Offering service not found: ${offering.service}`);
					}
					const translationKey = `${group.slug}:${offeringIndex}`;

					return {
						slug: slugifyService(offering.title),
						translationKey,
						title: offering.title,
						description: offering.description,
						service,
					};
				},
			),
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
				translationKey: offering.translationKey,
				number: offering.service.number,
				title: offering.title,
				shortTitle: offering.title,
				description: offering.description,
				metaTitle: getOfferingMetaTitle(
					locale,
					offering.translationKey,
					offering.title,
				),
				metaDescription: getOfferingMetaDescription(
					locale,
					offering.translationKey,
					offering.description,
				),
				canonicalSlug: offering.service.canonicalSlug,
				canonicalPath: undefined,
				isOffering: true,
			});
		}
	}

	return Array.from(pagesBySlug.values());
};

export const getService = (locale: Locale, slug: string) =>
	getServicePages(locale).find((service) => service.slug === slug);

export const getServiceAlternatePaths = (
	locale: Locale,
	service: ServiceItem,
): Partial<Record<Locale, string>> => {
	const paths: Partial<Record<Locale, string>> = {
		[locale]: service.canonicalPath ?? `/${locale}/services/${service.slug}/`,
	};

	for (const alternateLocale of ["en", "es"] as const) {
		if (alternateLocale === locale) continue;
		const alternatePages = getServicePages(alternateLocale);
		const alternate =
			alternatePages.find(
				(item) => item.translationKey === service.translationKey,
			) ?? alternatePages.find((item) => item.slug === service.canonicalSlug);
		if (alternate) {
			paths[alternateLocale] =
				alternate.canonicalPath ??
				`/${alternateLocale}/services/${alternate.slug}/`;
		}
	}

	return paths;
};
