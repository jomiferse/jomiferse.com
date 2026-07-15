import assert from "node:assert/strict";
import { test } from "node:test";

import * as headerController from "../src/lib/header-controller.ts";

test("inerts only the mobile menu background and restores owned targets", () => {
	const toggle = Reflect.get(headerController, "toggleMenuBackgroundInert");
	assert.equal(typeof toggle, "function");

	const target = (inert = false) => ({
		inert,
		dataset: {} as { mobileMenuInert?: string },
	});
	const menu = target();
	const main = target();
	const alreadyInert = target(true);

	toggle([menu, main, alreadyInert], menu, true);
	assert.equal(menu.inert, false);
	assert.equal(main.inert, true);
	assert.equal(main.dataset.mobileMenuInert, "true");
	assert.equal(alreadyInert.inert, true);
	assert.equal(alreadyInert.dataset.mobileMenuInert, undefined);

	toggle([menu, main, alreadyInert], menu, false);
	assert.equal(main.inert, false);
	assert.equal(main.dataset.mobileMenuInert, undefined);
	assert.equal(alreadyInert.inert, true);
});
