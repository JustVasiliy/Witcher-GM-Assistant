-- CreateEnum
CREATE TYPE "WoundState" AS ENUM ('ACTIVE', 'STABILIZED', 'TREATED');

-- CreateTable
CREATE TABLE "EncounterNpcWound" (
    "id" TEXT NOT NULL,
    "encounterNpcId" TEXT NOT NULL,
    "woundKey" TEXT NOT NULL,
    "state" "WoundState" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EncounterNpcWound_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EncounterNpcWound_encounterNpcId_idx" ON "EncounterNpcWound"("encounterNpcId");

-- AddForeignKey
ALTER TABLE "EncounterNpcWound" ADD CONSTRAINT "EncounterNpcWound_encounterNpcId_fkey" FOREIGN KEY ("encounterNpcId") REFERENCES "EncounterNpc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
