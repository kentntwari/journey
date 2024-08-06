import { prisma } from "~/utils/prisma";
import { generateSlug } from "~/utils/slug";

export async function createUserJourney(userId: string, title: string) {
  await prisma.user.update({
    where: {
      id: userId,
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
