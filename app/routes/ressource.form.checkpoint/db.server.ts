import { z } from "zod";

import { prisma } from "~/utils/prisma";
import * as zodSchema from "~/utils/schemas";

export async function createNewCheckpoint({
  journeyTitle,
  startDate,
  title,
  description,
  milestones,
}: z.infer<typeof zodSchema.checkpointSchema>) {
  try {
    const currentJourney = await prisma.journey.findFirst({
      where: {
        title: journeyTitle,
      },
      select: {
        id: true,
      },
    });

    if (!currentJourney) throw new Error(`No associated journey found`);

    await prisma.checkpoint.create({
      data: {
        journeyId: currentJourney.id,
        startDate,
        title,
        description,
        milestones: {
          create: milestones.map((milestone) => ({
            status: milestone.status,
            description: milestone.description,
            deadline: milestone.deadline,
          })),
        },
      },
    });
    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}
