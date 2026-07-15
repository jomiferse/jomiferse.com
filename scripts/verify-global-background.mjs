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
const footerStart = styles.indexOf(".footer-bar {");
const footerEnd = styles.indexOf(".footer-shell {");
const footerStyles = styles.slice(footerStart, footerEnd);

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

if ((backgroundStyles.match(/--footer-rule:/g) ?? []).length !== 2) {
	failures.push("footer background: light and dark rule tokens are required");
}

for (const marker of [
	"background-color: var(--footer-bg);",
	"var(--footer-rule) calc(var(--page-rule-spacing) - 1px)",
	"background-size: 100% var(--page-rule-spacing);",
]) {
	if (!footerStyles.includes(marker)) {
		failures.push(`footer background: missing ${marker}`);
	}
}

for (const marker of [
	"radial-gradient",
	"linear-gradient(90deg",
	"72px 72px",
]) {
	if (footerStyles.includes(marker)) {
		failures.push(`footer background: forbidden ${marker}`);
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.warn("Global background verification passed.");
}
