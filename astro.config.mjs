import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";

const siteUrl = new URL("https://www.jomiferse.com");
const internalHosts = new Set([siteUrl.hostname, "jomiferse.com"]);
const nonCanonicalServicePaths = new Set([
	"/en/services/automation-workflows/",
	"/en/services/business-website/",
	"/en/services/custom-web-application/",
	"/es/services/api-integrations/",
	"/es/services/automation-workflows/",
	"/es/services/business-website/",
	"/es/services/custom-web-application/",
]);

function isExternalHref(href) {
	try {
		const url = new URL(href, siteUrl);
		if (["mailto:", "tel:", "sms:", "javascript:"].includes(url.protocol)) {
			return false;
		}
		return !internalHosts.has(url.hostname);
	} catch {
		return false;
	}
}

function rehypeExternalLinksNofollow() {
	return (tree) => {
		const walk = (node) => {
			if (!node || typeof node !== "object") return;

			if (
				node.type === "element" &&
				node.tagName === "a" &&
				node.properties?.href &&
				isExternalHref(String(node.properties.href))
			) {
				const rel = String(node.properties.rel ?? "")
					.split(/\s+/)
					.filter(Boolean);
				for (const token of ["nofollow", "noopener", "noreferrer"]) {
					if (!rel.includes(token)) rel.push(token);
				}
				node.properties.rel = rel.join(" ");
			}

			if (Array.isArray(node.children)) {
				for (const child of node.children) walk(child);
			}
		};

		walk(tree);
	};
}

export default defineConfig({
	redirects: {
		"/es/experience": "/es/about",
		"/en/experience": "/en/about",
	},
	vite: {
		plugins: [tailwindcss()],
	},
	site: "https://www.jomiferse.com",
	compressHTML: true,
	markdown: {
		processor: unified({
			rehypePlugins: [rehypeExternalLinksNofollow],
		}),
	},
	integrations: [
		icon(),
		sitemap({
			filter: (page) => {
				const pathname = new URL(page, siteUrl).pathname;

				return (
					pathname !== "/" &&
					!pathname.startsWith("/api/") &&
					!pathname.startsWith("/_astro/") &&
					!pathname.startsWith("/drafts/") &&
					!pathname.endsWith("/privacy/") &&
					!pathname.includes("/blog/page/") &&
					!nonCanonicalServicePaths.has(pathname)
				);
			},
		}),
	],
	build: {
		inlineStylesheets: "always",
	},
	output: "static",
	adapter: vercel(),
	i18n: {
		locales: ["es", "en"],
		defaultLocale: "es",
	},
	darkMode: "class",
});
