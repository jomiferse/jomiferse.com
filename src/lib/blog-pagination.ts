import type { Locale } from "@/i18n";
import type { BlogAudience } from "@/lib/blog-commercial";

export const BLOG_POSTS_PER_PAGE = 6;

export function getTotalPages(
	itemCount: number,
	pageSize = BLOG_POSTS_PER_PAGE,
) {
	return Math.max(1, Math.ceil(itemCount / pageSize));
}

export function getPageItems<T>(
	items: T[],
	page: number,
	pageSize = BLOG_POSTS_PER_PAGE,
) {
	const start = (page - 1) * pageSize;
	return items.slice(start, start + pageSize);
}

export function getBlogArchivePath(
	locale: Locale,
	audience: BlogAudience = "business",
) {
	return audience === "technical"
		? `/${locale}/blog/technical`
		: `/${locale}/blog`;
}

export function getBlogPagePath(
	locale: Locale,
	page: number,
	audience: BlogAudience = "business",
) {
	const archivePath = getBlogArchivePath(locale, audience);
	return page <= 1 ? archivePath : `${archivePath}/page/${page}`;
}
