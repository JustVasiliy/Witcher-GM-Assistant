import { prisma } from "@/core/db";

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
