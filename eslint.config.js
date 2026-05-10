import eslintPluginAstro from "eslint-plugin-astro";

export default [
	{
		ignores: ["dist/", ".astro/", "node_modules/", ".vercel/", ".eslintcache"],
	},
	...eslintPluginAstro.configs.recommended,
	{
		rules: {
			"comma-dangle": ["error", "always-multiline"],
			"no-console": ["warn", { allow: ["warn", "error"] }],
		},
	},
];
