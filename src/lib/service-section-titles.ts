import type { Locale } from "@/i18n";

export const getServiceSectionTitles = (
	locale: Locale,
	serviceTitle: string,
) =>
	locale === "es"
		? {
				outcome: `Qué cambia con ${serviceTitle}`,
				pricing: `Qué determina el precio de ${serviceTitle}`,
				scope: `Qué incluye un proyecto de ${serviceTitle}`,
				process: `Cómo trabajo en ${serviceTitle}`,
				proof: `Experiencia aplicable a ${serviceTitle}`,
				faq: `Preguntas antes de contratar ${serviceTitle}`,
			}
		: {
				outcome: `What changes with ${serviceTitle}`,
				pricing: `What determines the price of ${serviceTitle}`,
				scope: `What a ${serviceTitle} project includes`,
				process: `How I deliver ${serviceTitle}`,
				proof: `Experience relevant to ${serviceTitle}`,
				faq: `Questions before hiring ${serviceTitle}`,
			};
