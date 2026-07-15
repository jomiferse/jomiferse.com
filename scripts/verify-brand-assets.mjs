import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const phase =
	process.argv.find((value) => value.startsWith("--phase="))?.split("=")[1] ??
	"assets";
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

const component = await readSource(
	"src",
	"components",
	"common",
	"BrandMark.astro",
);
const header = await readSource("src", "components", "common", "Header.astro");
const styles = await readSource("src", "styles", "global.css");
const brandRule = styles.match(/\.header-brand__mark\s*\{[^}]*\}/s)?.[0] ?? "";

requireMarkers("brand component", component, [
	"brandGeometry",
	'aria-hidden="true"',
	'focusable="false"',
	"brand-mark__surface",
	"brand-mark__letter",
	"brand-mark__dot",
]);
requireMarkers("header", header, [
	'import BrandMark from "@/components/common/BrandMark.astro"',
	'<BrandMark class="header-brand__mark" />',
]);
rejectMarkers("header", header, [
	'<span class="header-brand__mark">JMF</span>',
]);
requireMarkers("brand styles", brandRule, [
	".header-brand__mark",
	"width: 2.5rem",
	"height: 2.5rem",
]);
rejectMarkers("brand styles", brandRule, [
	"font-size: 0.7rem",
	"letter-spacing: 0.04em",
]);

if (phase === "assets") {
	const favicon = await readSource("public", "favicon.svg");
	const manifest = JSON.parse(await readSource("public", "site.webmanifest"));
	requireMarkers("favicon", favicon, [
		"prefers-color-scheme:dark",
		"#102d4f",
		"#ff8068",
	]);

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
			if (metadata.width !== size || metadata.height !== size) {
				failures.push(`${filename}: expected ${size}x${size}`);
			}
		} catch {
			failures.push(`${filename}: unreadable image`);
		}
	}

	const ico = await readFile(join(root, "public", "favicon.ico"));
	const count = ico.readUInt16LE(4);
	const sizes = Array.from(
		{ length: count },
		(_, index) => ico.readUInt8(6 + index * 16) || 256,
	);
	if (count !== 3 || sizes.join(",") !== "16,32,48") {
		failures.push(
			`favicon.ico: expected 16,32,48; received ${sizes.join(",")}`,
		);
	}

	if (manifest.name !== "José Miguel Fernández") {
		failures.push("manifest: wrong name");
	}
	if (manifest.short_name !== "JMF") {
		failures.push("manifest: wrong short_name");
	}
	if (manifest.theme_color !== "#102d4f") {
		failures.push("manifest: wrong theme_color");
	}
	if (manifest.background_color !== "#eef3f8") {
		failures.push("manifest: wrong background_color");
	}
	for (const icon of manifest.icons ?? []) {
		if (icon.purpose !== "any maskable") {
			failures.push(`${icon.src}: missing any maskable purpose`);
		}
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.warn(`Brand asset verification passed through ${phase}.`);
