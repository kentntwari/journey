import { getJourneyCheckpoints } from "./db.server";

export function getCurrentPosition(
  id: string,
  data: Awaited<ReturnType<typeof getJourneyCheckpoints>>
) {
  return data.findIndex((checkpoint) => checkpoint.id === id);
}

export function generateCheckpointId(
  currentCheckpointId: string | undefined,
  data: Awaited<ReturnType<typeof getJourneyCheckpoints>>
) {
  if (typeof currentCheckpointId === "undefined") return;

  const currentPosition = getCurrentPosition(currentCheckpointId, data);

  switch (true) {
    case currentPosition < data.length:
      return {
        next: data[currentPosition + 1]
          ? data[currentPosition + 1].id
          : data[0].id,
        prev:
          currentPosition > 0
            ? data[currentPosition - 1].id
            : data[data.length - 1].id,
      };

    default:
      return { next: data[0].id, prev: data[currentPosition - 1].id };
  }
}
