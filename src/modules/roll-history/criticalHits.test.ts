import { describe, expect, it } from "vitest";
import { computeCriticalHit } from "./criticalHits";

describe("computeCriticalHit", () => {
  it("returns null below the Simple threshold", () => {
    expect(computeCriticalHit(6)).toBeNull();
  });

  it("returns Simple Critical Wound at margin 7", () => {
    expect(computeCriticalHit(7)).toEqual({
      label: "Simple Critical Wound",
      bonusDamage: 3,
    });
  });

  it("stays Simple just below the Complex threshold", () => {
    expect(computeCriticalHit(9)).toEqual({
      label: "Simple Critical Wound",
      bonusDamage: 3,
    });
  });

  it("returns Complex Critical Wound at margin 10", () => {
    expect(computeCriticalHit(10)).toEqual({
      label: "Complex Critical Wound",
      bonusDamage: 5,
    });
  });

  it("returns Difficult Critical Wound at margin 13", () => {
    expect(computeCriticalHit(13)).toEqual({
      label: "Difficult Critical Wound",
      bonusDamage: 8,
    });
  });

  it("returns Deadly Critical Wound at margin 15", () => {
    expect(computeCriticalHit(15)).toEqual({
      label: "Deadly Critical Wound",
      bonusDamage: 10,
    });
  });

  it("stays Deadly for a much larger margin", () => {
    expect(computeCriticalHit(25)).toEqual({
      label: "Deadly Critical Wound",
      bonusDamage: 10,
    });
  });
});
