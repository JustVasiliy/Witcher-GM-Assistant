import { beforeEach, describe, expect, it } from "vitest";
import { selectUserEntries, useRollHistoryStore } from "./store";

const USER_ID = "user-1";

function currentEntries() {
  return selectUserEntries(USER_ID)(useRollHistoryStore.getState());
}

beforeEach(() => {
  useRollHistoryStore.setState({ userId: USER_ID, entriesByUser: {} });
});

describe("useRollHistoryStore per-user scoping", () => {
  const roll = {
    label: "Awareness",
    skill: "Awareness",
    side: "attacking",
    total: 10,
    difficulty: 5,
  } as const;

  it("does not show one user's rolls to another user", () => {
    useRollHistoryStore.getState().addRoll(roll);
    useRollHistoryStore.getState().setUser("user-2");

    const state = useRollHistoryStore.getState();
    expect(selectUserEntries("user-2")(state)).toHaveLength(0);
    expect(selectUserEntries(USER_ID)(state)).toHaveLength(1);
  });

  it("records rolls under the current user after switching", () => {
    useRollHistoryStore.getState().setUser("user-2");
    useRollHistoryStore.getState().addRoll(roll);

    const state = useRollHistoryStore.getState();
    expect(selectUserEntries("user-2")(state)).toHaveLength(1);
    expect(selectUserEntries(USER_ID)(state)).toHaveLength(0);
  });

  it("ignores rolls when no user is set", () => {
    useRollHistoryStore.setState({ userId: null });
    useRollHistoryStore.getState().addRoll(roll);
    expect(useRollHistoryStore.getState().entriesByUser).toEqual({});
  });

  it("returns a stable empty list for users with no rolls", () => {
    const state = useRollHistoryStore.getState();
    expect(selectUserEntries("nobody")(state)).toBe(
      selectUserEntries("nobody")(state),
    );
  });
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
    expect(currentEntries()[0]).toMatchObject({ success: true });
  });

  it("fails on attacking when total equals difficulty", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Awareness",
      skill: "Awareness",
      side: "attacking",
      total: 10,
      difficulty: 10,
    });
    expect(currentEntries()[0]).toMatchObject({ success: false });
  });

  it("succeeds on defending when total equals difficulty", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Dodge/Escape",
      skill: "Dodge/Escape",
      side: "defending",
      total: 10,
      difficulty: 10,
    });
    expect(currentEntries()[0]).toMatchObject({ success: true });
  });

  it("fails on defending when total is below difficulty", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Dodge/Escape",
      skill: "Dodge/Escape",
      side: "defending",
      total: 9,
      difficulty: 10,
    });
    expect(currentEntries()[0]).toMatchObject({ success: false });
  });

  it("attaches a critical hit for an eligible attacking skill that clears the margin", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Claw Swipe",
      skill: "Melee",
      side: "attacking",
      total: 22,
      difficulty: 5,
    });
    expect(currentEntries()[0]).toMatchObject({
      critical: { label: "Deadly Critical Wound", bonusDamage: 10 },
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
    expect(currentEntries()[0]).toMatchObject({ critical: null });
  });

  it("does not attach a critical hit when defending, even for an eligible skill", () => {
    useRollHistoryStore.getState().addRoll({
      label: "Melee",
      skill: "Melee",
      side: "defending",
      total: 22,
      difficulty: 5,
    });
    expect(currentEntries()[0]).toMatchObject({ critical: null });
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
    const labels = currentEntries().map((e) =>
      e.kind === "roll" ? e.label : "",
    );
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
    const entries = currentEntries();
    expect(entries).toHaveLength(50);
    const [first, , ...rest] = entries;
    expect(first.kind === "roll" && first.label).toBe("Roll 54");
    const last = rest[rest.length - 1];
    expect(last.kind === "roll" && last.label).toBe("Roll 5");
  });
});

describe("useRollHistoryStore addEvent", () => {
  it("records a plain event entry for the current user", () => {
    useRollHistoryStore.getState().addEvent("Round 2 — Ghoul: Bleed −2 HP");
    expect(currentEntries()[0]).toMatchObject({
      kind: "event",
      message: "Round 2 — Ghoul: Bleed −2 HP",
    });
  });

  it("ignores events when no user is set", () => {
    useRollHistoryStore.setState({ userId: null });
    useRollHistoryStore.getState().addEvent("x");
    expect(useRollHistoryStore.getState().entriesByUser).toEqual({});
  });
});

describe("roll history persistence migration", () => {
  const migrate = useRollHistoryStore.persist.getOptions().migrate!;

  it("tags version 1 entries as rolls", () => {
    const v1 = {
      entriesByUser: {
        u: [
          {
            id: "1",
            timestamp: 0,
            label: "A",
            skill: "Awareness",
            side: "attacking",
            total: 1,
            difficulty: 1,
            success: false,
            critical: null,
          },
        ],
      },
    };
    expect(migrate(v1, 1)).toEqual({
      entriesByUser: { u: [{ ...v1.entriesByUser.u[0], kind: "roll" }] },
    });
  });

  it("resets version 0 state", () => {
    expect(migrate([{ label: "old" }], 0)).toEqual({ entriesByUser: {} });
  });
});
