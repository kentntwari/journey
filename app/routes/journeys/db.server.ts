import { prisma } from "~/utils/prisma";

export async function getUserJourneys(userEmail: string) {
  const data = await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
    select: {
      journeys: {
        select: {
          slug: true,
          title: true,
          checkpoints: {
            select: {
              slug: true,
              title: true,
            },
          },
          updatedAt: true,
        },
      },
    },
  });

  await prisma.$disconnect();

  return data;
}
