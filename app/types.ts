import { z } from "zod";

import { getDetails as getCheckpointDetails } from "~/routes/ressource.checkpoint.$id/db.server";

import { checkpointSchema, milestoneSchema } from "./utils/schemas";

export type MileStoneEntry = z.infer<typeof milestoneSchema>;

const SkimmedCheckpointSchema = checkpointSchema.omit({ journeyTitle: true });
export type Checkpoint = z.infer<typeof SkimmedCheckpointSchema>;

export type SingleCheckpointFetchedData = {
  results: Awaited<ReturnType<typeof getCheckpointDetails>> | null;
  error: boolean | undefined;
};
