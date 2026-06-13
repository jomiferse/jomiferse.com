import { getCollection, type CollectionEntry } from "astro:content";

import type { Locale } from "@/i18n";

export type BlogPost = CollectionEntry<"blog">;

export { getTranslatedBlogPath } from "@/lib/blog-translation";

export async function getPublishedBlogPosts(locale: Locale) {
	const posts = await getCollection("blog");

	return posts
		.filter((post) => post.id.startsWith(`${locale}/`))
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getBlogPostGroups(posts: BlogPost[]) {
	return {
		featuredPosts: posts.filter((post) => post.data.featured),
		latestPosts: posts.filter((post) => !post.data.featured),
	};
}

export function getLocalBlogSlug(id: string, locale: Locale) {
	return id.replace(new RegExp(`^${locale}/`), "");
}
