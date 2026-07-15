import type { Locale } from "@/i18n";
import type { BillingUnit, PricingKey } from "@/lib/service-commercial";

const DEFAULT_IMAGE = "/images/og/portfolio-og.png";

export type StructuredData = Record<string, unknown>;

export interface BreadcrumbItem {
	name: string;
	path: string;
}

export interface PersonSeo {
	name: string;
	description: string;
	email: string;
	location: string;
	links: {
		linkedin: string;
		github: string;
	};
}

export interface BlogPostingSeo {
	site: string;
	locale: Locale;
	path: string;
	title: string;
	description: string;
	datePublished: Date;
	dateModified?: Date;
	author: string;
	tags?: string[];
	readingTime?: string;
	image?: string;
}

export interface SoftwareProjectSeo {
	name: string;
	description: string;
	url?: string;
	technologies?: string[];
	category?: string;
}

export interface CreativeWorkSeo {
	name: string;
	description: string;
	technologies?: string[];
	path: string;
}

export interface ServiceSeo {
	site: string;
	path: string;
	name: string;
	description: string;
	providerName: string;
	providerUrl?: string;
	areaServed?: string;
	audience?: string[];
	serviceType?: string;
	sameAs?: string[];
	offers?: StartingPriceOfferSeo[];
}

export interface StartingPriceOfferSeo {
	key: PricingKey;
	name: string;
	description: string;
	price: number;
	currency: "EUR";
	billingUnit: BillingUnit;
	path: string;
	priceNote?: string;
}

export interface ProfessionalServiceSeo {
	site: string;
	path: string;
	name: string;
	description: string;
	providerName: string;
	providerUrl: string;
	areaServed: string;
	sameAs: string[];
	services: Array<{
		name: string;
		description: string;
		path: string;
		offers?: StartingPriceOfferSeo[];
	}>;
}

export interface FaqSeo {
	question: string;
	answer: string;
}

export const absoluteUrl = (site: string, path: string) =>
	new URL(path, site).toString();

export const getSeoEntityIds = (site: string, path: string) => ({
	website: `${absoluteUrl(site, "/")}#website`,
	person: `${absoluteUrl(site, "/")}#person`,
	page: `${absoluteUrl(site, path)}#webpage`,
});

const buildStartingPriceOffer = (
	site: string,
	offer: StartingPriceOfferSeo,
	service?: { name: string; description: string; provider?: StructuredData },
): StructuredData => ({
	"@type": "Offer",
	"@id": `${absoluteUrl(site, offer.path)}#offer-${offer.key}`,
	name: offer.name,
	description: [offer.description, offer.priceNote].filter(Boolean).join(" "),
	url: absoluteUrl(site, `${offer.path}#pricing-options`),
	priceCurrency: offer.currency,
	priceSpecification: {
		"@type": "UnitPriceSpecification",
		price: offer.price,
		priceCurrency: offer.currency,
		unitText: offer.billingUnit === "month" ? "MONTH" : undefined,
	},
	itemOffered: service
		? {
				"@type": "Service",
				name: service.name,
				description: service.description,
				provider: service.provider,
			}
		: undefined,
});

export const buildBreadcrumbList = (
	site: string,
	items: BreadcrumbItem[],
): StructuredData => ({
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: items.map((item, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: item.name,
		item: absoluteUrl(site, item.path),
	})),
});

export const buildProfilePage = (
	site: string,
	locale: Locale,
	person: PersonSeo,
): StructuredData => {
	const path = `/${locale}/`;
	const ids = getSeoEntityIds(site, path);

	return {
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		"@id": ids.page,
		name: person.name,
		description: person.description,
		url: absoluteUrl(site, path),
		inLanguage: locale,
		isPartOf: { "@id": ids.website },
		mainEntity: {
			"@type": "Person",
			"@id": ids.person,
			name: person.name,
			description: person.description,
			email: `mailto:${person.email}`,
			address: {
				"@type": "PostalAddress",
				addressLocality: person.location,
			},
			sameAs: [person.links.linkedin, person.links.github],
		},
	};
};

export const buildCollectionPage = (
	site: string,
	path: string,
	name: string,
	description: string,
): StructuredData => ({
	"@context": "https://schema.org",
	"@type": "CollectionPage",
	"@id": getSeoEntityIds(site, path).page,
	name,
	description,
	url: absoluteUrl(site, path),
});

