import { getCv } from "@cv";
import { locales, type Locale } from "@/i18n";

type ProjectCollections = NonNullable<ReturnType<typeof getCv>["projects"]>;
type ProjectKind = "personal" | "client";
type ProjectSource =
	| ProjectCollections["personal"][number]
	| ProjectCollections["company"][number];

export type ProjectEntry = ProjectSource & {
	id: string;
	slug: string;
	kind: ProjectKind;
};

export const getProjectPages = (locale: Locale): ProjectEntry[] => {
	const projects = getCv(locale).projects;

	return [
		...(projects?.company ?? []).map((project) => ({
			...project,
			kind: "client" as const,
		})),
		...(projects?.personal ?? []).map((project) => ({
			...project,
			kind: "personal" as const,
		})),
	];
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
