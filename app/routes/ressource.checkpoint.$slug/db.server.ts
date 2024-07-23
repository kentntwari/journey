import { prisma } from "~/utils/prisma";

export async function getDetails(checkpointSlug: string) {
  try {
    const checkpoint = await prisma.checkpoint.findFirstOrThrow({
      where: {
        slug: checkpointSlug,
      },
      select: {
        title: true,
        slug: true,
        description: true,
        startDate: true,
        milestones: {
          select: {
            slug: true,
            status: true,
            deadline: true,
            description: true,
          },
        },
        challenges: {
          select: {
            slug: true,
            description: true,
          },
        },
        failures: {
          select: {
            slug: true,
            description: true,
          },
        },
      },
    });

    await prisma.$disconnect();
    return checkpoint;
  } catch (error) {
    throw error;
  }
}
