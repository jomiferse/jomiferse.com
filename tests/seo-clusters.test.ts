import assert from "node:assert/strict";
import { test } from "node:test";

import { commercialSeoClusters } from "../src/lib/seo-clusters.ts";

test("assigns one owner to every commercial cluster per locale", () => {
	for (const locale of ["es", "en"] as const) {
		const owners = commercialSeoClusters.map(
			(cluster) => cluster.owner[locale],
		);
		assert.equal(new Set(owners).size, owners.length);
		for (const cluster of commercialSeoClusters) {
			assert.ok(!cluster.supporting[locale].includes(cluster.owner[locale]));
		}
	}
});

test("records intent and priority for every localized target", () => {
	for (const cluster of commercialSeoClusters) {
		assert.ok([1, 2, 3].includes(cluster.priority));
		for (const locale of ["es", "en"] as const) {
			assert.ok(cluster.targets[locale]);
			assert.ok(
				["commercial", "informational", "mixed"].includes(
					cluster.targets[locale].intent,
				),
			);
			assert.ok(Array.isArray(cluster.targets[locale].secondary));
		}
	}
});

test("prioritizes the DataForSEO-backed acquisition owners", () => {
	const priorityOne = commercialSeoClusters
		.filter((cluster) => cluster.priority === 1)
		.map((cluster) => cluster.key);

	assert.deepEqual(priorityOne, [
		"local-web-design",
		"wordpress",
		"custom-software",
	]);

	const local = commercialSeoClusters.find(
		(cluster) => cluster.key === "local-web-design",
	);
	assert.ok(local);
	assert.equal(local.targets.es.primary, "diseño web Granada");
	assert.equal(local.targets.es.intent, "commercial");
	assert.equal(local.targets.en.primary, null);
});
