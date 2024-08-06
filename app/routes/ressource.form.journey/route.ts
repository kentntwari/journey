import type { ActionFunctionArgs } from "@remix-run/node";

import { parseWithZod } from "@conform-to/zod";

import { json, redirect } from "@remix-run/react";

import { verifyUser, redirectIfNotAuthenticated } from "~/.server/verifyUser";

import * as db from "./db.server";

import { newJourneyschema } from "~/utils/schemas";

export async function action({ request }: ActionFunctionArgs) {
  const { user: currentUser } = await verifyUser(request);
  if (!currentUser) throw redirectIfNotAuthenticated();

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: newJourneyschema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  await db.createUserJourney(currentUser.id, submission.value.title);

  json({ ok: true });

  return redirect(`/journeys?_action=new-journey`);
}
