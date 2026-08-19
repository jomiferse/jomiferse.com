const PROJECT_WIDTHS = [320, 640, 960, 1200] as const;
const AVATAR_WIDTHS = [160, 320, 640] as const;

const getWidths = (src: string): readonly number[] => {
	if (src === "/images/avatar.avif") return AVATAR_WIDTHS;
	if (
		src.startsWith("/images/projects/") ||
		src.startsWith("/images/blog/covers/")
	) {
		return PROJECT_WIDTHS;
	}
	return [];
};

const getVariantPath = (
	src: string,
	width: number,
	format: "avif" | "webp",
) => {
	const withoutImagesPrefix = src.replace(/^\/images\//, "");
	const stem = withoutImagesPrefix.replace(/\.[a-z0-9]+$/i, "");
	return `/images/responsive/${stem}-${width}.${format}`;
};

export interface ResponsiveImageSources {
	avif?: string;
	webp?: string;
	widths: readonly number[];
}

export const getResponsiveImageSources = (
	src: string,
): ResponsiveImageSources => {
	const widths = getWidths(src);
	if (!widths.length) return { widths };

	return {
		widths,
		avif: widths
			.map((width) => `${getVariantPath(src, width, "avif")} ${width}w`)
			.join(", "),
		webp: widths
			.map((width) => `${getVariantPath(src, width, "webp")} ${width}w`)
			.join(", "),
	};
};
