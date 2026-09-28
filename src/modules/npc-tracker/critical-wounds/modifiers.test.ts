import { describe, expect, it } from "vitest";
import { woundsToModifiers } from "./modifiers";

describe("woundsToModifiers", () => {
  it("emits the current state's modifiers with a labelled source", () => {
    expect(
      woundsToModifiers([
        { woundKey: "complex.broken-ribs", state: "STABILIZED" },
      ]),
    ).toEqual([
      {
        target: { kind: "stat", key: "BODY" },
        op: "add",
        value: -1,
        source: "Broken Ribs (Stabilized)",
      },
      {
        target: { kind: "stat", key: "REF" },
        op: "add",
        value: -1,
        source: "Broken Ribs (Stabilized)",
      },
    ]);
  });

  it("emits nothing for text-only states", () => {
    expect(
      woundsToModifiers([
        { woundKey: "complex.fractured-arm", state: "ACTIVE" },
      ]),
    ).toEqual([]);
  });

  it("skips unknown wound keys", () => {
    expect(
      woundsToModifiers([{ woundKey: "complex.removed", state: "ACTIVE" }]),
    ).toEqual([]);
  });

  it("concatenates modifiers from several wounds", () => {
    const modifiers = woundsToModifiers([
      { woundKey: "complex.broken-ribs", state: "TREATED" },
      { woundKey: "complex.ruptured-spleen", state: "TREATED" },
    ]);
    expect(modifiers.map((modifier) => modifier.source)).toEqual([
      "Broken Ribs (Treated)",
      "Ruptured Spleen (Treated)",
    ]);
  });
});
