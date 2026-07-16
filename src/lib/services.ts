import { getServiceItems, getTranslations, type Locale } from "@/i18n";
import {
	getCommercialServiceDefinition,
	getCommercialTimeline,
	resolvePricingOptions,
	serviceAreaSlugs,
	type PricingOption,
	type ServiceAreaSlug,
} from "@/lib/service-commercial";
import { getServiceAliasRedirect } from "@/lib/service-aliases";

export type ServiceSlug =
	| "business-website"
	| "website-redesign"
	| "custom-web-application"
	| "internal-tools"
	| "automation-workflows"
	| "api-integrations"
	| "backend-spring-boot"
	| "maintenance-support";

export interface ServiceItem {
	slug: string;
	translationKey: string;
	number: string;
	title: string;
	shortTitle: string;
	description: string;
	metaTitle: string;
	metaDescription: string;
	area: ServiceAreaSlug;
	icon: string;
	featuredRank?: 1 | 2 | 3;
	pricingOptions: readonly [PricingOption, PricingOption, PricingOption];
	timeline?: string;
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
	relatedPosts?: Array<{
		title: string;
		description: string;
		href: string;
	}>;
	canonicalSlug?: ServiceSlug;
	canonicalPath?: string;
	isOffering?: boolean;
}

export type ServiceGroupSlug =
	"it-consulting" | "web-wordpress" | "ai-automation" | "maintenance-support";

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

export interface ServiceArea {
	slug: ServiceAreaSlug;
	title: string;
	description: string;
	icon: string;
	entryPrice: number;
	featuredServices: readonly [ServiceItem, ServiceItem, ServiceItem];
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
	"maintenance-support",
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
			title: "Servicio de mantenimiento WordPress | José Miguel Fernández",
			description:
				"Servicio de mantenimiento WordPress con planes mensuales para actualizaciones, copias, seguridad, errores y soporte técnico.",
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
			title: "Chatbots para empresas y asistentes | José Miguel Fernández",
			description:
				"Chatbots para empresas que responden dudas, filtran contactos o consultan documentación con límites y revisión humana.",
		},
		"ai-automation:2": {
			title: "Automatizaciones con IA para empresas | José Miguel Fernández",
			description:
				"Automatizaciones con IA para emails, formularios, clasificación de mensajes, extracción de datos y reporting operativo.",
		},
		"ai-automation:3": {
			title: "Agentes de IA para empresas | José Miguel Fernández",
			description:
				"Agentes de IA para empresas que conectan datos y herramientas para ejecutar flujos concretos con permisos, trazabilidad y control humano.",
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
			title: "WordPress Maintenance Service | José Miguel Fernández",
			description:
				"WordPress maintenance plans covering updates, backups, security checks, bug fixes and practical support for business websites.",
		},
		"ai-automation:1": {
			title: "Chatbots for Businesses and Assistants | José Miguel Fernández",
			description:
				"Chatbots for businesses that answer questions, qualify enquiries or search documents with clear limits and human review.",
		},
		"ai-automation:3": {
			title: "AI Agents for Businesses | José Miguel Fernández",
			description:
				"AI agents for businesses that connect tools and data to run defined workflows with permissions, traceability and human oversight.",
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
		? `${description} Alcance claro y ejecución directa.`
		: `${description} Clear scope and direct execution.`);

const relatedPostsByLocale: Record<
	Locale,
	Record<string, NonNullable<ServiceItem["relatedPosts"]>>
