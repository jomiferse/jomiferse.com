import assert from "node:assert/strict";
import { test } from "node:test";

import astroConfig from "../astro.config.mjs";

test("keeps the Spanish default locale under the public /es prefix", () => {
	assert.equal(
		typeof astroConfig.i18n === "object" &&
			typeof astroConfig.i18n.routing === "object" &&
			astroConfig.i18n.routing.prefixDefaultLocale,
		true,
	);
});

test("generates canonical directory-style public URLs", () => {
	assert.equal(astroConfig.trailingSlash, "always");
});

test("redirects public routes to canonical trailing-slash destinations", () => {
	for (const [source, destination] of Object.entries(
		astroConfig.redirects ?? {},
	)) {
		const target =
			typeof destination === "string" ? destination : destination.destination;
		const pathname = new URL(target, "https://www.jomiferse.com").pathname;
		assert.ok(
			pathname === "/" || pathname.endsWith("/"),
			`${source} redirects to non-canonical ${target}`,
		);
	}
});
