import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	site: "https://www.jomiferse.com",
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
	output: "static",
	adapter: vercel(),
	darkMode: "class",
});
