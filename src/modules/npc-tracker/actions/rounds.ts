"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/core/db";
import { DEFAULT_ARMOR, parseNpcDetails } from "@/modules/bestiary";
import { computeRoundTick, formatTickLine } from "../effects/tick";
import type { ActionResult } from "../types";
import { requireUserId } from "./require-user-id";
import { sessionPath } from "./session-path";

export type AdvanceRoundResult =
  { error: string } | { round: number; log: string[] };

const ROUND_CONFLICT_MESSAGE =
  "The round was already advanced elsewhere — reload and try again.";

/** Signals a lost race on the encounter's round; caught to roll back the transaction. */
class RoundConflictError extends Error {}

/**
 * Moves the encounter to the next round and applies every NPC's effects
 * (damage over time, fire armor wear, expiry) in one transaction.
 */
export async function advanceRound(
  encounterId: string,
  campaignId: string,
  sessionId: string,
): Promise<AdvanceRoundResult> {
  const userId = await requireUserId();

  let result: { round: number; log: string[] } | null;
  try {
    result = await prisma.$transaction(async (tx) => {
      const encounter = await tx.encounter.findFirst({
        where: { id: encounterId, session: { campaign: { userId } } },
        include: {
          npcs: {
            orderBy: { sortOrder: "asc" },
            include: { effects: { orderBy: { createdAt: "asc" } } },
          },
        },
      });
      if (!encounter) return null;

      const round = encounter.round + 1;

      // Claim the round transition first, before any NPC writes: if another
      // request already advanced this encounter, count is 0 and nothing
      // below ever runs (the throw rolls the whole transaction back).
      const claimed = await tx.encounter.updateMany({
        where: { id: encounterId, round: encounter.round },
        data: { round },
      });
      if (claimed.count === 0) {
        throw new RoundConflictError();
      }

      const log: string[] = [];

      for (const npc of encounter.npcs) {
        if (npc.effects.length === 0) continue;
        const details = parseNpcDetails(npc.details);
        const tick = computeRoundTick({
          currentHp: npc.currentHp,
          armor: details?.armor ?? DEFAULT_ARMOR,
          effects: npc.effects,
        });
        if (tick.logParts.length === 0) continue;

        await tx.encounterNpc.update({
          where: { id: npc.id },
          data: {
            currentHp: tick.hp,
            // Invalid saved details are never rewritten; only HP changes then.
            ...(details &&
              tick.armorChanged && {
                details: { ...details, armor: tick.armor },
              }),
          },
        });
        if (tick.expired.length > 0) {
          await tx.encounterNpcEffect.deleteMany({
            where: { encounterNpcId: npc.id, effectKey: { in: tick.expired } },
          });
        }
        log.push(formatTickLine(round, npc.name, tick.logParts));
      }

      return { round, log };
    });
  } catch (error) {
    if (error instanceof RoundConflictError) {
      return { error: ROUND_CONFLICT_MESSAGE };
    }
    throw error;
  }

  if (!result) {
    return { error: "This encounter no longer exists." };
  }

  revalidatePath(sessionPath(campaignId, sessionId));
  return result;
}

/** Corrects the round number only — effects are not undone. */
export async function decrementRound(
  encounterId: string,
  campaignId: string,
  sessionId: string,
): Promise<ActionResult> {
  const userId = await requireUserId();

  await prisma.encounter.updateMany({
    where: {
      id: encounterId,
      round: { gt: 1 },
      session: { campaign: { userId } },
    },
    data: { round: { decrement: 1 } },
  });

  revalidatePath(sessionPath(campaignId, sessionId));
  return undefined;
}
