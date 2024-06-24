import { prisma } from "~/utils/prisma";

export async function getJourneyCheckpoints(journeyTitle: string) {
  try {
    const currentJourneyID = await prisma.journey.findFirst({
      where: {
        title: journeyTitle,
      },
      select: {
        id: true,
      },
    });

    if (!currentJourneyID) {
      throw new Error(`No journey found`);
    }

    const data = await prisma.checkpoint.findMany({
      where: {
        journeyId: currentJourneyID?.id,
      },
      select: {
        id: true,
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

    return data;
  } catch (error) {
    throw error;
  }
}
