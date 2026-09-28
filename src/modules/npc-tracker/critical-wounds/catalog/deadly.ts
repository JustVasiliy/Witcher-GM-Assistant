import type { WoundDefinition } from "../types";
import {
  HALF,
  legPenaltyTimes,
  QUARTER,
  skill,
  stat,
  statTimes,
  vital,
  vitalTimes,
} from "./helpers";

// Deadly Critical Table. Death, Death saves, bleeding, poison, lost limbs
// and prosthetics are text only. "Sight-based Awareness" applies to the
// Awareness skill; the text keeps the sight-based caveat.
const SEPARATED_SPINE =
  "The blow either snaps your neck or separates your head from your shoulders. You die immediately.";
const DAMAGED_EYE =
  "The blow cuts into or indents your eyeball. You take a -5 to sight-based Awareness and -4 to DEX. This wound begins bleeding.";
const HEART_DAMAGE =
  "The blow damages your heart. Make an immediate Death save. If you survive, the wound is bleeding and you must quarter your Stamina, SPD, and BODY.";
const SEPTIC_SHOCK =
  "The blow damages your intestines, letting waste enter your blood stream. Quarter your Stamina, take a -3 to INT, WILL, REF, and DEX. You are poisoned.";
const DISMEMBERED_ARM =
  "The blow rends your arm from your body or damages it beyond repair. The arm cannot be used and you start bleeding.";
const DISMEMBERED_LEG =
  "The blow tears your leg from your body or damages it beyond repair. Quarter your SPD, Dodge/Escape, and Athletics. This wound begins bleeding.";

const heartDamage = (value: number) => [
  vitalTimes("stamina", value),
  statTimes("SPD", value),
  statTimes("BODY", value),
];

export const DEADLY_WOUNDS: WoundDefinition[] = [
  {
    key: "deadly.separated-spine",
    severity: "DEADLY",
    name: "Separated Spine/Decapitated",
    roll: "12",
    description: SEPARATED_SPINE,
    effects: {
      ACTIVE: { text: SEPARATED_SPINE, modifiers: [] },
      STABILIZED: { text: "This wound cannot be stabilized.", modifiers: [] },
      TREATED: { text: "This wound cannot be treated.", modifiers: [] },
    },
  },
  {
    key: "deadly.damaged-eye",
    severity: "DEADLY",
    name: "Damaged Eye",
    roll: "11",
    description: DAMAGED_EYE,
    effects: {
      ACTIVE: {
        text: DAMAGED_EYE,
        modifiers: [skill("Awareness", -5), stat("DEX", -4)],
      },
      STABILIZED: {
        text: "You take a -3 to sight-based Awareness and -2 to DEX.",
        modifiers: [skill("Awareness", -3), stat("DEX", -2)],
      },
      TREATED: {
        text: "Permanent -1 to sight-based Awareness and DEX.",
        modifiers: [skill("Awareness", -1), stat("DEX", -1)],
      },
    },
  },
  {
    key: "deadly.heart-damage",
    severity: "DEADLY",
    name: "Heart Damage",
    roll: "9-10",
    description: HEART_DAMAGE,
    effects: {
      ACTIVE: { text: HEART_DAMAGE, modifiers: heartDamage(QUARTER) },
      STABILIZED: {
        text: "You halve your Stamina, SPD, and BODY.",
        modifiers: heartDamage(HALF),
      },
      TREATED: {
        text: "You take +2 damage per round from bleeding damage permanently.",
        modifiers: [],
      },
    },
  },
  {
    key: "deadly.septic-shock",
    severity: "DEADLY",
    name: "Septic Shock",
    roll: "6-8",
    description: SEPTIC_SHOCK,
    effects: {
      ACTIVE: {
        text: SEPTIC_SHOCK,
        modifiers: [
          vitalTimes("stamina", QUARTER),
          stat("INT", -3),
          stat("WILL", -3),
          stat("REF", -3),
          stat("DEX", -3),
        ],
      },
      STABILIZED: {
        text: "Your Stamina is halved and you take a -1 to INT, WILL, REF, and DEX.",
        modifiers: [
          vitalTimes("stamina", HALF),
          stat("INT", -1),
          stat("WILL", -1),
          stat("REF", -1),
          stat("DEX", -1),
        ],
      },
      TREATED: {
        text: "You take a -5 to Stamina permanently.",
        modifiers: [vital("stamina", -5)],
      },
    },
  },
  {
    key: "deadly.dismembered-arm",
    severity: "DEADLY",
    name: "Dismembered Arm",
    roll: "4-5",
    description: DISMEMBERED_ARM,
    effects: {
      ACTIVE: { text: DISMEMBERED_ARM, modifiers: [] },
      STABILIZED: { text: "That arm is useless.", modifiers: [] },
      TREATED: {
        text: "The arm can be replaced with a prosthetic.",
        modifiers: [],
      },
    },
  },
  {
    key: "deadly.dismembered-leg",
    severity: "DEADLY",
    name: "Dismembered Leg",
    roll: "2-3",
    description: DISMEMBERED_LEG,
    effects: {
      ACTIVE: {
        text: DISMEMBERED_LEG,
        modifiers: legPenaltyTimes(QUARTER),
      },
      STABILIZED: {
        text: "You quarter your SPD, Dodge/Escape, and Athletics.",
        modifiers: legPenaltyTimes(QUARTER),
      },
      TREATED: {
        text: "The leg can be replaced with a prosthetic.",
        modifiers: [],
      },
    },
  },
];
