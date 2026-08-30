"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db";
import { CampaignSchema } from "./schemas";
import type { CampaignFormState } from "./types";

export async function createCampaign(
  _prevState: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const validatedFields = CampaignSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const campaign = await prisma.campaign.create({
    data: {
      ...validatedFields.data,
      description: validatedFields.data.description ?? null,
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

  const validatedFields = CampaignSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await prisma.campaign.updateMany({
    where: { id, userId: session.user.id },
    data: {
      ...validatedFields.data,
      description: validatedFields.data.description ?? null,
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
