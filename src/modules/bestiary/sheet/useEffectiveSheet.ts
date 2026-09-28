"use client";

import { useMemo } from "react";
import { applyModifiers, type EffectiveSheet } from "./modifiers";
import { useNpcSheet } from "./NpcSheetContext";

const NO_MODIFIERS: never[] = [];

/** Sheet values with the sheet's modifiers applied — for view mode only. */
export function useEffectiveSheet(): EffectiveSheet {
  const { details, modifiers = NO_MODIFIERS } = useNpcSheet();
  return useMemo(
    () => applyModifiers(details, modifiers),
    [details, modifiers],
  );
}
