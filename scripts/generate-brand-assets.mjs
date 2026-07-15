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

await writeFile(
	join(publicDir, "favicon.svg"),
	renderBrandSvg({ themeAware: true }),
);

for (const size of [16, 32, 96]) {
	await writeFile(
		join(publicDir, `favicon-${size}x${size}.png`),
		await renderPng(rasterInput, size),
	);
}

await writeFile(
	join(publicDir, "apple-touch-icon.png"),
	await renderPng(maskableInput, 180),
);
await writeFile(
	join(publicDir, "web-app-manifest-192x192.png"),
	await renderPng(maskableInput, 192),
);
await writeFile(
	join(publicDir, "web-app-manifest-512x512.png"),
	await renderPng(maskableInput, 512),
);

const icoImages = await Promise.all(
	[16, 32, 48].map(async (size) => ({
		size,
		data: await renderPng(rasterInput, size),
	})),
);
await writeFile(join(publicDir, "favicon.ico"), createIco(icoImages));

console.warn("Brand assets generated.");
