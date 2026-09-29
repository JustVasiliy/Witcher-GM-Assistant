export type RollSide = "attacking" | "defending";

export type CriticalHit = {
  label: string;
  bonusDamage: number;
};

export type NewRollInput = {
  label: string;
  skill: string;
  side: RollSide;
  total: number;
  difficulty: number;
};

export type RollEntry = NewRollInput & {
  kind: "roll";
  id: string;
  timestamp: number;
  success: boolean;
  critical: CriticalHit | null;
};

/** A plain log line, e.g. what a round advance did to encounter NPCs. */
export type EventEntry = {
  kind: "event";
  id: string;
  timestamp: number;
  message: string;
};

export type RollHistoryEntry = RollEntry | EventEntry;
