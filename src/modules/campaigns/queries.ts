import { prisma } from "@/core/db";

export function listCampaignsForUser(userId: string) {
  return prisma.campaign.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { sessions: true } } },
  });
}

export function getCampaignById(id: string, userId: string) {
  return prisma.campaign.findFirst({
    where: { id, userId },
    include: {
      sessions: { orderBy: [{ date: "asc" }, { createdAt: "asc" }] },
    },
  });
}

export function getSessionById(
  campaignId: string,
  sessionId: string,
  userId: string,
) {
  return prisma.campaignSession.findFirst({
    where: { id: sessionId, campaignId, campaign: { userId } },
  });
}
