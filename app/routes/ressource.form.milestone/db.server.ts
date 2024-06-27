import type { MileStoneEntry } from "~/types";

import { prisma } from "~/utils/prisma";

export async function createMilestone(
  checkpointId: string,
  milestone: Omit<MileStoneEntry, "id">
) {
  try {
    const checkpoint = await prisma.checkpoint.findFirstOrThrow({
      where: { id: checkpointId },
      select: { id: true },
    });

    await prisma.milestone.create({
      data: {
        checkpointId: checkpoint.id,
        status: milestone.status,
        description: milestone.description,
        deadline: milestone.deadline,
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}
