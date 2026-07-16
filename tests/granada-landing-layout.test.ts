import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const routeSource = readFileSync(
	new URL("../src/pages/[locale]/[landing].astro", import.meta.url),
	"utf8",
);

test("uses the Granada presentation only for local web design", () => {
	assert.match(routeSource, /GranadaWebDesignLanding/);
	assert.match(routeSource, /page\.translationKey === "local-web-design"/);
	assert.match(routeSource, /commercial-landing/);
});

test("resolves pricing and offers for the local web design service", () => {
	assert.match(routeSource, /web-wordpress:0/);
	assert.match(routeSource, /Granada web design commercial source not found/);
	assert.match(routeSource, /offers:\s*granadaWebDesignService/);
});

test("defines the Granada service-page composition at the home width", () => {
	const componentUrl = new URL(
		"../src/components/landings/GranadaWebDesignLanding.astro",
		import.meta.url,
	);
	assert.equal(existsSync(componentUrl), true, "Granada component is missing");
	const componentSource = readFileSync(componentUrl, "utf8");

	for (const marker of [
		"data-granada-service-hero",
		"data-granada-service-trust",
		"data-granada-service-outcome",
		"data-granada-service-pricing",
		"data-granada-service-scope",
		"data-granada-service-process",
		"data-granada-service-proof",
		"data-granada-related-services",
		"data-granada-service-faq",
		"data-granada-service-cta",
	]) {
		assert.match(componentSource, new RegExp(marker));
	}
	for (const component of [
		"ServiceIconBadge",
		"ServiceTrustStrip",
		"ServicePricingGrid",
		"ServiceProofCard",
		"ConversionCta",
	]) {
		assert.match(componentSource, new RegExp(component));
	}
	assert.match(
		componentSource,
		/class="services-page service-detail-page granada-service-page"/,
	);
	assert.doesNotMatch(componentSource, /relatedPosts/);
	assert.doesNotMatch(
		componentSource,
		/granada-selector|data-granada-decision/,
	);
});
