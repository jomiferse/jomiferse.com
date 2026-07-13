import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
	loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		dateModified: z.coerce.date().optional(),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
		readingTime: z.string().optional(),
		featured: z.boolean().optional(),
		draft: z.boolean().optional(),
		translationSlug: z.string().optional(),
		cover: z.object({
			src: z.string(),
			alt: z.string(),
		}),
	}),
});

export const collections = { blog };
