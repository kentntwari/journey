-- DropForeignKey
ALTER TABLE "challenges" DROP CONSTRAINT "challenges_checkpointId_fkey";

-- DropForeignKey
ALTER TABLE "checkpoints" DROP CONSTRAINT "checkpoints_journeyId_fkey";

-- DropForeignKey
ALTER TABLE "failures" DROP CONSTRAINT "failures_checkpointId_fkey";

-- DropForeignKey
ALTER TABLE "journeys" DROP CONSTRAINT "journeys_userId_fkey";

-- DropForeignKey
ALTER TABLE "milestones" DROP CONSTRAINT "milestones_checkpointId_fkey";

-- AddForeignKey
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkpoints" ADD CONSTRAINT "checkpoints_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "checkpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "checkpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "failures" ADD CONSTRAINT "failures_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "checkpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
