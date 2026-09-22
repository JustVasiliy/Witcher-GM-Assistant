export function parseStaminaDelta(input: string): number | null {
  if (!/^[+-]?\d+$/.test(input.trim())) return null;
  return Number(input);
}

export function applyStaminaDelta(current: number, delta: number): number {
  return Math.max(0, current + delta);
}
