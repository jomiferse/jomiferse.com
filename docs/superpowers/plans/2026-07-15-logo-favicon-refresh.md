# Logo and Favicon Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the inconsistent header mark and favicon package with the approved “JF” editorial monogram across browser, installed-app, and site-header surfaces.

**Architecture:** Keep the geometry and SVG renderer in one TypeScript module. Render that geometry directly through a small Astro component in the header and through a build-time Sharp script for SVG, PNG, and ICO assets. A focused verifier checks source integration, metadata, dimensions, theme variants, and ICO entries without adding a production runtime dependency.

**Tech Stack:** Astro 7, TypeScript, Node.js 24, Sharp 0.34, SVG, CSS custom properties, Node test runner.

## Global Constraints

- Work directly on `main`; do not create a worktree or branch.
- Preserve unrelated staged and unstaged user changes. Every commit must use `git commit --only` with explicit paths.
- The approved mark is the geometric “JF” monogram with navy ink, an ivory surface, and one coral square.
- Header colors must use `var(--surface)`, `var(--home-navy)`, `var(--action)`, and `var(--surface-border)` so dark mode adapts naturally.
- The header mark is decorative inside the existing labelled home link and must not duplicate its accessible name.
- Do not change typography, navigation, commercial copy, social metadata, or unrelated components.
- Validate 1440 px desktop and 390 px mobile in `/es` and `/en`, in light and dark themes.

---

## File Structure

- Create `src/lib/brand-mark.ts`: single source of truth for geometry, palettes, and standalone SVG rendering.
- Create `src/components/common/BrandMark.astro`: theme-aware decorative header SVG.
- Modify `src/components/common/Header.astro`: replace the textual “JMF” mark with `BrandMark`.
- Modify `src/styles/global.css`: size the SVG mark and remove obsolete typographic badge styling.
- Create `scripts/generate-brand-assets.mjs`: generate all public SVG, PNG, and ICO files from the shared renderer.
- Create `scripts/verify-brand-assets.mjs`: verify integration, theme CSS, raster dimensions, manifest fields, and ICO entries.
- Create `tests/brand-mark.test.ts`: unit-test the renderer and maskable safe-area mode.
- Modify `public/site.webmanifest`: replace generic names and align install metadata.
- Regenerate the existing files under `public/`: `favicon.svg`, `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon-96x96.png`, `apple-touch-icon.png`, `web-app-manifest-192x192.png`, and `web-app-manifest-512x512.png`.

---

### Task 1: Shared brand geometry and SVG renderer

**Files:**

- Create: `tests/brand-mark.test.ts`
- Create: `src/lib/brand-mark.ts`

**Interfaces:**

- Produces: `brandGeometry`, `brandPalettes`, and `renderBrandSvg(options?: { themeAware?: boolean; maskable?: boolean }): string`.
- Consumers: `BrandMark.astro`, `generate-brand-assets.mjs`, and `verify-brand-assets.mjs`.

- [ ] **Step 1: Write the failing renderer tests**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";

import {
	brandGeometry,
	brandPalettes,
	renderBrandSvg,
} from "../src/lib/brand-mark.ts";

test("defines the approved JF geometry and palette", () => {
	assert.equal(brandGeometry.viewBox, "0 0 64 64");
	assert.match(brandGeometry.jPath, /^M13 16/);
	assert.match(brandGeometry.fPath, /^M35 16/);
	assert.deepEqual(brandGeometry.dot, { x: 50, y: 45, width: 7, height: 7, rx: 1.5 });
	assert.equal(brandPalettes.light.ink, "#102d4f");
	assert.equal(brandPalettes.light.accent, "#c8432f");
});

