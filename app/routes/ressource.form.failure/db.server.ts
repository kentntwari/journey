import type { FailureEntry } from "~/types";

import { prisma } from "~/utils/prisma";
import { generateSlug } from "~/utils/slug";

export async function createFailure(
  checkpointSlug: string,
  failure: Omit<FailureEntry, "slug">
) {
  try {
    const checkpoint = await prisma.checkpoint.findFirstOrThrow({
      where: { slug: checkpointSlug },
      select: { id: true },
    });

    await prisma.failure.create({
      data: {
        checkpointId: checkpoint.id,
        description: failure.description,
        slug: generateSlug(failure.description.substring(0, 20)),
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    throw error;
  }
}
