import { getCollection, type CollectionEntry } from "astro:content";

import type { Locale } from "@/i18n";
import type { BlogAudience } from "@/lib/blog-commercial";
import { selectHomeFeaturedBlogPosts } from "@/lib/blog-home-featured";
import {
	isPublishedBlogPost,
	isPublishedBlogPostForAudience,
} from "@/lib/blog-publication";

export type BlogPost = CollectionEntry<"blog">;

export { getTranslatedBlogPath } from "@/lib/blog-translation";

export async function getPublishedBlogPosts(locale: Locale) {
	const posts = await getCollection("blog");

	return posts
		.filter((post) => post.id.startsWith(`${locale}/`))
		.filter((post) => isPublishedBlogPost(post.data))
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getPublishedBlogPostsByAudience(
	locale: Locale,
	audience: BlogAudience,
) {
	const posts = await getPublishedBlogPosts(locale);
	return posts.filter((post) =>
		isPublishedBlogPostForAudience(post.data, audience),
	);
}

export async function getHomeFeaturedBlogPosts(locale: Locale) {
	const businessPosts = await getPublishedBlogPostsByAudience(
		locale,
		"business",
	);
	const posts = selectHomeFeaturedBlogPosts(businessPosts);

	if (posts.length !== 3) {
		throw new Error(
			`Expected three home featured blog posts for ${locale}, found ${posts.length}`,
		);
	}

	return posts;
}

export function getBlogPostGroups(posts: BlogPost[]) {
	const primaryFeatured = posts.find((post) => post.data.featured);

	return {
		primaryFeatured,
		archivePosts: posts.filter((post) => post.id !== primaryFeatured?.id),
	};
}

export function getLocalBlogSlug(id: string, locale: Locale) {
	return id.replace(new RegExp(`^${locale}/`), "");
}
