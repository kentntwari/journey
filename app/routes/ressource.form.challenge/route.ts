import type { ActionFunctionArgs } from "@remix-run/node";

import { parseWithZod } from "@conform-to/zod";

import { json } from "@remix-run/react";

import { createNewChallengeSchema } from "~/utils/schemas";

import { createChallenge } from "./db.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: createNewChallengeSchema,
  });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  await createChallenge(
    submission.value.checkpointSlug,
    submission.value.challenge
  );

  return null;
}
