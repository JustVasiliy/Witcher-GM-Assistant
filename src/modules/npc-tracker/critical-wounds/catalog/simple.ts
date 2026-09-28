import type { WoundDefinition } from "../types";
import {
  EMPATHIC_VERBAL_COMBAT_SKILLS,
  HALF,
  legPenalty,
  MAGICAL_SKILLS,
  QUARTER,
  skill,
  skills,
  stat,
  VERBAL_COMBAT_SKILLS,
  vital,
  vitalTimes,
} from "./helpers";

// Simple Critical Table. Encumbrance, Critical Healing and arm actions
// aren't sheet values, so those parts are text only.
const CRACKED_JAW =
  "The blow cracked your jaw, making it hard to speak clearly. You are at a -2 to Magical Skills & Verbal Combat (Charisma, Persuasion, Seduction, Leadership, Deceit, Social Etiquette, and Intimidation).";
const DISFIGURING_SCAR =
  "The blow mangled your face in some way. You are grotesque and difficult to look at. You take a -3 to empathic Verbal Combat (Charisma, Persuasion, Seduction, Deceit, Social Etiquette, and Leadership).";
const CRACKED_RIBS =
  "The blow cracked your ribs, making it painful to breathe and exert strength. You take a -2 to BODY. This does not effect Health Points.";
const FOREIGN_OBJECT =
  "The blow lodged a piece of clothing or armor in your wound, causing an infection. Your Recovery and Critical Healing are quartered.";
const SPRAINED_ARM =
  "The blow sprained your arm, making it difficult to maneuver. You take a -2 to actions that use the arm.";
const SPRAINED_LEG =
  "The blow sprained your leg, making it difficult to walk and maneuver. You take a -2 to SPD, Dodge/Escape, and Athletics.";

export const SIMPLE_WOUNDS: WoundDefinition[] = [
  {
    key: "simple.cracked-jaw",
    severity: "SIMPLE",
    name: "Cracked Jaw",
    roll: "12",
    description: CRACKED_JAW,
    effects: {
      ACTIVE: {
        text: CRACKED_JAW,
        modifiers: [
          ...skills(MAGICAL_SKILLS, -2),
          ...skills(VERBAL_COMBAT_SKILLS, -2),
        ],
      },
      STABILIZED: {
        text: "You are at a -1 to Magical Skills & Verbal Combat.",
        modifiers: [
          ...skills(MAGICAL_SKILLS, -1),
          ...skills(VERBAL_COMBAT_SKILLS, -1),
        ],
      },
      TREATED: {
        text: "You are at a -1 to Magical Skills.",
        modifiers: skills(MAGICAL_SKILLS, -1),
      },
    },
  },
  {
    key: "simple.disfiguring-scar",
    severity: "SIMPLE",
    name: "Disfiguring Scar",
    roll: "11",
    description: DISFIGURING_SCAR,
    effects: {
      ACTIVE: {
        text: DISFIGURING_SCAR,
        modifiers: skills(EMPATHIC_VERBAL_COMBAT_SKILLS, -3),
      },
      STABILIZED: {
        text: "You take a -1 to empathic Verbal Combat.",
        modifiers: skills(EMPATHIC_VERBAL_COMBAT_SKILLS, -1),
      },
      TREATED: {
        text: "You take a -1 to Seduction.",
        modifiers: [skill("Seduction", -1)],
      },
    },
  },
  {
    key: "simple.cracked-ribs",
    severity: "SIMPLE",
    name: "Cracked Ribs",
    roll: "9-10",
    description: CRACKED_RIBS,
    effects: {
      ACTIVE: { text: CRACKED_RIBS, modifiers: [stat("BODY", -2)] },
      STABILIZED: {
        text: "You are at a -1 to BODY.",
        modifiers: [stat("BODY", -1)],
      },
      TREATED: { text: "You take a -10 to Encumbrance.", modifiers: [] },
    },
  },
  {
    key: "simple.foreign-object",
    severity: "SIMPLE",
    name: "Foreign Object",
    roll: "6-8",
    description: FOREIGN_OBJECT,
    effects: {
      ACTIVE: {
        text: FOREIGN_OBJECT,
        modifiers: [vitalTimes("recovery", QUARTER)],
      },
      STABILIZED: {
        text: "Your Recovery & Critical Healing are halved.",
        modifiers: [vitalTimes("recovery", HALF)],
      },
      TREATED: {
        text: "You take a -2 to Recovery and a -1 to your Critical Healing.",
        modifiers: [vital("recovery", -2)],
      },
    },
  },
  {
    key: "simple.sprained-arm",
    severity: "SIMPLE",
    name: "Sprained Arm",
    roll: "4-5",
    description: SPRAINED_ARM,
    effects: {
      ACTIVE: { text: SPRAINED_ARM, modifiers: [] },
      STABILIZED: {
        text: "You are at a -1 to actions with that arm.",
        modifiers: [],
      },
      TREATED: {
        text: "You take a -1 to Physique.",
        modifiers: [skill("Physique", -1)],
      },
    },
  },
  {
    key: "simple.sprained-leg",
    severity: "SIMPLE",
    name: "Sprained Leg",
    roll: "2-3",
    description: SPRAINED_LEG,
    effects: {
      ACTIVE: { text: SPRAINED_LEG, modifiers: legPenalty(-2) },
      STABILIZED: {
        text: "You take a -1 to SPD, Dodge/Escape, and Athletics.",
        modifiers: legPenalty(-1),
      },
      TREATED: { text: "You take a -1 to SPD.", modifiers: [stat("SPD", -1)] },
    },
  },
];
