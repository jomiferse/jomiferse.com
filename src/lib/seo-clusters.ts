import type { Locale } from "@/i18n";

export const commercialSeoClusterKeys = [
	"freelance-developer",
	"wordpress",
	"custom-software",
	"excel-replacement",
	"process-automation",
	"ai-automation",
	"api-integrations",
	"spring-boot-development",
	"spring-boot-maintenance",
	"legacy-modernization",
	"technical-audit",
] as const;

export type CommercialSeoClusterKey = (typeof commercialSeoClusterKeys)[number];

export interface CommercialSeoCluster {
	key: CommercialSeoClusterKey;
	owner: Record<Locale, string>;
	supporting: Record<Locale, string[]>;
}

export const commercialSeoClusters: CommercialSeoCluster[] = [
	{
		key: "freelance-developer",
		owner: {
			es: "/es/desarrollador-freelance-espana/",
			en: "/en/freelance-developer-spain/",
		},
		supporting: {
			es: ["/es/", "/es/about/", "/es/projects/"],
			en: ["/en/", "/en/about/", "/en/projects/"],
		},
	},
	{
		key: "wordpress",
		owner: {
			es: "/es/services/diseno-web-wordpress/",
			en: "/en/services/wordpress-web-design/",
		},
		supporting: {
			es: [
				"/es/services/mantenimiento-wordpress/",
				"/es/services/optimizacion-wordpress/",
				"/es/services/woocommerce/",
			],
			en: [
				"/en/services/wordpress-maintenance/",
				"/en/services/wordpress-optimization/",
				"/en/services/woocommerce/",
			],
		},
	},
	{
		key: "custom-software",
		owner: {
			es: "/es/services/software-a-medida/",
			en: "/en/services/custom-software/",
		},
		supporting: {
			es: ["/es/software-a-medida-pymes/", "/es/services/internal-tools/"],
			en: [
				"/en/custom-software-small-businesses/",
				"/en/services/internal-tools/",
			],
		},
	},
	{
		key: "excel-replacement",
		owner: {
			es: "/es/sustituir-excel-software/",
			en: "/en/replace-excel-with-software/",
		},
		supporting: {
			es: ["/es/services/internal-tools/", "/es/software-a-medida-pymes/"],
			en: [
				"/en/services/internal-tools/",
				"/en/custom-software-small-businesses/",
			],
		},
	},
	{
		key: "process-automation",
		owner: {
			es: "/es/services/automatizacion-de-procesos/",
			en: "/en/services/process-automation/",
		},
		supporting: {
			es: ["/es/automatizacion-tareas-administrativas/"],
			en: ["/en/administrative-task-automation/"],
		},
	},
	{
		key: "ai-automation",
		owner: {
			es: "/es/services/automatizaciones-con-ia/",
			en: "/en/services/ai-automations/",
		},
		supporting: {
			es: [
				"/es/automatizacion-ia-operaciones-documentos/",
				"/es/services/ia-para-empresas/",
			],
			en: [
				"/en/ai-automation-operations-documents/",
				"/en/services/ai-for-companies/",
			],
		},
	},
	{
		key: "api-integrations",
		owner: {
			es: "/es/services/integraciones-api/",
			en: "/en/services/api-integrations/",
		},
		supporting: {
			es: [
				"/es/integracion-herramientas-negocio/",
				"/es/integracion-crm-formularios-pagos-erp/",
			],
			en: [
				"/en/business-tools-integration/",
				"/en/crm-forms-payments-erp-integration/",
			],
		},
	},
	{
		key: "spring-boot-development",
		owner: {
			es: "/es/services/backend-spring-boot/",
			en: "/en/services/backend-spring-boot/",
		},
		supporting: {
			es: [
				"/es/blog/spring-boot-produccion-checklist-devops/",
				"/es/blog/rendimiento-spring-boot-cambios-que-de-verdad-se-notan/",
			],
			en: [
				"/en/blog/spring-boot-production-devops-checklist/",
				"/en/blog/spring-boot-performance-tuning/",
			],
		},
	},
	{
		key: "spring-boot-maintenance",
		owner: {
			es: "/es/mantenimiento-spring-boot/",
			en: "/en/spring-boot-maintenance/",
		},
		supporting: {
			es: ["/es/services/backend-spring-boot/"],
			en: ["/en/services/backend-spring-boot/"],
		},
	},
	{
		key: "legacy-modernization",
		owner: {
			es: "/es/modernizacion-backend-legacy/",
			en: "/en/legacy-backend-modernization/",
		},
		supporting: {
			es: [
				"/es/services/backend-spring-boot/",
				"/es/blog/cuando-deberia-una-empresa-migrar-un-backend-legacy-a-java-spring-boot/",
			],
			en: [
				"/en/services/backend-spring-boot/",
				"/en/blog/when-should-a-company-migrate-a-legacy-backend-to-java-spring-boot/",
			],
		},
	},
	{
		key: "technical-audit",
		owner: {
			es: "/es/auditoria-backend-api-arquitectura/",
			en: "/en/backend-api-architecture-audit/",
		},
		supporting: {
			es: [
				"/es/services/segunda-opinion-tecnologica/",
				"/es/services/asesoria-informatica/",
			],
			en: [
				"/en/services/technology-second-opinion/",
				"/en/services/it-advisory/",
			],
		},
	},
];
