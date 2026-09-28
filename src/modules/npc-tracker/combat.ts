export type CombatState = { currentHp: number; currentStamina: number };

function clamp(value: number, max: number): number {
  return Math.min(max, Math.max(0, value));
}

/** Enforces 0 ≤ current ≤ max for an instance's HP and Stamina. */
export function clampCombat(
  combat: CombatState,
  max: { hp: number; stamina: number },
): CombatState {
  return {
    currentHp: clamp(combat.currentHp, max.hp),
    currentStamina: clamp(combat.currentStamina, max.stamina),
  };
}
