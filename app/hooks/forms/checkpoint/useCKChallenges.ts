import type { ChallengeEntry } from "~/types";

import { useSetAtom } from "jotai";

import { extractCKData } from "~/utils/conform";
import { pendingChallengesAtom, isAddChallengeAtom } from "~/utils/atoms";

export function useCKChallenges() {
  const setPendingChallenges = useSetAtom(pendingChallengesAtom);
  const setIsAddChallenge = useSetAtom(isAddChallengeAtom);

  function set(formData: FormData) {
    const { id, description } = extractCKData(
      formData,
      "challenge"
    ) as ChallengeEntry;

    setPendingChallenges((prev) => [...prev, { id, description }]);
    setIsAddChallenge(false);
  }

  return { set };
}
