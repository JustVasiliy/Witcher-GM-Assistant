import type { CreatureType } from "@/generated/prisma/client";

export type { CreatureType };

export type CoreCreature = {
  id: string;
  name: string;
  type: CreatureType;
};

export type Creature =
  | (CoreCreature & { source: "core" })
  | { id: string; name: string; type: CreatureType; source: "custom" };

export const CREATURE_TYPES: CreatureType[] = [
  "HUMANOID",
  "NECROPHAGE",
  "SPECTER",
  "BEAST",
  "CURSED_ONE",
  "HYBRID",
  "INSECTOID",
  "ELEMENTA",
  "RELICT",
  "OGROID",
  "DRACONID",
  "VAMPIRE",
];

export const TYPE_LABELS: Record<CreatureType, string> = {
  HUMANOID: "Humanoid",
  NECROPHAGE: "Necrophage",
  SPECTER: "Specter",
  BEAST: "Beast",
  CURSED_ONE: "Cursed One",
  HYBRID: "Hybrid",
  INSECTOID: "Insectoid",
  ELEMENTA: "Elementa",
  RELICT: "Relict",
  OGROID: "Ogroid",
  DRACONID: "Draconid",
  VAMPIRE: "Vampire",
};

export const TYPE_FILTER_LABELS: Record<CreatureType, string> = {
  HUMANOID: "Humanoids",
  NECROPHAGE: "Necrophages",
  SPECTER: "Specters",
  BEAST: "Beasts",
  CURSED_ONE: "Cursed Ones",
  HYBRID: "Hybrids",
  INSECTOID: "Insectoids",
  ELEMENTA: "Elementa",
  RELICT: "Relicts",
  OGROID: "Ogroids",
  DRACONID: "Draconids",
  VAMPIRE: "Vampires",
};
