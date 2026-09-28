"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CreatureType, NpcDetails } from "../types";

export type SheetPatch = {
  name?: string;
  details?: Partial<NpcDetails>;
  combat?: { currentHp?: number; currentStamina?: number };
};

export type NpcCombat = { currentHp: number; currentStamina: number };

/**
 * Everything the stat block needs, supplied by whoever renders it: the
 * bestiary page (a template — edits fork/update a custom NPC, no combat)
 * or an encounter (an instance — edits and combat state go to that
 * instance only).
 */
export type NpcSheet = {
  mode: "template" | "instance";
  name: string;
  type: CreatureType;
  details: NpcDetails;
  forksOnSave: boolean;
  save(patch: SheetPatch): Promise<{ error?: string } | undefined>;
  combat?: NpcCombat;
};

const NpcSheetContext = createContext<NpcSheet | null>(null);

export function NpcSheetProvider({
  sheet,
  children,
}: {
  sheet: NpcSheet;
  children: ReactNode;
}) {
  return (
    <NpcSheetContext.Provider value={sheet}>
      {children}
    </NpcSheetContext.Provider>
  );
}

export function useNpcSheet(): NpcSheet {
  const sheet = useContext(NpcSheetContext);
  if (!sheet) {
    throw new Error("useNpcSheet must be used inside an NpcSheetProvider.");
  }
  return sheet;
}

export function useNpcCombat(): NpcCombat {
  const { combat } = useNpcSheet();
  if (!combat) {
    throw new Error("useNpcCombat requires an instance sheet.");
  }
  return combat;
}

export function saveButtonLabel(sheet: NpcSheet): string {
  return sheet.forksOnSave ? "Save as New NPC" : "Save";
}
