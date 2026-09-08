import { describe, expect, it } from "vitest";
import { buildDefaultNpcDetails, mergeNpcDetails } from "./npc-defaults";
import { NpcDetailsSchema } from "./schemas";

describe("buildDefaultNpcDetails", () => {
  it("produces a skeleton that parses as valid NpcDetails", () => {
    const result = NpcDetailsSchema.safeParse(buildDefaultNpcDetails());
    expect(result.success).toBe(true);
  });

  it("has all-zero stats and vitals, and empty collections", () => {
    const details = buildDefaultNpcDetails();
    expect(details.coreStats).toEqual({
      INT: 0,
      REF: 0,
      DEX: 0,
      BODY: 0,
      SPD: 0,
      EMP: 0,
      CRA: 0,
      WILL: 0,
      LUCK: 0,
    });
    expect(details.vitalStats).toEqual({
      stun: 0,
      stamina: 0,
      recovery: 0,
      hp: 0,
      vigor: 0,
    });
    expect(details.skills).toEqual({});
    expect(details.attacks).toEqual([]);
    expect(details.abilities).toEqual([]);
    expect(details.weaknesses).toEqual([]);
    expect(details.loot).toEqual([]);
    expect(details.armor).toBeUndefined();
    expect(details.threatRating).toBeUndefined();
    expect(details.bounty).toBeUndefined();
    expect(details.flavor).toBeUndefined();
  });
});

describe("mergeNpcDetails", () => {
  it("overwrites only the patched top-level keys", () => {
    const existing = buildDefaultNpcDetails();
    const patch = { coreStats: { ...existing.coreStats, INT: 5 } };
    const merged = mergeNpcDetails(existing, patch);
    expect(merged.coreStats.INT).toBe(5);
    expect(merged.vitalStats).toEqual(existing.vitalStats);
  });

  it("adds a key that wasn't present before (e.g. bounty)", () => {
    const existing = buildDefaultNpcDetails();
    const merged = mergeNpcDetails(existing, { bounty: 30 });
    expect(merged.bounty).toBe(30);
  });

  it("replaces an array wholesale rather than concatenating", () => {
    const existing = mergeNpcDetails(buildDefaultNpcDetails(), {
      weaknesses: ["Fire"],
    });
    const merged = mergeNpcDetails(existing, { weaknesses: ["Silver"] });
    expect(merged.weaknesses).toEqual(["Silver"]);
  });

  it("the merged result still parses as valid NpcDetails", () => {
    const merged = mergeNpcDetails(buildDefaultNpcDetails(), { bounty: 30 });
    expect(NpcDetailsSchema.safeParse(merged).success).toBe(true);
  });
});
