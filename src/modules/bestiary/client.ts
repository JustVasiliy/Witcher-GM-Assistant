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
