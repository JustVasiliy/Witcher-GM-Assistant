import { describe, expect, it } from "vitest";
import { applyWoundListAction } from "./wound-list";
import type { CriticalWound } from "./types";

const wounds: CriticalWound[] = [
  { id: "a", woundKey: "complex.broken-ribs", state: "ACTIVE" },
  { id: "b", woundKey: "complex.fractured-leg", state: "ACTIVE" },
];

describe("applyWoundListAction", () => {
  it("changes the state of one wound", () => {
    expect(
      applyWoundListAction(wounds, {
        type: "setState",
        id: "b",
        state: "TREATED",
      }),
    ).toEqual([wounds[0], { ...wounds[1], state: "TREATED" }]);
  });

  it("removes one wound", () => {
    expect(applyWoundListAction(wounds, { type: "remove", id: "a" })).toEqual([
      wounds[1],
    ]);
  });

  it("does not mutate the input", () => {
    applyWoundListAction(wounds, {
      type: "setState",
      id: "a",
      state: "TREATED",
    });
    expect(wounds[0].state).toBe("ACTIVE");
  });
});
