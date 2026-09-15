/*
  Warnings:

  - Added the required column `updatedAt` to the `CustomNpc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomNpc" ADD COLUMN     "details" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
