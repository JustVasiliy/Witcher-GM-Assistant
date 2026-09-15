import { describe, expect, it } from "vitest";
import {
  ArmorLocationsSchema,
  HeaderSchema,
  NpcDetailsSchema,
  SKILL_NAMES,
  SKILL_TO_STAT,
  STAT_KEYS,
  type NpcDetailsInput,
} from "./schemas";

// Real data transcribed from a Ghoul stat card. The card shows combined
// Base (stat+skill), not raw skill values, so raw skills below are
// back-derived (Base − Stat). This is what proves skill values must
// allow negatives: Stealth and Resist Magic are below their stat alone.
const ghoulFixture: NpcDetailsInput = {
  coreStats: {
    INT: 1,
    REF: 6,
    DEX: 7,
    BODY: 6,
    SPD: 6,
    EMP: 1,
    CRA: 1,
    WILL: 5,
    LUCK: 0,
  },
  skills: {
    Melee: 0,
    Brawling: 0,
    "Dodge/Escape": 0,
    Athletics: 0,
    Awareness: 6,
    Stealth: -3,
    "Wilderness Survival": 5,
    "Resist Magic": -1,
    Endurance: 0,
    Courage: 2,
  },
  vitalStats: {
    stun: 5,
    stamina: 25,
    recovery: 5,
    hp: 25,
    vigor: 0,
  },
  armor: {
    head: 0,
    torso: 0,
    rightHand: 0,
    leftHand: 0,
    rightLeg: 0,
    leftLeg: 0,
  },
  attacks: [
    { name: "Claws", skill: "Melee", damage: "3d6", rof: 1 },
    {
      name: "Bite",
      skill: "Melee",
      damage: "3d6+2",
      effect: "Bleed (25%), -1 WA",
      rof: 1,
    },
  ],
  abilities: [
    {
      name: "Pounce",
      description: "A ghoul doesn't need to take a running start when leaping.",
    },
    {
      name: "Fury",
      description:
        "When ghouls are brought below 10 HP they enter a fury in which they move every round, attack every round, and regenerate 3 points of damage per turn.",
    },
    {
      name: "Night Vision",
      description: "Ghouls operate in areas of dim light with no penalties.",
    },
    {
      name: "Feral",
      description:
        "For the purposes of Awareness and Wilderness Survival, instinct gives them an INT of 6.",
    },
  ],
  weaknesses: ["Necrophage Oil"],
  loot: [
    { name: "Ghoul marrow", quantity: "1d6/2" },
    { name: "Ghoul claws", quantity: "2" },
    { name: "Venom extract", quantity: "1d6/2" },
  ],
  threatRating: { difficulty: "EASY", complexity: "DIFFICULT" },
  bounty: 30,
  flavor: {
    height: "Around 1.25 meters at the shoulder",
    weight: "Around 86kg",
    environment: "Battlefields and cemeteries",
    intelligenceDescription: "About as intelligent as a dog",
    organization: "Packs of 3 to 6",
    commonerSuperstition: {
      dc: 14,
      text: "Ya see a lot of ghouls in the North these days.",
    },
    witcherKnowledge: {
      dc: 10,
      text: "Much like other necrophages, common folk assume ghouls are re-animated corpses.",
    },
  },
};

describe("NpcDetailsSchema", () => {
  it("parses a real stat card (Ghoul), including negative skill values", () => {
    const result = NpcDetailsSchema.safeParse(ghoulFixture);
    expect(result.success).toBe(true);
  });

  it("round-trips through JSON serialization unchanged", () => {
    const roundTripped = JSON.parse(JSON.stringify(ghoulFixture));
    const result = NpcDetailsSchema.safeParse(roundTripped);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(ghoulFixture);
  });

  it("rejects a negative hp", () => {
    const invalid = {
      ...ghoulFixture,
      vitalStats: { ...ghoulFixture.vitalStats, hp: -1 },
    };
    expect(NpcDetailsSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects a negative bounty", () => {
    const invalid = { ...ghoulFixture, bounty: -5 };
    expect(NpcDetailsSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects an attack with rof below 1", () => {
    const invalid = {
      ...ghoulFixture,
      attacks: [
        { name: "Claws", skill: "Melee" as const, damage: "3d6", rof: 0 },
      ],
    };
    expect(NpcDetailsSchema.safeParse(invalid).success).toBe(false);
  });
});

describe("SKILL_TO_STAT", () => {
  it("maps every skill name to a valid stat key", () => {
    for (const skill of SKILL_NAMES) {
      expect(STAT_KEYS).toContain(SKILL_TO_STAT[skill]);
    }
  });

  it("has exactly one entry per skill name, matching SKILL_NAMES' length", () => {
    expect(Object.keys(SKILL_TO_STAT)).toHaveLength(SKILL_NAMES.length);
  });
});

describe("SKILL_NAMES", () => {
  it("has 50 skills total (11 INT + 8 REF + 5 DEX + 2 BODY + 10 EMP + 7 CRA + 7 WILL)", () => {
    expect(SKILL_NAMES).toHaveLength(50);
  });

  it("has no duplicate skill names", () => {
    expect(new Set(SKILL_NAMES).size).toBe(SKILL_NAMES.length);
  });
});

describe("ArmorLocationsSchema", () => {
  it("accepts all six body-part values", () => {
    const result = ArmorLocationsSchema.safeParse({
      head: 1,
      torso: 2,
      rightHand: 0,
      leftHand: 0,
      rightLeg: 3,
      leftLeg: 3,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a negative value", () => {
    const result = ArmorLocationsSchema.safeParse({
      head: -1,
      torso: 0,
      rightHand: 0,
      leftHand: 0,
      rightLeg: 0,
      leftLeg: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("HeaderSchema", () => {
  it("accepts a name, threat rating, and bounty", () => {
    const result = HeaderSchema.safeParse({
      name: "Ghoul",
      threatRating: { difficulty: "EASY", complexity: "DIFFICULT" },
      bounty: 30,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = HeaderSchema.safeParse({
      name: "",
      threatRating: { difficulty: "EASY", complexity: "DIFFICULT" },
      bounty: 30,
    });
    expect(result.success).toBe(false);
  });
});
