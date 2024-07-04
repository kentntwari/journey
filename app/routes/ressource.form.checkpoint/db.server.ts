import { z } from "zod";

import { prisma } from "~/utils/prisma";
import * as zodSchema from "~/utils/schemas";

export async function createNewCheckpoint({
  journeyTitle,
  startDate,
  title,
  description,
  milestones,
  challenges,
  failures,
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
        challenges: {
          create: challenges.map((challenge) => ({
            description: challenge.description,
          })),
        },
        failures: {
          create: failures.map((failure) => ({
            description: failure.description,
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

export async function updateStartDate(checkpointId: string, startDate: Date) {
  try {
    const currentCheckpoint = await prisma.checkpoint.findFirstOrThrow({
      where: {
        id: checkpointId,
      },
      select: {
        id: true,
      },
    });

    if (currentCheckpoint)
      await prisma.checkpoint.update({
        where: {
          id: currentCheckpoint.id,
        },
        data: {
          startDate,
        },
      });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}

export async function updateTitle(checkpointId: string, title: string) {
  try {
    const currentCheckpoint = await prisma.checkpoint.findFirstOrThrow({
      where: {
        id: checkpointId,
      },
      select: {
        id: true,
      },
    });

    if (currentCheckpoint)
      await prisma.checkpoint.update({
        where: {
          id: currentCheckpoint.id,
        },
        data: {
          title,
        },
      });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}

export async function updateDescription(
  checkpointId: string,
  description: string
) {
  try {
    const currentCheckpoint = await prisma.checkpoint.findFirstOrThrow({
      where: {
        id: checkpointId,
      },
      select: {
        id: true,
      },
    });

    if (currentCheckpoint)
      await prisma.checkpoint.update({
        where: {
          id: currentCheckpoint.id,
        },
        data: {
          description,
        },
      });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}

export async function deleteCheckpoint(checkpointId: string) {
  try {
    await prisma.checkpoint.delete({
      where: {
        id: checkpointId,
      },
    });
  } catch (error) {
    throw error;
  }
}
