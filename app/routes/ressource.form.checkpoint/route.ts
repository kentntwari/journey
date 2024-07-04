import type { ActionFunctionArgs } from "@remix-run/node";

import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";

import { redirect, json } from "@remix-run/node";

import * as db from "./db.server";

import {
  checkpointSchema,
  deleteCheckpointSchema,
  checkpointDescriptionSchema,
  checkpointTitleSchema,
  checkpointStartDateSchema,
} from "~/utils/schemas";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

  switch (formData.get("intent")) {
    case "update-startDate": {
      const submission = parseWithZod(formData, {
        schema: checkpointStartDateSchema.extend({ id: z.string() }),
      });

      if (submission.status !== "success") {
        return json(submission.reply());
      }

      await db.updateStartDate(submission.value.id, submission.value.startDate);

      return null;
    }

    case "update-title": {
      const submission = parseWithZod(formData, {
        schema: checkpointTitleSchema.extend({ id: z.string() }),
      });

      if (submission.status !== "success") {
        return json(submission.reply());
      }

      await db.updateTitle(submission.value.id, submission.value.title);

      return null;
    }

    case "update-description": {
      const submission = parseWithZod(formData, {
        schema: checkpointDescriptionSchema.extend({ id: z.string() }),
      });

      if (submission.status !== "success") {
        return json(submission.reply());
      }

      await db.updateDescription(
        submission.value.id,
        submission.value.description
      );

      return null;
    }

    case "delete": {
      const submission = parseWithZod(formData, {
        schema: deleteCheckpointSchema,
      });

      if (submission.status !== "success") {
        return json(submission.reply());
      }
      await db.deleteCheckpoint(submission.value.id);

      return redirect("/journeys/" + submission.value.journeyTitle);
    }

    default: {
      const submission = parseWithZod(formData, {
        schema: checkpointSchema,
      });

      if (submission.status !== "success") {
        return json(submission.reply());
      }

      await db.createNewCheckpoint({
        journeyTitle: submission.value.journeyTitle,
        title: submission.value.title,
        description: submission.value.description,
        startDate: submission.value.startDate,
        milestones: submission.value.milestones,
        challenges: submission.value.challenges,
        failures: submission.value.failures,
      });

      return redirect("/journeys/" + submission.value.journeyTitle);
    }
  }
}
