import type { ChallengeEntry } from "~/types";

import { useSetAtom } from "jotai";

import { extractCKData } from "~/utils/conform";
import { pendingFailuresAtom, isAddFailureAtom } from "~/utils/atoms";

export function useCKFailures() {
  const setPendingFailures = useSetAtom(pendingFailuresAtom);
  const setIsAddFailure = useSetAtom(isAddFailureAtom);

  function set(formData: FormData) {
    const { id, description } = extractCKData(
      formData,
      "failure"
    ) as ChallengeEntry;

    setPendingFailures((prev) => [...prev, { id, description }]);
    setIsAddFailure(false);
  }

  return { set };
}
