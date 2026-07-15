import type { Locale } from "@/i18n";

export const serviceAliasRedirects = {
	"/en/services/business-website/": "/en/services/wordpress-web-design/",
	"/en/services/custom-web-application/": "/en/services/custom-software/",
	"/en/services/automation-workflows/": "/en/services/process-automation/",
	"/en/services/maintenance-support/":
		"/en/services/maintenance-and-technical-support/",
	"/es/services/business-website/": "/es/services/diseno-web-wordpress/",
	"/es/services/custom-web-application/": "/es/services/software-a-medida/",
	"/es/services/automation-workflows/":
		"/es/services/automatizacion-de-procesos/",
	"/es/services/api-integrations/": "/es/services/integraciones-api/",
	"/es/services/maintenance-support/":
		"/es/services/mantenimiento-y-soporte-tecnico/",
} as const;

export const getServiceAliasRedirect = (locale: Locale, slug: string) =>
	serviceAliasRedirects[
		`/${locale}/services/${slug}/` as keyof typeof serviceAliasRedirects
	];
