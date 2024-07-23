import type { ChallengeEntry } from "~/types";

import { useSetAtom } from "jotai";

import { extractCKData } from "~/utils/conform";
import { pendingChallengesAtom, isAddChallengeAtom } from "~/utils/atoms";

export function useCKChallenges() {
  const setPendingChallenges = useSetAtom(pendingChallengesAtom);
  const setIsAddChallenge = useSetAtom(isAddChallengeAtom);

  function set(formData: FormData) {
    const { description } = extractCKData(formData, "challenge");

    setPendingChallenges((prev) => [...prev, { description }]);
    setIsAddChallenge(false);
  }

  return { set };
}
