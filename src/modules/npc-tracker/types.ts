import type {
  Encounter,
  EncounterNote,
  EncounterNpc,
  EncounterNpcEffect,
  EncounterNpcWound,
  Note,
} from "@/generated/prisma/client";

export type EncounterNpcWithWounds = EncounterNpc & {
  wounds: EncounterNpcWound[];
  effects: EncounterNpcEffect[];
};

export type EncounterWithDetails = Encounter & {
  npcs: EncounterNpcWithWounds[];
  notes: (EncounterNote & { note: Note })[];
};

export type ActionResult = { error?: string } | undefined;
