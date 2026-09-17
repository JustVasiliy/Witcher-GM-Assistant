import { describe, expect, it } from "vitest";
import { formatRollMessage } from "./formatRollMessage";
import type { RollHistoryEntry } from "./types";

function buildEntry(overrides: Partial<RollHistoryEntry> = {}): RollHistoryEntry {
  return {
    id: "1",
    timestamp: 0,
    label: "Awareness",
    skill: "Awareness",
    side: "attacking",
    total: 10,
    difficulty: 5,
    success: true,
    critical: null,
    ...overrides,
  };
}

describe("formatRollMessage", () => {
  it("formats a successful roll with no critical hit", () => {
    expect(formatRollMessage(buildEntry())).toBe(
      "Awareness: 10 vs 5 (attacking) → Success",
    );
  });

  it("formats a failed roll", () => {
    expect(formatRollMessage(buildEntry({ success: false, total: 3 }))).toBe(
      "Awareness: 3 vs 5 (attacking) → Failure",
    );
  });

  it("appends the critical hit label and bonus damage in parentheses", () => {
    expect(
      formatRollMessage(
        buildEntry({
          label: "Claw Swipe",
          skill: "Melee",
          total: 22,
          critical: { label: "Deadly Critical Wound", bonusDamage: 10 },
        }),
      ),
    ).toBe(
      "Claw Swipe: 22 vs 5 (attacking) → Success (Deadly Critical Wound, +10 Bonus damage)",
    );
  });

  it("formats a defending roll", () => {
    expect(
      formatRollMessage(buildEntry({ side: "defending", total: 5, difficulty: 5 })),
    ).toBe("Awareness: 5 vs 5 (defending) → Success");
  });
});
