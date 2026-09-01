-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "playerCount" INTEGER;

-- CreateTable
CREATE TABLE "CampaignSession" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "playerCount" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CampaignSession_campaignId_idx" ON "CampaignSession"("campaignId");

-- AddForeignKey
ALTER TABLE "CampaignSession" ADD CONSTRAINT "CampaignSession_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
