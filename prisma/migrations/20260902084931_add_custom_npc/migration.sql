-- CreateEnum
CREATE TYPE "CreatureType" AS ENUM ('HUMANOID', 'NECROPHAGE', 'SPECTER', 'BEAST', 'CURSED_ONE', 'HYBRID', 'INSECTOID', 'ELEMENTA', 'RELICT', 'OGROID', 'DRACONID', 'VAMPIRE');

-- CreateTable
CREATE TABLE "CustomNpc" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CreatureType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomNpc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomNpc_userId_idx" ON "CustomNpc"("userId");

-- AddForeignKey
ALTER TABLE "CustomNpc" ADD CONSTRAINT "CustomNpc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
