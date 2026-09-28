import type { WoundDefinition } from "../types";
import {
  legPenalty,
  MAGICAL_SKILLS,
  skills,
  stat,
  VERBAL_COMBAT_SKILLS,
  vital,
} from "./helpers";

// Complex Critical Table. Arm actions, Stun saves and bleeding are text
// only.
const MINOR_HEAD_WOUND =
  "The blow rattled your brain and caused some internal bleeding. It's hard to think straight. You take a -1 to INT, WILL, and STUN.";
const LOST_TEETH =
  "The blow knocked out some teeth. Roll 1d10 to see how many teeth are lost. You take a -3 to magical skills and Verbal Combat.";
const RUPTURED_SPLEEN =
  "A tear in your spleen begins bleeding profusely, making you woozy. Make a Stun save every 5 rounds. This wound induces bleeding.";
const BROKEN_RIBS =
  "The blow breaks your ribs, causing immense pain when you bend and strain. Take a -2 to BODY and a -1 to REF and DEX.";
const FRACTURED_ARM =
  "The blow fractures your arm. You take a -3 to actions with that arm.";
const FRACTURED_LEG =
  "The blow fractures your leg. You take a -3 to SPD, Dodge/Escape, and Athletics.";

const magicalAndVerbal = (value: number) => [
  ...skills(MAGICAL_SKILLS, value),
  ...skills(VERBAL_COMBAT_SKILLS, value),
];

export const COMPLEX_WOUNDS: WoundDefinition[] = [
  {
    key: "complex.minor-head-wound",
    severity: "COMPLEX",
    name: "Minor Head Wound",
    roll: "12",
    description: MINOR_HEAD_WOUND,
    effects: {
      ACTIVE: {
        text: MINOR_HEAD_WOUND,
        modifiers: [stat("INT", -1), stat("WILL", -1), vital("stun", -1)],
      },
      STABILIZED: {
        text: "You are at a -1 to INT and WILL.",
        modifiers: [stat("INT", -1), stat("WILL", -1)],
      },
      TREATED: {
        text: "You are at a -1 to WILL.",
        modifiers: [stat("WILL", -1)],
      },
    },
  },
  {
    key: "complex.lost-teeth",
    severity: "COMPLEX",
    name: "Lost Teeth",
    roll: "11",
    description: LOST_TEETH,
    effects: {
      ACTIVE: { text: LOST_TEETH, modifiers: magicalAndVerbal(-3) },
      STABILIZED: {
        text: "You take a -2 to magical skills and Verbal Combat.",
        modifiers: magicalAndVerbal(-2),
      },
      TREATED: {
        text: "You take a -1 to magical skills and Verbal Combat.",
        modifiers: magicalAndVerbal(-1),
      },
    },
  },
  {
    key: "complex.ruptured-spleen",
    severity: "COMPLEX",
    name: "Ruptured Spleen",
    roll: "9-10",
    description: RUPTURED_SPLEEN,
    effects: {
      ACTIVE: { text: RUPTURED_SPLEEN, modifiers: [] },
      STABILIZED: {
        text: "You must make a Stun save every 10 Rounds.",
        modifiers: [],
      },
      TREATED: {
        text: "You take a -2 to Stun.",
        modifiers: [vital("stun", -2)],
      },
    },
  },
  {
    key: "complex.broken-ribs",
    severity: "COMPLEX",
    name: "Broken Ribs",
    roll: "6-8",
    description: BROKEN_RIBS,
    effects: {
      ACTIVE: {
        text: BROKEN_RIBS,
        modifiers: [stat("BODY", -2), stat("REF", -1), stat("DEX", -1)],
      },
      STABILIZED: {
        text: "You are at a -1 to BODY and REF.",
        modifiers: [stat("BODY", -1), stat("REF", -1)],
      },
      TREATED: {
        text: "You are at a -1 to BODY.",
        modifiers: [stat("BODY", -1)],
      },
    },
  },
  {
    key: "complex.fractured-arm",
    severity: "COMPLEX",
    name: "Fractured Arm",
    roll: "4-5",
    description: FRACTURED_ARM,
    effects: {
      ACTIVE: { text: FRACTURED_ARM, modifiers: [] },
      STABILIZED: {
        text: "You take a -2 to actions with that arm.",
        modifiers: [],
      },
      TREATED: {
        text: "You take a -1 to actions with that arm.",
        modifiers: [],
      },
    },
  },
  {
    key: "complex.fractured-leg",
    severity: "COMPLEX",
    name: "Fractured Leg",
    roll: "2-3",
    description: FRACTURED_LEG,
    effects: {
      ACTIVE: { text: FRACTURED_LEG, modifiers: legPenalty(-3) },
      STABILIZED: {
        text: "You take a -2 to SPD, Dodge/Escape, and Athletics.",
        modifiers: legPenalty(-2),
      },
      TREATED: {
        text: "-1 to SPD, Dodge/Escape, and Athletics.",
        modifiers: legPenalty(-1),
      },
    },
  },
];
