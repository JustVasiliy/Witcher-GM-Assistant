import type { SheetModifierSpec } from "../sheet-modifier-helpers";
import type { EffectKey } from "../effects/types";

// Mirrors the Prisma `WoundState` enum; kept here so client code does not
// import the generated Prisma runtime.
export const WOUND_STATES = ["ACTIVE", "STABILIZED", "TREATED"] as const;
export type WoundState = (typeof WOUND_STATES)[number];

export const WOUND_STATE_LABELS: Record<WoundState, string> = {
  ACTIVE: "Active",
  STABILIZED: "Stabilized",
  TREATED: "Treated",
};

export const WOUND_SEVERITIES = [
  "SIMPLE",
  "COMPLEX",
  "DIFFICULT",
  "DEADLY",
] as const;
export type WoundSeverity = (typeof WOUND_SEVERITIES)[number];

export const SEVERITY_LABELS: Record<WoundSeverity, string> = {
  SIMPLE: "Simple",
  COMPLEX: "Complex",
  DIFFICULT: "Difficult",
  DEADLY: "Deadly",
};

/** Bonus damage dealt when a critical wound is applied (Critical Wounds Table). */
export const SEVERITY_BONUS_DAMAGE: Record<WoundSeverity, number> = {
  SIMPLE: 3,
  COMPLEX: 5,
  DIFFICULT: 8,
  DEADLY: 10,
};

export type { SheetModifierSpec } from "../sheet-modifier-helpers";

export type WoundEffect = { text: string; modifiers: SheetModifierSpec[] };

export type WoundDefinition = {
  key: string;
  severity: WoundSeverity;
  name: string;
  /** 2d6 roll range, e.g. "6-8". */
  roll: string;
  /** Full effect text, shown in the picker. */
  description: string;
  effects: Record<WoundState, WoundEffect>;
  /** Effects activated when this wound is added (idempotent). */
  triggersEffects?: EffectKey[];
};

export type CriticalWound = { id: string; woundKey: string; state: WoundState };
