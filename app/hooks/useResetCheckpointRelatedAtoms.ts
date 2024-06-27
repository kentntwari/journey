import { useSetAtom } from "jotai";

import {
  isAddChallengeAtom,
  isAddFailureAtom,
  isAddMilestoneAtom,
  pendingChallengesAtom,
  pendingFailuresAtom,
  pendingMilestonesAtom,
} from "~/utils/atoms";

export function useResetCheckpointRelatedAtoms() {
  const setIsAddChallenge = useSetAtom(isAddChallengeAtom);
  const setIsAddFailure = useSetAtom(isAddFailureAtom);
  const setIsAddMilestone = useSetAtom(isAddMilestoneAtom);
  const setPendingChallenges = useSetAtom(pendingChallengesAtom);
  const setPendingFailures = useSetAtom(pendingFailuresAtom);
  const setPendingMilestones = useSetAtom(pendingMilestonesAtom);

  function resetAtoms() {
    setIsAddMilestone(false);
    setIsAddChallenge(false);
    setIsAddFailure(false);
    setPendingMilestones([]);
    setPendingChallenges([]);
    setPendingFailures([]);
  }

  return { resetAtoms };
}
