import { formatAmount, type SkillName } from "@/modules/bestiary/client";
import type { RollSide } from "@/modules/roll-history";
import {
  ATTACK_SKILLS,
  DEFENSE_SKILLS,
  VERBAL_COMBAT_SKILLS,
} from "../sheet-modifier-helpers";
import type { EffectDefinition } from "./types";

const NAMED_GROUPS: [string, readonly SkillName[]][] = [
  ["Attack skills", ATTACK_SKILLS],
  ["Defense skills", DEFENSE_SKILLS],
  ["Verbal Combat", VERBAL_COMBAT_SKILLS],
];

function groupLabel(names: SkillName[]): string {
  const match = NAMED_GROUPS.find(
    ([, group]) =>
      group.length === names.length &&
      group.every((name) => names.includes(name)),
  );
  return match ? match[0] : names.join(", ");
}

/** Human-readable lines for the effect card's Modifiers section. */
export function describeEffect(definition: EffectDefinition): string[] {
  const lines: string[] = [];
  const skillGroups = new Map<
    string,
    { names: SkillName[]; value: number; side?: RollSide }
  >();

  for (const modifier of definition.modifiers) {
    const { target } = modifier;
    if (target.kind === "stat") {
      lines.push(`${target.key} ${formatAmount(modifier.value)}`);
    } else if (target.kind === "skill") {
      const groupKey = `${modifier.side ?? ""}|${modifier.value}`;
      const group = skillGroups.get(groupKey) ?? {
        names: [],
        value: modifier.value,
        side: modifier.side,
      };
      group.names.push(target.name);
      skillGroups.set(groupKey, group);
    }
  }

  for (const { names, value, side } of skillGroups.values()) {
    const when = side ? ` (when ${side})` : "";
    lines.push(`${groupLabel(names)} ${formatAmount(value)}${when}`);
  }

  lines.push(...(definition.modifierNotes ?? []));

  if (definition.tick === "fire") {
    lines.push(
      "Damage per round: 5 per burning location, reduced by SP, then ×3 head / ×1 torso / ×½ limbs (min 1)",
    );
  } else if (definition.tick) {
    const armor = definition.tick.ignoresArmor ? " (ignores armor)" : "";
    lines.push(`Damage per round: ${definition.tick.hpLoss} HP${armor}`);
  }

  if (definition.expiresOnTick) {
    lines.push("Ends automatically after 1 round");
  }

  return lines;
}
