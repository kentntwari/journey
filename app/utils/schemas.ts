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

export const createNewMilestoneSchema = z.object({
  checkpointId: z.string(),
  milestone: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (error) {
        return val;
      }
    }
  }, milestoneSchema),
});

export const challengeSchema = z.object({
  id: z.string(),
  description: z.string().min(1).max(100),
});

export const createNewChallengeSchema = z.object({
  checkpointId: z.string(),
  challenge: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (error) {
        return val;
      }
    }
  }, challengeSchema),
});

export const failureSchema = z.object({
  id: z.string(),
  description: z.string().min(1).max(100),
});

export const createNewFailureSchema = z.object({
  checkpointId: z.string(),
  failure: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (error) {
        return val;
      }
    }
  }, failureSchema),
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
  challenges: z
    .preprocess((val) => {
      if (typeof val === "string") return JSON.parse(val);
      return val;
    }, challengeSchema)
    .array(),
  failures: z
    .preprocess((val) => {
      if (typeof val === "string") return JSON.parse(val);
      return val;
    }, failureSchema)
    .array(),
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
