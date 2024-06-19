import { prisma } from "~/utils/prisma";

export async function createUserJourney(
  user: {
    email: string;
    firstName: string;
    lastName: string;
  },
  title: string
) {
  // check if user is registered in db
  const dbUser = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!dbUser) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        journeys: {
          create: {
            title,
          },
        },
      },
    });

    await prisma.$disconnect();
    return;
  }

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      journeys: {
        create: {
          title,
        },
      },
    },
  });

  await prisma.$disconnect();
  return;
}
