import { getTranslations, type Locale } from "@/i18n";

export const serviceAreaSlugs = [
	"web-conversion",
	"custom-software",
	"automation-ai",
	"maintenance-support",
] as const;

export const pricingKeys = ["intervention", "project", "support"] as const;

export type ServiceAreaSlug = (typeof serviceAreaSlugs)[number];
export type PricingKey = (typeof pricingKeys)[number];
export type BillingUnit = "one-off" | "month";

export interface PricingOption {
	key: PricingKey;
	label: string;
	description: string;
	amount: number;
	currency: "EUR";
	billingUnit: BillingUnit;
	deliverables: string[];
	boundary: string;
	ctaLabel: string;
}

type PricingProfile =
	| "businessWebsite"
	| "websiteRedesign"
	| "customApplication"
	| "internalTool"
	| "workflowAutomation"
	| "apiIntegration"
	| "springBackend"
	| "technicalMaintenance"
	| "projectManagement"
	| "technicalAdvisory"
	| "secondOpinion"
	| "wordpressWebsite"
	| "wordpressMaintenance"
	| "wordpressOptimization"
	| "woocommerce"
	| "wordpressMigration"
	| "landingPage"
	| "businessAi"
	| "chatbot"
	| "aiAutomation"
	| "aiAgent"
	| "aiTraining";

export interface CommercialServiceDefinition {
	area: ServiceAreaSlug;
	icon: string;
	featuredRank?: 1 | 2 | 3;
	pricingProfile: PricingProfile;
	prices: Record<PricingKey, number>;
}

interface PricingOptionCopy {
	label: string;
	description: string;
	deliverables: string[];
	boundary: string;
	ctaLabel: string;
}

interface CommercialCopy {
	pricingProfiles: Record<
		PricingProfile,
		Record<PricingKey, PricingOptionCopy>
	>;
	timelines: Record<PricingProfile, string>;
}

const defineService = (
	area: ServiceAreaSlug,
	icon: string,
	pricingProfile: PricingProfile,
	prices: readonly [number, number, number],
	featuredRank?: 1 | 2 | 3,
): CommercialServiceDefinition => ({
	area,
	icon,
	pricingProfile,
	featuredRank,
	prices: {
		intervention: prices[0],
		project: prices[1],
		support: prices[2],
	},
});

