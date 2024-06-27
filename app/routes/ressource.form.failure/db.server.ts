import type { FailureEntry } from "~/types";

import { prisma } from "~/utils/prisma";

export async function createFailure(
  checkpointId: string,
  failure: Omit<FailureEntry, "id">
) {
  try {
    const checkpoint = await prisma.checkpoint.findFirstOrThrow({
      where: { id: checkpointId },
      select: { id: true },
    });

    await prisma.failure.create({
      data: {
        checkpointId: checkpoint.id,
        description: failure.description,
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}
