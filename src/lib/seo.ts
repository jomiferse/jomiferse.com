import type { Locale } from "@/i18n";

const DEFAULT_IMAGE = "/images/og/portfolio-og.svg";

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
	}>;
}

export interface FaqSeo {
	question: string;
	answer: string;
}

export const absoluteUrl = (site: string, path: string) =>
	new URL(path, site).toString();

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
): StructuredData => ({
	"@context": "https://schema.org",
	"@type": "ProfilePage",
	name: person.name,
	description: person.description,
	url: absoluteUrl(site, `/${locale}`),
	inLanguage: locale,
	mainEntity: {
		"@type": "Person",
		name: person.name,
		description: person.description,
		email: `mailto:${person.email}`,
		address: {
			"@type": "PostalAddress",
			addressLocality: person.location,
		},
		sameAs: [person.links.linkedin, person.links.github],
	},
});

export const buildCollectionPage = (
	site: string,
	path: string,
	name: string,
	description: string,
): StructuredData => ({
	"@context": "https://schema.org",
	"@type": "CollectionPage",
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
	author,
	tags = [],
	readingTime,
	image = DEFAULT_IMAGE,
}: BlogPostingSeo): StructuredData => ({
	"@context": "https://schema.org",
	"@type": "BlogPosting",
	headline: title,
	description,
	datePublished: datePublished.toISOString(),
	dateModified: (dateModified ?? datePublished).toISOString(),
	inLanguage: locale,
	mainEntityOfPage: absoluteUrl(site, path),
	author: {
		"@type": "Person",
		name: author,
	},
	publisher: {
		"@type": "Person",
		name: author,
	},
	image: absoluteUrl(site, image),
	keywords: tags.join(", "),
	timeRequired: readingTimeToIsoDuration(readingTime),
});

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
}: ServiceSeo): StructuredData => ({
	"@context": "https://schema.org",
	"@type": "Service",
	name,
	description,
	url: absoluteUrl(site, path),
	serviceType: serviceType ?? name,
	areaServed,
	audience: audience.map((audienceType) => ({
		"@type": "Audience",
		audienceType,
	})),
	provider: {
		"@type": "Person",
		name: providerName,
		url: providerUrl,
		sameAs,
	},
});

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
	const offers = services.map((service) => ({
		"@type": "Offer",
		url: absoluteUrl(site, service.path),
		itemOffered: {
			"@type": "Service",
			name: service.name,
			description: service.description,
			provider: {
				"@type": "Person",
				name: providerName,
				url: providerUrl,
				sameAs,
			},
		},
	}));

	return {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		name,
		description,
		url: absoluteUrl(site, path),
		areaServed,
		founder: {
			"@type": "Person",
			name: providerName,
			url: providerUrl,
			sameAs,
		},
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
