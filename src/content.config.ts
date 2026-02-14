import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      // Type-check frontmatter using a schema
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image(),
      draft: z.boolean().default(false),
    }),
});

const stickers = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./stickers", pattern: "*.json" }),
  schema: () =>
    z.object({
      position: z.tuple([z.number(), z.number()]),
      size: z.tuple([z.number().positive(), z.number().positive()]),
      rotation: z.number().optional().default(0),

      image: z.string().url(),

      avatar: z
        .union([z.literal("github"), z.string().url()])
        .optional()
        .default("github"),

      profile: z
        .union([z.literal("github"), z.string().url()])
        .optional()
        .default("github"),

      displayName: z.string().optional(),
      quote: z.string().optional(),
    }),
});

export const collections = { blog, stickers };
