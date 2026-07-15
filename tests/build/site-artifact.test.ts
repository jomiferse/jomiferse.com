import assert from "node:assert/strict";
import { test } from "node:test";

import { auditBuildArtifact } from "./support/build-artifact.ts";

test("the production artifact satisfies the publish contract", async () => {
	const result = await auditBuildArtifact(process.cwd());

	assert.equal(result.failures.length, 0, result.failures.join("\n"));
	assert.ok(
		result.pages >= 150,
		`Expected at least 150 pages, found ${result.pages}`,
	);
	assert.ok(result.indexablePages > 100);
	assert.ok(result.maxHtmlBytes < 180_000);
});
