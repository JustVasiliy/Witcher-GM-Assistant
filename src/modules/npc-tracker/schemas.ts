import { z } from "zod";

export const EncounterNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required.")
  .max(100, "Name must be 100 characters or fewer.");

export const AddNpcSchema = z.object({
  source: z.enum(["CORE", "CUSTOM"]),
  creatureId: z.string().trim().min(1, "Select an NPC."),
});

export type AddNpcInput = z.infer<typeof AddNpcSchema>;

export const AttachNoteSchema = z.object({
  noteId: z.string().trim().min(1, "Select a note."),
});

export type AttachNoteInput = z.infer<typeof AttachNoteSchema>;
