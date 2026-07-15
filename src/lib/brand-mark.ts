export const brandGeometry = {
	viewBox: "0 0 64 64",
	background: { x: 2, y: 2, width: 60, height: 60, rx: 18 },
	jPath:
		"M13 16h17v25c0 8-4.8 13-12.5 13-4.2 0-7.8-1.7-10.5-4.8l5.4-5.5c1.5 1.7 3.1 2.5 4.9 2.5 3 0 4.7-1.9 4.7-5.5V23h-9z",
	fPath: "M35 16h22v7.2H43v8h11.2v7H43V54h-8z",
	dot: { x: 50, y: 45, width: 7, height: 7, rx: 1.5 },
} as const;

export const brandPalettes = {
	light: {
		surface: "#fbfdff",
		ink: "#102d4f",
		accent: "#c8432f",
		border: "#d7dee7",
	},
	dark: {
		surface: "#102d4f",
		ink: "#fbfdff",
		accent: "#ff8068",
		border: "#102d4f",
	},
} as const;

interface RenderBrandSvgOptions {
	themeAware?: boolean;
	maskable?: boolean;
}

export const renderBrandSvg = ({
	themeAware = false,
	maskable = false,
}: RenderBrandSvgOptions = {}) => {
	const { background, dot, fPath, jPath, viewBox } = brandGeometry;
	const { light, dark } = brandPalettes;
	const themeStyles = themeAware
		? `<style>:root{--brand-surface:${light.surface};--brand-ink:${light.ink};--brand-accent:${light.accent};--brand-border:${light.border}}@media(prefers-color-scheme:dark){:root{--brand-surface:${dark.surface};--brand-ink:${dark.ink};--brand-accent:${dark.accent};--brand-border:${dark.border}}}</style>`
		: "";
	const palette = themeAware
		? {
				surface: "var(--brand-surface)",
				ink: "var(--brand-ink)",
				accent: "var(--brand-accent)",
				border: "var(--brand-border)",
			}
		: light;
	const artwork = `<path d="${jPath}" fill="${palette.ink}"/><path d="${fPath}" fill="${palette.ink}"/><rect x="${dot.x}" y="${dot.y}" width="${dot.width}" height="${dot.height}" rx="${dot.rx}" fill="${palette.accent}"/>`;

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" aria-hidden="true">${themeStyles}${
		maskable
			? `<rect width="64" height="64" fill="${palette.surface}"/><g transform="translate(6 6) scale(0.8125)">${artwork}</g>`
			: `<rect x="${background.x}" y="${background.y}" width="${background.width}" height="${background.height}" rx="${background.rx}" fill="${palette.surface}" stroke="${palette.border}" stroke-width="2"/>${artwork}`
	}</svg>`;
};
