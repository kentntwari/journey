import type { ActionFunctionArgs } from "@remix-run/node";

import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";

import { redirect, json } from "@remix-run/node";

import * as db from "./db.server";

import {
  newCheckpointSchema,
  deleteCheckpointSchema,
  updateCheckpointDescriptionSchema,
  updateCheckpointTitleSchema,
  updateCheckpointStartDateSchema,
} from "~/utils/schemas";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

  switch (formData.get("intent")) {
    case "update-startDate": {
      const submission = parseWithZod(formData, {
        schema: updateCheckpointStartDateSchema.extend({
          slug: z.string(),
        }),
      });
      if (submission.status !== "success") {
        return json(submission.reply());
      }

      await db.updateStartDate(
        submission.value.slug,
        submission.value.startDate
      );

      return null;
    }

    case "update-title": {
      const submission = parseWithZod(formData, {
        schema: updateCheckpointTitleSchema.extend({
          slug: z.string(),
        }),
      });

      if (submission.status !== "success") {
        return json(submission.reply());
      }

      await db.updateTitle(submission.value.slug, submission.value.title);

      return null;
    }

    case "update-description": {
      const submission = parseWithZod(formData, {
        schema: updateCheckpointDescriptionSchema.extend({
          slug: z.string(),
        }),
      });

      if (submission.status !== "success") {
        return json(submission.reply());
      }

      await db.updateDescription(
        submission.value.slug,
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
      await db.deleteCheckpoint(submission.value.slug);

      return redirect("/journeys/" + submission.value.journeySlug);
    }

    default: {
      const submission = parseWithZod(formData, {
        schema: newCheckpointSchema,
      });

      if (submission.status !== "success") {
        return json(submission.reply());
      }

      await db.createNewCheckpoint({
        ...submission.value,
      });

      return redirect("/journeys/" + submission.value.journeySlug);
    }
  }
}
