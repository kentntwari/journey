/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `journeys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `journeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "journeys" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "journeys_title_key" ON "journeys"("title");
