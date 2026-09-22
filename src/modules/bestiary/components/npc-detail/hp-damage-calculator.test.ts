import { describe, expect, it } from "vitest";
import type { ArmorLocations } from "../../schemas";
import {
  applyPenetration,
  calculateDamage,
  calculateLocationDamage,
} from "./hp-damage-calculator";

describe("calculateLocationDamage", () => {
  it("marks armor as absorbing when damage does not exceed SP", () => {
    const result = calculateLocationDamage(5, 5, false, "torso");
    expect(result).toEqual({
      location: "torso",
      sp: 5,
      armorAbsorbs: true,
      penetrates: false,
      hpDamage: 0,
    });
  });

  it("does not penetrate when damage exactly equals SP", () => {
    const result = calculateLocationDamage(5, 5, false, "torso");
    expect(result.penetrates).toBe(false);
  });

  it("applies the torso ×1 modifier when damage penetrates", () => {
    const result = calculateLocationDamage(10, 5, false, "torso");
    expect(result).toEqual({
      location: "torso",
      sp: 5,
      armorAbsorbs: false,
      penetrates: true,
      hpDamage: 5,
    });
  });

  it("applies the head ×3 modifier", () => {
    const result = calculateLocationDamage(10, 5, false, "head");
    expect(result.hpDamage).toBe(15);
  });

  it("applies the ×0.5 modifier for hands/legs and floors the result", () => {
    const result = calculateLocationDamage(8, 5, false, "rightHand");
    // effective = 3, ×0.5 = 1.5 -> floor -> 1
    expect(result.hpDamage).toBe(1);
  });

  it("halves the result after the modifier when resistance applies, rounding down", () => {
    const result = calculateLocationDamage(10, 5, true, "torso");
    // effective = 5, ×1 = 5, ÷2 = 2.5 -> floor -> 2
    expect(result.hpDamage).toBe(2);
  });

  it("combines head modifier and resistance", () => {
    const result = calculateLocationDamage(10, 5, true, "head");
    // effective = 5, ×3 = 15, ÷2 = 7.5 -> floor -> 7
    expect(result.hpDamage).toBe(7);
  });
});

describe("calculateDamage", () => {
  const armor: ArmorLocations = {
    head: 5,
    torso: 5,
    rightHand: 5,
    leftHand: 5,
    rightLeg: 5,
    leftLeg: 5,
  };

  it("sums hp damage across all selected locations", () => {
    const result = calculateDamage(10, armor, ["torso", "head"], false);
    expect(result.totalHpDamage).toBe(5 + 15);
    expect(result.results).toHaveLength(2);
  });

  it("returns zero total when no locations are selected", () => {
    const result = calculateDamage(10, armor, [], false);
    expect(result.totalHpDamage).toBe(0);
    expect(result.results).toEqual([]);
  });
});

describe("applyPenetration", () => {
  const armor: ArmorLocations = {
    head: 5,
    torso: 5,
    rightHand: 5,
    leftHand: 5,
    rightLeg: 5,
    leftLeg: 5,
  };

  it("decrements SP by 1 only for penetrated locations", () => {
    const { results } = calculateDamage(10, armor, ["torso", "head"], false);
    const next = applyPenetration(armor, results);
    expect(next.torso).toBe(4);
    expect(next.head).toBe(4);
    expect(next.rightHand).toBe(5);
  });

  it("does not decrement SP when armor fully absorbs the hit", () => {
    const { results } = calculateDamage(3, armor, ["torso"], false);
    const next = applyPenetration(armor, results);
    expect(next.torso).toBe(5);
  });

  it("floors SP at 0", () => {
    const zeroArmor: ArmorLocations = { ...armor, torso: 0 };
    const { results } = calculateDamage(1, zeroArmor, ["torso"], false);
    const next = applyPenetration(zeroArmor, results);
    expect(next.torso).toBe(0);
  });
});
