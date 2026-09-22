import { describe, expect, it } from "vitest";
import { applyStaminaDelta, parseStaminaDelta } from "./stamina-change";

describe("parseStaminaDelta", () => {
  it("parses a negative integer", () => {
    expect(parseStaminaDelta("-1")).toBe(-1);
  });

  it("parses a positive integer with an explicit plus sign", () => {
    expect(parseStaminaDelta("+2")).toBe(2);
  });

  it("parses a positive integer without a sign", () => {
    expect(parseStaminaDelta("5")).toBe(5);
  });

  it("returns null for an empty string", () => {
    expect(parseStaminaDelta("")).toBeNull();
  });

  it("returns null for a non-integer", () => {
    expect(parseStaminaDelta("1.5")).toBeNull();
  });

  it("returns null for non-numeric text", () => {
    expect(parseStaminaDelta("abc")).toBeNull();
  });
});

describe("applyStaminaDelta", () => {
  it("adds a positive delta", () => {
    expect(applyStaminaDelta(10, 2)).toBe(12);
  });

  it("subtracts a negative delta", () => {
    expect(applyStaminaDelta(10, -3)).toBe(7);
  });

  it("clamps the result at 0", () => {
    expect(applyStaminaDelta(2, -5)).toBe(0);
  });

  it("has no upper cap", () => {
    expect(applyStaminaDelta(100, 50)).toBe(150);
  });
});
