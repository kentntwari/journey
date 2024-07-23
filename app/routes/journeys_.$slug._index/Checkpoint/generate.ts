import { getJourney } from "../db.server";

export function getCurrentPosition(
  slug: string,
  data: Awaited<ReturnType<typeof getJourney>>["checkpoints"]
) {
  return data.findIndex((checkpoint) => checkpoint.slug === slug);
}

export function generateCheckpointId(
  currentCheckpoint: string | undefined,
  data: Awaited<ReturnType<typeof getJourney>>["checkpoints"]
) {
  if (typeof currentCheckpoint === "undefined") return;

  const currentPosition = getCurrentPosition(currentCheckpoint, data);

  switch (true) {
    case currentPosition < data.length:
      return {
        next: data[currentPosition + 1]
          ? data[currentPosition + 1].slug
          : data[0].slug,
        prev:
          currentPosition > 0
            ? data[currentPosition - 1].slug
            : data[data.length - 1].slug,
      };

    default:
      return { next: data[0].slug, prev: data[currentPosition - 1].slug };
  }
}
