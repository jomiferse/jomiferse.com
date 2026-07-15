import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const styles = await readFile(
	join(root, "src", "styles", "global.css"),
	"utf8",
);
const failures = [];
const backgroundStart = styles.indexOf(":root {");
const backgroundEnd = styles.indexOf("h1,");
const backgroundStyles = styles.slice(backgroundStart, backgroundEnd);

for (const marker of [
	"--page-rule:",
	"--page-guide:",
	"--page-rule-spacing: 4.5rem;",
	"background-color: var(--bg);",
	"background-size: 100% var(--page-rule-spacing);",
	"left: max(1rem, calc((100vw - 88rem) / 2));",
	"background: var(--page-guide);",
	"@media (min-width: 64rem)",
]) {
	if (!backgroundStyles.includes(marker)) {
		failures.push(`global background: missing ${marker}`);
	}
}

for (const marker of [
	"radial-gradient",
	"mix-blend-mode",
	"72px 72px",
	".dark body {",
	".dark body::before",
]) {
	if (backgroundStyles.includes(marker)) {
		failures.push(`global background: forbidden ${marker}`);
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("Global background verification passed.");
}
