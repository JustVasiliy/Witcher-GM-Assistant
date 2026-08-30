import { prisma } from "@/core/db";

export function listCampaignsForUser(userId: string) {
  return prisma.campaign.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function getCampaignById(id: string, userId: string) {
  return prisma.campaign.findFirst({
    where: { id, userId },
  });
}
