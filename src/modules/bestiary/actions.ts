"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db";

export async function deleteCustomNpc(id: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  await prisma.customNpc.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/bestiary");
}
