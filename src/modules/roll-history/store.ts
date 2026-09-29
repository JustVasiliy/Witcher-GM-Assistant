import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { computeCriticalHit, CRITICAL_ELIGIBLE_SKILLS } from "./criticalHits";
import type { NewRollInput, RollEntry, RollHistoryEntry } from "./types";

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
  addEvent: (message: string) => void;
};

export const useRollHistoryStore = create<RollHistoryState>()(
  persist(
    (set, get) => {
      function append(entry: RollHistoryEntry) {
        const { userId } = get();
        if (!userId) {
          return;
        }
        set((state) => ({
          entriesByUser: {
            ...state.entriesByUser,
            [userId]: [entry, ...(state.entriesByUser[userId] ?? [])].slice(
              0,
              MAX_ENTRIES,
            ),
          },
        }));
      }

      return {
        userId: null,
        entriesByUser: {},
        setUser: (userId) => set({ userId }),
        addRoll: (input) => {
          const success =
            input.side === "attacking"
              ? input.total > input.difficulty
              : input.total >= input.difficulty;
          const margin = input.total - input.difficulty;
          const critical =
            input.side === "attacking" &&
            success &&
            (CRITICAL_ELIGIBLE_SKILLS as readonly string[]).includes(
              input.skill,
            )
              ? computeCriticalHit(margin)
              : null;
          append({
            ...input,
            kind: "roll",
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            success,
            critical,
          });
        },
        addEvent: (message) => {
          append({
            kind: "event",
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            message,
          });
        },
      };
    },
    {
      name: "witcher-gm-roll-history",
      version: 2,
      migrate: (persisted, version) => {
        // v1 entries were all rolls, before entries had a `kind`.
        if (version === 1) {
          const { entriesByUser = {} } = persisted as {
            entriesByUser?: Record<string, Omit<RollEntry, "kind">[]>;
          };
          return {
            entriesByUser: Object.fromEntries(
              Object.entries(entriesByUser).map(([userId, entries]) => [
                userId,
                entries.map((entry) => ({ ...entry, kind: "roll" as const })),
              ]),
            ),
          };
        }
        // v0 stored a single unscoped list; it can't be attributed to a user.
        return { entriesByUser: {} };
      },
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
