"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db";
import { CampaignSchema, CampaignSessionSchema } from "./schemas";
import { getCampaignById, getSessionById } from "./queries";
import type { CampaignFormState, SessionFormState } from "./types";

function parseCampaignFormData(formData: FormData) {
  return CampaignSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    playerCount: formData.get("playerCount") || undefined,
  });
}

function parseSessionFormData(formData: FormData) {
  return CampaignSessionSchema.safeParse({
    title: formData.get("title"),
    date: formData.get("date"),
    playerCount: formData.get("playerCount") || undefined,
    description: formData.get("description") || undefined,
  });
}

export async function createCampaign(
  _prevState: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const validatedFields = parseCampaignFormData(formData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const campaign = await prisma.campaign.create({
    data: {
      name: validatedFields.data.name,
      description: validatedFields.data.description ?? null,
      imageUrl: validatedFields.data.imageUrl ?? null,
      playerCount: validatedFields.data.playerCount ?? null,
      userId: session.user.id,
    },
  });

  revalidatePath("/campaigns");
  revalidatePath("/dashboard");
  redirect(`/campaigns/${campaign.id}`);
}

export async function updateCampaign(
  id: string,
  _prevState: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const validatedFields = parseCampaignFormData(formData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await prisma.campaign.updateMany({
    where: { id, userId: session.user.id },
    data: {
      name: validatedFields.data.name,
      description: validatedFields.data.description ?? null,
      imageUrl: validatedFields.data.imageUrl ?? null,
      playerCount: validatedFields.data.playerCount ?? null,
    },
  });

  if (result.count === 0) {
    return { message: "Campaign not found." };
  }

  revalidatePath("/campaigns");
  revalidatePath("/dashboard");
  redirect(`/campaigns/${id}`);
}

export async function deleteCampaign(id: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  await prisma.campaign.deleteMany({ where: { id, userId: session.user.id } });

  revalidatePath("/campaigns");
  revalidatePath("/dashboard");
  redirect("/campaigns");
}

export async function createSession(
  campaignId: string,
  _prevState: SessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const campaign = await getCampaignById(campaignId, session.user.id);
  if (!campaign) {
    notFound();
  }

  const validatedFields = parseSessionFormData(formData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  await prisma.campaignSession.create({
    data: {
      title: validatedFields.data.title,
      date: new Date(validatedFields.data.date),
      playerCount: validatedFields.data.playerCount ?? null,
      description: validatedFields.data.description ?? null,
      campaignId,
    },
  });

  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}

export async function updateSession(
  campaignId: string,
  sessionId: string,
  _prevState: SessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await getSessionById(campaignId, sessionId, session.user.id);
  if (!existing) {
    notFound();
  }

  const validatedFields = parseSessionFormData(formData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  await prisma.campaignSession.update({
    where: { id: sessionId },
    data: {
      title: validatedFields.data.title,
      date: new Date(validatedFields.data.date),
      playerCount: validatedFields.data.playerCount ?? null,
      description: validatedFields.data.description ?? null,
    },
  });

  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}

export async function deleteSession(campaignId: string, sessionId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await getSessionById(campaignId, sessionId, session.user.id);
  if (!existing) {
    notFound();
  }

  await prisma.campaignSession.deleteMany({
    where: { id: sessionId, campaignId },
  });

  revalidatePath(`/campaigns/${campaignId}`);
}
