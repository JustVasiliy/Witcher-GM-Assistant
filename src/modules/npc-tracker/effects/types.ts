import type { ArmorLocations } from "@/modules/bestiary/client";
import type { SheetModifierSpec } from "../sheet-modifier-helpers";

export const EFFECT_KEYS = [
  "FIRE",
  "STUN",
  "POISON",
  "BLEED",
  "FREEZE",
  "STAGGERED",
  "INTOXICATION",
  "HALLUCINATION",
  "NAUSEA",
  "SUFFOCATION",
  "BLINDED",
] as const;
export type EffectKey = (typeof EFFECT_KEYS)[number];

export function isEffectKey(key: string): key is EffectKey {
  return (EFFECT_KEYS as readonly string[]).includes(key);
}

export type BodyLocation = keyof ArmorLocations;

export const BODY_LOCATIONS = [
  "head",
  "torso",
  "rightHand",
  "leftHand",
  "rightLeg",
  "leftLeg",
] as const satisfies readonly BodyLocation[];

/** HP lost each round, or "fire" for the per-location Fire rules. */
export type EffectTick = { hpLoss: number; ignoresArmor?: true } | "fire";

export type EffectDefinition = {
  key: EffectKey;
  name: string;
  icon: string;
  /** Effect Table text. */
  description: string;
  /** Applied to the sheet (or to rolls on one side) while active. */
  modifiers: SheetModifierSpec[];
  /** Rules that aren't sheet values, listed with the modifiers. */
  modifierNotes?: string[];
  tick?: EffectTick;
  /** Removed automatically on the next round advance. */
  expiresOnTick?: true;
  /** How to end the effect — a prompt only; removal is always manual. */
  removal: string;
  reminder?: string;
};

/** The saved shape the logic needs (a subset of the Prisma row). */
export type ActiveEffect = { effectKey: string; burningLocations: string[] };
