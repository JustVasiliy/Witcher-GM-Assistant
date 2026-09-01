import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDate, formatDateOnly, formatRelativeTime } from "./utils";

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-20T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats a date from two days ago", () => {
    const result = formatRelativeTime(new Date("2026-05-18T12:00:00.000Z"));
    expect(result).toBe("2 days ago");
  });

  it("formats a date from one week ago", () => {
    const result = formatRelativeTime(new Date("2026-05-13T12:00:00.000Z"));
    expect(result).toBe("last week");
  });

  it("formats a future date as tomorrow", () => {
    const result = formatRelativeTime(new Date("2026-05-21T12:00:00.000Z"));
    expect(result).toBe("tomorrow");
  });
});

describe("formatDate", () => {
  it("formats a date as a medium-length US date string", () => {
    const result = formatDate(new Date("2026-05-12T00:00:00.000Z"));
    expect(result).toBe("May 12, 2026");
  });
});

describe("formatDateOnly", () => {
  it("formats a date in UTC regardless of the runtime's local timezone", () => {
    const result = formatDateOnly(new Date("2026-05-12T00:00:00.000Z"));
    expect(result).toBe("May 12, 2026");
  });
});
