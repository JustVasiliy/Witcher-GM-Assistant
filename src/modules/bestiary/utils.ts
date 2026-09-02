import { CREATURE_TYPES, type Creature, type CreatureType } from "./types";

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
