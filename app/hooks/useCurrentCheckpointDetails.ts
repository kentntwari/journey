import type { SingleCheckpointFetchedData } from "~/types";

import { useFetchers } from "@remix-run/react";

export function useCurrentCheckpointDetails() {
  const fetchers = useFetchers();

  const res = fetchers
    .map((f) => {
      if (f.key === "get-checkpoint-details" && f.state === "idle")
        return f.data as SingleCheckpointFetchedData;
    })
    .filter(Boolean)[0];

  if (!res) return;

  return res;
}
