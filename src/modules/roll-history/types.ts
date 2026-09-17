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

export type RollHistoryEntry = NewRollInput & {
  id: string;
  timestamp: number;
  success: boolean;
  critical: CriticalHit | null;
};
