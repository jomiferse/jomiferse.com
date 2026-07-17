import type { Locale } from "@/i18n";
import type { BillingUnit, PricingKey } from "@/lib/service-commercial";

const DEFAULT_IMAGE = "/images/og/portfolio-og.png";
const PROFILE_IMAGE = "/images/avatar.avif";

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
	jobTitle?: string;
	image?: string;
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
	image?: string;
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

export const normalizePagePath = (path: string) => {
	const pathname = /^https?:\/\//.test(path) ? new URL(path).pathname : path;
	const cleanPath = pathname.split(/[?#]/, 1)[0] || "/";
	const withLeadingSlash = cleanPath.startsWith("/")
		? cleanPath
		: `/${cleanPath}`;

	return withLeadingSlash === "/"
		? "/"
		: `${withLeadingSlash.replace(/\/+$/, "")}/`;
};

export const absoluteUrl = (site: string, path: string) =>
	new URL(path, site).toString();

export const absolutePageUrl = (site: string, path: string) =>
	absoluteUrl(site, normalizePagePath(path));

export const getSeoEntityIds = (site: string, path: string) => ({
	website: `${absolutePageUrl(site, "/")}#website`,
	person: `${absolutePageUrl(site, "/")}#person`,
	page: `${absolutePageUrl(site, path)}#webpage`,
});

const withoutContext = (node: StructuredData): StructuredData => {
	const { "@context": _context, ...value } = node;
	return value;
};

export const buildStructuredDataGraph = (
	nodes: StructuredData[],
): StructuredData => ({
	"@context": "https://schema.org",
	"@graph": nodes.map(withoutContext),
});

export const buildPerson = (
	site: string,
	locale: Locale,
	person: PersonSeo,
): StructuredData => ({
	"@type": "Person",
	"@id": getSeoEntityIds(site, "/").person,
	name: person.name,
	jobTitle: person.jobTitle,
	description: person.description,
	url: absolutePageUrl(site, `/${locale}/about/`),
	email: `mailto:${person.email}`,
	image: absoluteUrl(site, person.image ?? PROFILE_IMAGE),
	address: {
		"@type": "PostalAddress",
		addressLocality: "Granada",
		addressRegion: locale === "es" ? "Andalucía" : "Andalusia",
		addressCountry: "ES",
	},
	sameAs: [person.links.linkedin, person.links.github],
	knowsLanguage: ["es", "en"],
	hasOccupation: {
		"@type": "Occupation",
		name:
			locale === "es"
				? "Desarrollador web freelance en Granada"
				: "Freelance web developer in Granada",
		occupationLocation: {
			"@type": "Country",
			name: locale === "es" ? "España" : "Spain",
		},
		skills:
			"Full-stack development, internal tools, workflow automation, API integrations, Java, Spring Boot, TypeScript, Astro",
	},
	knowsAbout: [
		"Java",
		"Spring Boot",
		"Distributed Systems",
		"Product Engineering",
		"Systems Engineering",
		"Automation",
		"Internal Tooling",
		"Kubernetes",
		"Docker",
		"PostgreSQL",
		"CI/CD",
		"Backend Architecture",
	],
});

export const buildWebSite = (site: string, name: string): StructuredData => ({
	"@type": "WebSite",
	"@id": getSeoEntityIds(site, "/").website,
	name,
	url: absolutePageUrl(site, "/"),
	inLanguage: ["es", "en"],
	publisher: { "@id": getSeoEntityIds(site, "/").person },
});

export const buildWebPage = (
	site: string,
	path: string,
	locale: Locale,
	name: string,
	description: string,
): StructuredData => {
	const ids = getSeoEntityIds(site, path);

	return {
		"@type": "WebPage",
		"@id": ids.page,
		name,
		description,
		url: absolutePageUrl(site, path),
		inLanguage: locale,
		isPartOf: { "@id": ids.website },
		author: { "@id": ids.person },
	};
};

const buildStartingPriceOffer = (
	site: string,
	offer: StartingPriceOfferSeo,
	service?: {
		id: string;
		name: string;
		description: string;
		url: string;
		provider?: StructuredData;
	},
): StructuredData => ({
	"@type": "Offer",
	"@id": `${absolutePageUrl(site, offer.path)}#offer-${offer.key}`,
	name: offer.name,
	description: [offer.description, offer.priceNote].filter(Boolean).join(" "),
	url: `${absolutePageUrl(site, offer.path)}#pricing-options`,
	price: offer.price,
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
				"@id": service.id,
				name: service.name,
				description: service.description,
				url: service.url,
				provider: service.provider,
			}
		: undefined,
});

export const buildBreadcrumbList = (
	site: string,
	items: BreadcrumbItem[],
): StructuredData => {
	if (items.length < 2) {
		throw new RangeError("Breadcrumb items must contain at least two entries");
	}

	return {
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: absolutePageUrl(site, item.path),
		})),
	};
};

