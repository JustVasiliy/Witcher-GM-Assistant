import { describe, expect, it } from "vitest";
import { NoteSchema } from "./schemas";

describe("NoteSchema", () => {
  it("accepts a valid title and content", () => {
    const result = NoteSchema.safeParse({
      title: "Session 3 hooks",
      content: "Remember to follow up on the bandit camp.",
    });
    expect(result.success).toBe(true);
  });

  it("trims whitespace from title and content", () => {
    const result = NoteSchema.safeParse({
      title: "  Loose ends  ",
      content: "  Talk to the innkeeper.  ",
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      title: "Loose ends",
      content: "Talk to the innkeeper.",
    });
  });

  it("rejects an empty title", () => {
    const result = NoteSchema.safeParse({ title: "", content: "Something" });
    expect(result.success).toBe(false);
  });

  it("rejects empty content", () => {
    const result = NoteSchema.safeParse({ title: "Title", content: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a title over 150 characters", () => {
    const result = NoteSchema.safeParse({
      title: "a".repeat(151),
      content: "Something",
    });
    expect(result.success).toBe(false);
  });

  it("rejects content over 5000 characters", () => {
    const result = NoteSchema.safeParse({
      title: "Title",
      content: "a".repeat(5001),
    });
    expect(result.success).toBe(false);
  });
});
