import type { BlogAudience } from "./blog-commercial.ts";

interface BlogPublicationData {
	draft?: boolean;
	commercial: {
		audience: BlogAudience;
	};
}

export const isPublishedBlogPost = (data: { draft?: boolean }) => !data.draft;

export const isPublishedBlogPostForAudience = (
	data: BlogPublicationData,
	audience: BlogAudience,
) => isPublishedBlogPost(data) && data.commercial.audience === audience;
