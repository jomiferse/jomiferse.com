import eslintPluginAstro from 'eslint-plugin-astro'
import tsParser from '@typescript-eslint/parser'

export default [
	{
		ignores: ['dist/', '.astro/', 'node_modules/', '.vercel/', '.eslintcache'],
	},

	...eslintPluginAstro.configs.recommended,

	{
		files: ['**/*.astro'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
		},
	},

	{
		rules: {
			'comma-dangle': ['error', 'always-multiline'],
			'no-console': ['warn', { allow: ['warn', 'error'] }],
		},
	},
]
