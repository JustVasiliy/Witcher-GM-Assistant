import { prisma } from "@/core/db";

export function listEncountersForSession(sessionId: string, userId: string) {
  return prisma.encounter.findMany({
    where: { sessionId, session: { campaign: { userId } } },
    orderBy: { sortOrder: "asc" },
    include: {
      npcs: { orderBy: { sortOrder: "asc" } },
      notes: { include: { note: true }, orderBy: { note: { title: "asc" } } },
    },
  });
}

export function getEncounterById(encounterId: string, userId: string) {
  return prisma.encounter.findFirst({
    where: { id: encounterId, session: { campaign: { userId } } },
  });
}
