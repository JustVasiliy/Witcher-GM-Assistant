import { describe, expect, it } from "vitest";
import { computeRoundTick, formatTickLine } from "./tick";

const NO_ARMOR = {
  head: 0,
  torso: 0,
  rightHand: 0,
  leftHand: 0,
  rightLeg: 0,
  leftLeg: 0,
};

const effect = (effectKey: string, burningLocations: string[] = []) => ({
  effectKey,
  burningLocations,
});

describe("computeRoundTick", () => {
  it("changes nothing without effects", () => {
    expect(
      computeRoundTick({ currentHp: 20, armor: NO_ARMOR, effects: [] }),
    ).toEqual({
      hp: 20,
      armor: NO_ARMOR,
      armorChanged: false,
      expired: [],
      logParts: [],
    });
  });

  it("sums Poison and Bleed damage", () => {
    const result = computeRoundTick({
      currentHp: 20,
      armor: NO_ARMOR,
      effects: [effect("POISON"), effect("BLEED")],
    });
    expect(result.hp).toBe(15);
    expect(result.logParts).toEqual(["Poison −3 HP", "Bleed −2 HP"]);
  });

  it("burns each location using SP from the start of the tick, then wears SP", () => {
    const armor = { ...NO_ARMOR, head: 2, rightLeg: 0 };
    const result = computeRoundTick({
      currentHp: 30,
      armor,
      effects: [effect("FIRE", ["head", "rightLeg"])],
    });
    // head: (5-2)×3 = 9; right leg: 5×0.5 = 2.5 → 2
    expect(result.hp).toBe(19);
    expect(result.armor).toEqual({ ...armor, head: 1 });
    expect(result.armorChanged).toBe(true);
    expect(result.logParts).toEqual([
      "Fire −11 HP (Head 9, Right Leg 2)",
      "Head SP 2→1",
    ]);
  });

  it("wears SP even when it blocks all fire damage", () => {
    const result = computeRoundTick({
      currentHp: 10,
      armor: { ...NO_ARMOR, torso: 6 },
      effects: [effect("FIRE", ["torso"])],
    });
    expect(result.hp).toBe(10);
    expect(result.armor.torso).toBe(5);
    expect(result.logParts).toEqual(["Fire −0 HP", "Torso SP 6→5"]);
  });

  it("does not wear SP below 0 and ignores unknown locations", () => {
    const result = computeRoundTick({
      currentHp: 10,
      armor: NO_ARMOR,
      effects: [effect("FIRE", ["torso", "tail"])],
    });
    expect(result.armorChanged).toBe(false);
    expect(result.hp).toBe(5);
  });

  it("floors HP at 0", () => {
    const result = computeRoundTick({
      currentHp: 2,
      armor: NO_ARMOR,
      effects: [effect("SUFFOCATION")],
    });
    expect(result.hp).toBe(0);
  });

  it("expires Staggered", () => {
    const result = computeRoundTick({
      currentHp: 10,
      armor: NO_ARMOR,
      effects: [effect("STAGGERED"), effect("FREEZE")],
    });
    expect(result.expired).toEqual(["STAGGERED"]);
    expect(result.logParts).toEqual(["Staggered ended"]);
  });

  it("ignores unknown effect keys", () => {
    const result = computeRoundTick({
      currentHp: 10,
      armor: NO_ARMOR,
      effects: [effect("LEVITATION")],
    });
    expect(result.logParts).toEqual([]);
  });
});

describe("formatTickLine", () => {
  it("joins the parts under the round and NPC name", () => {
    expect(
      formatTickLine(4, "Alghoul 2", ["Poison −3 HP", "Staggered ended"]),
    ).toBe("Round 4 — Alghoul 2: Poison −3 HP, Staggered ended");
  });
});
