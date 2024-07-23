import { z } from "zod";

export const milestoneSchema = z.object({
  slug: z.string(),
  status: z.union([z.literal("in progress"), z.literal("completed")]),
  deadline: z.date({
    required_error: "Deadline is required",
    invalid_type_error: "Invalid date",
  }),
  description: z.string().min(1).max(100),
});

export const createNewMilestoneSchema = z.object({
  checkpointSlug: z.string(),
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
  slug: z.string(),
  description: z.string().min(1).max(100),
});

export const createNewChallengeSchema = z.object({
  checkpointSlug: z.string(),
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
  slug: z.string(),
  description: z.string().min(1).max(100),
});

export const createNewFailureSchema = z.object({
  checkpointSlug: z.string(),
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
  journeySlug: z.string().nonempty(),
  startDate: z.date(),
  title: z.string().min(50).max(500),
  slug: z.string(),
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
    journeySlug: true,
    description: true,
    milestones: true,
    challenges: true,
    failures: true,
  })
  .extend({
    slug: z.string(),
    milestones: z.number(),
    challenges: z.number(),
    failures: z.number(),
  });

export const updateCheckpointTitleSchema = checkpointSchema.pick({
  title: true,
});
export const updateCheckpointDescriptionSchema = checkpointSchema.pick({
  description: true,
});
export const updateCheckpointStartDateSchema = checkpointSchema.pick({
  startDate: true,
});

export const newCheckpointSchema = checkpointSchema.omit({ slug: true });

export const deleteCheckpointSchema = z.object({
  slug: z.string(),
  journeySlug: z.string(),
});

export const journeySchema = z.object({
  slug: z.string(),
  title: z.string(),
  updatedAt: z.date(),
  checkpoints: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
    })
  ),
});

export const newJourneyschema = z.object({
  title: z.string().min(1).max(100),
});