const readingTimeToIsoDuration = (readingTime?: string) => {
	if (!readingTime) return undefined;
	const match = readingTime.match(/(\d+)/);
	if (!match) return undefined;
	return `PT${match[1]}M`;
};

export const buildBlogPosting = ({
	site,
	locale,
	path,
	title,
	description,
	datePublished,
	dateModified,
	tags = [],
	readingTime,
	image = DEFAULT_IMAGE,
}: BlogPostingSeo): StructuredData => {
	const ids = getSeoEntityIds(site, path);

	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		"@id": `${absoluteUrl(site, path)}#article`,
		headline: title,
		description,
		datePublished: datePublished.toISOString(),
		dateModified: (dateModified ?? datePublished).toISOString(),
		inLanguage: locale,
		mainEntityOfPage: { "@id": ids.page },
		isPartOf: { "@id": ids.website },
		author: { "@id": ids.person },
		publisher: { "@id": ids.person },
		image: absoluteUrl(site, image),
		keywords: tags.join(", "),
		timeRequired: readingTimeToIsoDuration(readingTime),
	};
};

export const buildSoftwareApplication = (
	project: SoftwareProjectSeo,
): StructuredData => ({
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: project.name,
	description: project.description,
	applicationCategory: project.category ?? "DeveloperApplication",
	url: project.url ? project.url : undefined,
	operatingSystem: "Web",
	creator: {
		"@type": "Person",
		name: "José Miguel Fernández",
	},
	keywords: project.technologies?.join(", "),
});

export const buildCreativeWork = (
	site: string,
	project: CreativeWorkSeo,
): StructuredData => ({
	"@context": "https://schema.org",
	"@type": "CreativeWork",
	name: project.name,
	description: project.description,
	creator: {
		"@type": "Person",
		name: "José Miguel Fernández",
	},
	keywords: project.technologies?.join(", "),
	url: absoluteUrl(site, project.path),
});

export const buildServicePage = ({
	site,
	path,
	name,
	description,
	providerName,
	providerUrl,
	areaServed = "Remote",
	audience = [],
	serviceType,
	sameAs = [],
	offers = [],
}: ServiceSeo): StructuredData => {
	const ids = getSeoEntityIds(site, path);
	const provider = {
		"@type": "Person",
		"@id": ids.person,
		name: providerName,
		url: providerUrl,
		sameAs,
	};

	return {
		"@context": "https://schema.org",
		"@type": "Service",
		"@id": `${absoluteUrl(site, path)}#service`,
		name,
		description,
		url: absoluteUrl(site, path),
		serviceType: serviceType ?? name,
		areaServed,
		audience: audience.map((audienceType) => ({
			"@type": "Audience",
			audienceType,
		})),
		provider,
		offers: offers.map((offer) =>
			buildStartingPriceOffer(site, offer, { name, description, provider }),
		),
	};
};

export const buildProfessionalService = ({
	site,
	path,
	name,
	description,
	providerName,
	providerUrl,
	areaServed,
	sameAs,
	services,
}: ProfessionalServiceSeo): StructuredData => {
	const provider = {
		"@type": "Person",
		"@id": getSeoEntityIds(site, path).person,
		name: providerName,
		url: providerUrl,
		sameAs,
	};
	const offers = services.flatMap((service) =>
		service.offers?.length
			? service.offers.map((offer) =>
					buildStartingPriceOffer(site, offer, {
						name: service.name,
						description: service.description,
						provider,
					}),
				)
			: [
					{
						"@type": "Offer",
						url: absoluteUrl(site, service.path),
						itemOffered: {
							"@type": "Service",
							name: service.name,
							description: service.description,
							provider,
						},
					},
				],
	);

	return {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		"@id": `${absoluteUrl(site, path)}#professional-service`,
		name,
		description,
		url: absoluteUrl(site, path),
		areaServed,
		founder: provider,
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name,
			itemListElement: offers,
		},
		makesOffer: offers,
	};
};

export const buildFaqPage = (faqs: FaqSeo[]): StructuredData => ({
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: faqs.map((faq) => ({
		"@type": "Question",
		name: faq.question,
		acceptedAnswer: {
			"@type": "Answer",
			text: faq.answer,
		},
	})),
});
