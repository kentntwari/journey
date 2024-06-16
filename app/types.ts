import { z } from "zod";

import { milestoneSchema } from "./utils/schemas";

export type MileStoneEntry = z.infer<typeof milestoneSchema>;
