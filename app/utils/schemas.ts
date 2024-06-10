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
  description: z.string().min(1).max(100),
});

export const failureSchema = z.object({
  description: z.string().min(1).max(100),
});

export const checkpointSchema = z.object({
  startDate: z.date(),
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(1000),
  milestones: z.array(milestoneSchema),
  challenges: z.array(challengeSchema),
  failures: z.array(failureSchema),
});
