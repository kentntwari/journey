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
    const { id, status, description, deadline } = extractCKData(
      formData,
      "milestone"
    ) as MileStoneEntry;

    setPendingMilestones((prev) => [
      ...prev,
      { id, status, description, deadline },
    ]);
    setIsAddMilestone(false);
  }

  return { set };
}
