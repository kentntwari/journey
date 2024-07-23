import type { MileStoneEntry } from "~/types";

import { prisma } from "~/utils/prisma";
import { generateSlug } from "~/utils/slug";

export async function createMilestone(
  checkpointSlug: string,
  milestone: Omit<MileStoneEntry, "slug">
) {
  try {
    const checkpoint = await prisma.checkpoint.findFirstOrThrow({
      where: { slug: checkpointSlug },
      select: { id: true },
    });

    await prisma.milestone.create({
      data: {
        checkpointId: checkpoint.id,
        status: milestone.status,
        description: milestone.description,
        slug: generateSlug(milestone.description.substring(0, 20)),
        deadline: milestone.deadline,
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}
