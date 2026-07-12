export const contactSourceCategories = [
	"direct",
	"service",
	"landing",
	"article",
	"project",
] as const;

export type ContactSourceCategory = (typeof contactSourceCategories)[number];

const isContactSourceCategory = (
	value: string,
): value is ContactSourceCategory =>
	contactSourceCategories.includes(value as ContactSourceCategory);

const isPublicLocalizedPath = (value: string) =>
	/^\/(en|es)(?:\/[a-z0-9-]+)*\/?$/.test(value) &&
	!value.startsWith("/en/api/") &&
	!value.startsWith("/es/api/");

export const normalizeContactSource = (category: string, path: string) => {
	if (
		!isContactSourceCategory(category) ||
		category === "direct" ||
		!isPublicLocalizedPath(path)
	) {
		return { category: "direct" as const, path: null };
	}

	return { category, path };
};
