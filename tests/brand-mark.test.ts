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
	assert.deepEqual(brandGeometry.dot, {
		x: 50,
		y: 45,
		width: 7,
		height: 7,
		rx: 1.5,
	});
	assert.equal(brandPalettes.light.ink, "#102d4f");
	assert.equal(brandPalettes.light.accent, "#c8432f");
});

test("renders a theme-aware favicon SVG", () => {
	const svg = renderBrandSvg({ themeAware: true });

	assert.match(svg, /prefers-color-scheme:dark/);
	assert.match(svg, /#102d4f/);
	assert.match(svg, /#ff8068/);
	assert.match(svg, /aria-hidden="true"/);
});

test("keeps maskable artwork inside a central safe area", () => {
	const svg = renderBrandSvg({ maskable: true });

	assert.match(svg, /<rect width="64" height="64"/);
	assert.match(svg, /transform="translate\(6 6\) scale\(0\.8125\)"/);
});
