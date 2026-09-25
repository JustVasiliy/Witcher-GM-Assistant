import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { computeCriticalHit, CRITICAL_ELIGIBLE_SKILLS } from "./criticalHits";
import type { NewRollInput, RollHistoryEntry } from "./types";

const MAX_ENTRIES = 50;

const EMPTY_ENTRIES: RollHistoryEntry[] = [];

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

type RollHistoryState = {
  userId: string | null;
  entriesByUser: Record<string, RollHistoryEntry[]>;
  setUser: (userId: string) => void;
  addRoll: (input: NewRollInput) => void;
};

export const useRollHistoryStore = create<RollHistoryState>()(
  persist(
    (set, get) => ({
      userId: null,
      entriesByUser: {},
      setUser: (userId) => set({ userId }),
      addRoll: (input) => {
        const { userId } = get();
        if (!userId) {
          return;
        }
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
          entriesByUser: {
            ...state.entriesByUser,
            [userId]: [entry, ...(state.entriesByUser[userId] ?? [])].slice(
              0,
              MAX_ENTRIES,
            ),
          },
        }));
      },
    }),
    {
      name: "witcher-gm-roll-history",
      version: 1,
      // v0 stored a single unscoped list; it can't be attributed to a user.
      migrate: () => ({ entriesByUser: {} }),
      partialize: (state) => ({ entriesByUser: state.entriesByUser }),
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage,
      ),
    },
  ),
);

export function selectUserEntries(userId: string) {
  return (state: RollHistoryState) =>
    state.entriesByUser[userId] ?? EMPTY_ENTRIES;
}
