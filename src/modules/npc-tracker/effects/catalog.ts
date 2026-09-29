import {
  ATTACK_SKILLS,
  DEFENSE_SKILLS,
  sided,
  skill,
  skills,
  stat,
  VERBAL_COMBAT_SKILLS,
} from "../sheet-modifier-helpers";
import { isEffectKey, type EffectDefinition, type EffectKey } from "./types";

// Effect Table (core rulebook). Removal checks are prompts for the GM;
// the app never resolves them.
export const EFFECTS: Record<EffectKey, EffectDefinition> = {
  FIRE: {
    key: "FIRE",
    name: "Fire",
    icon: "🔥",
    description:
      "You are engulfed in flames. Every turn you take 5 points of damage to every burning body location. Armor soaks the damage, but fire does 1 point of damage to armor every turn.",
    modifiers: [],
    tick: "fire",
    removal: "Take a turn to pour water on yourself, or stop, drop, and roll.",
  },
  STUN: {
    key: "STUN",
    name: "Stun",
    icon: "💫",
    description:
      "You are stunned, your head reeling and vision swimming. You can't take any actions while stunned and anyone attacking you only has to beat DC:10 to hit you.",
    modifiers: [],
    modifierNotes: [
      "Can't take any actions.",
      "Attackers only need to beat DC 10 to hit.",
    ],
    removal:
      "Stun save (takes the whole turn). Ends immediately if struck while stunned.",
  },
  POISON: {
    key: "POISON",
    name: "Poison",
    icon: "☠️",
    description:
      "Poison or venom courses through your body, doing 3 points of damage every turn which armor does not negate.",
    modifiers: [],
    tick: { hpLoss: 3, ignoresArmor: true },
    removal: "Endurance check DC 15 (takes 1 action).",
  },
  BLEED: {
    key: "BLEED",
    name: "Bleed",
    icon: "🩸",
    description:
      "Your wound opens a vein, causing horrible bleeding. You take 2 points of damage each turn until the bleeding is stopped.",
    modifiers: [],
    tick: { hpLoss: 2 },
    removal:
      "Cast a Healing spell, or make a First Aid check DC 15 (takes 1 action).",
  },
  FREEZE: {
    key: "FREEZE",
    name: "Freeze",
    icon: "❄️",
    description:
      "You're not literally frozen in a block of ice, but your whole body is stiff and an icy glaze has formed on your clothes. You have a -3 to your SPD and a -1 to Reflex.",
    modifiers: [stat("SPD", -3), stat("REF", -1)],
    removal: "Physique check DC 16 (takes 1 action).",
  },
  STAGGERED: {
    key: "STAGGERED",
    name: "Staggered",
    icon: "🌀",
    description:
      "You are thrown off balance and take a -2 to your attack and defense.",
    modifiers: [
      ...sided("attacking", skills(ATTACK_SKILLS, -2)),
      ...sided("defending", skills(DEFENSE_SKILLS, -2)),
    ],
    expiresOnTick: true,
    removal:
      "Ends automatically: at the beginning of your next turn you recover your balance.",
  },
  INTOXICATION: {
    key: "INTOXICATION",
    name: "Intoxication",
    icon: "🍺",
    description:
      "You're stumbling drunk. Your REF, DEX, and INT are at a -2 and you are at a -3 for Verbal Combat. There's a 25% chance you won't clearly remember everything you did while you were intoxicated.",
    modifiers: [
      stat("REF", -2),
      stat("DEX", -2),
      stat("INT", -2),
      ...skills(VERBAL_COMBAT_SKILLS, -3),
    ],
    removal: "Wears off with time (GM decides).",
    reminder: "25% chance not to remember what happened while intoxicated.",
  },
  HALLUCINATION: {
    key: "HALLUCINATION",
    name: "Hallucination",
    icon: "👁️",
    description:
      "You are seeing visions and images that aren't really there. The GM has free rein to make any false sensory experience they want appear to you.",
    modifiers: [],
    modifierNotes: ["The GM controls false sensory experiences."],
    removal:
      "Wears off (GM decides). A Deduction check DC 15 recognizes each false image.",
  },
  NAUSEA: {
    key: "NAUSEA",
    name: "Nausea",
    icon: "🤢",
    description:
      "Your stomach is churning and you have to concentrate not to vomit. Every 3 rounds you must roll under your BODY or spend the round vomiting or dry-heaving.",
    modifiers: [],
    removal: "Wears off (GM decides).",
    reminder: "Every 3 rounds: roll under BODY or lose the round vomiting.",
  },
  SUFFOCATION: {
    key: "SUFFOCATION",
    name: "Suffocation",
    icon: "😮‍💨",
    description:
      "Your access to air has been cut off and you are choking to death. Every round you take 3 damage which armor does not negate.",
    modifiers: [],
    tick: { hpLoss: 3, ignoresArmor: true },
    removal:
      "Restore the air supply (surface from water, escape a chokehold, etc.).",
  },
  BLINDED: {
    key: "BLINDED",
    name: "Blinded",
    icon: "🙈",
    description:
      "Your eyes have been blocked or damaged. You are at a -3 to all Attack and Defense and a -5 to sight-based Awareness.",
    modifiers: [
      skill("Awareness", -5),
      ...sided("attacking", skills(ATTACK_SKILLS, -3)),
      ...sided("defending", skills(DEFENSE_SKILLS, -3)),
    ],
    modifierNotes: ["Awareness penalty applies to sight-based checks."],
    removal: "Take a turn to clear your eyes.",
  },
};

export function getEffectDefinition(key: string): EffectDefinition | undefined {
  return isEffectKey(key) ? EFFECTS[key] : undefined;
}
