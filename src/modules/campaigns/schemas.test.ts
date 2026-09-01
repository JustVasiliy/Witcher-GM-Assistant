import { describe, expect, it } from "vitest";
import { CampaignSchema, CampaignSessionSchema } from "./schemas";

describe("CampaignSchema", () => {
  it("accepts a valid campaign with only a name", () => {
    const result = CampaignSchema.safeParse({ name: "The Continent" });
    expect(result.success).toBe(true);
  });

  it("accepts a valid campaign with a description", () => {
    const result = CampaignSchema.safeParse({
      name: "The Continent",
      description: "A grim journey through the Northern Realms.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = CampaignSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a name longer than 100 characters", () => {
    const result = CampaignSchema.safeParse({ name: "a".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from the name", () => {
    const result = CampaignSchema.safeParse({ name: "  The Continent  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("The Continent");
    }
  });

  it("rejects a description longer than 2000 characters", () => {
    const result = CampaignSchema.safeParse({
      name: "The Continent",
      description: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a missing description", () => {
    const result = CampaignSchema.safeParse({
      name: "The Continent",
      description: undefined,
    });
    expect(result.success).toBe(true);
  });
});

describe("CampaignSchema imageUrl and playerCount", () => {
  it("accepts a campaign with a valid image URL", () => {
    const result = CampaignSchema.safeParse({
      name: "The Continent",
      imageUrl: "https://example.com/cover.png",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid image URL", () => {
    const result = CampaignSchema.safeParse({
      name: "The Continent",
      imageUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a missing image URL", () => {
    const result = CampaignSchema.safeParse({ name: "The Continent" });
    expect(result.success).toBe(true);
  });

  it("accepts a valid player count", () => {
    const result = CampaignSchema.safeParse({
      name: "The Continent",
      playerCount: 5,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.playerCount).toBe(5);
    }
  });

  it("rejects a negative player count", () => {
    const result = CampaignSchema.safeParse({
      name: "The Continent",
      playerCount: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a player count over 99", () => {
    const result = CampaignSchema.safeParse({
      name: "The Continent",
      playerCount: 100,
    });
    expect(result.success).toBe(false);
  });

  it("coerces a string player count from form data", () => {
    const result = CampaignSchema.safeParse({
      name: "The Continent",
      playerCount: "5",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.playerCount).toBe(5);
    }
  });

  it("treats an empty image URL as absent", () => {
    const result = CampaignSchema.safeParse({
      name: "The Continent",
      imageUrl: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.imageUrl).toBeUndefined();
    }
  });

  it("treats an empty player count as absent", () => {
    const result = CampaignSchema.safeParse({
      name: "The Continent",
      playerCount: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.playerCount).toBeUndefined();
    }
  });
});

describe("CampaignSessionSchema", () => {
  it("accepts a valid session", () => {
    const result = CampaignSessionSchema.safeParse({
      title: "A Fragile Peace",
      date: "2026-05-12",
      playerCount: 4,
      description: "The group arrives in White Orchard.",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a session with only title and date", () => {
    const result = CampaignSessionSchema.safeParse({
      title: "A Fragile Peace",
      date: "2026-05-12",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = CampaignSessionSchema.safeParse({
      title: "",
      date: "2026-05-12",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a title longer than 150 characters", () => {
    const result = CampaignSessionSchema.safeParse({
      title: "a".repeat(151),
      date: "2026-05-12",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing date", () => {
    const result = CampaignSessionSchema.safeParse({
      title: "A Fragile Peace",
      date: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unparseable date", () => {
    const result = CampaignSessionSchema.safeParse({
      title: "A Fragile Peace",
      date: "not-a-date",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative player count", () => {
    const result = CampaignSessionSchema.safeParse({
      title: "A Fragile Peace",
      date: "2026-05-12",
      playerCount: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a description longer than 2000 characters", () => {
    const result = CampaignSessionSchema.safeParse({
      title: "A Fragile Peace",
      date: "2026-05-12",
      description: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("treats an empty player count as absent", () => {
    const result = CampaignSessionSchema.safeParse({
      title: "A Fragile Peace",
      date: "2026-05-12",
      playerCount: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.playerCount).toBeUndefined();
    }
  });
});
