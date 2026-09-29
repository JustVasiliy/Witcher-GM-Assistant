import type { RollEntry } from "./types";

export function formatRollMessage(entry: RollEntry): string {
  const outcome = entry.success ? "Success" : "Failure";
  const critical = entry.critical
    ? ` (${entry.critical.label}, +${entry.critical.bonusDamage} Bonus damage)`
    : "";
  return `${entry.label}: ${entry.total} vs ${entry.difficulty} (${entry.side}) → ${outcome}${critical}`;
}
