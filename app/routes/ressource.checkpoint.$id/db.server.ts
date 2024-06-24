import { prisma } from "~/utils/prisma";

export async function getDetails(id: string) {
  try {
    const checkpoint = await prisma.checkpoint.findFirstOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        milestones: {
          select: {
            id: true,
            status: true,
            deadline: true,
            description: true,
          },
        },
        challenges: {
          select: {
            id: true,
            description: true,
          },
        },
        failures: {
          select: {
            id: true,
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
