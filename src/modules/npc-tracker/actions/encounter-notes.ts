"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db";
import { getNoteById } from "@/modules/notes";
import { getEncounterById } from "../queries";
import { AttachNoteSchema } from "../schemas";
import type { ActionResult } from "../types";
import { sessionPath } from "./session-path";

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
