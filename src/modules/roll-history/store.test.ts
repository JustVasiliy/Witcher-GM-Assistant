import { beforeEach, describe, expect, it } from "vitest";
import { useRollHistoryStore } from "./store";

beforeEach(() => {
  useRollHistoryStore.setState({ entries: [] });
});

describe("useRollHistoryStore addRoll", () => {
  it("succeeds on attacking when total is strictly greater than difficulty", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Awareness",
      skill: "Awareness",
      side: "attacking",
      total: 10,
      difficulty: 9,
    });
    expect(useRollHistoryStore.getState().entries[0].success).toBe(true);
  });

  it("fails on attacking when total equals difficulty", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Awareness",
      skill: "Awareness",
      side: "attacking",
      total: 10,
      difficulty: 10,
    });
    expect(useRollHistoryStore.getState().entries[0].success).toBe(false);
  });

  it("succeeds on defending when total equals difficulty", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Dodge/Escape",
      skill: "Dodge/Escape",
      side: "defending",
      total: 10,
      difficulty: 10,
    });
    expect(useRollHistoryStore.getState().entries[0].success).toBe(true);
  });

  it("fails on defending when total is below difficulty", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Dodge/Escape",
      skill: "Dodge/Escape",
      side: "defending",
      total: 9,
      difficulty: 10,
    });
    expect(useRollHistoryStore.getState().entries[0].success).toBe(false);
  });

  it("attaches a critical hit for an eligible attacking skill that clears the margin", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Claw Swipe",
      skill: "Melee",
      side: "attacking",
      total: 22,
      difficulty: 5,
    });
    expect(useRollHistoryStore.getState().entries[0].critical).toEqual({
      label: "Deadly Critical Wound",
      bonusDamage: 10,
    });
  });

  it("does not attach a critical hit for a non-eligible skill even with a large margin", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Awareness",
      skill: "Awareness",
      side: "attacking",
      total: 22,
      difficulty: 5,
    });
    expect(useRollHistoryStore.getState().entries[0].critical).toBeNull();
  });

  it("does not attach a critical hit when defending, even for an eligible skill", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Melee",
      skill: "Melee",
      side: "defending",
      total: 22,
      difficulty: 5,
    });
    expect(useRollHistoryStore.getState().entries[0].critical).toBeNull();
  });

  it("orders entries newest first", () => {
    useRollHistoryStore.getState().addRoll({
      label: "First",
      skill: "Awareness",
      side: "attacking",
      total: 10,
      difficulty: 5,
    });
    useRollHistoryStore.getState().addRoll({
      label: "Second",
      skill: "Awareness",
      side: "attacking",
      total: 10,
      difficulty: 5,
    });
    const labels = useRollHistoryStore.getState().entries.map((e) => e.label);
    expect(labels).toEqual(["Second", "First"]);
  });

  it("caps history at 50 entries, dropping the oldest", () => {
    for (let i = 0; i < 55; i++) {
      useRollHistoryStore.getState().addRoll({
        label: `Roll ${i}`,
        skill: "Awareness",
        side: "attacking",
        total: 10,
        difficulty: 5,
      });
    }
    const entries = useRollHistoryStore.getState().entries;
    expect(entries).toHaveLength(50);
    expect(entries[0].label).toBe("Roll 54");
    expect(entries[49].label).toBe("Roll 5");
  });
});
