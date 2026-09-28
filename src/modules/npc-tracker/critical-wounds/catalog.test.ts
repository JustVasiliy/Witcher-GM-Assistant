import { describe, expect, it } from "vitest";
import {
  CRITICAL_WOUNDS,
  getWoundDefinition,
  woundsBySeverity,
} from "./catalog";
import {
  WOUND_SEVERITIES,
  WOUND_STATES,
  type WoundSeverity,
  type WoundState,
} from "./types";

const stat = (key: string, value: number) => ({
  target: { kind: "stat", key },
  op: "add",
  value,
});
const statTimes = (key: string, value: number) => ({
  target: { kind: "stat", key },
  op: "multiply",
  value,
});
const skill = (name: string, value: number) => ({
  target: { kind: "skill", name },
  op: "add",
  value,
});
const skillTimes = (name: string, value: number) => ({
  target: { kind: "skill", name },
  op: "multiply",
  value,
});
const vital = (key: string, value: number) => ({
  target: { kind: "vital", key },
  op: "add",
  value,
});
const vitalTimes = (key: string, value: number) => ({
  target: { kind: "vital", key },
  op: "multiply",
  value,
});
const allActions = (value: number) => ({
  target: { kind: "allSkills" },
  op: "add",
  value,
});

const MAGICAL = ["Spell Casting", "Hex Weaving", "Ritual Crafting"];
const EMPATHIC_VERBAL = [
  "Charisma",
  "Persuasion",
  "Seduction",
  "Leadership",
  "Deceit",
  "Social Etiquette",
];
const VERBAL = [...EMPATHIC_VERBAL, "Intimidation"];
const skills = (names: string[], value: number) =>
  names.map((name) => skill(name, value));

const legSkills = (value: number) => [
  stat("SPD", value),
  skill("Dodge/Escape", value),
  skill("Athletics", value),
];
const legSkillsTimes = (value: number) => [
  statTimes("SPD", value),
  skillTimes("Dodge/Escape", value),
  skillTimes("Athletics", value),
];

type Expected = Record<string, Record<WoundState, unknown[]>>;
const NONE = { ACTIVE: [], STABILIZED: [], TREATED: [] };

