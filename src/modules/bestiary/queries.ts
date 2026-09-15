import { prisma } from "@/core/db";

export function getCustomNpcById(id: string, userId: string) {
  return prisma.customNpc.findFirst({ where: { id, userId } });
}

export function listCustomNpcsForUser(userId: string) {
  return prisma.customNpc.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}
