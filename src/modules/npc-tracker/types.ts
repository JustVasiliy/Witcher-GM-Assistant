import type {
  Encounter,
  EncounterNote,
  EncounterNpc,
  Note,
} from "@/generated/prisma/client";

export type EncounterWithDetails = Encounter & {
  npcs: EncounterNpc[];
  notes: (EncounterNote & { note: Note })[];
};

export type ActionResult = { error?: string } | undefined;
