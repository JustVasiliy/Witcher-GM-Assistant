"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db";
import { CORE_CREATURES } from "./data/core-creatures";
import { buildDefaultNpcDetails, mergeNpcDetails } from "./npc-defaults";
import { getCustomNpcById } from "./queries";
import {
  HeaderSchema,
  NpcDetailsSchema,
  parseNpcDetails,
  type NpcDetailsInput,
} from "./schemas";

const GENERIC_VALIDATION_ERROR =
  "Invalid data — please check the fields and try again.";

export async function deleteCustomNpc(id: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  await prisma.customNpc.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/bestiary");
  redirect("/bestiary");
}

export async function updateCustomNpcDetails(
  id: string,
  patch: Partial<NpcDetailsInput>,
): Promise<{ error?: string } | undefined> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await getCustomNpcById(id, session.user.id);
  if (!existing) {
    notFound();
  }

  let currentDetails: NpcDetailsInput;
  if (existing.details === null) {
    currentDetails = buildDefaultNpcDetails();
  } else {
    const parsed = parseNpcDetails(existing.details);
    if (!parsed) {
      return {
        error: "This NPC's saved data is invalid and can't be updated.",
      };
    }
    currentDetails = parsed;
  }
  const merged = mergeNpcDetails(currentDetails, patch);
  const validated = NpcDetailsSchema.safeParse(merged);

  if (!validated.success) {
    return { error: GENERIC_VALIDATION_ERROR };
  }

  await prisma.customNpc.updateMany({
    where: { id, userId: session.user.id },
    data: { details: validated.data },
  });

  revalidatePath(`/bestiary/${id}`);
  revalidatePath("/bestiary");
  return undefined;
}

export async function createCustomNpc() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const created = await prisma.customNpc.create({
    data: {
      userId: session.user.id,
      name: "New NPC",
      type: "HUMANOID",
      details: buildDefaultNpcDetails(),
    },
  });

  revalidatePath("/bestiary");
  redirect(`/bestiary/${created.id}`);
}

export async function forkCoreCreature(
  coreId: string,
  patch: Partial<NpcDetailsInput>,
  nameOverride?: string,
): Promise<{ error?: string } | undefined> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const coreCreature = CORE_CREATURES.find(
    (creature) => creature.id === coreId,
  );
  if (!coreCreature) {
    notFound();
  }

  const merged = mergeNpcDetails(buildDefaultNpcDetails(), patch);
  const validated = NpcDetailsSchema.safeParse(merged);

  if (!validated.success) {
    return { error: GENERIC_VALIDATION_ERROR };
  }

  const created = await prisma.customNpc.create({
    data: {
      userId: session.user.id,
      name: nameOverride ?? coreCreature.name,
      type: coreCreature.type,
      details: validated.data,
    },
  });

  revalidatePath("/bestiary");
  redirect(`/bestiary/${created.id}`);
}

export async function updateCustomNpcName(
  id: string,
  name: string,
): Promise<{ error?: string } | undefined> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const validated = HeaderSchema.shape.name.safeParse(name);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Invalid name." };
  }

  const result = await prisma.customNpc.updateMany({
    where: { id, userId: session.user.id },
    data: { name: validated.data },
  });

  if (result.count === 0) {
    notFound();
  }

  revalidatePath(`/bestiary/${id}`);
  revalidatePath("/bestiary");
  return undefined;
}
