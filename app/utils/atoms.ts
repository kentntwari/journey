import type { MileStoneEntry, ChallengeEntry, FailureEntry } from "~/types";

import { atom } from "jotai";

export const isDialogOpenAtom = atom(false);

export const isAddMilestoneAtom = atom(false);
export const isAddChallengeAtom = atom(false);
export const isAddFailureAtom = atom(false);

export const pendingMilestonesAtom = atom<MileStoneEntry[]>([]);
export const pendingChallengesAtom = atom<ChallengeEntry[]>([]);
export const pendingFailuresAtom = atom<FailureEntry[]>([]);
