import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
	getEvidenceProfile,
	type EvidenceContext,
} from "../src/lib/proof-evidence.ts";

const contexts: EvidenceContext[] = [
	"home",
	"granada",
	"api-integrations",
	"it-advisory",
	"custom-software",
];
const projectIdsByLocale = Object.fromEntries(
	await Promise.all(
		(["es", "en"] as const).map(async (locale) => {
			const cv = JSON.parse(
				await readFile(
					new URL(`../src/data/cv.${locale}.json`, import.meta.url),
					"utf8",
				),
			) as { projects: { items: Array<{ id: string }> } };
			return [locale, new Set(cv.projects.items.map((project) => project.id))];
		}),
	),
) as Record<"es" | "en", Set<string>>;

test("keeps every commercial evidence passage source-backed and citable", () => {
	for (const locale of ["es", "en"] as const) {
		for (const context of contexts) {
			const profile = getEvidenceProfile(locale, context);
			const words = profile.body.trim().split(/\s+/).length;
			assert.ok(
				words >= 120 && words <= 170,
				`${locale}/${context}: expected 120-170 words, found ${words}`,
			);
			assert.ok(
				projectIdsByLocale[locale].has(profile.projectId),
				`${locale}/${context}: unknown evidence project ${profile.projectId}`,
			);
		}
	}
});
