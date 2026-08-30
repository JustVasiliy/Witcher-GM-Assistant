import { describe, expect, it } from "vitest";
import { CampaignSchema } from "./schemas";

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