> = {
	es: {
		"base:backend-spring-boot": [
			{
				title: "Spring Boot en producción",
				description:
					"Configuración, observabilidad, despliegue y rollback para operar con más contexto.",
				href: "/es/blog/spring-boot-produccion-checklist-devops/",
			},
			{
				title: "Rendimiento en Spring Boot",
				description:
					"Qué medir y qué cambios suelen tener un impacto real en producción.",
				href: "/es/blog/rendimiento-spring-boot-cambios-que-de-verdad-se-notan/",
			},
			{
				title: "Migrar un backend legacy a Spring Boot",
				description:
					"Señales, riesgos y una estrategia incremental antes de reescribir.",
				href: "/es/blog/cuando-deberia-una-empresa-migrar-un-backend-legacy-a-java-spring-boot/",
			},
		],
		"it-consulting:3": [
			{
				title: "Cuándo construir una herramienta interna",
				description:
					"Señales de que una hoja o herramienta genérica ya no sostiene bien el proceso.",
				href: "/es/blog/cuando-construir-herramienta-interna-en-vez-de-usar-excel/",
			},
			{
				title: "Cuánto cuesta una herramienta interna",
				description:
					"Qué cambia el alcance y cómo plantear una primera versión útil.",
				href: "/es/blog/cuanto-cuesta-crear-herramienta-interna-a-medida/",
			},
		],
		"it-consulting:5": [
			{
				title: "Cuándo automatizar procesos de empresa",
				description:
					"Cómo encontrar tareas repetidas con reglas y resultado medible.",
				href: "/es/blog/automatizar-procesos-empresa-cuando-merece-la-pena/",
			},
			{
				title: "Usar IA en un producto sin humo",
				description:
					"Casos donde ayuda y límites que conviene mantener visibles.",
				href: "/es/blog/usar-ia-en-tu-producto-sin-humo/",
			},
		],
		"it-consulting:4": [
			{
				title: "APIs idempotentes que sobreviven a reintentos",
				description:
					"Patrones para evitar pagos, pedidos o trabajos duplicados.",
				href: "/es/blog/apis-idempotentes-que-sobreviven-a-reintentos/",
			},
			{
				title: "Kafka, RabbitMQ o una base de datos",
				description:
					"Cómo coordinar trabajo asíncrono sin sobredimensionar la integración.",
				href: "/es/blog/cuando-deberias-usar-kafka-rabbitmq-o-simplemente-una-base-de-datos/",
			},
		],
		"web-wordpress:1": [
			{
				title: "Qué necesita una web profesional para captar clientes",
				description:
					"Una revisión práctica de oferta, confianza, rendimiento y contacto.",
				href: "/es/blog/que-debe-tener-web-profesional-para-captar-clientes/",
			},
		],
		"base:maintenance-support": [
			{
				title: "Cuándo necesita mantenimiento una aplicación",
				description:
					"Señales operativas, dependencias y despliegues que conviene atender antes de una incidencia mayor.",
				href: "/es/blog/cuando-necesita-empresa-mantenimiento-spring-boot/",
			},
		],
		"maintenance-support:0": [
			{
				title: "Cuándo necesita mantenimiento una aplicación",
				description:
					"Señales operativas, dependencias y despliegues que conviene atender antes de una incidencia mayor.",
				href: "/es/blog/cuando-necesita-empresa-mantenimiento-spring-boot/",
			},
		],
	},
	en: {
		"base:backend-spring-boot": [
			{
				title: "Spring Boot in production",
				description:
					"Configuration, observability, delivery and rollback checks for operating with context.",
				href: "/en/blog/spring-boot-production-devops-checklist/",
			},
			{
				title: "Spring Boot performance tuning",
				description:
					"What to measure and which changes tend to matter in production.",
				href: "/en/blog/spring-boot-performance-tuning/",
			},
			{
				title: "Migrating a legacy backend to Spring Boot",
				description:
					"Signals, risks and an incremental strategy before rewriting.",
				href: "/en/blog/when-should-a-company-migrate-a-legacy-backend-to-java-spring-boot/",
			},
		],
		"it-consulting:3": [
			{
				title: "When to build an internal tool",
				description:
					"Signals that a spreadsheet or generic tool no longer supports the workflow.",
				href: "/en/blog/when-to-build-an-internal-tool-instead-of-using-excel/",
			},
			{
				title: "How much does an internal tool cost?",
				description:
					"What changes scope and how to frame a useful first version.",
				href: "/en/blog/how-much-does-a-custom-internal-tool-cost/",
			},
		],
		"it-consulting:5": [
			{
				title: "When business process automation is worth it",
				description:
					"Find repeated tasks with stable rules and a measurable result.",
				href: "/en/blog/when-business-process-automation-is-worth-it/",
			},
			{
				title: "Using AI in a product without hype",
				description: "Where it helps and which limits should remain visible.",
				href: "/en/blog/using-ai-in-your-product-without-hype/",
			},
		],
		"it-consulting:4": [
			{
				title: "Idempotent APIs that survive retries",
				description:
					"Patterns that prevent duplicate payments, orders and jobs.",
				href: "/en/blog/idempotent-apis-that-survive-retries/",
			},
			{
				title: "Kafka, RabbitMQ or a database",
				description:
					"Coordinate asynchronous work without oversizing the integration.",
				href: "/en/blog/when-should-you-use-kafka-rabbitmq-or-just-a-database/",
			},
		],
		"web-wordpress:1": [
			{
				title: "What a professional website needs to get clients",
				description:
					"A practical review of offer, trust, performance and contact paths.",
				href: "/en/blog/what-a-professional-website-needs-to-get-clients/",
			},
		],
		"base:maintenance-support": [
			{
				title: "When an application needs maintenance",
				description:
					"Operational signals, dependencies and delivery problems worth addressing before a larger incident.",
				href: "/en/blog/when-company-needs-spring-boot-maintenance/",
			},
		],
		"maintenance-support:0": [
			{
				title: "When an application needs maintenance",
				description:
					"Operational signals, dependencies and delivery problems worth addressing before a larger incident.",
				href: "/en/blog/when-company-needs-spring-boot-maintenance/",
			},
		],
	},
};

