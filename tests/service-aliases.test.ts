import assert from "node:assert/strict";
import { test } from "node:test";

import {
	getServiceAliasRedirect,
	serviceAliasRedirects,
} from "../src/lib/service-aliases.ts";

test("maps every historical service alias to one localized canonical route", () => {
	assert.equal(
		getServiceAliasRedirect("en", "business-website"),
		"/en/services/wordpress-web-design/",
	);
	assert.equal(
		getServiceAliasRedirect("es", "api-integrations"),
		"/es/services/integraciones-api/",
	);
	assert.equal(getServiceAliasRedirect("en", "api-integrations"), undefined);
	assert.equal(Object.keys(serviceAliasRedirects).length, 9);
});
