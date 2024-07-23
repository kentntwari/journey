import type { ActionFunctionArgs } from "@remix-run/node";

import { parseWithZod } from "@conform-to/zod";

import { json } from "@remix-run/react";

import { createNewFailureSchema } from "~/utils/schemas";

import { createFailure } from "./db.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: createNewFailureSchema,
  });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  await createFailure(
    submission.value.checkpointSlug,
    submission.value.failure
  );

  return null;
}
