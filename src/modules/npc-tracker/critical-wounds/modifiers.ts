import type { SheetModifier } from "@/modules/bestiary/client";
import { getWoundDefinition } from "./catalog";
import { WOUND_STATE_LABELS, type CriticalWound } from "./types";

/** Turns saved wounds into sheet modifiers for their current state. */
export function woundsToModifiers(
  wounds: Pick<CriticalWound, "woundKey" | "state">[],
): SheetModifier[] {
  return wounds.flatMap((wound) => {
    const definition = getWoundDefinition(wound.woundKey);
    // A key removed from the catalog must not break the sheet.
    if (!definition) return [];
    const source = `${definition.name} (${WOUND_STATE_LABELS[wound.state]})`;
    return definition.effects[wound.state].modifiers.map((modifier) => ({
      ...modifier,
      source,
    }));
  });
}
