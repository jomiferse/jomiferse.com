import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const [robots, llms, seo] = await Promise.all([
	readFile(new URL("public/robots.txt", root), "utf8"),
	readFile(new URL("public/llms.txt", root), "utf8"),
	readFile(new URL("src/lib/seo.ts", root), "utf8"),
]);

const servicePaths = [
	"/es/services/diseno-web-wordpress/",
	"/en/services/wordpress-web-design/",
	"/es/services/website-redesign/",
	"/en/services/website-redesign/",
	"/es/services/software-a-medida/",
	"/en/services/custom-software/",
	"/es/services/internal-tools/",
	"/en/services/internal-tools/",
	"/es/services/automatizacion-de-procesos/",
	"/en/services/process-automation/",
	"/es/services/integraciones-api/",
	"/en/services/api-integrations/",
	"/es/services/backend-spring-boot/",
	"/en/services/backend-spring-boot/",
];

const crawlerAllowsPublicContent = (crawler: string) =>
	robots.split(/(?=^User-agent:\s*)/gim).some((group) => {
		const lines = group
			.split(/\r?\n/)
			.map((line) => line.trim())
			.filter(Boolean);

		return (
			lines[0]?.toLowerCase() === `user-agent: ${crawler.toLowerCase()}` &&
			lines.some((line) => /^allow:\s*\/$/i.test(line))
		);
	});

test("keeps public content accessible to OpenAI search crawlers", () => {
	for (const crawler of ["OAI-SearchBot", "ChatGPT-User"]) {
		assert.ok(
			crawlerAllowsPublicContent(crawler),
			`${crawler} must be allowed`,
		);
	}
});

test("lists every primary localized service in llms.txt", () => {
	for (const path of servicePaths) {
		assert.match(llms, new RegExp(`https://www\\.jomiferse\\.com${path}`));
	}
});

test("keeps commercial schema signals and excludes HowTo schema", () => {
	for (const signal of [
		'"@type": "ProfessionalService"',
		'"@type": "OfferCatalog"',
		"makesOffer:",
	]) {
		assert.ok(seo.includes(signal), `Missing schema signal: ${signal}`);
	}

	assert.doesNotMatch(`${robots}\n${llms}\n${seo}`, /\bHowTo\b/);
});
