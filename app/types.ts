import { z } from "zod";

import { getDetails as getCheckpointDetails } from "~/routes/ressource.checkpoint.$id/db.server";

import {
  checkpointTitleSchema,
  checkpointDescriptionSchema,
  checkpointStartDateSchema,
  deleteCheckpointSchema,
  checkpointSchema,
  milestoneSchema,
  challengeSchema,
  failureSchema,
  newJourneyschema,
} from "./utils/schemas";

export type TitleEntry = z.infer<typeof checkpointTitleSchema>;
export type DescriptionEntry = z.infer<typeof checkpointDescriptionSchema>;
export type StartDateEntry = z.infer<typeof checkpointStartDateSchema>;
export type MileStoneEntry = z.infer<typeof milestoneSchema>;
export type ChallengeEntry = z.infer<typeof challengeSchema>;
export type FailureEntry = z.infer<typeof failureSchema>;
export type CheckpointEntry = z.infer<typeof checkpointSchema>;
export type JourneyEntry = z.infer<typeof newJourneyschema>;
export type DeleteCheckpointEntry = z.infer<typeof deleteCheckpointSchema>;

export type SingleCheckpointFetchedData = {
  results: Awaited<ReturnType<typeof getCheckpointDetails>> | null;
  error: boolean | undefined;
};
