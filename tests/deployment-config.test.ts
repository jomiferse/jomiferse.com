import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const readOptionalFile = async (path: URL) => {
	try {
		return await readFile(path, "utf8");
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
		throw error;
	}
};

const parseRobotsGroups = (robots: string) =>
	robots
		.trim()
		.split(/\n\s*\n/)
		.map((block) => block.split("\n").map((line) => line.trim()))
		.filter((lines) => lines.some((line) => line.startsWith("User-agent:")));

test("redirects both global contact aliases before framework routing", async () => {
	const config = JSON.parse(
		await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
	) as {
		redirects?: Array<{
			source: string;
			destination: string;
			permanent: boolean;
		}>;
	};

	for (const source of ["/contact", "/contact/"]) {
		assert.deepEqual(
			config.redirects?.find((redirect) => redirect.source === source),
			{
				source,
				destination: "/es/contact/",
				permanent: true,
			},
		);
	}
});

test("repeats private route disallows in every named AI crawler group", async () => {
	const robots = await readFile(
		new URL("../public/robots.txt", import.meta.url),
		"utf8",
	);
	const namedGroups = parseRobotsGroups(robots).filter(
		(lines) => !lines.includes("User-agent: *"),
	);

	assert.ok(namedGroups.length > 0);
	for (const group of namedGroups) {
		assert.ok(group.includes("Disallow: /api/"), group[0]);
		assert.ok(group.includes("Disallow: /drafts/"), group[0]);
	}
});

test("configures static-site security headers", async () => {
	const source = await readOptionalFile(
		new URL("../vercel.json", import.meta.url),
	);
	assert.ok(source, "vercel.json must exist");
	const config = JSON.parse(source) as {
		headers?: Array<{
			source: string;
			headers: Array<{ key: string; value: string }>;
		}>;
	};
	const globalRule = config.headers?.find((rule) => rule.source === "/(.*)");
	assert.ok(globalRule, "missing global response headers");
	const headers = new Map(
		globalRule.headers.map(({ key, value }) => [key.toLowerCase(), value]),
	);

	assert.equal(headers.get("x-content-type-options"), "nosniff");
	assert.equal(headers.get("x-frame-options"), "DENY");
	assert.equal(
		headers.get("referrer-policy"),
		"strict-origin-when-cross-origin",
	);
	assert.match(headers.get("permissions-policy") ?? "", /camera=\(\)/);
	assert.match(headers.get("permissions-policy") ?? "", /microphone=\(\)/);
	assert.match(
		headers.get("content-security-policy") ?? "",
		/default-src 'self'/,
	);
	assert.match(
		headers.get("content-security-policy") ?? "",
		/object-src 'none'/,
	);
	assert.match(
		headers.get("content-security-policy") ?? "",
		/frame-ancestors 'none'/,
	);
	assert.equal(headers.get("strict-transport-security"), "max-age=63072000");
	assert.doesNotMatch(
		headers.get("strict-transport-security") ?? "",
		/includeSubDomains/i,
	);
});

test("caches fingerprinted Astro assets immutably", async () => {
	const source = await readOptionalFile(
		new URL("../vercel.json", import.meta.url),
	);
	assert.ok(source, "vercel.json must exist");
	const config = JSON.parse(source) as {
		headers?: Array<{
			source: string;
			headers: Array<{ key: string; value: string }>;
		}>;
	};
	const assetRule = config.headers?.find(
		(rule) => rule.source === "/_astro/(.*)",
	);
	assert.ok(assetRule, "missing Astro asset cache headers");
	assert.ok(
		assetRule.headers.some(
			({ key, value }) =>
				key.toLowerCase() === "cache-control" &&
				value === "public, max-age=31536000, immutable",
		),
	);
});
