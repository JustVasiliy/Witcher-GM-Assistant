import { describe, expect, it } from "vitest";
import { EFFECTS, getEffectDefinition } from "./catalog";
import { EFFECT_KEYS } from "./types";

describe("EFFECTS", () => {
  it("defines every effect key, keyed by itself, in table order", () => {
    expect(Object.keys(EFFECTS)).toEqual([...EFFECT_KEYS]);
    for (const key of EFFECT_KEYS) {
      expect(EFFECTS[key].key).toBe(key);
      expect(EFFECTS[key].description.length).toBeGreaterThan(0);
      expect(EFFECTS[key].removal.length).toBeGreaterThan(0);
    }
  });

  it("ticks damage for Poison, Bleed and Suffocation", () => {
    expect(EFFECTS.POISON.tick).toEqual({ hpLoss: 3, ignoresArmor: true });
    expect(EFFECTS.BLEED.tick).toEqual({ hpLoss: 2 });
    expect(EFFECTS.SUFFOCATION.tick).toEqual({
      hpLoss: 3,
      ignoresArmor: true,
    });
    expect(EFFECTS.FIRE.tick).toBe("fire");
  });

  it("only Staggered expires on its own", () => {
    const expiring = Object.values(EFFECTS).filter((d) => d.expiresOnTick);
    expect(expiring.map((d) => d.key)).toEqual(["STAGGERED"]);
  });
});

describe("getEffectDefinition", () => {
  it("returns undefined for unknown keys", () => {
    expect(getEffectDefinition("LEVITATION")).toBeUndefined();
  });
});
