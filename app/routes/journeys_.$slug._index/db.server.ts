import { prisma } from "~/utils/prisma";
import { generateSlug } from "~/utils/slug";

export async function getJourney(slug: string) {
  try {
    const currentJourney = await prisma.journey.findFirst({
      where: {
        slug,
      },
      select: {
        id: true,
        title: true,
        isEnded: true,
      },
    });

    if (!currentJourney) {
      throw new Error(`No journey found`);
    }

    const checkpoints = await prisma.checkpoint.findMany({
      where: {
        journeyId: currentJourney.id,
      },
      select: {
        slug: true,
        title: true,
        startDate: true,
        _count: {
          select: {
            milestones: true,
            challenges: true,
            failures: true,
          },
        },
      },
    });

    await prisma.$disconnect();

    return { currentJourney, checkpoints };
  } catch (error) {
    throw error;
  }
}

export async function updateJourneyTitle(
  currentJourneySlug: string,
  newTitle: string
) {
  try {
    await prisma.journey.update({
      where: {
        slug: currentJourneySlug,
      },
      data: {
        title: newTitle,
        slug: generateSlug(newTitle),
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}

export async function deleteJourney(currentJourneySlug: string) {
  try {
    await prisma.journey.delete({
      where: {
        slug: currentJourneySlug,
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}

export async function endJourney(currentJourneySlug: string) {
  try {
    await prisma.journey.update({
      where: {
        slug: currentJourneySlug,
      },
      data: {
        isEnded: true,
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}

export async function resumeJourney(currentJourneySlug: string) {
  try {
    await prisma.journey.update({
      where: {
        slug: currentJourneySlug,
      },
      data: {
        isEnded: false,
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}
