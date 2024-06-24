import type { MileStoneEntry } from "~/types";

import { atom } from "jotai";

export const isDialogOpenAtom = atom(false);

export const isAddMilestoneAtom = atom(false);

export const pendingMilestonesAtom = atom<MileStoneEntry[]>([]);