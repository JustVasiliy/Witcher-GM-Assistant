"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db";
import { getSessionById } from "@/modules/campaigns";
import { getNoteById } from "@/modules/notes";
import { getEncounterById } from "./queries";
import { AddNpcSchema, AttachNoteSchema, EncounterNameSchema } from "./schemas";
import type { ActionResult } from "./types";

function sessionPath(campaignId: string, sessionId: string) {
  return `/campaigns/${campaignId}/sessions/${sessionId}`;
}

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

export async function addNpcToEncounter(
  encounterId: string,
  campaignId: string,
  sessionId: string,
  source: string,
  creatureId: string,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await getEncounterById(encounterId, session.user.id);
  if (!existing) {
    notFound();
  }

  const validated = AddNpcSchema.safeParse({ source, creatureId });
  if (!validated.success) {
    return { error: "Invalid NPC selection." };
  }

  const existingCount = await prisma.encounterNpc.count({
    where: { encounterId },
  });

  await prisma.encounterNpc.create({
    data: {
      encounterId,
      source: validated.data.source,
      creatureId: validated.data.creatureId,
      sortOrder: existingCount,
    },
  });

  revalidatePath(sessionPath(campaignId, sessionId));
  return undefined;
}

export async function removeNpcFromEncounter(
  encounterNpcId: string,
  campaignId: string,
  sessionId: string,
) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await prisma.encounterNpc.findFirst({
    where: {
      id: encounterNpcId,
      encounter: { session: { campaign: { userId: session.user.id } } },
    },
  });
  if (!existing) {
    notFound();
  }

  await prisma.encounterNpc.delete({ where: { id: encounterNpcId } });

  revalidatePath(sessionPath(campaignId, sessionId));
}

export async function attachNoteToEncounter(
  encounterId: string,
  campaignId: string,
  sessionId: string,
  noteId: string,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await getEncounterById(encounterId, session.user.id);
  if (!existing) {
    notFound();
  }

  const validated = AttachNoteSchema.safeParse({ noteId });
  if (!validated.success) {
    return { error: "Invalid note selection." };
  }

  const note = await getNoteById(validated.data.noteId, session.user.id);
  if (!note) {
    notFound();
  }

  try {
    await prisma.encounterNote.create({
      data: { encounterId, noteId: validated.data.noteId },
    });
  } catch (error) {
    const isUniqueViolation =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002";
    if (!isUniqueViolation) {
      throw error;
    }
  }

  revalidatePath(sessionPath(campaignId, sessionId));
  return undefined;
}

export async function detachNoteFromEncounter(
  encounterNoteId: string,
  campaignId: string,
  sessionId: string,
) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await prisma.encounterNote.findFirst({
    where: {
      id: encounterNoteId,
      encounter: { session: { campaign: { userId: session.user.id } } },
    },
  });
  if (!existing) {
    notFound();
  }

  await prisma.encounterNote.delete({ where: { id: encounterNoteId } });

  revalidatePath(sessionPath(campaignId, sessionId));
}
