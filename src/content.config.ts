import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import {
	blogAudienceValues,
	blogEditorialRoleValues,
} from "./lib/blog-commercial";
import { commercialSeoClusterKeys } from "./lib/seo-clusters";

const blog = defineCollection({
	loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		metaTitle: z.string().optional(),
		description: z.string(),
		metaDescription: z.string().optional(),
		date: z.coerce.date(),
		dateModified: z.coerce.date().optional(),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
		readingTime: z.string().optional(),
		featured: z.boolean().optional(),
		draft: z.boolean().optional(),
		translationSlug: z.string().optional(),
		commercial: z.object({
			role: z.enum(blogEditorialRoleValues),
			audience: z.enum(blogAudienceValues),
			cluster: z.enum(commercialSeoClusterKeys),
		}),
		cover: z.object({
			src: z.string(),
			alt: z.string(),
		}),
	}),
});

export const collections = { blog };