export const buildProfilePage = (
	site: string,
	locale: Locale,
	_person: PersonSeo,
): StructuredData => {
	const ids = getSeoEntityIds(site, `/${locale}/about/`);

	return {
		"@type": "ProfilePage",
		"@id": ids.page,
		mainEntity: {
			"@type": "Person",
			"@id": ids.person,
		},
	};
};

export const buildCollectionPage = (
	site: string,
	path: string,
	name: string,
	description: string,
	mainEntityId?: string,
): StructuredData => ({
	"@type": "CollectionPage",
	"@id": getSeoEntityIds(site, path).page,
	name,
	description,
	url: absolutePageUrl(site, path),
	mainEntity: mainEntityId ? { "@id": mainEntityId } : undefined,
});

export const buildContactPage = (
	site: string,
	path: string,
	name: string,
	description: string,
): StructuredData => ({
	"@type": "ContactPage",
	"@id": getSeoEntityIds(site, path).page,
	name,
	description,
	url: absolutePageUrl(site, path),
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
}: BlogPostingSeo): StructuredData => {
	const ids = getSeoEntityIds(site, path);
	const pageUrl = absolutePageUrl(site, path);
	const authorEntity =
		author === "José Miguel Fernández"
			? { "@id": ids.person }
			: { "@type": "Person", name: author };

	return {
		"@type": "BlogPosting",
		"@id": `${pageUrl}#article`,
		headline: title,
		description,
		datePublished: datePublished.toISOString(),
		dateModified: (dateModified ?? datePublished).toISOString(),
		inLanguage: locale,
		mainEntityOfPage: { "@id": ids.page },
		isPartOf: { "@id": ids.website },
		author: authorEntity,
		publisher: { "@id": ids.person },
		image: absoluteUrl(site, image),
		keywords: tags.join(", "),
		timeRequired: readingTimeToIsoDuration(readingTime),
	};
};

export const buildSoftwareApplication = (
	project: SoftwareProjectSeo,
): StructuredData => ({
	"@type": "SoftwareApplication",
	name: project.name,
	description: project.description,
	applicationCategory: project.category ?? "DeveloperApplication",
	url: project.url,
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
): StructuredData => {
	const pageUrl = absolutePageUrl(site, project.path);
	const ids = getSeoEntityIds(site, project.path);

	return {
		"@type": "CreativeWork",
		"@id": `${pageUrl}#creative-work`,
		name: project.name,
		description: project.description,
		creator: { "@id": ids.person },
		mainEntityOfPage: { "@id": ids.page },
		keywords: project.technologies?.join(", "),
		url: pageUrl,
		image: project.image ? absoluteUrl(site, project.image) : undefined,
	};
};

export const buildItemList = (
	site: string,
	path: string,
	name: string,
	items: Array<{ name: string; path: string }>,
): StructuredData => ({
	"@type": "ItemList",
	"@id": `${absolutePageUrl(site, path)}#item-list`,
	name,
	numberOfItems: items.length,
	itemListElement: items.map((item, index) => ({
		"@type": "ListItem",
		position: index + 1,
		item: {
			"@type": "CreativeWork",
			"@id": `${absolutePageUrl(site, item.path)}#creative-work`,
			name: item.name,
			url: absolutePageUrl(site, item.path),
		},
	})),
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
	const pageUrl = absolutePageUrl(site, path);
	const serviceId = `${pageUrl}#service`;
	const provider = {
		"@type": "Person",
		"@id": ids.person,
		name: providerName,
		url: providerUrl,
		sameAs,
	};
	const service = {
		id: serviceId,
		name,
		description,
		url: pageUrl,
		provider,
	};

	return {
		"@type": "Service",
		"@id": serviceId,
		name,
		description,
		url: pageUrl,
		mainEntityOfPage: { "@id": ids.page },
		serviceType: serviceType ?? name,
		areaServed,
		audience: audience.map((audienceType) => ({
			"@type": "Audience",
			audienceType,
		})),
		provider,
		offers: offers.map((offer) =>
			buildStartingPriceOffer(site, offer, service),
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
	const ids = getSeoEntityIds(site, path);
	const pageUrl = absolutePageUrl(site, path);
	const provider = {
		"@type": "Person",
		"@id": ids.person,
		name: providerName,
		url: providerUrl,
		sameAs,
	};
	const offers = services.flatMap((service) => {
		const serviceUrl = absolutePageUrl(site, service.path);
		const serviceEntity = {
			id: `${serviceUrl}#service`,
			name: service.name,
			description: service.description,
			url: serviceUrl,
			provider,
		};

		return service.offers?.length
			? service.offers.map((offer) =>
					buildStartingPriceOffer(site, offer, serviceEntity),
				)
			: [
					{
						"@type": "Offer",
						url: serviceUrl,
						itemOffered: {
							"@type": "Service",
							"@id": serviceEntity.id,
							name: service.name,
							description: service.description,
							url: serviceUrl,
							provider,
						},
					},
				];
	});

	return {
		"@type": "ProfessionalService",
		"@id": `${pageUrl}#professional-service`,
		name,
		description,
		url: pageUrl,
		mainEntityOfPage: { "@id": ids.page },
		areaServed,
		sameAs,
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
