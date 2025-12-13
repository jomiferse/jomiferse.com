import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import icon from "astro-icon";

export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	site: "https://www.jomiferse.com",
	integrations: [react(), icon()],
	output: "static"
});
