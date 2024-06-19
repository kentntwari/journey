import { z } from "zod";

import { checkpointSchema, milestoneSchema } from "./utils/schemas";

export type MileStoneEntry = z.infer<typeof milestoneSchema>;

const SkimmedCheckpointSchema = checkpointSchema.omit({ journeyTitle: true });
export type Checkpoint = z.infer<typeof SkimmedCheckpointSchema>;
