import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().default(false),
      cover: z
        .object({
          image: image(),
        })
        .optional(),
      ShowToc: z.boolean().default(false),
      ShowReadingTime: z.boolean().default(false),
      math: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      categories: z.array(z.string()).default([]),
      series: z.array(z.string()).default([]),
    }),
});

export const collections = { posts };
