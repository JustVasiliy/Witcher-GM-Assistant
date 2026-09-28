import type { WoundDefinition, WoundSeverity } from "../types";
import { COMPLEX_WOUNDS } from "./complex";
import { DEADLY_WOUNDS } from "./deadly";
import { DIFFICULT_WOUNDS } from "./difficult";
import { SIMPLE_WOUNDS } from "./simple";

export const CRITICAL_WOUNDS: WoundDefinition[] = [
  ...SIMPLE_WOUNDS,
  ...COMPLEX_WOUNDS,
  ...DIFFICULT_WOUNDS,
  ...DEADLY_WOUNDS,
];

export function getWoundDefinition(key: string): WoundDefinition | undefined {
  return CRITICAL_WOUNDS.find((wound) => wound.key === key);
}

export function woundsBySeverity(severity: WoundSeverity): WoundDefinition[] {
  return CRITICAL_WOUNDS.filter((wound) => wound.severity === severity);
}
