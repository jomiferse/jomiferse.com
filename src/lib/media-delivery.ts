export const EDITORIAL_IMAGE_SIZES =
	"(max-width: 56rem) calc(100vw - 2rem), 50rem";

export const getEditorialImageAttributes = (width: number, height: number) => ({
	width,
	height,
	loading: "lazy" as const,
	decoding: "async" as const,
	sizes: EDITORIAL_IMAGE_SIZES,
});

interface HoverPreviewTarget {
	dataset: { hoverSrc?: string };
	hasAttribute(name: string): boolean;
	setAttribute(name: string, value: string): void;
}

interface HoverPreviewRoot {
	querySelectorAll(selector: string): Iterable<unknown>;
}

export const loadHoverPreviews = (
	root: HoverPreviewRoot,
	capabilities: { hover: boolean; saveData: boolean },
) => {
	if (!capabilities.hover || capabilities.saveData) return 0;

	let loaded = 0;
	for (const candidate of root.querySelectorAll("[data-hover-preview]")) {
		const preview = candidate as HoverPreviewTarget;
		const src = preview.dataset.hoverSrc;
		if (!src || preview.hasAttribute("src")) continue;
		preview.setAttribute("src", src);
		loaded += 1;
	}

	return loaded;
};
