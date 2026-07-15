export const blogEditorialRoleValues = [
	"buyer-led",
	"technical-authority",
	"case-study",
] as const;

export type BlogEditorialRole = (typeof blogEditorialRoleValues)[number];

export const blogAudienceValues = ["business", "technical"] as const;

export type BlogAudience = (typeof blogAudienceValues)[number];
