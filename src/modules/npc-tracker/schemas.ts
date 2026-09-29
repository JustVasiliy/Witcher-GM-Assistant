import { z } from "zod";

import { getWoundDefinition } from "./critical-wounds/catalog";
import { WOUND_STATES } from "./critical-wounds/types";
import { BODY_LOCATIONS, EFFECT_KEYS } from "./effects/types";

export const EncounterNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required.")
  .max(100, "Name must be 100 characters or fewer.");

export const MAX_NPC_QUANTITY = 20;

export const AddNpcSchema = z.object({
  source: z.enum(["CORE", "CUSTOM"]),
  creatureId: z.string().trim().min(1, "Select an NPC."),
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(MAX_NPC_QUANTITY, `Quantity must be ${MAX_NPC_QUANTITY} or fewer.`),
});

export type AddNpcInput = z.infer<typeof AddNpcSchema>;

// Shares the encounter-name rule (trim, 1–100) with bestiary's HeaderSchema name.
// Kept local so this client-imported file does not import the bestiary barrel
// and pull Prisma into the client bundle.
export const NpcInstanceNameSchema = EncounterNameSchema;

const combatValue = (label: string) =>
  z
    .number()
    .int(`${label} must be a whole number.`)
    .min(0, `${label} cannot be negative.`);

export const UpdateEncounterNpcSchema = z.object({
  name: NpcInstanceNameSchema.optional(),
  // Loose on purpose: merged into the stored snapshot, then the merged
  // result is validated with bestiary's NpcDetailsSchema.
  details: z.record(z.string(), z.unknown()).optional(),
  combat: z
    .object({
      currentHp: combatValue("Current HP").optional(),
      currentStamina: combatValue("Current Stamina").optional(),
    })
    .optional(),
});

export type UpdateEncounterNpcInput = z.infer<typeof UpdateEncounterNpcSchema>;

export const AttachNoteSchema = z.object({
  noteId: z.string().trim().min(1, "Select a note."),
});

export type AttachNoteInput = z.infer<typeof AttachNoteSchema>;

export const AddCriticalWoundSchema = z.object({
  woundKey: z
    .string()
    .refine(
      (key) => getWoundDefinition(key) !== undefined,
      "Unknown critical wound.",
    ),
});

export const SetCriticalWoundStateSchema = z.object({
  state: z.enum(WOUND_STATES),
});

export const EffectKeySchema = z.enum(EFFECT_KEYS);

export const ToggleEffectSchema = z.object({ effectKey: EffectKeySchema });

export const BodyLocationSchema = z.enum(BODY_LOCATIONS);

export const SetFireLocationsSchema = z.object({
  locations: z
    .array(BodyLocationSchema)
    .refine(
      (locations) => new Set(locations).size === locations.length,
      "Each body location can be listed once.",
    ),
});
