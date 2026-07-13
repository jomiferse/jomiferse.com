import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const layoutPath = fileURLToPath(
	new URL("../src/layouts/BaseLayout.astro", import.meta.url),
);
const layout = await readFile(layoutPath, "utf8");

if (!layout.includes('const theme = stored ?? "light";')) {
	console.error("The default theme for first-time visitors must be light.");
	process.exitCode = 1;
} else {
	console.warn("Default theme verification passed.");
}
