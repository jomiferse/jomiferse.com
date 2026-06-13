import type { Locale } from "@/i18n";

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

export function getBlogPagePath(locale: Locale, page: number) {
	return page <= 1 ? `/${locale}/blog` : `/${locale}/blog/page/${page}`;
}
