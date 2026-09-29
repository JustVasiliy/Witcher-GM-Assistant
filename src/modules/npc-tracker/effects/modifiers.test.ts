import { describe, expect, it } from "vitest";
import { effectsToModifiers } from "./modifiers";

describe("effectsToModifiers", () => {
  it("maps Freeze to SPD −3 and REF −1 labelled Freeze", () => {
    expect(effectsToModifiers([{ effectKey: "FREEZE" }])).toEqual([
      {
        target: { kind: "stat", key: "SPD" },
        op: "add",
        value: -3,
        source: "Freeze",
      },
      {
        target: { kind: "stat", key: "REF" },
        op: "add",
        value: -1,
        source: "Freeze",
      },
    ]);
  });

  it("tags Staggered penalties with the roll side", () => {
    const modifiers = effectsToModifiers([{ effectKey: "STAGGERED" }]);
    const attacking = modifiers.filter((m) => m.side === "attacking");
    const defending = modifiers.filter((m) => m.side === "defending");
    expect(attacking).toHaveLength(7);
    expect(defending).toHaveLength(9);
    expect(modifiers.every((m) => m.value === -2 && m.side)).toBe(true);
  });

  it("gives Blinded an always-on Awareness −5", () => {
    const always = effectsToModifiers([{ effectKey: "BLINDED" }]).filter(
      (m) => !m.side,
    );
    expect(always).toEqual([
      {
        target: { kind: "skill", name: "Awareness" },
        op: "add",
        value: -5,
        source: "Blinded",
      },
    ]);
  });

  it("emits nothing for text-only effects and unknown keys", () => {
    expect(
      effectsToModifiers([
        { effectKey: "POISON" },
        { effectKey: "STUN" },
        { effectKey: "LEVITATION" },
      ]),
    ).toEqual([]);
  });
});
