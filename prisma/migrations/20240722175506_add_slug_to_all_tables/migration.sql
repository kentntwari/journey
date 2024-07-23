/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `challenges` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `checkpoints` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `failures` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `journeys` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `milestones` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `challenges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `checkpoints` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `failures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `journeys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `milestones` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "journeys_id_title_idx";

-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "checkpoints" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "failures" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "journeys" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "milestones" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "challenges_slug_key" ON "challenges"("slug");

-- CreateIndex
CREATE INDEX "challenges_id_slug_idx" ON "challenges"("id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "checkpoints_slug_key" ON "checkpoints"("slug");

-- CreateIndex
CREATE INDEX "checkpoints_id_slug_idx" ON "checkpoints"("id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "failures_slug_key" ON "failures"("slug");

-- CreateIndex
CREATE INDEX "failures_id_slug_idx" ON "failures"("id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "journeys_slug_key" ON "journeys"("slug");

-- CreateIndex
CREATE INDEX "journeys_id_slug_idx" ON "journeys"("id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "milestones_slug_key" ON "milestones"("slug");

-- CreateIndex
CREATE INDEX "milestones_id_slug_idx" ON "milestones"("id", "slug");
