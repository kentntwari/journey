import type { MileStoneEntry } from "../../../types";

import { useSetAtom } from "jotai";

import { extractCKData } from "../../../utils/conform";
import {
  pendingMilestonesAtom,
  isAddMilestoneAtom,
} from "../../../utils/atoms";

export function useCKMilestones() {
  const setPendingMilestones = useSetAtom(pendingMilestonesAtom);
  const setIsAddMilestone = useSetAtom(isAddMilestoneAtom);

  function set(formData: FormData) {
    const { status, description, deadline } = extractCKData(
      formData,
      "milestone"
    );

    setPendingMilestones((prev) => [
      ...prev,
      { status, description, deadline },
    ]);
    setIsAddMilestone(false);
  }

  return { set };
}
