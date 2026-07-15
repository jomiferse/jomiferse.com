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
		const render = (url: string) =>
			container.renderToString(page.default, {
				request: new Request(url),
				params: { locale: "en" },
				partial: false,
			});

		const selectedHtml = await render(
			"https://www.jomiferse.com/en/contact?error=missing&service=business-website&scope=project",
		);
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

		const invalidHtml = await render(
			"https://www.jomiferse.com/en/contact?service=unknown-service&scope=project",
		);
		assert.match(invalidHtml, /name="service" value data-selected-service/);
		assert.doesNotMatch(invalidHtml, /value="unknown-service"/);
	} finally {
		await vite.close();
	}
});
