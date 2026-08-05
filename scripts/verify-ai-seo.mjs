import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const site = "https://www.jomiferse.com";

const localizedServicePaths = [
	["/es/services/diseno-web-wordpress/", "/en/services/wordpress-web-design/"],
	["/es/services/website-redesign/", "/en/services/website-redesign/"],
	["/es/services/software-a-medida/", "/en/services/custom-software/"],
	["/es/services/internal-tools/", "/en/services/internal-tools/"],
	[
		"/es/services/automatizacion-de-procesos/",
		"/en/services/process-automation/",
	],
	["/es/services/integraciones-api/", "/en/services/api-integrations/"],
	["/es/services/backend-spring-boot/", "/en/services/backend-spring-boot/"],
];

export const expectedServiceUrls = localizedServicePaths
	.flat()
	.map((path) => `${site}${path}`);

const crawlerAllowsPublicContent = (robots, crawler) =>
	robots
		.split(/(?=^User-agent:\s*)/gim)
		.some((group) => {
			const lines = group
				.split(/\r?\n/)
				.map((line) => line.trim())
				.filter(Boolean);
			return (
				lines[0]?.toLowerCase() === `user-agent: ${crawler.toLowerCase()}` &&
				lines.some((line) => /^allow:\s*\/$/i.test(line))
			);
		});

export function verifyAiSeoSources({ robots, llms, seo }) {
	const issues = [];

	for (const crawler of ["OAI-SearchBot", "ChatGPT-User"]) {
		if (!crawlerAllowsPublicContent(robots, crawler)) {
			issues.push(`${crawler} must be explicitly allowed to crawl public content`);
		}
	}

	for (const serviceUrl of expectedServiceUrls) {
		if (!llms.includes(serviceUrl)) {
			issues.push(`Missing service URL in llms.txt: ${serviceUrl}`);
		}
	}

	for (const schemaSignal of [
		'"@type": "ProfessionalService"',
		'"@type": "OfferCatalog"',
		"makesOffer:",
	]) {
		if (!seo.includes(schemaSignal)) {
			issues.push(`Missing commercial schema signal: ${schemaSignal}`);
		}
	}

	if (/\bHowTo\b/.test(`${robots}\n${llms}\n${seo}`)) {
		issues.push("HowTo schema must not be present");
	}

	return issues;
}

async function run() {
	const projectRoot = fileURLToPath(new URL("../", import.meta.url));
	const [robots, llms, seo] = await Promise.all([
		readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
		readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
		readFile(new URL("../src/lib/seo.ts", import.meta.url), "utf8"),
	]);
	const issues = verifyAiSeoSources({ robots, llms, seo });

	if (issues.length > 0) {
		console.error("AI/SEO verification failed:");
		for (const issue of issues) console.error(`- ${issue}`);
		process.exitCode = 1;
		return;
	}

	process.stdout.write(
		`AI/SEO verification passed for ${projectRoot} (${expectedServiceUrls.length} localized service URLs).\n`,
	);
}

if (
	process.argv[1] &&
	pathToFileURL(fileURLToPath(new URL(process.argv[1], "file:///"))).href ===
		import.meta.url
) {
	await run();
}
