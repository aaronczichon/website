// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";
// 2. Define your collection(s)
const blogCollection = defineCollection({
  type: "content", // v2.5.0 and later
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tags: z.array(z.string()),
      image: z
        .object({
          url: image().optional(),
          src: z.string().optional(),
          alt: z.string(),
        })
        .optional(),
      pubDate: z.date(),
      description: z.string(),
    }),
});

const cvCollection = defineCollection({
  type: "content", // v2.5.0 and later
  schema: () =>
    z.object({
      title: z.string(),
      position: z.string(),
      timeframe: z.string(),
      location: z.string(),
      order: z.number(),
      type: z.ZodEnum.create(["current", "past"]),
      image: z.object({
        assetId: z.string(),
        alt: z.string(),
      }),
      techSkills: z.array(z.string()).optional(),
      generalSkills: z.array(z.string()).optional(),
    }),
});
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  blog: blogCollection,
  cv: cvCollection,
};
