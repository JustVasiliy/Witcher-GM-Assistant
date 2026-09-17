import type { CriticalHit } from "./types";

export const CRITICAL_ELIGIBLE_SKILLS = [
  "Brawling",
  "Dodge/Escape",
  "Melee",
  "Riding",
  "Swordsmanship",
  "Small Blades",
  "Staff/Spear",
  "Archery",
  "Athletics",
  "Crossbow",
  "Spell Casting",
] as const;

export function computeCriticalHit(margin: number): CriticalHit | null {
  if (margin >= 15) {
    return { label: "Deadly Critical Wound", bonusDamage: 10 };
  }
  if (margin >= 13) {
    return { label: "Difficult Critical Wound", bonusDamage: 8 };
  }
  if (margin >= 10) {
    return { label: "Complex Critical Wound", bonusDamage: 5 };
  }
  if (margin >= 7) {
    return { label: "Simple Critical Wound", bonusDamage: 3 };
  }
  return null;
}
