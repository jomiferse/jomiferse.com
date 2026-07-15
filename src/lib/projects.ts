import { getCv } from "@cv";
import { locales, type Locale } from "@/i18n";

type ProjectCollections = NonNullable<ReturnType<typeof getCv>["projects"]>;
type ProjectSource = ProjectCollections["items"][number];

export type ProjectEntry = ProjectSource & {
	id: string;
	slug: string;
};

export const getProjectPages = (locale: Locale): ProjectEntry[] => {
	const projects = getCv(locale).projects;

	return projects?.items ?? [];
};

export const getProject = (locale: Locale, slug: string) =>
	getProjectPages(locale).find((project) => project.slug === slug);

export const getProjectAlternatePaths = (
	project: ProjectEntry,
): Partial<Record<Locale, string>> =>
	Object.fromEntries(
		locales.map((targetLocale) => {
			const match = getProjectPages(targetLocale).find(
				(item) => item.id === project.id,
			);

			return [
				targetLocale,
				match ? `/${targetLocale}/projects/${match.slug}/` : undefined,
			];
		}),
	);

export const getProjectContactHref = (
	locale: Locale,
	project: ProjectEntry,
) => {
	const sourcePath = `/${locale}/projects/${project.slug}/`;
	const relatedService = project.caseStudy?.serviceHref
		?.split("/")
		.filter(Boolean)
		.at(-1);
	const params = new URLSearchParams({
		service: relatedService ?? "assessment",
		sourceCategory: "project",
		sourcePath,
	});

	return `/${locale}/contact?${params.toString()}`;
};
