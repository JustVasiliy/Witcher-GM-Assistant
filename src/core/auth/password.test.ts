import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("hashPassword / verifyPassword", () => {
  it("produces a hash that verifies against the original password", async () => {
    const hash = await hashPassword("Correct-Horse1!");
    const result = await verifyPassword("Correct-Horse1!", hash);
    expect(result).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("Correct-Horse1!");
    const result = await verifyPassword("wrong-password", hash);
    expect(result).toBe(false);
  });

  it("produces a different hash each time (random salt)", async () => {
    const first = await hashPassword("Correct-Horse1!");
    const second = await hashPassword("Correct-Horse1!");
    expect(first).not.toBe(second);
  });
});
