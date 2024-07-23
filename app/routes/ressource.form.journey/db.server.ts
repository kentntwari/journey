import { prisma } from "~/utils/prisma";
import { generateSlug } from "~/utils/slug";

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
            title: title.trim(),
            slug: generateSlug(title),
          },
        },
      },
    });

    await prisma.$disconnect();
    return;
  }

  await prisma.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      journeys: {
        create: {
          title: title.trim(),
          slug: generateSlug(title),
        },
      },
    },
  });

  await prisma.$disconnect();
  return;
}
