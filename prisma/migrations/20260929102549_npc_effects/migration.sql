-- AlterTable
ALTER TABLE "Encounter" ADD COLUMN     "round" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "EncounterNpcEffect" (
    "id" TEXT NOT NULL,
    "encounterNpcId" TEXT NOT NULL,
    "effectKey" TEXT NOT NULL,
    "burningLocations" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EncounterNpcEffect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EncounterNpcEffect_encounterNpcId_idx" ON "EncounterNpcEffect"("encounterNpcId");

-- CreateIndex
CREATE UNIQUE INDEX "EncounterNpcEffect_encounterNpcId_effectKey_key" ON "EncounterNpcEffect"("encounterNpcId", "effectKey");

-- AddForeignKey
ALTER TABLE "EncounterNpcEffect" ADD CONSTRAINT "EncounterNpcEffect_encounterNpcId_fkey" FOREIGN KEY ("encounterNpcId") REFERENCES "EncounterNpc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