test("renders a theme-aware favicon SVG", () => {
	const svg = renderBrandSvg({ themeAware: true });

	assert.match(svg, /prefers-color-scheme: dark/);
	assert.match(svg, /#102d4f/);
	assert.match(svg, /#ff8068/);
	assert.match(svg, /aria-hidden="true"/);
});

test("keeps maskable artwork inside a central safe area", () => {
	const svg = renderBrandSvg({ maskable: true });

	assert.match(svg, /<rect width="64" height="64"/);
	assert.match(svg, /transform="translate\(6 6\) scale\(0\.8125\)"/);
});
```

- [ ] **Step 2: Run the test and confirm the module is missing**

Run: `node --test tests/brand-mark.test.ts`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/brand-mark.ts`.

- [ ] **Step 3: Implement the geometry and renderer**

```ts
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
		? `<style>:root{--brand-surface:${light.surface};--brand-ink:${light.ink};--brand-accent:${light.accent};--brand-border:${light.border}}@media (prefers-color-scheme:dark){:root{--brand-surface:${dark.surface};--brand-ink:${dark.ink};--brand-accent:${dark.accent};--brand-border:${dark.border}}}</style>`
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
```

- [ ] **Step 4: Run the focused and full unit tests**

Run: `node --test tests/brand-mark.test.ts`

Expected: all brand-mark tests PASS.

Run: `pnpm test`

Expected: all repository tests PASS.

- [ ] **Step 5: Commit the shared renderer only**

```bash
git add src/lib/brand-mark.ts tests/brand-mark.test.ts
git commit --only src/lib/brand-mark.ts tests/brand-mark.test.ts -m "feat(brand): add shared monogram geometry"
```

---

### Task 2: Header brand component and structural verification

**Files:**

- Create: `scripts/verify-brand-assets.mjs`
- Create: `src/components/common/BrandMark.astro`
- Modify: `src/components/common/Header.astro:1-67`
- Modify: `src/styles/global.css:656-678`

**Interfaces:**

- Consumes: `brandGeometry` from `src/lib/brand-mark.ts`.
- Produces: `<BrandMark class="header-brand__mark" />` as a decorative, theme-aware SVG.

- [ ] **Step 1: Add a verifier that can stop after structural checks**

```js
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const phase = process.argv.find((value) => value.startsWith("--phase="))?.split("=")[1] ?? "assets";
const phases = ["structure", "assets"];
const failures = [];

if (!phases.includes(phase)) throw new Error(`Unknown phase: ${phase}`);

const readSource = async (...parts) => {
	try {
		return await readFile(join(root, ...parts), "utf8");
	} catch {
		failures.push(`missing source: ${parts.join("/")}`);
		return "";
	}
};
const requireMarkers = (label, source, markers) => {
	for (const marker of markers) {
		if (!source.includes(marker)) failures.push(`${label}: missing ${marker}`);
	}
};
const rejectMarkers = (label, source, markers) => {
	for (const marker of markers) {
		if (source.includes(marker)) failures.push(`${label}: forbidden ${marker}`);
	}
};

const component = await readSource("src", "components", "common", "BrandMark.astro");
const header = await readSource("src", "components", "common", "Header.astro");
const styles = await readSource("src", "styles", "global.css");

requireMarkers("brand component", component, ["brandGeometry", 'aria-hidden="true"', 'focusable="false"', "brand-mark__surface", "brand-mark__letter", "brand-mark__dot"]);
requireMarkers("header", header, ['import BrandMark from "@/components/common/BrandMark.astro"', '<BrandMark class="header-brand__mark" />']);
rejectMarkers("header", header, ['<span class="header-brand__mark">JMF</span>']);
requireMarkers("brand styles", styles, [".header-brand__mark", "width: 2.5rem", "height: 2.5rem"]);
rejectMarkers("brand styles", styles, ["font-size: 0.7rem", "letter-spacing: 0.04em"]);

if (phase === "assets") {
	const favicon = await readSource("public", "favicon.svg");
	const manifest = JSON.parse(await readSource("public", "site.webmanifest"));
	requireMarkers("favicon", favicon, ["prefers-color-scheme:dark", "#102d4f", "#ff8068"]);

	const expectedImages = new Map([
		["favicon-16x16.png", 16],
		["favicon-32x32.png", 32],
		["favicon-96x96.png", 96],
		["apple-touch-icon.png", 180],
		["web-app-manifest-192x192.png", 192],
		["web-app-manifest-512x512.png", 512],
	]);
	for (const [filename, size] of expectedImages) {
		try {
			const metadata = await sharp(join(root, "public", filename)).metadata();
			if (metadata.width !== size || metadata.height !== size) failures.push(`${filename}: expected ${size}x${size}`);
		} catch {
			failures.push(`${filename}: unreadable image`);
		}
	}

	const ico = await readFile(join(root, "public", "favicon.ico"));
	const count = ico.readUInt16LE(4);
	const sizes = Array.from({ length: count }, (_, index) => ico.readUInt8(6 + index * 16) || 256);
	if (count !== 3 || sizes.join(",") !== "16,32,48") failures.push(`favicon.ico: expected 16,32,48; received ${sizes.join(",")}`);

	if (manifest.name !== "José Miguel Fernández") failures.push("manifest: wrong name");
	if (manifest.short_name !== "JMF") failures.push("manifest: wrong short_name");
	if (manifest.theme_color !== "#102d4f") failures.push("manifest: wrong theme_color");
	if (manifest.background_color !== "#eef3f8") failures.push("manifest: wrong background_color");
	for (const icon of manifest.icons ?? []) {
		if (icon.purpose !== "any maskable") failures.push(`${icon.src}: missing any maskable purpose`);
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.warn(`Brand asset verification passed through ${phase}.`);
```

- [ ] **Step 2: Run the structural phase and verify it fails**

Run: `node scripts/verify-brand-assets.mjs --phase=structure`

Expected: FAIL because `BrandMark.astro` and its header integration do not exist.

- [ ] **Step 3: Create the Astro component**

```astro
---
import { brandGeometry } from "@/lib/brand-mark";

interface Props {
	class?: string;
}

const { class: className } = Astro.props as Props;
const { background, dot, fPath, jPath, viewBox } = brandGeometry;
---

<svg
	viewBox={viewBox}
	class:list={["brand-mark", className]}
	aria-hidden="true"
	focusable="false"
>
	<rect
		class="brand-mark__surface"
		x={background.x}
		y={background.y}
		width={background.width}
		height={background.height}
		rx={background.rx}
	/>
	<path class="brand-mark__letter" d={jPath} />
	<path class="brand-mark__letter" d={fPath} />
	<rect
		class="brand-mark__dot"
		x={dot.x}
		y={dot.y}
		width={dot.width}
		height={dot.height}
		rx={dot.rx}
	/>
</svg>

<style>
	.brand-mark {
		display: block;
	}

	.brand-mark__surface {
		fill: var(--surface);
		stroke: color-mix(in srgb, var(--action) 34%, var(--surface-border));
		stroke-width: 2;
	}

	.brand-mark__letter {
		fill: var(--home-navy);
	}

	.brand-mark__dot {
		fill: var(--action);
	}
</style>
```

- [ ] **Step 4: Integrate the component and simplify its global sizing rule**

Add the import to `Header.astro`:

```astro
import BrandMark from "@/components/common/BrandMark.astro";
```

Replace the old mark span with:

```astro
<BrandMark class="header-brand__mark" />
```

Replace the `.header-brand__mark` rule in `global.css` with:

```css
.header-brand__mark {
	display: block;
	width: 2.5rem;
	height: 2.5rem;
	flex: 0 0 auto;
	filter: drop-shadow(
		0 8px 10px color-mix(in srgb, var(--home-navy) 6%, transparent)
	);
}
```

- [ ] **Step 5: Run structural verification, formatting, and Astro check**

Run: `node scripts/verify-brand-assets.mjs --phase=structure`

Expected: `Brand asset verification passed through structure.`

Run: `pnpm exec prettier --check src/lib/brand-mark.ts src/components/common/BrandMark.astro src/components/common/Header.astro src/styles/global.css scripts/verify-brand-assets.mjs tests/brand-mark.test.ts`

Expected: all listed files use Prettier formatting.

Run: `pnpm run check`

Expected: Astro reports no errors.

- [ ] **Step 6: Commit only the header integration and verifier**

```bash
git add scripts/verify-brand-assets.mjs src/components/common/BrandMark.astro src/components/common/Header.astro src/styles/global.css
git commit --only scripts/verify-brand-assets.mjs src/components/common/BrandMark.astro src/components/common/Header.astro src/styles/global.css -m "feat(header): adopt editorial brand mark"
```

---

### Task 3: Reproducible favicon and installed-app assets

**Files:**

- Create: `scripts/generate-brand-assets.mjs`
- Modify: `public/site.webmanifest`
- Regenerate: `public/favicon.svg`
- Regenerate: `public/favicon.ico`
- Regenerate: `public/favicon-16x16.png`
- Regenerate: `public/favicon-32x32.png`
- Regenerate: `public/favicon-96x96.png`
- Regenerate: `public/apple-touch-icon.png`
- Regenerate: `public/web-app-manifest-192x192.png`
- Regenerate: `public/web-app-manifest-512x512.png`

**Interfaces:**

- Consumes: `renderBrandSvg` from `src/lib/brand-mark.ts` and Sharp.
- Produces: deterministic browser and app icon files in `public/`.

- [ ] **Step 1: Run full verification against the old assets**

Run: `node scripts/verify-brand-assets.mjs`

Expected: FAIL for the old favicon theme markers, manifest values, and ICO entry sizes.

- [ ] **Step 2: Add the asset generator**

```js
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import { renderBrandSvg } from "../src/lib/brand-mark.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicDir = join(root, "public");
const rasterInput = Buffer.from(renderBrandSvg());
const maskableInput = Buffer.from(renderBrandSvg({ maskable: true }));

const renderPng = (input, size) =>
	sharp(input, { density: 384 }).resize(size, size).png().toBuffer();

const createIco = (images) => {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(images.length, 4);

	let offset = 6 + images.length * 16;
	const entries = images.map(({ data, size }) => {
		const entry = Buffer.alloc(16);
		entry.writeUInt8(size === 256 ? 0 : size, 0);
		entry.writeUInt8(size === 256 ? 0 : size, 1);
		entry.writeUInt16LE(1, 4);
		entry.writeUInt16LE(32, 6);
		entry.writeUInt32LE(data.length, 8);
		entry.writeUInt32LE(offset, 12);
		offset += data.length;
		return entry;
	});

	return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
};

await writeFile(join(publicDir, "favicon.svg"), renderBrandSvg({ themeAware: true }));

for (const size of [16, 32, 96]) {
	await writeFile(join(publicDir, `favicon-${size}x${size}.png`), await renderPng(rasterInput, size));
}

await writeFile(join(publicDir, "apple-touch-icon.png"), await renderPng(maskableInput, 180));
await writeFile(join(publicDir, "web-app-manifest-192x192.png"), await renderPng(maskableInput, 192));
await writeFile(join(publicDir, "web-app-manifest-512x512.png"), await renderPng(maskableInput, 512));

const icoImages = await Promise.all(
	[16, 32, 48].map(async (size) => ({ size, data: await renderPng(rasterInput, size) })),
);
await writeFile(join(publicDir, "favicon.ico"), createIco(icoImages));

console.warn("Brand assets generated.");
```

- [ ] **Step 3: Replace the generic manifest values**

```json
{
	"name": "José Miguel Fernández",
	"short_name": "JMF",
	"icons": [
		{
			"src": "/web-app-manifest-192x192.png",
			"sizes": "192x192",
			"type": "image/png",
			"purpose": "any maskable"
		},
		{
			"src": "/web-app-manifest-512x512.png",
			"sizes": "512x512",
			"type": "image/png",
			"purpose": "any maskable"
		}
	],
	"theme_color": "#102d4f",
	"background_color": "#eef3f8",
	"display": "standalone"
}
```

- [ ] **Step 4: Generate and verify every public asset**

Run: `node scripts/generate-brand-assets.mjs`

Expected: `Brand assets generated.`

Run: `node scripts/verify-brand-assets.mjs`

Expected: `Brand asset verification passed through assets.`

Run: `file public/favicon.ico public/favicon-16x16.png public/favicon-32x32.png public/favicon-96x96.png public/apple-touch-icon.png public/web-app-manifest-192x192.png public/web-app-manifest-512x512.png`

Expected: ICO output plus PNG dimensions of 16, 32, 96, 180, 192, and 512 px respectively.

- [ ] **Step 5: Inspect the output at native and enlarged sizes**

Open `public/favicon-16x16.png`, `public/favicon-32x32.png`, and `public/web-app-manifest-512x512.png`. Confirm the “J” and “F” remain separate, the coral square is visible, no edge is cropped, and the maskable artwork has a visibly larger safe area.

- [ ] **Step 6: Commit only the generator, manifest, and generated assets**

```bash
git add scripts/generate-brand-assets.mjs public/site.webmanifest public/favicon.svg public/favicon.ico public/favicon-16x16.png public/favicon-32x32.png public/favicon-96x96.png public/apple-touch-icon.png public/web-app-manifest-192x192.png public/web-app-manifest-512x512.png
git commit --only scripts/generate-brand-assets.mjs public/site.webmanifest public/favicon.svg public/favicon.ico public/favicon-16x16.png public/favicon-32x32.png public/favicon-96x96.png public/apple-touch-icon.png public/web-app-manifest-192x192.png public/web-app-manifest-512x512.png -m "feat(brand): refresh favicon asset set"
```

---

### Task 4: Browser review and complete repository validation

**Files:**

- Verify only; modify earlier task files only if validation reveals a defect.

**Interfaces:**

- Consumes: completed header component and generated public assets.
- Produces: verified light/dark, bilingual, responsive brand experience.

- [ ] **Step 1: Format all task files**

Run: `pnpm exec prettier --write src/lib/brand-mark.ts src/components/common/BrandMark.astro src/components/common/Header.astro src/styles/global.css scripts/generate-brand-assets.mjs scripts/verify-brand-assets.mjs tests/brand-mark.test.ts public/site.webmanifest public/favicon.svg`

Expected: Prettier completes without errors. Re-run `node scripts/generate-brand-assets.mjs` if formatting changes `favicon.svg` away from the deterministic generated output.

- [ ] **Step 2: Run focused checks**

Run: `pnpm test && node scripts/verify-brand-assets.mjs && pnpm run verify:header-redesign`

Expected: unit tests and both verification scripts PASS.

- [ ] **Step 3: Run the required repository validation set**

Run: `pnpm run format:check && pnpm run check && pnpm run lint && pnpm run verify:ai-seo && pnpm run build`

Expected: every command exits 0; the production build emits `/es` and `/en` routes.

- [ ] **Step 4: Review the header in the browser**

Run: `pnpm run dev`

Review `/es` and `/en` at 1440 × 900 and 390 × 844. In each route, inspect light and dark themes, scroll past 24 px to activate the compact header, and confirm:

- the mark remains 40 × 40 px without layout shift;
- the name and role remain readable and unchanged;
- the SVG uses navy/coral in light mode and the theme-adjusted light/coral treatment in dark mode;
- the mobile actions fit without horizontal overflow;
- focus on the home link remains visible;
- the browser tab shows the new favicon.

- [ ] **Step 5: Inspect final scope and working tree safety**

Run: `git status -sb`

Expected: unrelated user changes remain present and untouched; only intentional brand files differ from their committed state if a validation fix was necessary.

Run: `git diff --check HEAD~3..HEAD`

Expected: no whitespace errors in the implementation commits.
