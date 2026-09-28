"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db";
import {
  buildDefaultNpcDetails,
  CORE_CREATURES,
  getCustomNpcById,
  NpcDetailsSchema,
  parseNpcDetails,
  type CreatureType,
  type NpcDetails,
} from "@/modules/bestiary";
import { clampCombat } from "../combat";
import { nextInstanceNames } from "../instance-names";
import { getEncounterById } from "../queries";
import {
  AddNpcSchema,
  UpdateEncounterNpcSchema,
  type AddNpcInput,
  type UpdateEncounterNpcInput,
} from "../schemas";
import type { ActionResult } from "../types";
import { sessionPath } from "./session-path";

type NpcTemplate = { name: string; type: CreatureType; details: NpcDetails };

async function resolveTemplate(
  source: AddNpcInput["source"],
  creatureId: string,
  userId: string,
): Promise<NpcTemplate | null> {
  if (source === "CORE") {
    const core = CORE_CREATURES.find((creature) => creature.id === creatureId);
    if (!core) return null;
    return {
      name: core.name,
      type: core.type,
      details: core.details ?? buildDefaultNpcDetails(),
    };
  }

  const custom = await getCustomNpcById(creatureId, userId);
  if (!custom) return null;
  return {
    name: custom.name,
    type: custom.type,
    details: parseNpcDetails(custom.details) ?? buildDefaultNpcDetails(),
  };
}

export async function addNpcToEncounter(
  encounterId: string,
  campaignId: string,
  sessionId: string,
  source: string,
  creatureId: string,
  quantity: number,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await getEncounterById(encounterId, session.user.id);
  if (!existing) {
    notFound();
  }

  const validated = AddNpcSchema.safeParse({ source, creatureId, quantity });
  if (!validated.success) {
    return {
      error: validated.error.issues[0]?.message ?? "Invalid NPC selection.",
    };
  }

  const template = await resolveTemplate(
    validated.data.source,
    validated.data.creatureId,
    session.user.id,
  );
  if (!template) {
    return { error: "Invalid NPC selection." };
  }

  const siblings = await prisma.encounterNpc.findMany({
    where: {
      encounterId,
      source: validated.data.source,
      creatureId: validated.data.creatureId,
    },
    select: { id: true, name: true },
  });
  const { newNames, renameBareTo } = nextInstanceNames(
    template.name,
    siblings.map((sibling) => sibling.name),
    validated.data.quantity,
  );
  const bareSibling = renameBareTo
    ? siblings.find((sibling) => sibling.name === template.name)
    : undefined;

  const existingCount = await prisma.encounterNpc.count({
    where: { encounterId },
  });

  await prisma.$transaction([
    ...(bareSibling && renameBareTo
      ? [
          prisma.encounterNpc.update({
            where: { id: bareSibling.id },
            data: { name: renameBareTo },
          }),
        ]
      : []),
    prisma.encounterNpc.createMany({
      data: newNames.map((name, index) => ({
        encounterId,
        source: validated.data.source,
        creatureId: validated.data.creatureId,
        name,
        type: template.type,
        details: template.details,
        currentHp: template.details.vitalStats.hp,
        currentStamina: template.details.vitalStats.stamina,
        sortOrder: existingCount + index,
      })),
    }),
  ]);

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

const GENERIC_VALIDATION_ERROR =
  "Invalid data — please check the fields and try again.";

export async function updateEncounterNpc(
  encounterNpcId: string,
  campaignId: string,
  sessionId: string,
  patch: UpdateEncounterNpcInput,
): Promise<ActionResult> {
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

  const validated = UpdateEncounterNpcSchema.safeParse(patch);
  if (!validated.success) {
    return {
      error: validated.error.issues[0]?.message ?? GENERIC_VALIDATION_ERROR,
    };
  }

  const currentDetails = parseNpcDetails(existing.details);
  if (!currentDetails) {
    return {
      error: "This NPC's saved data is invalid and can't be updated.",
    };
  }
  const mergedDetails = NpcDetailsSchema.safeParse({
    ...currentDetails,
    ...validated.data.details,
  });
  if (!mergedDetails.success) {
    return { error: GENERIC_VALIDATION_ERROR };
  }

  const combat = clampCombat(
    {
      currentHp: validated.data.combat?.currentHp ?? existing.currentHp,
      currentStamina:
        validated.data.combat?.currentStamina ?? existing.currentStamina,
    },
    {
      hp: mergedDetails.data.vitalStats.hp,
      stamina: mergedDetails.data.vitalStats.stamina,
    },
  );

  await prisma.encounterNpc.update({
    where: { id: encounterNpcId },
    data: {
      ...(validated.data.name !== undefined && { name: validated.data.name }),
      details: mergedDetails.data,
      currentHp: combat.currentHp,
      currentStamina: combat.currentStamina,
    },
  });

  revalidatePath(sessionPath(campaignId, sessionId));
  return undefined;
}
