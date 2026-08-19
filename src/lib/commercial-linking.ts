import type { Locale } from "@/i18n";

export interface CommercialBuyerPath {
	key:
		| "business-tools-integration"
		| "dashboards-internal-admin-panels"
		| "technology-consultant-small-businesses";
	serviceKeys: string[];
	title: string;
	description: string;
	href: string;
}

const commercialBuyerPaths: Record<Locale, CommercialBuyerPath[]> = {
	es: [
		{
			key: "business-tools-integration",
			serviceKeys: ["base:api-integrations", "it-consulting:4"],
			title: "Integrar las herramientas que ya usa tu negocio",
			description:
				"Un recorrido para conectar formularios, CRM, pagos, ERP y datos sin crear más trabajo manual.",
			href: "/es/integracion-herramientas-negocio/",
		},
		{
			key: "dashboards-internal-admin-panels",
			serviceKeys: ["base:internal-tools", "it-consulting:3"],
			title: "Crear un dashboard o panel interno",
			description:
				"Cómo centralizar operaciones, permisos e indicadores cuando una hoja de cálculo ya no es suficiente.",
			href: "/es/dashboards-paneles-internos/",
		},
		{
			key: "technology-consultant-small-businesses",
			serviceKeys: ["it-consulting:0", "it-consulting:1", "it-consulting:2"],
			title: "Contar con criterio técnico antes de invertir",
			description:
				"Ayuda para revisar alcance, proveedor, arquitectura y prioridades antes de comprometer presupuesto.",
			href: "/es/consultor-tecnologico-pequenas-empresas/",
		},
	],
	en: [
		{
			key: "business-tools-integration",
			serviceKeys: ["base:api-integrations", "it-consulting:4"],
			title: "Connect the tools your business already uses",
			description:
				"A practical path for connecting forms, CRM, payments, ERP and data without creating more manual work.",
			href: "/en/business-tools-integration/",
		},
		{
			key: "dashboards-internal-admin-panels",
			serviceKeys: ["base:internal-tools", "it-consulting:3"],
			title: "Build an internal dashboard or admin panel",
			description:
				"Centralise operations, permissions and useful indicators when a spreadsheet is no longer enough.",
			href: "/en/dashboards-internal-admin-panels/",
		},
		{
			key: "technology-consultant-small-businesses",
			serviceKeys: ["it-consulting:0", "it-consulting:1", "it-consulting:2"],
			title: "Get technical judgement before you invest",
			description:
				"Review scope, suppliers, architecture and priorities before committing budget to a technology project.",
			href: "/en/technology-consultant-small-businesses/",
		},
	],
};

export const getCommercialBuyerPaths = (locale: Locale) =>
	commercialBuyerPaths[locale];

export const getCommercialBuyerPathForService = (
	locale: Locale,
	serviceKey: string,
) =>
	getCommercialBuyerPaths(locale).find((path) =>
		path.serviceKeys.includes(serviceKey),
	);
