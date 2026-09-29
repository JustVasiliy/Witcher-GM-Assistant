import { describe, expect, it } from "vitest";
import { applyEffectListAction } from "./effect-list";

const effects = [
  { effectKey: "BLEED", burningLocations: [] },
  { effectKey: "FIRE", burningLocations: ["head"] },
];

describe("applyEffectListAction", () => {
  it("activates a new effect", () => {
    expect(
      applyEffectListAction(effects, { type: "activate", key: "POISON" }),
    ).toEqual([...effects, { effectKey: "POISON", burningLocations: [] }]);
  });

  it("does not duplicate an active effect", () => {
    expect(
      applyEffectListAction(effects, { type: "activate", key: "BLEED" }),
    ).toBe(effects);
  });

  it("removes an effect", () => {
    expect(
      applyEffectListAction(effects, { type: "remove", key: "BLEED" }),
    ).toEqual([effects[1]]);
  });

  it("replaces burning locations", () => {
    expect(
      applyEffectListAction(effects, {
        type: "setFireLocations",
        locations: ["head", "torso"],
      }),
    ).toEqual([
      effects[0],
      { effectKey: "FIRE", burningLocations: ["head", "torso"] },
    ]);
  });

  it("starts fire when it was not burning", () => {
    expect(
      applyEffectListAction([effects[0]], {
        type: "setFireLocations",
        locations: ["torso"],
      }),
    ).toEqual([effects[0], { effectKey: "FIRE", burningLocations: ["torso"] }]);
  });

  it("removes fire when no locations remain", () => {
    expect(
      applyEffectListAction(effects, {
        type: "setFireLocations",
        locations: [],
      }),
    ).toEqual([effects[0]]);
  });
});
