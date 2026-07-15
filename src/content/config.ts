import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Marketing Hub'),
    readingTime: z.number().optional(),
    cover: z.string().optional(),
  }),
});

export const collections = { blog };
