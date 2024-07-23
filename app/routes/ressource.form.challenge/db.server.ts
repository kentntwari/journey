import type { ChallengeEntry } from "~/types";

import { prisma } from "~/utils/prisma";
import { generateSlug } from "~/utils/slug";

export async function createChallenge(
  checkpointSlug: string,
  challenge: Omit<ChallengeEntry, "id">
) {
  try {
    const checkpoint = await prisma.checkpoint.findFirstOrThrow({
      where: { slug: checkpointSlug },
      select: { id: true },
    });

    await prisma.challenge.create({
      data: {
        checkpointId: checkpoint.id,
        description: challenge.description,
        slug: generateSlug(challenge.description.substring(0, 20)),
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}
