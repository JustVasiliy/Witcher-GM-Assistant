// A client-safe entry point: NpcTabs.tsx (npc-tracker module) is a "use client"
// component that needs NpcStatBlock, but the main index.ts barrel also re-exports
// queries.ts's Prisma-backed functions, which drag `pg` into the browser bundle
// the moment anything imports through that barrel from client code. This file
// re-exports only what's safe for a client bundle to pull in.
export { NpcStatBlock } from "./components/NpcStatBlock";
export { NpcSheetProvider } from "./sheet/NpcSheetContext";
export type { NpcCombat, NpcSheet, SheetPatch } from "./sheet/NpcSheetContext";
export { parseNpcDetails } from "./schemas";
export { buildDefaultNpcDetails } from "./npc-defaults";
export type { Creature } from "./types";
export type { SheetModifier, SheetModifierTarget } from "./sheet/modifiers";
export type { SkillName, StatKey } from "./schemas";
export { ARMOR_LABELS, DEFAULT_ARMOR } from "./armor";
export type { ArmorLocations } from "./schemas";
export { formatAmount } from "./sheet/modifiers";
export { SheetCard } from "./components/npc-detail/SheetCard";
