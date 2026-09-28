import { describe, expect, it } from "vitest";
import {
  AddCriticalWoundSchema,
  AddNpcSchema,
  AttachNoteSchema,
  EncounterNameSchema,
  NpcInstanceNameSchema,
  SetCriticalWoundStateSchema,
  UpdateEncounterNpcSchema,
} from "./schemas";

describe("EncounterNameSchema", () => {
  it("accepts a trimmed name", () => {
    const result = EncounterNameSchema.safeParse("  Ambush  ");
    expect(result.success).toBe(true);
    expect(result.data).toBe("Ambush");
  });

  it("rejects an empty name", () => {
    expect(EncounterNameSchema.safeParse("   ").success).toBe(false);
  });

  it("rejects a name over 100 characters", () => {
    expect(EncounterNameSchema.safeParse("a".repeat(101)).success).toBe(false);
  });
});

describe("AddNpcSchema", () => {
  it("accepts a core source with a creature id and quantity", () => {
    const result = AddNpcSchema.safeParse({
      source: "CORE",
      creatureId: "ghoul",
      quantity: 1,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a custom source with a creature id and quantity", () => {
    const result = AddNpcSchema.safeParse({
      source: "CUSTOM",
      creatureId: "abc123",
      quantity: 5,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid source", () => {
    const result = AddNpcSchema.safeParse({
      source: "WILD",
      creatureId: "ghoul",
      quantity: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty creature id", () => {
    const result = AddNpcSchema.safeParse({
      source: "CORE",
      creatureId: "",
      quantity: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a quantity of 0", () => {
    const result = AddNpcSchema.safeParse({
      source: "CORE",
      creatureId: "ghoul",
      quantity: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a quantity over 20", () => {
    const result = AddNpcSchema.safeParse({
      source: "CORE",
      creatureId: "ghoul",
      quantity: 21,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a fractional quantity", () => {
    const result = AddNpcSchema.safeParse({
      source: "CORE",
      creatureId: "ghoul",
      quantity: 1.5,
    });
    expect(result.success).toBe(false);
  });
});

describe("NpcInstanceNameSchema", () => {
  it("trims the name", () => {
    expect(NpcInstanceNameSchema.parse("  Bandit 2  ")).toBe("Bandit 2");
  });

  it("rejects an empty name", () => {
    expect(NpcInstanceNameSchema.safeParse("  ").success).toBe(false);
  });

  it("rejects a name over 100 characters", () => {
    expect(NpcInstanceNameSchema.safeParse("a".repeat(101)).success).toBe(
      false,
    );
  });
});

describe("UpdateEncounterNpcSchema", () => {
  it("accepts an empty patch", () => {
    expect(UpdateEncounterNpcSchema.safeParse({}).success).toBe(true);
  });

  it("accepts a combat-only patch", () => {
    const result = UpdateEncounterNpcSchema.safeParse({
      combat: { currentHp: 4 },
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ combat: { currentHp: 4 } });
  });

  it("passes details through untouched for server-side merge", () => {
    const result = UpdateEncounterNpcSchema.safeParse({
      details: { armor: { head: 1 } },
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ details: { armor: { head: 1 } } });
  });

  it("rejects negative combat values", () => {
    expect(
      UpdateEncounterNpcSchema.safeParse({ combat: { currentStamina: -1 } })
        .success,
    ).toBe(false);
  });

  it("rejects fractional combat values", () => {
    expect(
      UpdateEncounterNpcSchema.safeParse({ combat: { currentHp: 1.5 } })
        .success,
    ).toBe(false);
  });

  it("rejects an empty name", () => {
    expect(UpdateEncounterNpcSchema.safeParse({ name: " " }).success).toBe(
      false,
    );
  });
});

describe("AttachNoteSchema", () => {
  it("accepts a note id", () => {
    expect(AttachNoteSchema.safeParse({ noteId: "abc123" }).success).toBe(true);
  });

  it("rejects an empty note id", () => {
    expect(AttachNoteSchema.safeParse({ noteId: "" }).success).toBe(false);
  });
});

describe("AddCriticalWoundSchema", () => {
  it("accepts a catalog key", () => {
    expect(
      AddCriticalWoundSchema.safeParse({ woundKey: "complex.broken-ribs" })
        .success,
    ).toBe(true);
  });

  it("rejects an unknown key", () => {
    const result = AddCriticalWoundSchema.safeParse({
      woundKey: "complex.nope",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Unknown critical wound.");
  });
});

describe("SetCriticalWoundStateSchema", () => {
  it("accepts a valid state", () => {
    expect(
      SetCriticalWoundStateSchema.safeParse({ state: "STABILIZED" }).success,
    ).toBe(true);
  });

  it("rejects an invalid state", () => {
    expect(
      SetCriticalWoundStateSchema.safeParse({ state: "HEALED" }).success,
    ).toBe(false);
  });
});
