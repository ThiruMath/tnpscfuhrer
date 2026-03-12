import { defineCollection, z } from "astro:content";

const notes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    subject: z.string().optional(),
    exam: z.array(z.string()).optional(),
    topics: z.array(z.string()).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    last_updated: z.date().optional(),
    source_references: z.array(z.string()).optional()
  })
});

export const collections = {
  notes
};