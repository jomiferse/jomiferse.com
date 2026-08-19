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
	dataset: { hoverSrc?: string; hoverSrcset?: string };
	hasAttribute(name: string): boolean;
	setAttribute(name: string, value: string): void;
	parentElement?: {
		addEventListener(
			type: "pointerenter",
			listener: () => void,
			options: { once: true; passive: true },
		): void;
	} | null;
}

interface HoverPreviewRoot {
	querySelectorAll(selector: string): Iterable<unknown>;
}

export const bindHoverPreviewIntent = (
	root: HoverPreviewRoot,
	capabilities: { hover: boolean; saveData: boolean },
) => {
	if (!capabilities.hover || capabilities.saveData) return 0;

	let bound = 0;
	for (const candidate of root.querySelectorAll("[data-hover-preview]")) {
		const preview = candidate as HoverPreviewTarget;
		const src = preview.dataset.hoverSrc;
		const trigger = preview.parentElement;
		if (!src || !trigger || preview.hasAttribute("src")) continue;

		trigger.addEventListener(
			"pointerenter",
			() => {
				if (preview.hasAttribute("src")) return;
				const srcset = preview.dataset.hoverSrcset;
				if (srcset) preview.setAttribute("srcset", srcset);
				preview.setAttribute("src", src);
			},
			{ once: true, passive: true },
		);
		bound += 1;
	}

	return bound;
};
