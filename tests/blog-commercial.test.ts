import assert from "node:assert/strict";
import { test } from "node:test";

import * as blogCommercial from "../src/lib/blog-commercial.ts";

const copy = {
	eyebrow: "Context",
	title: "Title",
	text: "Text",
	contact: "Contact",
};

const resolveBlogCommercialCta = Reflect.get(
	blogCommercial,
	"resolveBlogCommercialCta",
);

test("exports a commercial CTA resolver", () => {
	assert.equal(typeof resolveBlogCommercialCta, "function");
});

test("resolves the Spanish owner and attributed contact URL", () => {
	assert.equal(typeof resolveBlogCommercialCta, "function");
	const result = resolveBlogCommercialCta(
		"es",
		{
			role: "buyer-led",
			audience: "business",
			cluster: "custom-software",
		},
		"/es/blog/evaluar-presupuesto-software-a-medida/",
		copy,
	);

	assert.equal(result.primary.href, "/es/services/software-a-medida/");
	assert.equal(result.primary.label, "Ver software a medida");
	assert.equal(
		result.secondary.href,
		"/es/contact/?service=software-a-medida&sourceCategory=article&sourcePath=%2Fes%2Fblog%2Fevaluar-presupuesto-software-a-medida%2F",
	);
});

test("resolves a non-service owner with a valid contact service", () => {
	assert.equal(typeof resolveBlogCommercialCta, "function");
	const result = resolveBlogCommercialCta(
		"en",
		{
			role: "technical-authority",
			audience: "technical",
			cluster: "technical-audit",
		},
		"/en/blog/modular-monolith-vs-microservices/",
		copy,
	);

	assert.equal(result.primary.href, "/en/backend-api-architecture-audit/");
	assert.match(result.secondary.href, /service=technology-second-opinion/);
});

test("rejects an article path from another locale", () => {
	assert.equal(typeof resolveBlogCommercialCta, "function");
	assert.throws(
		() =>
			resolveBlogCommercialCta(
				"es",
				{
					role: "case-study",
					audience: "technical",
					cluster: "custom-software",
				},
				"/en/blog/example/",
				copy,
			),
		/Article path must start with \/es\/blog\//,
	);
});
