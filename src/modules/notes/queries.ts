import { prisma } from "@/core/db";

export function listNotesForUser(userId: string) {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function getNoteById(id: string, userId: string) {
  return prisma.note.findFirst({ where: { id, userId } });
}
