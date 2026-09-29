import type { ActiveEffect, BodyLocation, EffectKey } from "./types";

export type EffectListAction =
  | { type: "activate"; key: EffectKey }
  | { type: "remove"; key: EffectKey }
  | { type: "setFireLocations"; locations: BodyLocation[] };

/** Reducer for optimistic effect-list updates. */
export function applyEffectListAction(
  effects: ActiveEffect[],
  action: EffectListAction,
): ActiveEffect[] {
  switch (action.type) {
    case "activate":
      return effects.some((effect) => effect.effectKey === action.key)
        ? effects
        : [...effects, { effectKey: action.key, burningLocations: [] }];
    case "remove":
      return effects.filter((effect) => effect.effectKey !== action.key);
    case "setFireLocations": {
      if (action.locations.length === 0) {
        return effects.filter((effect) => effect.effectKey !== "FIRE");
      }
      const fire = {
        effectKey: "FIRE",
        burningLocations: [...action.locations],
      };
      return effects.some((effect) => effect.effectKey === "FIRE")
        ? effects.map((effect) => (effect.effectKey === "FIRE" ? fire : effect))
        : [...effects, fire];
    }
  }
}
