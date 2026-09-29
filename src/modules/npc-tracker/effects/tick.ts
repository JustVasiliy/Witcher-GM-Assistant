import { ARMOR_LABELS, type ArmorLocations } from "@/modules/bestiary/client";
import { getEffectDefinition } from "./catalog";
import { fireDamage, isBodyLocation } from "./fire";
import type { ActiveEffect, EffectKey } from "./types";

export type TickInput = {
  currentHp: number;
  armor: ArmorLocations;
  effects: ActiveEffect[];
};

export type TickResult = {
  hp: number;
  armor: ArmorLocations;
  armorChanged: boolean;
  expired: EffectKey[];
  logParts: string[];
};

/** What one round advance does to one NPC. Pure; the caller persists it. */
export function computeRoundTick({
  currentHp,
  armor,
  effects,
}: TickInput): TickResult {
  let hpLoss = 0;
  let armorChanged = false;
  const nextArmor = { ...armor };
  const expired: EffectKey[] = [];
  const logParts: string[] = [];

  for (const effect of effects) {
    const definition = getEffectDefinition(effect.effectKey);
    if (!definition) continue;

    if (definition.tick === "fire") {
      const burning = effect.burningLocations.filter(isBodyLocation);
      // Damage uses SP from the start of the tick; wear is applied after.
      const hits = burning.map((location) => ({
        location,
        damage: fireDamage(location, armor[location]),
      }));
      const total = hits.reduce((sum, hit) => sum + hit.damage, 0);
      hpLoss += total;
      const detail = hits
        .filter((hit) => hit.damage > 0)
        .map((hit) => `${ARMOR_LABELS[hit.location]} ${hit.damage}`)
        .join(", ");
      logParts.push(
        detail ? `Fire −${total} HP (${detail})` : `Fire −${total} HP`,
      );
      for (const location of burning) {
        if (armor[location] > 0) {
          nextArmor[location] = armor[location] - 1;
          armorChanged = true;
          logParts.push(
            `${ARMOR_LABELS[location]} SP ${armor[location]}→${nextArmor[location]}`,
          );
        }
      }
    } else if (definition.tick) {
      hpLoss += definition.tick.hpLoss;
      logParts.push(`${definition.name} −${definition.tick.hpLoss} HP`);
    }

    if (definition.expiresOnTick) {
      expired.push(definition.key);
      logParts.push(`${definition.name} ended`);
    }
  }

  return {
    hp: Math.max(0, currentHp - hpLoss),
    armor: nextArmor,
    armorChanged,
    expired,
    logParts,
  };
}

export function formatTickLine(
  round: number,
  name: string,
  parts: string[],
): string {
  return `Round ${round} — ${name}: ${parts.join(", ")}`;
}
