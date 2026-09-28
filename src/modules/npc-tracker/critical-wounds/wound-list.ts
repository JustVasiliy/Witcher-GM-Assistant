import type { CriticalWound, WoundState } from "./types";

export type WoundListAction =
  | { type: "setState"; id: string; state: WoundState }
  | { type: "remove"; id: string };

/** Reducer for optimistic wound-list updates. */
export function applyWoundListAction<T extends CriticalWound>(
  wounds: T[],
  action: WoundListAction,
): T[] {
  if (action.type === "remove") {
    return wounds.filter((wound) => wound.id !== action.id);
  }
  return wounds.map((wound) =>
    wound.id === action.id ? { ...wound, state: action.state } : wound,
  );
}
