import type { ChallengeEntry } from "~/types";

import { prisma } from "~/utils/prisma";

export async function createChallenge(
  checkpointId: string,
  challenge: Omit<ChallengeEntry, "id">
) {
  try {
    const checkpoint = await prisma.checkpoint.findFirstOrThrow({
      where: { id: checkpointId },
      select: { id: true },
    });

    await prisma.challenge.create({
      data: {
        checkpointId: checkpoint.id,
        description: challenge.description,
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}
