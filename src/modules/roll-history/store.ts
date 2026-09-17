import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { computeCriticalHit, CRITICAL_ELIGIBLE_SKILLS } from "./criticalHits";
import type { NewRollInput, RollHistoryEntry } from "./types";

const MAX_ENTRIES = 50;

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

type RollHistoryState = {
  entries: RollHistoryEntry[];
  addRoll: (input: NewRollInput) => void;
};

export const useRollHistoryStore = create<RollHistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addRoll: (input) => {
        const success =
          input.side === "attacking"
            ? input.total > input.difficulty
            : input.total >= input.difficulty;
        const margin = input.total - input.difficulty;
        const critical =
          input.side === "attacking" &&
          success &&
          (CRITICAL_ELIGIBLE_SKILLS as readonly string[]).includes(input.skill)
            ? computeCriticalHit(margin)
            : null;
        const entry: RollHistoryEntry = {
          ...input,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          success,
          critical,
        };
        set((state) => ({
          entries: [entry, ...state.entries].slice(0, MAX_ENTRIES),
        }));
      },
    }),
    {
      name: "witcher-gm-roll-history",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage,
      ),
    },
  ),
);
