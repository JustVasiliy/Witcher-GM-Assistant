import { BODY_LOCATIONS, type BodyLocation } from "./types";

export const FIRE_BASE_DAMAGE = 5;

export const LOCATION_MULTIPLIER: Record<BodyLocation, number> = {
  head: 3,
  torso: 1,
  rightHand: 0.5,
  leftHand: 0.5,
  rightLeg: 0.5,
  leftLeg: 0.5,
};

export function isBodyLocation(value: string): value is BodyLocation {
  return (BODY_LOCATIONS as readonly string[]).includes(value);
}

/** Fire damage to a location before armor. */
export function fireBaseForLocation(location: BodyLocation): number {
  return Math.floor(FIRE_BASE_DAMAGE * LOCATION_MULTIPLIER[location]);
}

/**
 * HP damage fire deals to one location per round. SP is subtracted before
 * the location multiplier; if any damage gets through it is at least 1.
 */
export function fireDamage(location: BodyLocation, sp: number): number {
  const remainder = FIRE_BASE_DAMAGE - sp;
  if (remainder <= 0) return 0;
  return Math.max(1, Math.floor(remainder * LOCATION_MULTIPLIER[location]));
}
