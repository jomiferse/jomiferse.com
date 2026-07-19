import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { buildPerson, buildServicePage } from "../src/lib/seo.ts";

const root = new URL("../", import.meta.url);
type Locale = "en" | "es";
const translations = {
	en: JSON.parse(await readFile(new URL("src/i18n/en.json", root), "utf8")),
	es: JSON.parse(await readFile(new URL("src/i18n/es.json", root), "utf8")),
};
const llms = await readFile(new URL("public/llms.txt", root), "utf8");
const servicesSource = await readFile(
	new URL("src/lib/services.ts", root),
	"utf8",
);
const blogLayout = await readFile(
	new URL("src/layouts/BlogPostLayout.astro", root),
	"utf8",
);

test("positions the home page around José Miguel's freelance IT consulting and development in Granada", () => {
	const expectations: Record<
		Locale,
		{ title: string; heading: string; introPattern: RegExp }
	> = {
		en: {
			title: "Freelance IT Consultant and Developer in Granada",
			heading: "Freelance IT consulting and development in Granada.",
			introPattern: /José Miguel Fernández/,
		},
		es: {
			title: "Consultor informático freelance y desarrollador en Granada",
			heading: "Consultoría informática y desarrollo freelance en Granada.",
			introPattern: /José Miguel Fernández/,
		},
	};

	for (const locale of ["en", "es"] as const) {
		const home = translations[locale].home.page;
		assert.equal(home.meta.title, expectations[locale].title);
		assert.equal(home.consultancyHero.title, expectations[locale].heading);
		assert.match(home.consultancyHero.intro, expectations[locale].introPattern);
		assert.ok(home.meta.description.length >= 120);
		assert.ok(home.meta.description.length <= 160);
		assert.match(home.meta.description, /José Miguel Fernández/);
	}
});

test("keeps key commercial metadata useful at search-result length", () => {
	for (const locale of ["en", "es"] as const) {
		const copy = translations[locale];
		const entries = [
			copy.services.hub.meta,
			copy.about.page.meta,
			copy.contact.page.meta,
			copy.projects.page.meta,
			copy.blog.page.meta,
		];

		for (const meta of entries) {
			assert.ok(
				meta.title.length >= 30,
				`${locale}: short title ${meta.title}`,
			);
			assert.ok(meta.title.length <= 60, `${locale}: long title ${meta.title}`);
			assert.ok(
				meta.description.length >= 120,
				`${locale}: short description ${meta.description}`,
			);
			assert.ok(
				meta.description.length <= 160,
				`${locale}: long description ${meta.description}`,
			);
		}
	}
});

test("keeps the shared person identity invariant across localized pages", () => {
	const person = {
		name: "José Miguel Fernández",
		description: "Full-stack developer and independent IT consultant.",
		email: "jomiferse@gmail.com",
		location: "Granada, Spain",
		links: {
			linkedin: "https://www.linkedin.com/in/jomiferse/",
			github: "https://github.com/jomiferse/",
		},
	};
	const english = buildPerson("https://www.jomiferse.com", "en", person);
	const spanish = buildPerson("https://www.jomiferse.com", "es", person);

	assert.equal(english["@id"], spanish["@id"]);
	assert.equal(english.url, "https://www.jomiferse.com/es/about/");
	assert.equal(spanish.url, "https://www.jomiferse.com/es/about/");
	assert.deepEqual(english.address, spanish.address);
	assert.deepEqual(english.address, {
		"@type": "PostalAddress",
		addressLocality: "Granada",
		addressRegion: "Andalucía",
		addressCountry: "ES",
	});
});

test("keeps embedded service providers on the same stable person URL", () => {
	const service = buildServicePage({
		site: "https://www.jomiferse.com",
		path: "/en/services/example/",
		name: "Example service",
		description: "Example description",
		providerName: "José Miguel Fernández",
		providerUrl: "https://www.jomiferse.com/en/about/",
	});
	assert.equal(
		(service.provider as Record<string, unknown>).url,
		"https://www.jomiferse.com/es/about/",
	);
});

test("links the primary WordPress web design service to its professional website guide", () => {
	for (const href of [
		"/es/blog/que-debe-tener-web-profesional-para-captar-clientes/",
		"/en/blog/what-a-professional-website-needs-to-get-clients/",
	]) {
		assert.match(servicesSource, new RegExp(href.replaceAll("/", "\\/")));
	}
});

test("keeps llms.txt concise and focused on canonical discovery paths", () => {
	assert.ok(llms.trim().split(/\s+/).length <= 900);

	for (const path of [
		"/es/services/diseno-web-wordpress/",
		"/es/services/website-redesign/",
		"/es/services/software-a-medida/",
		"/es/services/internal-tools/",
		"/es/services/automatizacion-de-procesos/",
		"/es/services/integraciones-api/",
		"/es/services/backend-spring-boot/",
		"/en/services/wordpress-web-design/",
		"/en/services/website-redesign/",
		"/en/services/custom-software/",
		"/en/services/internal-tools/",
		"/en/services/process-automation/",
		"/en/services/api-integrations/",
		"/en/services/backend-spring-boot/",
		"/es/automatizacion-tareas-administrativas/",
		"/es/integracion-herramientas-negocio/",
		"/es/consultor-tecnologico-pequenas-empresas/",
		"/es/auditoria-backend-api-arquitectura/",
		"/es/automatizacion-ia-operaciones-documentos/",
		"/es/dashboards-paneles-internos/",
		"/es/modernizacion-backend-legacy/",
		"/en/administrative-task-automation/",
		"/en/business-tools-integration/",
		"/en/technology-consultant-small-businesses/",
		"/en/backend-api-architecture-audit/",
		"/en/ai-automation-operations-documents/",
		"/en/dashboards-internal-admin-panels/",
		"/en/legacy-backend-modernization/",
	]) {
		assert.match(llms, new RegExp(path.replaceAll("/", "\\/")));
	}

	for (const path of ["/es/diseno-web-granada/", "/en/web-design-granada/"]) {
		assert.equal(llms.split(path).length - 1, 1);
	}

	assert.match(llms, /\/es\/projects\/cv-studio\//);
	assert.match(llms, /\/en\/projects\/cv-studio\//);
	assert.match(llms, /\/es\/contact\//);
	assert.match(llms, /\/en\/contact\//);
});

test("shows a localized author credential sourced from current CV data", () => {
	assert.match(blogLayout, /getCv/);
	assert.match(blogLayout, /data-blog-author-credential/);
	assert.match(blogLayout, /cv\.currentRole/);
	assert.match(blogLayout, /cv\.yearsWorking/);
	assert.match(blogLayout, /frontmatter\.author === cv\.name/);
	assert.ok(blogLayout.includes("href={`/${locale}/about/`}"));
});
