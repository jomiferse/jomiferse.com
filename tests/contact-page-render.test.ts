import assert from "node:assert/strict";
import { realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getViteConfig } from "astro/config";

const astroRoot = realpathSync("node_modules/astro");
const viteUrl = pathToFileURL(
	join(dirname(astroRoot), "vite/dist/node/index.js"),
);
const { createServer } = await import(viteUrl.href);

test("renders validated contact selection and status from the request URL", async () => {
	const getConfig = getViteConfig({
		logLevel: "silent",
		server: { hmr: false, middlewareMode: true },
	});
	const config = await getConfig({
		command: "serve",
		mode: "test",
		isSsrBuild: false,
		isPreview: false,
	});
	config.server = {
		...config.server,
		hmr: false,
		middlewareMode: true,
		watch: null,
		ws: false,
	};
	const vite = await createServer(config);

	try {
		const page = await vite.ssrLoadModule("/src/pages/[locale]/contact.astro");
		const container = await AstroContainer.create();
		const render = (locale: "en" | "es", url: string) =>
			container.renderToString(page.default, {
				request: new Request(url),
				params: { locale },
				partial: false,
			});

		const selectedHtml = await render(
			"en",
			"https://www.jomiferse.com/en/contact?error=missing&service=business-website&scope=project",
		);
		assert.match(
			selectedHtml,
			/<title>Contact a Freelance IT Consultant<\/title>/,
		);
		assert.match(
			selectedHtml,
			/<meta name="description" content="Contact José Miguel Fernández for freelance full-stack development, internal tools, automation workflows, API integrations and backend systems\."/,
		);
		assert.match(selectedHtml, /data-lead-service="business-website"/);
		assert.match(selectedHtml, /data-lead-locale="en"/);
		assert.match(selectedHtml, /data-lead-scope="project"/);
		assert.match(
			selectedHtml,
			/name="service" value="business-website" data-selected-service/,
		);
		const fallbackHtml = selectedHtml.match(
			/<noscript>[\s\S]*?<\/noscript>/,
		)?.[0];
		assert.ok(fallbackHtml);
		assert.match(
			fallbackHtml,
			/<option value="business-website"[^>]*selected[^>]*>\s*Business Website\s*<\/option>/,
		);
		assert.match(
			fallbackHtml,
			/<option value="project"[^>]*selected[^>]*>\s*Complete project\s*<\/option>/,
		);
		assert.match(
			selectedHtml,
			/data-contact-status="missing" class="contact-status contact-status--visible"/,
		);
		assert.match(
			selectedHtml,
			/name="name"[\s\S]*aria-describedby="contact-name-error"/,
		);
		assert.match(
			selectedHtml,
			/id="contact-name-error"[\s\S]*data-field-error="name"[\s\S]*role="alert"/,
		);
		assert.match(
			selectedHtml,
			/data-required-note[^>]*>\s*Fields marked with \* are required\./,
		);
		assert.match(
			selectedHtml,
			/<link rel="canonical" href="https:\/\/www\.jomiferse\.com\/en\/contact\/"/,
		);
		const jsonLdSource = selectedHtml.match(
			/<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
		)?.[1];
		assert.ok(jsonLdSource);
		const jsonLd = JSON.parse(jsonLdSource) as {
			"@context": string;
			"@graph": Array<Record<string, unknown>>;
		};
		assert.equal(jsonLd["@context"], "https://schema.org");
		const contactPage = jsonLd["@graph"].find(
			(node) => node["@type"] === "ContactPage",
		);
		assert.equal(
			contactPage?.["@id"],
			"https://www.jomiferse.com/en/contact/#webpage",
		);
		const breadcrumb = jsonLd["@graph"].find(
			(node) => node["@type"] === "BreadcrumbList",
		);
		const breadcrumbItems = breadcrumb?.itemListElement as
			Array<Record<string, unknown>> | undefined;
		assert.equal(
			breadcrumbItems?.at(-1)?.item,
			"https://www.jomiferse.com/en/contact/",
		);

		const invalidHtml = await render(
			"en",
			"https://www.jomiferse.com/en/contact?service=unknown-service&scope=project",
		);
		assert.match(invalidHtml, /name="service" value data-selected-service/);
		assert.doesNotMatch(invalidHtml, /value="unknown-service"/);

		const spanishHtml = await render(
			"es",
			"https://www.jomiferse.com/es/contact?sent=1",
		);
		assert.match(
			spanishHtml,
			/<title>Contacto para consultoría y desarrollo<\/title>/,
		);
		assert.match(
			spanishHtml,
			/<link rel="canonical" href="https:\/\/www\.jomiferse\.com\/es\/contact\/"/,
		);
		assert.match(spanishHtml, /hreflang="es"/);
		assert.match(spanishHtml, /hreflang="en"/);
		assert.match(spanishHtml, /hreflang="x-default"/);
		assert.match(spanishHtml, /data-lead-service="unspecified"/);
		assert.match(spanishHtml, /data-lead-locale="es"/);
		assert.match(spanishHtml, /data-lead-scope="unspecified"/);
	} finally {
		await vite.close();
	}
});
