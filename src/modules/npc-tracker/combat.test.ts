import { describe, expect, it } from "vitest";
import { clampCombat } from "./combat";

describe("clampCombat", () => {
  it("keeps values already within range", () => {
    expect(
      clampCombat(
        { currentHp: 10, currentStamina: 5 },
        { hp: 20, stamina: 10 },
      ),
    ).toEqual({ currentHp: 10, currentStamina: 5 });
  });

  it("floors negative values at 0", () => {
    expect(
      clampCombat(
        { currentHp: -3, currentStamina: -1 },
        { hp: 20, stamina: 10 },
      ),
    ).toEqual({ currentHp: 0, currentStamina: 0 });
  });

  it("caps values at max", () => {
    expect(
      clampCombat(
        { currentHp: 25, currentStamina: 12 },
        { hp: 20, stamina: 10 },
      ),
    ).toEqual({ currentHp: 20, currentStamina: 10 });
  });

  it("pulls current down when max is lowered below it", () => {
    expect(
      clampCombat({ currentHp: 20, currentStamina: 10 }, { hp: 8, stamina: 4 }),
    ).toEqual({ currentHp: 8, currentStamina: 4 });
  });
});
