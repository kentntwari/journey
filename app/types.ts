import { z } from "zod";

import { getDetails as getCheckpointDetails } from "~/routes/ressource.checkpoint.$slug/db.server";

import {
  updateCheckpointTitleSchema,
  updateCheckpointDescriptionSchema,
  updateCheckpointStartDateSchema,
  deleteCheckpointSchema,
  newCheckpointSchema,
  checkpointSchema,
  milestoneSchema,
  challengeSchema,
  failureSchema,
  newJourneyschema,
} from "./utils/schemas";

export type MileStoneEntry = z.infer<typeof milestoneSchema>;
export type ChallengeEntry = z.infer<typeof challengeSchema>;
export type FailureEntry = z.infer<typeof failureSchema>;
export type CheckpointEntry = z.infer<typeof checkpointSchema>;
export type JourneyEntry = z.infer<typeof newJourneyschema>;
export type NewCheckpointEntry = z.infer<typeof newCheckpointSchema>;
export type DeleteCheckpointEntry = z.infer<typeof deleteCheckpointSchema>;
export type UpdateTitleEntry = z.infer<typeof updateCheckpointTitleSchema>;
export type UpdateDescriptionEntry = z.infer<
  typeof updateCheckpointDescriptionSchema
>;
export type UpdateStartDateEntry = z.infer<
  typeof updateCheckpointStartDateSchema
>;

export type SingleCheckpointFetchedData = {
  results: Awaited<ReturnType<typeof getCheckpointDetails>> | null;
  error: boolean | undefined;
};
