import { prisma } from "~/utils/prisma";

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

export async function getUserJourneys(user: User) {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!currentUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    await prisma.$disconnect();
    return [];
  }

  const data = await prisma.journey.findMany({
    where: {
      userId: user.id,
    },
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
  });

  await prisma.$disconnect();

  return data;
}
