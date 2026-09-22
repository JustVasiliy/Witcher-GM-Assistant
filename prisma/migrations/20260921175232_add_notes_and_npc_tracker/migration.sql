-- CreateEnum
CREATE TYPE "NpcSource" AS ENUM ('CORE', 'CUSTOM');

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encounter" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EncounterNpc" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "source" "NpcSource" NOT NULL,
    "creatureId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EncounterNpc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EncounterNote" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,

    CONSTRAINT "EncounterNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Note_userId_idx" ON "Note"("userId");

-- CreateIndex
CREATE INDEX "Encounter_sessionId_idx" ON "Encounter"("sessionId");

-- CreateIndex
CREATE INDEX "EncounterNpc_encounterId_idx" ON "EncounterNpc"("encounterId");

-- CreateIndex
CREATE INDEX "EncounterNote_encounterId_idx" ON "EncounterNote"("encounterId");

-- CreateIndex
CREATE UNIQUE INDEX "EncounterNote_encounterId_noteId_key" ON "EncounterNote"("encounterId", "noteId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CampaignSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncounterNpc" ADD CONSTRAINT "EncounterNpc_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncounterNote" ADD CONSTRAINT "EncounterNote_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncounterNote" ADD CONSTRAINT "EncounterNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
