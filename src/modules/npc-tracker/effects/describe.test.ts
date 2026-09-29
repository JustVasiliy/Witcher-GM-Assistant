import { describe, expect, it } from "vitest";
import { EFFECTS } from "./catalog";
import { describeEffect } from "./describe";

describe("describeEffect", () => {
  it("lists stat changes", () => {
    expect(describeEffect(EFFECTS.FREEZE)).toEqual(["SPD −3", "REF −1"]);
  });

  it("groups known skill sets and marks the side", () => {
    expect(describeEffect(EFFECTS.STAGGERED)).toEqual([
      "Attack skills −2 (when attacking)",
      "Defense skills −2 (when defending)",
      "Ends automatically after 1 round",
    ]);
  });

  it("names Verbal Combat as a group", () => {
    expect(describeEffect(EFFECTS.INTOXICATION)).toEqual([
      "REF −2",
      "DEX −2",
      "INT −2",
      "Verbal Combat −3",
    ]);
  });

  it("adds notes and per-round damage", () => {
    expect(describeEffect(EFFECTS.POISON)).toEqual([
      "Damage per round: 3 HP (ignores armor)",
    ]);
    expect(describeEffect(EFFECTS.STUN)).toEqual(EFFECTS.STUN.modifierNotes);
  });

  it("lists single skills by name", () => {
    expect(describeEffect(EFFECTS.BLINDED)).toEqual([
      "Awareness −5",
      "Attack skills −3 (when attacking)",
      "Defense skills −3 (when defending)",
      "Awareness penalty applies to sight-based checks.",
    ]);
  });
});
