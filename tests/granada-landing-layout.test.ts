import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const routeSource = readFileSync(
	new URL("../src/pages/[locale]/[landing].astro", import.meta.url),
	"utf8",
);

test("uses the home-derived presentation only for local web design", () => {
	assert.match(routeSource, /GranadaWebDesignLanding/);
	assert.match(routeSource, /page\.translationKey === "local-web-design"/);
	assert.match(routeSource, /commercial-landing/);
});

test("defines the compact home-derived Granada composition", () => {
	const componentUrl = new URL(
		"../src/components/landings/GranadaWebDesignLanding.astro",
		import.meta.url,
	);
	assert.equal(existsSync(componentUrl), true, "Granada component is missing");
	const componentSource = readFileSync(componentUrl, "utf8");

	for (const marker of [
		"data-granada-hero",
		"data-granada-decision",
		"data-granada-services",
		"data-granada-proof",
		"data-granada-process",
		"data-granada-faq",
		"data-granada-cta",
	]) {
		assert.match(componentSource, new RegExp(marker));
	}
	assert.doesNotMatch(componentSource, /relatedPosts/);
	assert.match(componentSource, /getServiceHref/);
	assert.match(componentSource, /featuredProject/);
});
