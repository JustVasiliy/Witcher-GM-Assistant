import { z } from "zod";

export const NoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title must be 150 characters or fewer."),
  content: z
    .string()
    .trim()
    .min(1, "Content is required.")
    .max(5000, "Content must be 5000 characters or fewer."),
});

export type NoteInput = z.infer<typeof NoteSchema>;
