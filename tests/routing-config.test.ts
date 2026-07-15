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

test("redirects the short contact path to the Spanish contact page", () => {
	assert.equal(astroConfig.redirects?.["/contact"], "/es/contact");
});