// The four Critical Wound tables, as agreed with the user.
const EXPECTED: Record<WoundSeverity, Expected> = {
  SIMPLE: {
    "simple.cracked-jaw": {
      ACTIVE: [...skills(MAGICAL, -2), ...skills(VERBAL, -2)],
      STABILIZED: [...skills(MAGICAL, -1), ...skills(VERBAL, -1)],
      TREATED: skills(MAGICAL, -1),
    },
    "simple.disfiguring-scar": {
      ACTIVE: skills(EMPATHIC_VERBAL, -3),
      STABILIZED: skills(EMPATHIC_VERBAL, -1),
      TREATED: [skill("Seduction", -1)],
    },
    "simple.cracked-ribs": {
      ACTIVE: [stat("BODY", -2)],
      STABILIZED: [stat("BODY", -1)],
      TREATED: [],
    },
    "simple.foreign-object": {
      ACTIVE: [vitalTimes("recovery", 0.25)],
      STABILIZED: [vitalTimes("recovery", 0.5)],
      TREATED: [vital("recovery", -2)],
    },
    "simple.sprained-arm": {
      ACTIVE: [],
      STABILIZED: [],
      TREATED: [skill("Physique", -1)],
    },
    "simple.sprained-leg": {
      ACTIVE: legSkills(-2),
      STABILIZED: legSkills(-1),
      TREATED: [stat("SPD", -1)],
    },
  },
  COMPLEX: {
    "complex.minor-head-wound": {
      ACTIVE: [stat("INT", -1), stat("WILL", -1), vital("stun", -1)],
      STABILIZED: [stat("INT", -1), stat("WILL", -1)],
      TREATED: [stat("WILL", -1)],
    },
    "complex.lost-teeth": {
      ACTIVE: [...skills(MAGICAL, -3), ...skills(VERBAL, -3)],
      STABILIZED: [...skills(MAGICAL, -2), ...skills(VERBAL, -2)],
      TREATED: [...skills(MAGICAL, -1), ...skills(VERBAL, -1)],
    },
    "complex.ruptured-spleen": {
      ACTIVE: [],
      STABILIZED: [],
      TREATED: [vital("stun", -2)],
    },
    "complex.broken-ribs": {
      ACTIVE: [stat("BODY", -2), stat("REF", -1), stat("DEX", -1)],
      STABILIZED: [stat("BODY", -1), stat("REF", -1)],
      TREATED: [stat("BODY", -1)],
    },
    "complex.fractured-arm": NONE,
    "complex.fractured-leg": {
      ACTIVE: legSkills(-3),
      STABILIZED: legSkills(-2),
      TREATED: legSkills(-1),
    },
  },
  DIFFICULT: {
    "difficult.skull-fracture": {
      ACTIVE: [stat("INT", -1), stat("DEX", -1)],
      STABILIZED: [stat("INT", -1), stat("DEX", -1)],
      TREATED: [],
    },
    "difficult.concussion": {
      ACTIVE: [stat("INT", -2), stat("REF", -2), stat("DEX", -2)],
      STABILIZED: [stat("INT", -1), stat("REF", -1), stat("DEX", -1)],
      TREATED: [stat("INT", -1), stat("DEX", -1)],
    },
    "difficult.torn-stomach": {
      ACTIVE: [allActions(-2)],
      STABILIZED: [allActions(-2)],
      TREATED: [allActions(-1)],
    },
    "difficult.sucking-chest-wound": {
      ACTIVE: [stat("BODY", -3), stat("SPD", -3)],
      STABILIZED: [stat("BODY", -2), stat("SPD", -2)],
      TREATED: [stat("BODY", -1), stat("SPD", -1)],
    },
    "difficult.compound-arm-fracture": NONE,
    "difficult.compound-leg-fracture": {
      ACTIVE: legSkillsTimes(0.25),
      STABILIZED: legSkillsTimes(0.5),
      TREATED: legSkills(-2),
    },
  },
  DEADLY: {
    "deadly.separated-spine": NONE,
    "deadly.damaged-eye": {
      ACTIVE: [skill("Awareness", -5), stat("DEX", -4)],
      STABILIZED: [skill("Awareness", -3), stat("DEX", -2)],
      TREATED: [skill("Awareness", -1), stat("DEX", -1)],
    },
    "deadly.heart-damage": {
      ACTIVE: [
        vitalTimes("stamina", 0.25),
        statTimes("SPD", 0.25),
        statTimes("BODY", 0.25),
      ],
      STABILIZED: [
        vitalTimes("stamina", 0.5),
        statTimes("SPD", 0.5),
        statTimes("BODY", 0.5),
      ],
      TREATED: [],
    },
    "deadly.septic-shock": {
      ACTIVE: [
        vitalTimes("stamina", 0.25),
        stat("INT", -3),
        stat("WILL", -3),
        stat("REF", -3),
        stat("DEX", -3),
      ],
      STABILIZED: [
        vitalTimes("stamina", 0.5),
        stat("INT", -1),
        stat("WILL", -1),
        stat("REF", -1),
        stat("DEX", -1),
      ],
      TREATED: [vital("stamina", -5)],
    },
    "deadly.dismembered-arm": NONE,
    "deadly.dismembered-leg": {
      ACTIVE: legSkillsTimes(0.25),
      STABILIZED: legSkillsTimes(0.25),
      TREATED: [],
    },
  },
};

describe("CRITICAL_WOUNDS", () => {
  it("has unique keys", () => {
    const keys = CRITICAL_WOUNDS.map((wound) => wound.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("gives every wound a known severity, a description, and text for all three states", () => {
    for (const wound of CRITICAL_WOUNDS) {
      expect(WOUND_SEVERITIES).toContain(wound.severity);
      expect(wound.description.length).toBeGreaterThan(0);
      for (const state of WOUND_STATES) {
        expect(wound.effects[state].text.length).toBeGreaterThan(0);
      }
    }
  });

  it("keys every wound by its severity", () => {
    for (const wound of CRITICAL_WOUNDS) {
      expect(wound.key.startsWith(`${wound.severity.toLowerCase()}.`)).toBe(
        true,
      );
    }
  });

  it.each(WOUND_SEVERITIES)(
    "contains exactly the six %s wounds in table order",
    (severity) => {
      expect(woundsBySeverity(severity).map((wound) => wound.key)).toEqual(
        Object.keys(EXPECTED[severity]),
      );
    },
  );

  it.each(
    WOUND_SEVERITIES.flatMap((severity) => Object.entries(EXPECTED[severity])),
  )("%s has the agreed modifiers per state", (key, expected) => {
    const wound = getWoundDefinition(key);
    expect(wound).toBeDefined();
    for (const state of WOUND_STATES) {
      expect(wound!.effects[state].modifiers).toEqual(expected[state]);
    }
  });
});

describe("getWoundDefinition", () => {
  it("returns undefined for unknown keys", () => {
    expect(getWoundDefinition("complex.nope")).toBeUndefined();
  });
});
