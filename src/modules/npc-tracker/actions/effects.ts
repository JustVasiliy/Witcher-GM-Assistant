"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/core/db";
import { SetFireLocationsSchema, ToggleEffectSchema } from "../schemas";
import type { ActionResult } from "../types";
import { requireUserId } from "./require-user-id";
import { sessionPath } from "./session-path";

const MISSING_NPC = "This NPC is no longer in the encounter.";

function findOwnedNpc(encounterNpcId: string, userId: string) {
  return prisma.encounterNpc.findFirst({
    where: {
      id: encounterNpcId,
      encounter: { session: { campaign: { userId } } },
    },
    select: { id: true },
  });
}

export async function activateEffect(
  encounterNpcId: string,
  campaignId: string,
  sessionId: string,
  effectKey: string,
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!(await findOwnedNpc(encounterNpcId, userId))) {
    return { error: MISSING_NPC };
  }

  const validated = ToggleEffectSchema.safeParse({ effectKey });
  if (!validated.success) {
    return { error: "Unknown effect." };
  }
  if (validated.data.effectKey === "FIRE") {
    return { error: "Use the Fire window to choose burning body parts." };
  }

  // skipDuplicates: activating an already-active effect is a no-op.
  await prisma.encounterNpcEffect.createMany({
    data: [{ encounterNpcId, effectKey: validated.data.effectKey }],
    skipDuplicates: true,
  });

  revalidatePath(sessionPath(campaignId, sessionId));
  return undefined;
}

export async function removeEffect(
  encounterNpcId: string,
  campaignId: string,
  sessionId: string,
  effectKey: string,
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!(await findOwnedNpc(encounterNpcId, userId))) {
    return { error: MISSING_NPC };
  }

  const validated = ToggleEffectSchema.safeParse({ effectKey });
  if (!validated.success) {
    return { error: "Unknown effect." };
  }

  await prisma.encounterNpcEffect.deleteMany({
    where: { encounterNpcId, effectKey: validated.data.effectKey },
  });

  revalidatePath(sessionPath(campaignId, sessionId));
  return undefined;
}

/** Sets exactly which body parts are burning; none removes Fire. */
export async function setFireLocations(
  encounterNpcId: string,
  campaignId: string,
  sessionId: string,
  locations: string[],
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!(await findOwnedNpc(encounterNpcId, userId))) {
    return { error: MISSING_NPC };
  }

  const validated = SetFireLocationsSchema.safeParse({ locations });
  if (!validated.success) {
    return {
      error: validated.error.issues[0]?.message ?? "Invalid body parts.",
    };
  }

  if (validated.data.locations.length === 0) {
    await prisma.encounterNpcEffect.deleteMany({
      where: { encounterNpcId, effectKey: "FIRE" },
    });
  } else {
    await prisma.encounterNpcEffect.upsert({
      where: {
        encounterNpcId_effectKey: { encounterNpcId, effectKey: "FIRE" },
      },
      create: {
        encounterNpcId,
        effectKey: "FIRE",
        burningLocations: validated.data.locations,
      },
      update: { burningLocations: validated.data.locations },
    });
  }

  revalidatePath(sessionPath(campaignId, sessionId));
  return undefined;
}
