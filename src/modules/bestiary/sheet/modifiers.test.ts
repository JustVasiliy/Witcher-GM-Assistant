import { describe, expect, it } from "vitest";
import { applyModifiers, formatAmount, type SheetModifier } from "./modifiers";

const base = {
  coreStats: {
    INT: 5,
    REF: 6,
    DEX: 6,
    BODY: 7,
    SPD: 5,
    EMP: 4,
    CRA: 4,
    WILL: 5,
    LUCK: 3,
  },
  skills: { Physique: 3, "Spell Casting": 2, "Dodge/Escape": 4 },
  vitalStats: { stun: 7, stamina: 35, recovery: 7, hp: 35, vigor: 0 },
};

describe("formatAmount", () => {
  it("uses a real minus sign for negatives and + otherwise", () => {
    expect(formatAmount(-2)).toBe("−2");
    expect(formatAmount(3)).toBe("+3");
    expect(formatAmount(0)).toBe("+0");
  });
});

describe("applyModifiers", () => {
  it("returns base values and no sources without modifiers", () => {
    const sheet = applyModifiers(base, []);
    expect(sheet.coreStats).toEqual(base.coreStats);
    expect(sheet.vitalStats).toEqual(base.vitalStats);
    expect(sheet.skillBase("Physique")).toBe(10);
    expect(sheet.skillBase("Awareness")).toBe(5);
    expect(sheet.statSources("BODY")).toEqual([]);
    expect(sheet.skillSources("Physique")).toEqual([]);
  });

  it("cascades a stat penalty into skills based on that stat", () => {
    const modifiers: SheetModifier[] = [
      {
        target: { kind: "stat", key: "BODY" },
        op: "add",
        value: -2,
        source: "Broken Ribs (Active)",
      },
    ];
    const sheet = applyModifiers(base, modifiers);
    expect(sheet.coreStats.BODY).toBe(5);
    expect(sheet.skillBase("Physique")).toBe(8);
    expect(sheet.skillBase("Endurance")).toBe(5);
    expect(sheet.statSources("BODY")).toEqual([
      "Broken Ribs (Active): BODY −2",
    ]);
    expect(sheet.skillSources("Physique")).toEqual([
      "Broken Ribs (Active): BODY −2",
    ]);
    expect(sheet.skillSources("Awareness")).toEqual([]);
  });

  it("applies a direct skill modifier without touching the stat", () => {
    const sheet = applyModifiers(base, [
      {
        target: { kind: "skill", name: "Spell Casting" },
        op: "add",
        value: -3,
        source: "Lost Teeth (Active)",
      },
    ]);
    expect(sheet.skillBase("Spell Casting")).toBe(4);
    expect(sheet.coreStats.WILL).toBe(5);
    expect(sheet.skillSources("Spell Casting")).toEqual([
      "Lost Teeth (Active): Spell Casting −3",
    ]);
    expect(sheet.statSources("WILL")).toEqual([]);
  });

  it("stacks modifiers from several sources", () => {
    const sheet = applyModifiers(base, [
      {
        target: { kind: "stat", key: "BODY" },
        op: "add",
        value: -2,
        source: "Broken Ribs (Active)",
      },
      {
        target: { kind: "stat", key: "BODY" },
        op: "add",
        value: -1,
        source: "Broken Ribs (Treated)",
      },
    ]);
    expect(sheet.coreStats.BODY).toBe(4);
    expect(sheet.statSources("BODY")).toEqual([
      "Broken Ribs (Active): BODY −2",
      "Broken Ribs (Treated): BODY −1",
    ]);
  });

  it("applies vital modifiers", () => {
    const sheet = applyModifiers(base, [
      {
        target: { kind: "vital", key: "stun" },
        op: "add",
        value: -1,
        source: "Minor Head Wound (Active)",
      },
    ]);
    expect(sheet.vitalStats.stun).toBe(6);
    expect(sheet.vitalSources("stun")).toEqual([
      "Minor Head Wound (Active): Stun −1",
    ]);
  });

  it("does not clamp values below zero", () => {
    const sheet = applyModifiers(base, [
      {
        target: { kind: "stat", key: "LUCK" },
        op: "add",
        value: -5,
        source: "Test",
      },
    ]);
    expect(sheet.coreStats.LUCK).toBe(-2);
  });

  it("does not mutate the base values", () => {
    applyModifiers(base, [
      {
        target: { kind: "stat", key: "BODY" },
        op: "add",
        value: -2,
        source: "X",
      },
      {
        target: { kind: "vital", key: "stun" },
        op: "multiply",
        value: 0.5,
        source: "X",
      },
    ]);
    expect(base.coreStats.BODY).toBe(7);
    expect(base.vitalStats.stun).toBe(7);
  });

  describe("multipliers", () => {
    it("multiplies a stat, rounds down, and cascades into its skills", () => {
      const sheet = applyModifiers(base, [
        {
          target: { kind: "stat", key: "BODY" },
          op: "multiply",
          value: 0.5,
          source: "Heart Damage (Stabilized)",
        },
      ]);
      expect(sheet.coreStats.BODY).toBe(3);
      expect(sheet.skillBase("Physique")).toBe(6);
      expect(sheet.statSources("BODY")).toEqual([
        "Heart Damage (Stabilized): BODY ×½",
      ]);
      expect(sheet.skillSources("Physique")).toEqual([
        "Heart Damage (Stabilized): BODY ×½",
      ]);
    });

    it("applies multipliers before flat modifiers, whatever the order", () => {
      const sheet = applyModifiers(base, [
        {
          target: { kind: "stat", key: "BODY" },
          op: "add",
          value: -1,
          source: "A",
        },
        {
          target: { kind: "stat", key: "BODY" },
          op: "multiply",
          value: 0.5,
          source: "B",
        },
      ]);
      // floor(7 × ½) − 1
      expect(sheet.coreStats.BODY).toBe(2);
    });

    it("stacks multipliers multiplicatively", () => {
      const sheet = applyModifiers(base, [
        {
          target: { kind: "stat", key: "BODY" },
          op: "multiply",
          value: 0.5,
          source: "A",
        },
        {
          target: { kind: "stat", key: "BODY" },
          op: "multiply",
          value: 0.5,
          source: "B",
        },
      ]);
      // floor(7 × ¼)
      expect(sheet.coreStats.BODY).toBe(1);
    });

    it("multiplies a skill's full roll value (effective stat + ranks)", () => {
      const quarterDodge: SheetModifier = {
        target: { kind: "skill", name: "Dodge/Escape" },
        op: "multiply",
        value: 0.25,
        source: "Compound Leg Fracture (Active)",
      };
      // floor((6 + 4) × ¼)
      expect(
        applyModifiers(base, [quarterDodge]).skillBase("Dodge/Escape"),
      ).toBe(2);
      // floor((4 + 4) × ¼) with REF −2 cascading in first
      const withConcussion = applyModifiers(base, [
        quarterDodge,
        {
          target: { kind: "stat", key: "REF" },
          op: "add",
          value: -2,
          source: "Concussion (Active)",
        },
      ]);
      expect(withConcussion.skillBase("Dodge/Escape")).toBe(2);
      expect(withConcussion.skillSources("Dodge/Escape")).toEqual([
        "Compound Leg Fracture (Active): Dodge/Escape ×¼",
        "Concussion (Active): REF −2",
      ]);
    });

    it("applies a skill multiplier before a flat skill modifier", () => {
      const sheet = applyModifiers(base, [
        {
          target: { kind: "skill", name: "Athletics" },
          op: "add",
          value: -1,
          source: "A",
        },
        {
          target: { kind: "skill", name: "Athletics" },
          op: "multiply",
          value: 0.5,
          source: "B",
        },
      ]);
      // floor(6 × ½) − 1
      expect(sheet.skillBase("Athletics")).toBe(2);
    });

    it("multiplies vitals", () => {
      const sheet = applyModifiers(base, [
        {
          target: { kind: "vital", key: "recovery" },
          op: "multiply",
          value: 0.25,
          source: "Foreign Object (Active)",
        },
        {
          target: { kind: "vital", key: "stamina" },
          op: "multiply",
          value: 0.5,
          source: "Septic Shock (Stabilized)",
        },
      ]);
      expect(sheet.vitalStats.recovery).toBe(1);
      expect(sheet.vitalStats.stamina).toBe(17);
      expect(sheet.vitalSources("recovery")).toEqual([
        "Foreign Object (Active): Recovery ×¼",
      ]);
      expect(sheet.vitalSources("stamina")).toEqual([
        "Septic Shock (Stabilized): Stamina ×½",
      ]);
    });

    it("labels other multipliers numerically", () => {
      const sheet = applyModifiers(base, [
        {
          target: { kind: "stat", key: "SPD" },
          op: "multiply",
          value: 2,
          source: "X",
        },
      ]);
      expect(sheet.statSources("SPD")).toEqual(["X: SPD ×2"]);
    });
  });

  describe("all skills", () => {
    const tornStomach: SheetModifier = {
      target: { kind: "allSkills" },
      op: "add",
      value: -2,
      source: "Torn Stomach (Active)",
    };

    it("lowers every skill and lists the source on each", () => {
      const sheet = applyModifiers(base, [tornStomach]);
      expect(sheet.skillBase("Awareness")).toBe(3);
      expect(sheet.skillBase("Physique")).toBe(8);
      expect(sheet.skillSources("Awareness")).toEqual([
        "Torn Stomach (Active): all actions −2",
      ]);
    });

    it("does not change stats", () => {
      const sheet = applyModifiers(base, [tornStomach]);
      expect(sheet.coreStats).toEqual(base.coreStats);
      expect(sheet.statSources("INT")).toEqual([]);
    });

    it("is added after a skill multiplier", () => {
      const sheet = applyModifiers(base, [
        tornStomach,
        {
          target: { kind: "skill", name: "Dodge/Escape" },
          op: "multiply",
          value: 0.5,
          source: "Compound Leg Fracture (Stabilized)",
        },
      ]);
      // floor((6 + 4) × ½) − 2
      expect(sheet.skillBase("Dodge/Escape")).toBe(3);
    });
  });
});
