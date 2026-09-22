import { describe, expect, it } from "vitest";
import { AddNpcSchema, AttachNoteSchema, EncounterNameSchema } from "./schemas";

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
  it("accepts a core source with a creature id", () => {
    const result = AddNpcSchema.safeParse({
      source: "CORE",
      creatureId: "ghoul",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a custom source with a creature id", () => {
    const result = AddNpcSchema.safeParse({
      source: "CUSTOM",
      creatureId: "abc123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid source", () => {
    const result = AddNpcSchema.safeParse({
      source: "WILD",
      creatureId: "ghoul",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty creature id", () => {
    const result = AddNpcSchema.safeParse({ source: "CORE", creatureId: "" });
    expect(result.success).toBe(false);
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
