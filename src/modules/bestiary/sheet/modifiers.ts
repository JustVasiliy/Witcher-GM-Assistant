import type { RollSide } from "@/modules/roll-history";
import {
  SKILL_TO_STAT,
  STAT_KEYS,
  type CoreStats,
  type SkillName,
  type SkillValues,
  type StatKey,
  type VitalStats,
} from "../schemas";
import { computeSkillBase } from "../utils";

export type SheetModifierTarget =
  | { kind: "stat"; key: StatKey }
  | { kind: "skill"; name: SkillName }
  | { kind: "vital"; key: keyof VitalStats }
  | { kind: "allSkills" };

/**
 * A temporary adjustment to a sheet value (e.g. from a critical wound).
 * Supplied by whoever renders the sheet; never saved into `details`.
 * `add` shifts the value by `value`; `multiply` scales it by `value`
 * (e.g. 0.5 to halve). A modifier with `side` applies only to rolls made
 * on that side (see `rollModifiers`) and never to displayed values.
 */
export type SheetModifier = {
  target: SheetModifierTarget;
  op: "add" | "multiply";
  value: number;
  source: string;
  side?: RollSide;
};

export type EffectiveSheet = {
  coreStats: CoreStats;
  vitalStats: VitalStats;
  skillBase: (skill: SkillName) => number;
  statSources: (key: StatKey) => string[];
  skillSources: (skill: SkillName) => string[];
  vitalSources: (key: keyof VitalStats) => string[];
  rollModifiers: (
    skill: SkillName,
    side: RollSide,
  ) => { total: number; sources: string[] };
};

const VITAL_LABELS: Record<keyof VitalStats, string> = {
  stun: "Stun",
  stamina: "Stamina",
  recovery: "Recovery",
  hp: "HP",
  vigor: "Vigor",
};

const MULTIPLIER_LABELS: Record<number, string> = { 0.5: "½", 0.25: "¼" };

export function formatAmount(amount: number): string {
  return amount < 0 ? `−${Math.abs(amount)}` : `+${amount}`;
}

function formatChange({ op, value }: SheetModifier): string {
  return op === "add"
    ? formatAmount(value)
    : `×${MULTIPLIER_LABELS[value] ?? value}`;
}

function targetLabel(target: SheetModifierTarget): string {
  switch (target.kind) {
    case "stat":
      return target.key;
    case "skill":
      return target.name;
    case "vital":
      return VITAL_LABELS[target.key];
    case "allSkills":
      return "all actions";
  }
}

function describeModifier(modifier: SheetModifier): string {
  return `${modifier.source}: ${targetLabel(modifier.target)} ${formatChange(modifier)}`;
}

/** Combined effect of all modifiers on one value. */
type Adjustment = { multiplier: number; flat: number };

const NO_ADJUSTMENT: Adjustment = { multiplier: 1, flat: 0 };

function combine(
  current: Adjustment = NO_ADJUSTMENT,
  { op, value }: SheetModifier,
): Adjustment {
  return op === "multiply"
    ? { ...current, multiplier: current.multiplier * value }
    : { ...current, flat: current.flat + value };
}

/** Multipliers first (rounded down), then flat modifiers. */
function adjust(value: number, { multiplier, flat }: Adjustment): number {
  return Math.floor(value * multiplier) + flat;
}

/**
 * Effective values = floor(base × multipliers) + flat modifiers. A stat
 * modifier also flows into every skill based on that stat; a skill's
 * multipliers scale its full roll value (effective stat + ranks). Values
 * are not clamped.
 */
export function applyModifiers(
  base: { coreStats: CoreStats; skills: SkillValues; vitalStats: VitalStats },
  allModifiers: SheetModifier[],
): EffectiveSheet {
  const modifiers = allModifiers.filter((modifier) => !modifier.side);
  const statAdjustments: Partial<Record<StatKey, Adjustment>> = {};
  const vitalAdjustments: Partial<Record<keyof VitalStats, Adjustment>> = {};
  const skillAdjustments: Partial<Record<SkillName, Adjustment>> = {};
  let everySkill = NO_ADJUSTMENT;

  for (const modifier of modifiers) {
    const { target } = modifier;
    if (target.kind === "stat") {
      statAdjustments[target.key] = combine(
        statAdjustments[target.key],
        modifier,
      );
    } else if (target.kind === "vital") {
      vitalAdjustments[target.key] = combine(
        vitalAdjustments[target.key],
        modifier,
      );
    } else if (target.kind === "skill") {
      skillAdjustments[target.name] = combine(
        skillAdjustments[target.name],
        modifier,
      );
    } else {
      everySkill = combine(everySkill, modifier);
    }
  }

  const coreStats = { ...base.coreStats };
  for (const key of STAT_KEYS) {
    coreStats[key] = adjust(
      base.coreStats[key],
      statAdjustments[key] ?? NO_ADJUSTMENT,
    );
  }

  const vitalStats = { ...base.vitalStats };
  for (const key of Object.keys(vitalStats) as (keyof VitalStats)[]) {
    vitalStats[key] = adjust(
      base.vitalStats[key],
      vitalAdjustments[key] ?? NO_ADJUSTMENT,
    );
  }

  const sourcesWhere = (predicate: (target: SheetModifierTarget) => boolean) =>
    modifiers
      .filter((modifier) => predicate(modifier.target))
      .map(describeModifier);

  return {
    coreStats,
    vitalStats,
    skillBase: (skill) => {
      const own = skillAdjustments[skill] ?? NO_ADJUSTMENT;
      return adjust(computeSkillBase(coreStats, base.skills, skill), {
        multiplier: own.multiplier * everySkill.multiplier,
        flat: own.flat + everySkill.flat,
      });
    },
    statSources: (key) =>
      sourcesWhere((target) => target.kind === "stat" && target.key === key),
    skillSources: (skill) =>
      sourcesWhere(
        (target) =>
          (target.kind === "skill" && target.name === skill) ||
          (target.kind === "stat" && target.key === SKILL_TO_STAT[skill]) ||
          target.kind === "allSkills",
      ),
    vitalSources: (key) =>
      sourcesWhere((target) => target.kind === "vital" && target.key === key),
    rollModifiers: (skill, side) => {
      const matching = allModifiers.filter(
        (modifier) =>
          modifier.side === side &&
          modifier.op === "add" &&
          modifier.target.kind === "skill" &&
          modifier.target.name === skill,
      );
      return {
        total: matching.reduce((sum, modifier) => sum + modifier.value, 0),
        sources: matching.map(describeModifier),
      };
    },
  };
}
