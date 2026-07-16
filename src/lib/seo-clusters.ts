import type { Locale } from "@/i18n";

export const commercialSeoClusterKeys = [
	"local-web-design",
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

export type CommercialSeoIntent = "commercial" | "informational" | "mixed";

export interface CommercialSeoTarget {
	primary: string | null;
	secondary: string[];
	intent: CommercialSeoIntent;
}

export interface CommercialSeoCluster {
	key: CommercialSeoClusterKey;
	priority: 1 | 2 | 3;
	targets: Record<Locale, CommercialSeoTarget>;
	owner: Record<Locale, string>;
	supporting: Record<Locale, string[]>;
}

export const commercialSeoClusters: CommercialSeoCluster[] = [
	{
		key: "local-web-design",
		priority: 1,
		targets: {
			es: {
				primary: "diseño web Granada",
				secondary: [
					"diseño web en Granada",
					"desarrollo web Granada",
					"diseño páginas web Granada",
					"diseñador web Granada",
				],
				intent: "commercial",
			},
			en: {
				primary: null,
				secondary: ["web design Granada", "web development Granada"],
				intent: "commercial",
			},
		},
		owner: {
			es: "/es/diseno-web-granada/",
			en: "/en/web-design-granada/",
		},
		supporting: {
			es: ["/es/", "/es/about/", "/es/projects/"],
			en: ["/en/", "/en/about/", "/en/projects/"],
		},
	},
	{
		key: "wordpress",
		priority: 1,
		targets: {
			es: {
				primary: "diseño web WordPress",
				secondary: ["diseño web con WordPress", "diseño web WordPress precio"],
				intent: "commercial",
			},
			en: {
				primary: "WordPress web design",
				secondary: ["WordPress website design"],
				intent: "commercial",
			},
		},
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
		priority: 1,
		targets: {
			es: {
				primary: "software a medida",
				secondary: [
					"desarrollo de software a medida",
					"software a medida para empresas",
					"aplicaciones web a medida",
				],
				intent: "commercial",
			},
			en: {
				primary: "custom software development",
				secondary: ["custom software for businesses"],
				intent: "commercial",
			},
		},
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
		priority: 3,
		targets: {
			es: {
				primary: "sustituir Excel por software",
				secondary: ["alternativas a Excel para empresas"],
				intent: "mixed",
			},
			en: {
				primary: "replace Excel with software",
				secondary: ["Excel replacement for business workflows"],
				intent: "mixed",
			},
		},
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
		priority: 2,
		targets: {
			es: {
				primary: "automatización de procesos para empresas",
				secondary: [
					"automatización de procesos empresariales",
					"automatización de tareas administrativas",
				],
				intent: "mixed",
			},
			en: {
				primary: "business process automation",
				secondary: ["administrative task automation"],
				intent: "mixed",
			},
		},
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
		priority: 2,
		targets: {
			es: {
				primary: "automatización con IA para empresas",
				secondary: [
					"automatización de procesos con IA",
					"agentes de IA para empresas",
				],
				intent: "mixed",
			},
			en: {
				primary: "AI automation for businesses",
				secondary: ["AI agents for businesses"],
				intent: "mixed",
			},
		},
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
		priority: 2,
		targets: {
			es: {
				primary: "integración API",
				secondary: ["integración CRM", "integración ERP"],
				intent: "mixed",
			},
			en: {
				primary: "API integration services",
				secondary: ["CRM integration", "ERP integration"],
				intent: "commercial",
			},
		},
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
		priority: 3,
		targets: {
			es: {
				primary: "desarrollo backend Spring Boot",
				secondary: ["backend Spring Boot"],
				intent: "mixed",
			},
			en: {
				primary: "Spring Boot backend development",
				secondary: ["Spring Boot developer"],
				intent: "mixed",
			},
		},
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
		priority: 3,
		targets: {
			es: {
				primary: "mantenimiento Spring Boot",
				secondary: ["soporte Spring Boot"],
				intent: "commercial",
			},
			en: {
				primary: "Spring Boot maintenance",
				secondary: ["Spring Boot support"],
				intent: "commercial",
			},
		},
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
		priority: 3,
		targets: {
			es: {
				primary: "modernización backend legacy",
				secondary: ["modernización de aplicaciones"],
				intent: "mixed",
			},
			en: {
				primary: "legacy backend modernization",
				secondary: ["legacy application modernization"],
				intent: "mixed",
			},
		},
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
		priority: 3,
		targets: {
			es: {
				primary: "auditoría backend y API",
				secondary: ["auditoría de software", "segunda opinión tecnológica"],
				intent: "commercial",
			},
			en: {
				primary: "backend and API audit",
				secondary: ["software architecture audit"],
				intent: "commercial",
			},
		},
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
