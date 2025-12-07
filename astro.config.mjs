import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	site: "https://www.jomiferse.com",
	integrations: [react()],
	output: "static",
	adapter: cloudflare(),
});
