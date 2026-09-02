import { describe, expect, it } from "vitest";
import { CORE_CREATURES } from "./core-creatures";
import { CREATURE_TYPES } from "../types";

describe("CORE_CREATURES", () => {
  it("contains at least one creature for every CreatureType", () => {
    const typesPresent = new Set(
      CORE_CREATURES.map((creature) => creature.type),
    );
    for (const type of CREATURE_TYPES) {
      expect(typesPresent.has(type)).toBe(true);
    }
  });

  it("has no duplicate ids", () => {
    const ids = CORE_CREATURES.map((creature) => creature.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no duplicate names", () => {
    const names = CORE_CREATURES.map((creature) => creature.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
