import { z } from "zod";

import { getDetails as getCheckpointDetails } from "~/routes/ressource.checkpoint.$id/db.server";

import {
  checkpointSchema,
  milestoneSchema,
  challengeSchema,
  failureSchema,
} from "./utils/schemas";

const SkimmedCheckpointSchema = checkpointSchema.omit({ journeyTitle: true });

export type MileStoneEntry = z.infer<typeof milestoneSchema>;

export type ChallengeEntry = z.infer<typeof challengeSchema>;

export type FailureEntry = z.infer<typeof failureSchema>;

export type Checkpoint = z.infer<typeof SkimmedCheckpointSchema>;

export type SingleCheckpointFetchedData = {
  results: Awaited<ReturnType<typeof getCheckpointDetails>> | null;
  error: boolean | undefined;
};
