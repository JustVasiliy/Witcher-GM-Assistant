"use client";

import type { ReactNode } from "react";
import {
  forkCoreCreature,
  updateCustomNpcDetails,
  updateCustomNpcName,
} from "../actions";
import { buildDefaultNpcDetails } from "../npc-defaults";
import type { Creature } from "../types";
import {
  NpcSheetProvider,
  type NpcSheet,
  type SheetPatch,
} from "./NpcSheetContext";

async function saveTemplate(
  creature: Creature,
  patch: SheetPatch,
): Promise<{ error?: string } | undefined> {
  // First save on a core creature forks a new CustomNpc (and redirects to it).
  if (creature.source === "core") {
    return forkCoreCreature(creature.id, patch.details ?? {}, patch.name);
  }

  const [nameResult, detailsResult] = await Promise.all([
    patch.name !== undefined
      ? updateCustomNpcName(creature.id, patch.name)
      : undefined,
    patch.details !== undefined
      ? updateCustomNpcDetails(creature.id, patch.details)
      : undefined,
  ]);
  const error = nameResult?.error ?? detailsResult?.error;
  return error ? { error } : undefined;
}

export function TemplateSheetProvider({
  creature,
  children,
}: {
  creature: Creature;
  children: ReactNode;
}) {
  const sheet: NpcSheet = {
    mode: "template",
    name: creature.name,
    type: creature.type,
    details: creature.details ?? buildDefaultNpcDetails(),
    forksOnSave: creature.source === "core",
    save: (patch) => saveTemplate(creature, patch),
  };

  return <NpcSheetProvider sheet={sheet}>{children}</NpcSheetProvider>;
}
