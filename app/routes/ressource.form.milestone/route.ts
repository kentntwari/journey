import type { ActionFunctionArgs } from "@remix-run/node";

import { parseWithZod } from "@conform-to/zod";

import { json } from "@remix-run/react";

import { createNewMilestoneSchema } from "~/utils/schemas";

import { createMilestone } from "./db.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: createNewMilestoneSchema,
  });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  await createMilestone(
    submission.value.checkpointId,
    submission.value.milestone
  );

  return null;
}
