import type { Note } from "@/generated/prisma/client";

export type { Note };

export type FieldErrors = Record<string, string[] | undefined>;

export type NoteFormState =
  | {
      errors?: FieldErrors;
      message?: string;
    }
  | undefined;
