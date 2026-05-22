import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

const siteUrl = new URL("https://www.jomiferse.com");
const internalHosts = new Set([siteUrl.hostname, "jomiferse.com"]);

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
	vite: {
		plugins: [tailwindcss()],
	},
	site: "https://www.jomiferse.com",
	markdown: {
		rehypePlugins: [rehypeExternalLinksNofollow],
	},
	integrations: [
		icon(),
		sitemap({
			filter: (page) => {
				return (
					!page.startsWith("/api/") &&
					!page.startsWith("/_astro/") &&
					!page.startsWith("/drafts/")
				);
			},
		}),
	],
	build: {
		inlineStylesheets: "auto",
	},
	output: "static",
	adapter: vercel(),
	i18n: {
		locales: ["es", "en"],
		defaultLocale: "en",
	},
	darkMode: "class",
});
