import type {
  SheetModifier,
  SheetModifierTarget,
  SkillName,
  StatKey,
} from "@/modules/bestiary/client";
import type { RollSide } from "@/modules/roll-history";

export type SheetModifierSpec = Omit<SheetModifier, "source">;

type VitalKey = Extract<SheetModifierTarget, { kind: "vital" }>["key"];

export const HALF = 0.5;
export const QUARTER = 0.25;

export const stat = (key: StatKey, value: number): SheetModifierSpec => ({
  target: { kind: "stat", key },
  op: "add",
  value,
});

export const statTimes = (key: StatKey, value: number): SheetModifierSpec => ({
  target: { kind: "stat", key },
  op: "multiply",
  value,
});

export const skill = (name: SkillName, value: number): SheetModifierSpec => ({
  target: { kind: "skill", name },
  op: "add",
  value,
});

export const skillTimes = (
  name: SkillName,
  value: number,
): SheetModifierSpec => ({
  target: { kind: "skill", name },
  op: "multiply",
  value,
});

export const skills = (
  names: readonly SkillName[],
  value: number,
): SheetModifierSpec[] => names.map((name) => skill(name, value));

export const vital = (key: VitalKey, value: number): SheetModifierSpec => ({
  target: { kind: "vital", key },
  op: "add",
  value,
});

export const vitalTimes = (
  key: VitalKey,
  value: number,
): SheetModifierSpec => ({
  target: { kind: "vital", key },
  op: "multiply",
  value,
});

/** "−N to all actions": applies to every skill roll. */
export const allActions = (value: number): SheetModifierSpec => ({
  target: { kind: "allSkills" },
  op: "add",
  value,
});

export const MAGICAL_SKILLS: readonly SkillName[] = [
  "Spell Casting",
  "Hex Weaving",
  "Ritual Crafting",
];

/** Verbal Combat skills without Intimidation (Disfiguring Scar). */
export const EMPATHIC_VERBAL_COMBAT_SKILLS: readonly SkillName[] = [
  "Charisma",
  "Persuasion",
  "Seduction",
  "Leadership",
  "Deceit",
  "Social Etiquette",
];

export const VERBAL_COMBAT_SKILLS: readonly SkillName[] = [
  ...EMPATHIC_VERBAL_COMBAT_SKILLS,
  "Intimidation",
];

/** SPD, Dodge/Escape and Athletics — the usual leg-wound trio. */
export const legPenalty = (value: number): SheetModifierSpec[] => [
  stat("SPD", value),
  skill("Dodge/Escape", value),
  skill("Athletics", value),
];

export const legPenaltyTimes = (value: number): SheetModifierSpec[] => [
  statTimes("SPD", value),
  skillTimes("Dodge/Escape", value),
  skillTimes("Athletics", value),
];

/** Skills used to attack with a weapon or bare hands. */
export const ATTACK_SKILLS: readonly SkillName[] = [
  "Brawling",
  "Melee",
  "Small Blades",
  "Staff/Spear",
  "Swordsmanship",
  "Archery",
  "Crossbow",
];

/** Skills used to dodge, reposition, or parry. */
export const DEFENSE_SKILLS: readonly SkillName[] = [
  "Dodge/Escape",
  "Athletics",
  ...ATTACK_SKILLS,
];

/** Marks modifiers as applying only to rolls made on `side`. */
export const sided = (
  side: RollSide,
  specs: SheetModifierSpec[],
): SheetModifierSpec[] => specs.map((spec) => ({ ...spec, side }));