const getRelatedPosts = (locale: Locale, translationKey: string) =>
	relatedPostsByLocale[locale][translationKey];

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
	{
		slug: "maintenance-support",
		primaryService: "maintenance-support",
		services: [
			"maintenance-support",
			"website-redesign",
			"backend-spring-boot",
		],
	},
] as const satisfies ReadonlyArray<{
	slug: ServiceGroupSlug;
	primaryService: ServiceSlug;
	services: readonly ServiceSlug[];
}>;

export const getServices = (locale: Locale): ServiceItem[] => {
	const serviceItems = getServiceItems(locale);

	return serviceSlugs.map((slug, index) => {
		const translationKey = `base:${slug}`;
		const commercial = getCommercialServiceDefinition(translationKey);

		return {
			slug,
			translationKey,
			canonicalSlug: slug,
			number: String(index + 1).padStart(2, "0"),
			...serviceItems[slug],
			area: commercial.area,
			icon: commercial.icon,
			featuredRank: commercial.featuredRank,
			pricingOptions: resolvePricingOptions(locale, translationKey),
			timeline: getCommercialTimeline(locale, translationKey),
			relatedPosts: getRelatedPosts(locale, translationKey),
			canonicalPath: getServiceAliasRedirect(locale, slug),
		};
	});
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
			const existingPage = pagesBySlug.get(offering.slug);
			if (existingPage?.isOffering) continue;
			if (
				existingPage &&
				existingPage.canonicalSlug !== offering.service.canonicalSlug
			) {
				throw new Error(
					`Service slug collision for ${locale}/${offering.slug}: ${existingPage.translationKey} and ${offering.translationKey}`,
				);
			}
			const commercial = getCommercialServiceDefinition(
				offering.translationKey,
			);

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
				area: commercial.area,
				icon: commercial.icon,
				featuredRank: commercial.featuredRank,
				pricingOptions: resolvePricingOptions(locale, offering.translationKey),
				timeline: getCommercialTimeline(locale, offering.translationKey),
				relatedPosts: getRelatedPosts(locale, offering.translationKey),
			});
		}
	}

	return Array.from(pagesBySlug.values());
};

export const getCanonicalServicePages = (locale: Locale) =>
	getServicePages(locale).filter((service) => !service.canonicalPath);

export const getServiceAreas = (locale: Locale): ServiceArea[] => {
	const services = getCanonicalServicePages(locale);
	const areaCopy = getTranslations(locale).services.commercial.areas;

	return serviceAreaSlugs.map((slug) => {
		const areaServices = services.filter((service) => service.area === slug);
		const featuredServices = areaServices
			.filter((service) => service.featuredRank !== undefined)
			.sort(
				(left, right) => (left.featuredRank ?? 4) - (right.featuredRank ?? 4),
			);

		if (featuredServices.length !== 3) {
			throw new Error(
				`Expected three featured services for ${locale}/${slug}, found ${featuredServices.length}`,
			);
		}

		const primaryService = featuredServices[0];
		if (!primaryService) {
			throw new Error(`Missing primary service for ${locale}/${slug}`);
		}

		return {
			slug,
			...areaCopy[slug],
			entryPrice: primaryService.pricingOptions[0].amount,
			featuredServices: featuredServices as [
				ServiceItem,
				ServiceItem,
				ServiceItem,
			],
			primaryService,
			services: areaServices,
		};
	});
};

export const getRelatedServices = (
	locale: Locale,
	service: ServiceItem,
	limit = 3,
) => {
	const candidates = getCanonicalServicePages(locale).filter(
		(item) => item.translationKey !== service.translationKey,
	);
	const sameArea = candidates.filter((item) => item.area === service.area);
	const otherAreas = candidates.filter((item) => item.area !== service.area);

	return [...sameArea, ...otherAreas].slice(0, limit);
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
