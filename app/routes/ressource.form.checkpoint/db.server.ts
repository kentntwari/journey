import { z } from "zod";

import { prisma } from "~/utils/prisma";
import { generateSlug } from "~/utils/slug";
import * as zodSchema from "~/utils/schemas";

export async function createNewCheckpoint({
  journeySlug,
  startDate,
  title,
  description,
  milestones,
  challenges,
  failures,
}: z.infer<typeof zodSchema.newCheckpointSchema>) {
  try {
    const currentJourney = await prisma.journey.findFirst({
      where: {
        slug: journeySlug,
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
        slug: generateSlug(title),
        description,
        milestones: {
          create: milestones.map((milestone) => ({
            status: milestone.status,
            description: milestone.description,
            slug: generateSlug(milestone.description.substring(0, 20)),

            deadline: milestone.deadline,
          })),
        },
        challenges: {
          create: challenges.map((challenge) => ({
            description: challenge.description,
            slug: generateSlug(challenge.description.substring(0, 20)),
          })),
        },
        failures: {
          create: failures.map((failure) => ({
            description: failure.description,
            slug: generateSlug(failure.description.substring(0, 20)),
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

export async function updateStartDate(checkpointSlug: string, startDate: Date) {
  try {
    const currentCheckpoint = await prisma.checkpoint.findFirstOrThrow({
      where: {
        slug: checkpointSlug,
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

export async function updateTitle(checkpointSlug: string, title: string) {
  try {
    const currentCheckpoint = await prisma.checkpoint.findFirstOrThrow({
      where: {
        slug: checkpointSlug,
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
  checkpointSlug: string,
  description: string
) {
  try {
    const currentCheckpoint = await prisma.checkpoint.findFirstOrThrow({
      where: {
        slug: checkpointSlug,
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

export async function deleteCheckpoint(checkpointSlug: string) {
  try {
    await prisma.checkpoint.delete({
      where: {
        slug: checkpointSlug,
      },
    });
  } catch (error) {
    throw error;
  }
}
