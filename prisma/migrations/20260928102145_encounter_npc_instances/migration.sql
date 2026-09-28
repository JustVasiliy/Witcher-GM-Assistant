-- Encounter NPCs become self-contained instances with NOT NULL snapshot
-- columns. Existing rows are dev data only and are discarded.
DELETE FROM "EncounterNpc";

/*
  Warnings:

  - Added the required column `currentHp` to the `EncounterNpc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentStamina` to the `EncounterNpc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `EncounterNpc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `EncounterNpc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `EncounterNpc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EncounterNpc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EncounterNpc" ADD COLUMN     "currentHp" INTEGER NOT NULL,
ADD COLUMN     "currentStamina" INTEGER NOT NULL,
ADD COLUMN     "details" JSONB NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "type" "CreatureType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
