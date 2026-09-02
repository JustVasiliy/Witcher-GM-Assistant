import { prisma } from "@/core/db";

export function listCustomNpcsForUser(userId: string) {
  return prisma.customNpc.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}
