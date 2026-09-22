import type { ArmorLocations } from "../../schemas";

// Head is a called-shot location (×3); hands/legs are harder to land a
// solid hit on (×0.5); torso is the baseline (×1).
export const LOCATION_DAMAGE_MODIFIERS: Record<keyof ArmorLocations, number> = {
  head: 3,
  torso: 1,
  rightHand: 0.5,
  leftHand: 0.5,
  rightLeg: 0.5,
  leftLeg: 0.5,
};

export type LocationDamageResult = {
  location: keyof ArmorLocations;
  sp: number;
  armorAbsorbs: boolean;
  penetrates: boolean;
  hpDamage: number;
};

export type DamageCalculation = {
  results: LocationDamageResult[];
  totalHpDamage: number;
};

export function calculateLocationDamage(
  damage: number,
  sp: number,
  hasResistance: boolean,
  location: keyof ArmorLocations,
): LocationDamageResult {
  const penetrates = damage > sp;
  const effective = Math.max(0, damage - sp);
  const raw = effective * LOCATION_DAMAGE_MODIFIERS[location];
  const hpDamage = Math.floor(hasResistance ? raw / 2 : raw);

  return {
    location,
    sp,
    armorAbsorbs: effective === 0,
    penetrates,
    hpDamage,
  };
}

export function calculateDamage(
  damage: number,
  armor: ArmorLocations,
  selectedLocations: (keyof ArmorLocations)[],
  hasResistance: boolean,
): DamageCalculation {
  const results = selectedLocations.map((location) =>
    calculateLocationDamage(damage, armor[location], hasResistance, location),
  );
  const totalHpDamage = results.reduce((sum, r) => sum + r.hpDamage, 0);

  return { results, totalHpDamage };
}

export function applyPenetration(
  armor: ArmorLocations,
  results: LocationDamageResult[],
): ArmorLocations {
  const next = { ...armor };
  for (const result of results) {
    if (result.penetrates) {
      next[result.location] = Math.max(0, next[result.location] - 1);
    }
  }
  return next;
}
