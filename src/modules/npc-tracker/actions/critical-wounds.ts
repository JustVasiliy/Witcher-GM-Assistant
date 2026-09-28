"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db";
import { getWoundDefinition } from "../critical-wounds/catalog";
import { SEVERITY_BONUS_DAMAGE } from "../critical-wounds/types";
import {
  AddCriticalWoundSchema,
  SetCriticalWoundStateSchema,
} from "../schemas";
import type { ActionResult } from "../types";
import { sessionPath } from "./session-path";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user.id;
}

function findOwnedWound(woundId: string, userId: string) {
  return prisma.encounterNpcWound.findFirst({
    where: {
      id: woundId,
      encounterNpc: {
        encounter: { session: { campaign: { userId } } },
      },
    },
  });
}

export async function addCriticalWound(
  encounterNpcId: string,
  campaignId: string,
  sessionId: string,
  woundKey: string,
): Promise<ActionResult> {
  const userId = await requireUserId();

  const npc = await prisma.encounterNpc.findFirst({
    where: {
      id: encounterNpcId,
      encounter: { session: { campaign: { userId } } },
    },
  });
  if (!npc) {
    notFound();
  }

  const validated = AddCriticalWoundSchema.safeParse({ woundKey });
  const definition = validated.success
    ? getWoundDefinition(validated.data.woundKey)
    : undefined;
  if (!definition) {
    return { error: "Unknown critical wound." };
  }

  // The wound's bonus damage is dealt in the same transaction, applied as an
  // atomic decrement (not a read-then-write of currentHp) so a concurrent HP
  // write can't be lost, with a floor-at-0 clamp afterwards.
  await prisma.$transaction([
    prisma.encounterNpcWound.create({
      data: { encounterNpcId, woundKey: definition.key },
    }),
    prisma.encounterNpc.update({
      where: { id: encounterNpcId },
      data: {
        currentHp: { decrement: SEVERITY_BONUS_DAMAGE[definition.severity] },
      },
    }),
    prisma.encounterNpc.updateMany({
      where: { id: encounterNpcId, currentHp: { lt: 0 } },
      data: { currentHp: 0 },
    }),
  ]);

  revalidatePath(sessionPath(campaignId, sessionId));
  return undefined;
}

export async function setCriticalWoundState(
  woundId: string,
  campaignId: string,
  sessionId: string,
  state: string,
): Promise<ActionResult> {
  const userId = await requireUserId();

  const wound = await findOwnedWound(woundId, userId);
  if (!wound) {
    return { error: "This wound no longer exists." };
  }

  const validated = SetCriticalWoundStateSchema.safeParse({ state });
  if (!validated.success) {
    return { error: "Invalid wound state." };
  }

  await prisma.encounterNpcWound.update({
    where: { id: woundId },
    data: { state: validated.data.state },
  });

  revalidatePath(sessionPath(campaignId, sessionId));
  return undefined;
}

// Removing a wound does not refund its bonus damage (spec decision).
export async function removeCriticalWound(
  woundId: string,
  campaignId: string,
  sessionId: string,
): Promise<ActionResult> {
  const userId = await requireUserId();

  const wound = await findOwnedWound(woundId, userId);
  if (!wound) {
    return { error: "This wound no longer exists." };
  }

  await prisma.encounterNpcWound.delete({ where: { id: woundId } });

  revalidatePath(sessionPath(campaignId, sessionId));
  return undefined;
}
