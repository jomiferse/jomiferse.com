import { defineCollection, z } from "astro:content";

const blog = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.date(),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
		readingTime: z.string().optional(),
		draft: z.boolean().optional(),
	}),
});

export const collections = { blog };