export const serviceCommercialDefinitions = {
	"base:business-website": defineService(
		"web-conversion",
		"globe",
		"businessWebsite",
		[120, 590, 69],
	),
	"base:website-redesign": defineService(
		"web-conversion",
		"pen-tool",
		"websiteRedesign",
		[120, 390, 69],
		2,
	),
	"base:custom-web-application": defineService(
		"custom-software",
		"laptop",
		"customApplication",
		[250, 1200, 149],
	),
	"base:internal-tools": defineService(
		"custom-software",
		"layers",
		"internalTool",
		[250, 900, 149],
		2,
	),
	"base:automation-workflows": defineService(
		"automation-ai",
		"git-branch",
		"workflowAutomation",
		[180, 650, 99],
	),
	"base:api-integrations": defineService(
		"custom-software",
		"code",
		"apiIntegration",
		[250, 450, 149],
	),
	"base:backend-spring-boot": defineService(
		"custom-software",
		"springboot",
		"springBackend",
		[250, 700, 149],
	),
	"base:maintenance-support": defineService(
		"maintenance-support",
		"circle-check-big",
		"technicalMaintenance",
		[90, 290, 69],
	),
	"it-consulting:0": defineService(
		"custom-software",
		"briefcase-business",
		"projectManagement",
		[250, 900, 149],
	),
	"it-consulting:1": defineService(
		"custom-software",
		"lightbulb",
		"technicalAdvisory",
		[120, 450, 99],
	),
	"it-consulting:2": defineService(
		"custom-software",
		"circle-check-big",
		"secondOpinion",
		[120, 390, 99],
	),
	"it-consulting:3": defineService(
		"custom-software",
		"laptop",
		"customApplication",
		[250, 1200, 149],
		1,
	),
	"it-consulting:4": defineService(
		"custom-software",
		"code",
		"apiIntegration",
		[250, 450, 149],
		3,
	),
	"it-consulting:5": defineService(
		"automation-ai",
		"git-branch",
		"workflowAutomation",
		[180, 650, 99],
		1,
	),
	"it-consulting:6": defineService(
		"maintenance-support",
		"cloud",
		"technicalMaintenance",
		[90, 290, 69],
		3,
	),
	"web-wordpress:0": defineService(
		"web-conversion",
		"globe",
		"wordpressWebsite",
		[120, 590, 69],
		1,
	),
	"web-wordpress:1": defineService(
		"maintenance-support",
		"circle-check-big",
		"wordpressMaintenance",
		[90, 290, 69],
		2,
	),
	"web-wordpress:2": defineService(
		"maintenance-support",
		"cloud",
		"wordpressOptimization",
		[120, 390, 69],
	),
	"web-wordpress:3": defineService(
		"web-conversion",
		"briefcase-business",
		"woocommerce",
		[180, 890, 99],
	),
	"web-wordpress:4": defineService(
		"web-conversion",
		"git-branch",
		"wordpressMigration",
		[150, 590, 69],
	),
	"web-wordpress:5": defineService(
		"web-conversion",
		"pen-tool",
		"landingPage",
		[120, 490, 69],
		3,
	),
	"ai-automation:0": defineService(
		"automation-ai",
		"brain",
		"businessAi",
		[180, 650, 99],
	),
	"ai-automation:1": defineService(
		"automation-ai",
		"message-square",
		"chatbot",
		[180, 650, 99],
		3,
	),
	"ai-automation:2": defineService(
		"automation-ai",
		"sparkles",
		"aiAutomation",
		[180, 650, 99],
		2,
	),
	"ai-automation:3": defineService(
		"automation-ai",
		"brain",
		"aiAgent",
		[250, 900, 149],
	),
	"ai-automation:4": defineService(
		"automation-ai",
		"lightbulb",
		"aiTraining",
		[180, 450, 99],
	),
	"maintenance-support:0": defineService(
		"maintenance-support",
		"circle-check-big",
		"technicalMaintenance",
		[90, 290, 69],
		1,
	),
} as const satisfies Record<string, CommercialServiceDefinition>;

export type CommercialTranslationKey =
	keyof typeof serviceCommercialDefinitions;

export const getCommercialServiceDefinition = (translationKey: string) => {
	const definition = (
		serviceCommercialDefinitions as Record<
			string,
			CommercialServiceDefinition | undefined
		>
	)[translationKey];

	if (!definition) {
		throw new Error(`Missing commercial service definition: ${translationKey}`);
	}

	return definition;
};

const getCommercialCopy = (locale: Locale) =>
	getTranslations(locale).services.commercial as unknown as CommercialCopy;

export const resolvePricingOptions = (
	locale: Locale,
	translationKey: string,
): readonly [PricingOption, PricingOption, PricingOption] => {
	const definition = getCommercialServiceDefinition(translationKey);
	const profile =
		getCommercialCopy(locale).pricingProfiles[definition.pricingProfile];

	if (!profile) {
		throw new Error(
			`Missing ${locale} pricing profile: ${definition.pricingProfile}`,
		);
	}

	return pricingKeys.map((key) => {
		const copy = profile[key];
		if (!copy) {
			throw new Error(
				`Missing ${locale} pricing copy: ${definition.pricingProfile}.${key}`,
			);
		}

		return {
			key,
			...copy,
			amount: definition.prices[key],
			currency: "EUR" as const,
			billingUnit:
				key === "support" ? ("month" as const) : ("one-off" as const),
		};
	}) as [PricingOption, PricingOption, PricingOption];
};

export const getCommercialTimeline = (
	locale: Locale,
	translationKey: string,
) => {
	const definition = getCommercialServiceDefinition(translationKey);
	return getCommercialCopy(locale).timelines[definition.pricingProfile];
};
