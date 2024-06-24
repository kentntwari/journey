import { z } from "zod";

export const milestoneSchema = z.object({
  id: z.string(),
  status: z.union([z.literal("in progress"), z.literal("completed")]),
  deadline: z.date({
    required_error: "Deadline is required",
    invalid_type_error: "Invalid date",
  }),
  description: z.string().min(1).max(100),
});

export const challengeSchema = z.object({
  id: z.string(),
  description: z.string().min(1).max(100),
});

export const failureSchema = z.object({
  id: z.string(),
  description: z.string().min(1).max(100),
});

export const checkpointSchema = z.object({
  journeyTitle: z.string().nonempty(),
  startDate: z.date(),
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(1000),
  milestones: z
    .preprocess((val) => {
      if (typeof val === "string") return JSON.parse(val);
      return val;
    }, milestoneSchema)
    .array(),
  challenges: z.array(challengeSchema),
  failures: z.array(failureSchema),
});

export const skimmedCheckpointSchema = checkpointSchema
  .omit({
    journeyTitle: true,
    description: true,
    milestones: true,
    challenges: true,
    failures: true,
  })
  .extend({
    id: z.string(),
    milestones: z.number(),
    challenges: z.number(),
    failures: z.number(),
  });

export const journeySchema = z.object({
  id: z.string(),
  title: z.string(),
  updatedAt: z.date(),
  checkpoints: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
    })
  ),
});

export const newJourneyschema = z.object({
  title: z.string().min(1).max(100),
});
