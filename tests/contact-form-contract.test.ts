import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const source = await readFile(
	new URL("../src/components/forms/ContactForm.astro", import.meta.url),
	"utf8",
);

test("keeps server field limits in the no-JavaScript contact form", () => {
	assert.match(source, /name="name"[\s\S]*minlength="2"[\s\S]*maxlength="100"/);
	assert.match(source, /name="email"[\s\S]*maxlength="254"/);
	assert.match(
		source,
		/name="message"[\s\S]*minlength="20"[\s\S]*maxlength="5000"/,
	);
});

test("includes a keyboard and screen-reader hidden honeypot", () => {
	assert.match(source, /class="contact-honeypot"/);
	assert.match(source, /name="website"/);
	assert.match(source, /tabindex="-1"/);
	assert.match(source, /aria-hidden="true"/);
});

test("offers native service and scope controls when JavaScript is unavailable", () => {
	assert.match(
		source,
		/<form[\s\S]*action="\/api\/contact"[\s\S]*method="post"/,
	);
	assert.match(source, /<noscript>[\s\S]*name="serviceFallback"/);
	assert.match(source, /<noscript>[\s\S]*name="scopeFallback"/);
	assert.match(
		source,
		/<option[\s\S]*value=\{option\.value\}[\s\S]*selected=\{resolvedService\?\.value === option\.value\}/,
	);
	assert.match(source, /option value=\{scope\} selected=\{[^}]*scope/);
});

test("contact-page redirects can reveal a status without JavaScript", async () => {
	const page = await readFile(
		new URL("../src/pages/[locale]/contact.astro", import.meta.url),
		"utf8",
	);
	assert.match(page, /id="contact-status-sent"/);
	assert.match(page, /id="contact-status-missing"/);
	assert.match(page, /id="contact-status-send"/);
	assert.match(page, /\.contact-status:target/);
});

test("waits for analytics consent to be applied before tracking a lead", async () => {
	const [page, cookieConsent] = await Promise.all([
		readFile(
			new URL("../src/pages/[locale]/contact.astro", import.meta.url),
			"utf8",
		),
		readFile(
			new URL("../src/components/common/CookieConsent.astro", import.meta.url),
			"utf8",
		),
	]);

	assert.match(
		cookieConsent,
		/updateConsentMode\(preferences\);\s*loadGoogleAnalytics\(preferences\);\s*announceAnalyticsReady\(preferences\);/,
	);
	assert.match(
		page,
		/window\.addEventListener\(\s*ANALYTICS_READY_EVENT,\s*trackConfirmedContactLead/,
	);
});
