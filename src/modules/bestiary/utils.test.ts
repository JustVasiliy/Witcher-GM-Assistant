import { describe, expect, it } from "vitest";
import {
  computeEncumbrance,
  computeLeap,
  computeRun,
  computeSkillBase,
  countByType,
  filterCreatures,
  pageCount,
  paginate,
} from "./utils";
import type { Creature } from "./types";
import type { CoreStats, SkillValues } from "./schemas";

const creatures: Creature[] = [
  { id: "alghoul", name: "Alghoul", type: "NECROPHAGE", source: "core" },
  { id: "bandit", name: "Bandit", type: "HUMANOID", source: "core" },
  { id: "custom-1", name: "Broken One", type: "HUMANOID", source: "custom" },
  { id: "striga", name: "Striga", type: "CURSED_ONE", source: "core" },
];

describe("filterCreatures", () => {
  it("returns everything alphabetically when query and types are empty", () => {
    const result = filterCreatures(creatures, { query: "", types: new Set() });
    expect(result.map((c) => c.name)).toEqual([
      "Alghoul",
      "Bandit",
      "Broken One",
      "Striga",
    ]);
  });

  it("matches the search query case-insensitively as a substring", () => {
    const result = filterCreatures(creatures, {
      query: "GHO",
      types: new Set(),
    });
    expect(result.map((c) => c.name)).toEqual(["Alghoul"]);
  });

  it("unions across multiple selected types", () => {
    const result = filterCreatures(creatures, {
      query: "",
      types: new Set(["NECROPHAGE", "CURSED_ONE"]),
    });
    expect(result.map((c) => c.name)).toEqual(["Alghoul", "Striga"]);
  });

  it("combines search and type filtering", () => {
    const result = filterCreatures(creatures, {
      query: "b",
      types: new Set(["HUMANOID"]),
    });
    expect(result.map((c) => c.name)).toEqual(["Bandit", "Broken One"]);
  });
});

describe("countByType", () => {
  it("counts creatures per type, ignoring types with zero matches", () => {
    const result = countByType(creatures);
    expect(result.HUMANOID).toBe(2);
    expect(result.NECROPHAGE).toBe(1);
    expect(result.CURSED_ONE).toBe(1);
    expect(result.VAMPIRE ?? 0).toBe(0);
  });
});

describe("paginate", () => {
  const items = [1, 2, 3, 4, 5, 6, 7];

  it("returns the first page", () => {
    expect(paginate(items, 1, 3)).toEqual([1, 2, 3]);
  });

  it("returns a middle page", () => {
    expect(paginate(items, 2, 3)).toEqual([4, 5, 6]);
  });

  it("returns a partial last page", () => {
    expect(paginate(items, 3, 3)).toEqual([7]);
  });
});

describe("pageCount", () => {
  it("computes the number of pages, rounding up", () => {
    expect(pageCount(7, 3)).toBe(3);
    expect(pageCount(6, 3)).toBe(2);
  });

  it("returns at least 1 for an empty list", () => {
    expect(pageCount(0, 6)).toBe(1);
  });
});

// Real values from a Ghoul stat card: SPD 6 → Run 18 → Leap 3, BODY 6 → Encumbrance 60.
describe("computeRun", () => {
  it("multiplies SPD by 3", () => {
    expect(computeRun(6)).toBe(18);
  });
});

describe("computeLeap", () => {
  it("floors Run divided by 5", () => {
    expect(computeLeap(6)).toBe(3);
  });
});

describe("computeEncumbrance", () => {
  it("multiplies BODY by 10", () => {
    expect(computeEncumbrance(6)).toBe(60);
  });
});

describe("computeSkillBase", () => {
  const ghoulStats: CoreStats = {
    INT: 1,
    REF: 6,
    DEX: 7,
    BODY: 6,
    SPD: 6,
    EMP: 1,
    CRA: 1,
    WILL: 5,
    LUCK: 0,
  };
  const ghoulSkills: SkillValues = {
    Melee: 0,
    Awareness: 6,
    Stealth: -3,
    "Wilderness Survival": 5,
    "Resist Magic": -1,
    Courage: 2,
  };

  it("adds a positive raw skill value to its stat", () => {
    expect(computeSkillBase(ghoulStats, ghoulSkills, "Awareness")).toBe(7);
  });

  it("adds a negative raw skill value to its stat", () => {
    expect(computeSkillBase(ghoulStats, ghoulSkills, "Stealth")).toBe(4);
  });

  it("treats an untrained skill as 0, falling back to the stat alone", () => {
    expect(computeSkillBase(ghoulStats, ghoulSkills, "Archery")).toBe(
      ghoulStats.DEX,
    );
  });
});
