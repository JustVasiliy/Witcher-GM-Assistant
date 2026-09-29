import { describe, expect, it } from "vitest";
import { fireBaseForLocation, fireDamage, isBodyLocation } from "./fire";

describe("fireBaseForLocation", () => {
  it("applies the location multiplier to 5 and rounds down", () => {
    expect(fireBaseForLocation("head")).toBe(15);
    expect(fireBaseForLocation("torso")).toBe(5);
    expect(fireBaseForLocation("rightHand")).toBe(2);
    expect(fireBaseForLocation("leftLeg")).toBe(2);
  });
});

describe("fireDamage", () => {
  it("deals full damage with no armor", () => {
    expect(fireDamage("head", 0)).toBe(15);
    expect(fireDamage("torso", 0)).toBe(5);
    expect(fireDamage("leftHand", 0)).toBe(2);
  });

  it("subtracts SP before the multiplier", () => {
    expect(fireDamage("head", 3)).toBe(6);
    expect(fireDamage("torso", 3)).toBe(2);
    expect(fireDamage("rightLeg", 3)).toBe(1);
  });

  it("deals at least 1 when armor does not block it all", () => {
    expect(fireDamage("rightLeg", 4)).toBe(1);
  });

  it("deals 0 when SP is 5 or more", () => {
    expect(fireDamage("head", 5)).toBe(0);
    expect(fireDamage("torso", 12)).toBe(0);
  });
});

describe("isBodyLocation", () => {
  it("accepts armor location keys only", () => {
    expect(isBodyLocation("head")).toBe(true);
    expect(isBodyLocation("tail")).toBe(false);
  });
});
