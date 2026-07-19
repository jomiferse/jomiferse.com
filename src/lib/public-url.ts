const hasFileExtension = (pathname: string) =>
	/\/[a-z0-9][a-z0-9._-]*\.[a-z0-9]+$/i.test(pathname);

export const canonicalPublicHref = (href: string) => {
	if (!href.startsWith("/") || href.startsWith("//")) return href;

	const suffixIndex = href.search(/[?#]/);
	const pathname = suffixIndex === -1 ? href : href.slice(0, suffixIndex);
	const suffix = suffixIndex === -1 ? "" : href.slice(suffixIndex);

	if (
		pathname === "/" ||
		pathname.endsWith("/") ||
		pathname.startsWith("/api/") ||
		pathname.startsWith("/_astro/") ||
		hasFileExtension(pathname)
	) {
		return href;
	}

	return `${pathname}/${suffix}`;
};

export const normalizeInternalHtmlHrefs = (html: string) =>
	html.replace(
		/\bhref=(['"])(\/[^'"]*)\1/g,
		(_match, quote: string, href: string) =>
			`href=${quote}${canonicalPublicHref(href)}${quote}`,
	);
