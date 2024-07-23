import type { MileStoneEntry, ChallengeEntry, FailureEntry } from "~/types";

import { atom } from "jotai";

export const isDialogOpenAtom = atom(false);
export const isAlertDialogOpenAtom = atom(false);

export const isAddMilestoneAtom = atom(false);
export const isAddChallengeAtom = atom(false);
export const isAddFailureAtom = atom(false);

export const pendingMilestonesAtom = atom<Omit<MileStoneEntry, "slug">[]>([]);
export const pendingChallengesAtom = atom<
  Pick<ChallengeEntry, "description">[]
>([]);
export const pendingFailuresAtom = atom<Pick<FailureEntry, "description">[]>(
  []
);

export const isEditJourneyTitleAtom = atom(false);
export const isEndJourneyAtom = atom(false);

export const isEditCheckpointStartDateAtom = atom(false);
export const isEditCheckpointTitleAtom = atom(false);
export const isEditCheckpointDescriptionAtom = atom(false);
export const isDeleteCheckpointAtom = atom(false);
