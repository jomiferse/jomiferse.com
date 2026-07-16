import type { Locale } from "../i18n/index.ts";
import {
	commercialSeoClusters,
	type CommercialSeoClusterKey,
} from "./seo-clusters.ts";

export const blogEditorialRoleValues = [
	"buyer-led",
	"technical-authority",
	"case-study",
] as const;

export type BlogEditorialRole = (typeof blogEditorialRoleValues)[number];

export const blogAudienceValues = ["business", "technical"] as const;

export type BlogAudience = (typeof blogAudienceValues)[number];

export interface BlogCommercialContext {
	role: BlogEditorialRole;
	audience: BlogAudience;
	cluster: CommercialSeoClusterKey;
}

export interface BlogCommercialCtaCopy {
	eyebrow: string;
	title: string;
	text: string;
	contact: string;
}

interface ClusterCtaConfiguration {
	label: Record<Locale, string>;
	contactService: Record<Locale, string>;
}

export interface ResolvedBlogCommercialCta extends BlogCommercialCtaCopy {
	primary: { label: string; href: string };
	secondary: { label: string; href: string };
}

const clusterCtaConfiguration: Record<
	CommercialSeoClusterKey,
	ClusterCtaConfiguration
> = {
	"local-web-design": {
		label: {
			es: "Ver diseño web en Granada",
			en: "Explore web design in Granada",
		},
		contactService: {
			es: "diseno-web-wordpress",
			en: "wordpress-web-design",
		},
	},
	wordpress: {
		label: {
			es: "Ver diseño web para negocios",
			en: "Explore business web design",
		},
		contactService: {
			es: "diseno-web-wordpress",
			en: "wordpress-web-design",
		},
	},
	"custom-software": {
		label: { es: "Ver software a medida", en: "Explore custom software" },
		contactService: { es: "software-a-medida", en: "custom-software" },
	},
	"excel-replacement": {
		label: {
			es: "Ver alternativas a Excel",
			en: "Explore Excel replacement",
		},
		contactService: { es: "internal-tools", en: "internal-tools" },
	},
	"process-automation": {
		label: {
			es: "Ver automatización de procesos",
			en: "Explore process automation",
		},
		contactService: {
			es: "automatizacion-de-procesos",
			en: "process-automation",
		},
	},
	"ai-automation": {
		label: {
			es: "Ver automatizaciones con IA",
			en: "Explore AI automation",
		},
		contactService: {
			es: "automatizaciones-con-ia",
			en: "ai-automations",
		},
	},
	"api-integrations": {
		label: { es: "Ver integraciones API", en: "Explore API integrations" },
		contactService: { es: "integraciones-api", en: "api-integrations" },
	},
	"spring-boot-development": {
		label: {
			es: "Ver backend con Spring Boot",
			en: "Explore Spring Boot backend",
		},
		contactService: { es: "backend-spring-boot", en: "backend-spring-boot" },
	},
	"spring-boot-maintenance": {
		label: {
			es: "Ver mantenimiento Spring Boot",
			en: "Explore Spring Boot maintenance",
		},
		contactService: { es: "backend-spring-boot", en: "backend-spring-boot" },
	},
	"legacy-modernization": {
		label: {
			es: "Ver modernización de backend",
			en: "Explore backend modernization",
		},
		contactService: { es: "backend-spring-boot", en: "backend-spring-boot" },
	},
	"technical-audit": {
		label: { es: "Ver auditoría técnica", en: "Explore technical audit" },
		contactService: {
			es: "segunda-opinion-tecnologica",
			en: "technology-second-opinion",
		},
	},
};

export const resolveBlogCommercialCta = (
	locale: Locale,
	context: BlogCommercialContext,
	articlePath: string,
	copy: BlogCommercialCtaCopy,
): ResolvedBlogCommercialCta => {
	const expectedPrefix = `/${locale}/blog/`;
	if (!articlePath.startsWith(expectedPrefix)) {
		throw new Error(`Article path must start with ${expectedPrefix}`);
	}

	const cluster = commercialSeoClusters.find(
		(candidate) => candidate.key === context.cluster,
	);
	if (!cluster) {
		throw new Error(`Unknown commercial cluster: ${context.cluster}`);
	}

	const configuration = clusterCtaConfiguration[context.cluster];
	const params = new URLSearchParams({
		service: configuration.contactService[locale],
		sourceCategory: "article",
		sourcePath: articlePath,
	});

	return {
		...copy,
		primary: {
			label: configuration.label[locale],
			href: cluster.owner[locale],
		},
		secondary: {
			label: copy.contact,
			href: `/${locale}/contact/?${params.toString()}`,
		},
	};
};
