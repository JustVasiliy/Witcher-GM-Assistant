import type { SheetModifier } from "@/modules/bestiary/client";
import { getEffectDefinition } from "./catalog";
import type { ActiveEffect } from "./types";

/** Turns active effects into sheet modifiers labelled with the effect name. */
export function effectsToModifiers(
  effects: Pick<ActiveEffect, "effectKey">[],
): SheetModifier[] {
  return effects.flatMap((effect) => {
    const definition = getEffectDefinition(effect.effectKey);
    // A key removed from the catalog must not break the sheet.
    if (!definition) return [];
    return definition.modifiers.map((modifier) => ({
      ...modifier,
      source: definition.name,
    }));
  });
}
