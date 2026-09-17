import type { NpcDetailsInput } from "./schemas";

/**
 * The all-zero skeleton every CustomNpc.details starts from — via a fork
 * from a core creature, or a future from-scratch "New NPC" flow. Always
 * a complete, schema-valid NpcDetailsInput, so a merge-patch into it (or
 * into anything built from it) can never produce a partially-missing
 * object.
 */
export function buildDefaultNpcDetails(): NpcDetailsInput {
  return {
    coreStats: {
      INT: 0,
      REF: 0,
      DEX: 0,
      BODY: 0,
      SPD: 0,
      EMP: 0,
      CRA: 0,
      WILL: 0,
      LUCK: 0,
    },
    skills: {},
    vitalStats: {
      stun: 0,
      stamina: 0,
      recovery: 0,
      hp: 0,
      vigor: 0,
    },
    attacks: [],
    abilities: [],
    weaknesses: [],
    loot: [],
  };
}

/**
 * Merges a card's edited slice into an existing NpcDetailsInput.
 * Top-level-key granularity only — a patched key (e.g. the whole
 * `attacks` array) fully replaces the existing value; never a deeper
 * partial merge.
 */
export function mergeNpcDetails(
  existing: NpcDetailsInput,
  patch: Partial<NpcDetailsInput>,
): NpcDetailsInput {
  return { ...existing, ...patch };
}
