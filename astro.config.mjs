import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { legacyRedirects } from "./src/lib/legacy-redirects.ts";
import { getEditorialImageAttributes } from "./src/lib/media-delivery.ts";

const siteUrl = new URL("https://www.jomiferse.com");
const internalHosts = new Set([siteUrl.hostname, "jomiferse.com"]);
const imageDimensions = new Map();
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

function rehypeSafeExternalLinks() {
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
				for (const token of ["noopener", "noreferrer"]) {
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

function rehypeEditorialImages() {
	return async (tree) => {
		const images = [];
		const walk = (node) => {
			if (!node || typeof node !== "object") return;
			if (node.type === "element" && node.tagName === "img") images.push(node);
			if (Array.isArray(node.children)) node.children.forEach(walk);
		};

		walk(tree);
		await Promise.all(
			images.map(async (node) => {
				const src = String(node.properties?.src ?? "");
				if (!src.startsWith("/images/")) return;
				let dimensions = imageDimensions.get(src);
				if (!dimensions) {
					const metadata = await sharp(
						fileURLToPath(
							new URL(`.${src}`, new URL("./public/", import.meta.url)),
						),
					).metadata();
					if (!metadata.width || !metadata.height) return;
					dimensions = { width: metadata.width, height: metadata.height };
					imageDimensions.set(src, dimensions);
				}
				node.properties = {
					...node.properties,
					...getEditorialImageAttributes(dimensions.width, dimensions.height),
				};
			}),
		);
	};
}

export default defineConfig({
	trailingSlash: "always",
	redirects: {
		"/": "/es/",
		"/es/experience": "/es/about/",
		"/en/experience": "/en/about/",
		...legacyRedirects,
	},
	vite: {
		plugins: [tailwindcss()],
	},
	site: "https://www.jomiferse.com",
	compressHTML: true,
	markdown: {
		processor: unified({
			rehypePlugins: [rehypeSafeExternalLinks, rehypeEditorialImages],
		}),
	},
	integrations: [
		icon(),
		sitemap({
			customPages: [
				"https://www.jomiferse.com/en/contact/",
				"https://www.jomiferse.com/es/contact/",
			],
			filter: (page) => {
				const pathname = new URL(page, siteUrl).pathname;

				return (
					pathname !== "/" &&
					!pathname.startsWith("/api/") &&
					!pathname.startsWith("/_astro/") &&
					!pathname.startsWith("/drafts/") &&
					!pathname.endsWith("/privacy/")
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
		defaultLocale: "es",
		routing: {
			prefixDefaultLocale: true,
		},
	},
	darkMode: "class",
});
