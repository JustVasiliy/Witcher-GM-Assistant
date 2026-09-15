import { CREATURE_TYPES, type Creature, type CreatureType } from "./types";
import {
  SKILL_TO_STAT,
  type CoreStats,
  type SkillName,
  type SkillValues,
} from "./schemas";

export function filterCreatures(
  creatures: Creature[],
  { query, types }: { query: string; types: Set<CreatureType> },
): Creature[] {
  const normalizedQuery = query.trim().toLowerCase();

  return creatures
    .filter(
      (creature) =>
        !normalizedQuery ||
        creature.name.toLowerCase().includes(normalizedQuery),
    )
    .filter((creature) => types.size === 0 || types.has(creature.type))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function countByType(
  creatures: Creature[],
): Record<CreatureType, number> {
  const counts = Object.fromEntries(
    CREATURE_TYPES.map((type) => [type, 0]),
  ) as Record<CreatureType, number>;

  for (const creature of creatures) {
    counts[creature.type] += 1;
  }

  return counts;
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function pageCount(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

/** Run = SPD × 3. */
export function computeRun(spd: number): number {
  return spd * 3;
}

/** Leap = floor(Run / 5). */
export function computeLeap(spd: number): number {
  return Math.floor(computeRun(spd) / 5);
}

/** Encumbrance = BODY × 10. */
export function computeEncumbrance(body: number): number {
  return body * 10;
}

/** Base = stat + skill, for a given skill (untrained skills default to 0). */
export function computeSkillBase(
  coreStats: CoreStats,
  skills: SkillValues,
  skill: SkillName,
): number {
  const stat = SKILL_TO_STAT[skill];
  return coreStats[stat] + (skills[skill] ?? 0);
}
