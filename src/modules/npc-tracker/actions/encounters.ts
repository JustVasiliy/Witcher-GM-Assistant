"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db";
import { getSessionById } from "@/modules/campaigns";
import { getEncounterById } from "../queries";
import { EncounterNameSchema } from "../schemas";
import type { ActionResult } from "../types";
import { sessionPath } from "./session-path";

export async function createEncounter(campaignId: string, sessionId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const campaignSession = await getSessionById(
    campaignId,
    sessionId,
    session.user.id,
  );
  if (!campaignSession) {
    notFound();
  }

  const existingCount = await prisma.encounter.count({ where: { sessionId } });

  await prisma.encounter.create({
    data: {
      sessionId,
      name: `Encounter ${existingCount + 1}`,
      sortOrder: existingCount,
    },
  });

  revalidatePath(sessionPath(campaignId, sessionId));
}

export async function renameEncounter(
  encounterId: string,
  campaignId: string,
  sessionId: string,
  name: string,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await getEncounterById(encounterId, session.user.id);
  if (!existing) {
    notFound();
  }

  const validated = EncounterNameSchema.safeParse(name);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Invalid name." };
  }

  await prisma.encounter.update({
    where: { id: encounterId },
    data: { name: validated.data },
  });

  revalidatePath(sessionPath(campaignId, sessionId));
  return undefined;
}

export async function deleteEncounter(
  encounterId: string,
  campaignId: string,
  sessionId: string,
) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await getEncounterById(encounterId, session.user.id);
  if (!existing) {
    notFound();
  }

  await prisma.encounter.delete({ where: { id: encounterId } });

  revalidatePath(sessionPath(campaignId, sessionId));
}
