import type { WoundDefinition } from "../types";
import {
  allActions,
  HALF,
  legPenalty,
  legPenaltyTimes,
  QUARTER,
  stat,
} from "../../sheet-modifier-helpers";

// Difficult Critical Table. Head-wound damage, Stun saves, acid damage,
// suffocation, bleeding and useless arms are text only.
const SKULL_FRACTURE =
  "The blow fractures a part of your skull, weakening your head and causing bleeding. You take a -1 to INT and DEX, and take quadruple damage from head wounds.";
const CONCUSSION =
  "The blow caused a minor concussion. Make a Stun save every 1d6 rounds and take a -2 to INT, REF, and DEX.";
const TORN_STOMACH =
  "The blow rips your stomach, pouring its contents into your gut. You take a -2 to all actions and take 4 points of acid damage per round.";
const SUCKING_CHEST_WOUND =
  "The wound tears your lung, which fills your chest with air, crushing organs. You take a -3 to BODY and SPD. You also start suffocating.";
const COMPOUND_ARM_FRACTURE =
  "The blow crushes your arm. Bone sticks out of the skin. The arm is rendered useless and you start bleeding.";
const COMPOUND_LEG_FRACTURE =
  "The blow snaps your leg, rendering it useless. Quarter SPD, Dodge/Escape, and Athletics. This induces bleeding.";

export const DIFFICULT_WOUNDS: WoundDefinition[] = [
  {
    key: "difficult.skull-fracture",
    severity: "DIFFICULT",
    name: "Skull Fracture",
    roll: "12",
    description: SKULL_FRACTURE,
    triggersEffects: ["BLEED"],
    effects: {
      ACTIVE: {
        text: SKULL_FRACTURE,
        modifiers: [stat("INT", -1), stat("DEX", -1)],
      },
      STABILIZED: {
        text: "Take a -1 to INT and DEX and quadruple damage from head wounds.",
        modifiers: [stat("INT", -1), stat("DEX", -1)],
      },
      TREATED: {
        text: "You take quadruple damage from head wounds.",
        modifiers: [],
      },
    },
  },
  {
    key: "difficult.concussion",
    severity: "DIFFICULT",
    name: "Concussion",
    roll: "11",
    description: CONCUSSION,
    effects: {
      ACTIVE: {
        text: CONCUSSION,
        modifiers: [stat("INT", -2), stat("REF", -2), stat("DEX", -2)],
      },
      STABILIZED: {
        text: "You take a -1 to INT, REF, and DEX.",
        modifiers: [stat("INT", -1), stat("REF", -1), stat("DEX", -1)],
      },
      TREATED: {
        text: "You take a -1 to INT and DEX.",
        modifiers: [stat("INT", -1), stat("DEX", -1)],
      },
    },
  },
  {
    key: "difficult.torn-stomach",
    severity: "DIFFICULT",
    name: "Torn Stomach",
    roll: "9-10",
    description: TORN_STOMACH,
    effects: {
      ACTIVE: { text: TORN_STOMACH, modifiers: [allActions(-2)] },
      STABILIZED: {
        text: "You take a -2 to all actions.",
        modifiers: [allActions(-2)],
      },
      TREATED: {
        text: "You take a -1 to all actions.",
        modifiers: [allActions(-1)],
      },
    },
  },
  {
    key: "difficult.sucking-chest-wound",
    severity: "DIFFICULT",
    name: "Sucking Chest Wound",
    roll: "6-8",
    description: SUCKING_CHEST_WOUND,
    triggersEffects: ["SUFFOCATION"],
    effects: {
      ACTIVE: {
        text: SUCKING_CHEST_WOUND,
        modifiers: [stat("BODY", -3), stat("SPD", -3)],
      },
      STABILIZED: {
        text: "You take a -2 to BODY and SPD.",
        modifiers: [stat("BODY", -2), stat("SPD", -2)],
      },
      TREATED: {
        text: "You take a -1 to BODY and SPD.",
        modifiers: [stat("BODY", -1), stat("SPD", -1)],
      },
    },
  },
  {
    key: "difficult.compound-arm-fracture",
    severity: "DIFFICULT",
    name: "Compound Arm Fracture",
    roll: "4-5",
    description: COMPOUND_ARM_FRACTURE,
    triggersEffects: ["BLEED"],
    effects: {
      ACTIVE: { text: COMPOUND_ARM_FRACTURE, modifiers: [] },
      STABILIZED: { text: "That arm is useless.", modifiers: [] },
      TREATED: {
        text: "That arm must remain in a sling, but it can hold things.",
        modifiers: [],
      },
    },
  },
  {
    key: "difficult.compound-leg-fracture",
    severity: "DIFFICULT",
    name: "Compound Leg Fracture",
    roll: "2-3",
    description: COMPOUND_LEG_FRACTURE,
    triggersEffects: ["BLEED"],
    effects: {
      ACTIVE: {
        text: COMPOUND_LEG_FRACTURE,
        modifiers: legPenaltyTimes(QUARTER),
      },
      STABILIZED: {
        text: "Halves SPD, Dodge/Escape, and Athletics.",
        modifiers: legPenaltyTimes(HALF),
      },
      TREATED: {
        text: "-2 to SPD, Dodge/Escape, and Athletics.",
        modifiers: legPenalty(-2),
      },
    },
  },
];
