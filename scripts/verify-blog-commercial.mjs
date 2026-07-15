import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const expectedClusters = new Set([
	"freelance-developer",
	"wordpress",
	"custom-software",
	"excel-replacement",
	"process-automation",
	"ai-automation",
	"api-integrations",
	"spring-boot-development",
	"spring-boot-maintenance",
	"legacy-modernization",
	"technical-audit",
]);

const clusterSource = await readFile(
	join(root, "src", "lib", "seo-clusters.ts"),
	"utf8",
);
const tupleSource = clusterSource.match(
	/export const commercialSeoClusterKeys = \[([\s\S]*?)\] as const;/,
)?.[1];

if (!tupleSource) {
	failures.push("seo clusters: missing commercialSeoClusterKeys tuple");
} else {
	const actualClusters = new Set(
		[...tupleSource.matchAll(/"([^"]+)"/g)].map((match) => match[1]),
	);

	for (const cluster of expectedClusters) {
		if (!actualClusters.has(cluster)) {
			failures.push(`seo clusters: missing ${cluster}`);
		}
	}
	for (const cluster of actualClusters) {
		if (!expectedClusters.has(cluster)) {
			failures.push(`seo clusters: unexpected ${cluster}`);
		}
	}
}

if (failures.length > 0) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else {
	console.log("Blog commercial source verification passed.");
}
