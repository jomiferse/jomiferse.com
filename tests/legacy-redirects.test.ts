import assert from "node:assert/strict";
import { test } from "node:test";

import {
	getLegacyRedirect,
	legacyRedirects,
} from "../src/lib/legacy-redirects.ts";

test("redirects historical service aliases with or without a trailing slash", () => {
	assert.equal(
		getLegacyRedirect("/es/services/api-integrations/"),
		"/es/services/integraciones-api/",
	);
	assert.equal(
		getLegacyRedirect("/es/services/api-integrations"),
		"/es/services/integraciones-api/",
	);
});

test("redirects known wrong-locale blog paths", () => {
	assert.equal(
		getLegacyRedirect(
			"/en/blog/cuando-deberia-una-empresa-migrar-un-backend-legacy-a-java-spring-boot/",
		),
		"/en/blog/when-should-a-company-migrate-a-legacy-backend-to-java-spring-boot/",
	);
	assert.equal(
		getLegacyRedirect("/es/blog/building-cv-studio/"),
		"/es/blog/creando-cv-studio/",
	);
});

test("redirects the replaced freelance landings", () => {
	assert.equal(
		getLegacyRedirect("/es/desarrollador-freelance-espana/"),
		"/es/diseno-web-granada/",
	);
	assert.equal(
		getLegacyRedirect("/en/freelance-developer-spain"),
		"/en/web-design-granada/",
	);
});

test("leaves canonical and unknown paths unresolved", () => {
	assert.equal(getLegacyRedirect("/es/diseno-web-granada/"), undefined);
	assert.equal(getLegacyRedirect("/es/una-ruta-desconocida/"), undefined);
	assert.equal(Object.keys(legacyRedirects).length, 13);
});
