import type { SubmissionResult } from "@conform-to/react";
import type { MileStoneEntry } from "~/types";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useSetAtom } from "jotai";

import { useSubmit, useSearchParams } from "@remix-run/react";

import { useCurrentCheckpointDetails } from "../useCurrentCheckpointDetails";

import { milestoneSchema } from "~/utils/schemas";
import { pendingMilestonesAtom, isAddMilestoneAtom } from "~/utils/atoms";

export function useMilestoneForm({
  shouldRevalidate,
  lastResult,
}: {
  shouldRevalidate?: "onSubmit" | "onInput" | "onBlur" | undefined;
  lastResult?: SubmissionResult<string[]> | null | undefined;
} = {}): [typeof form, typeof fields] {
  const submit = useSubmit();

  const [searchParams] = useSearchParams();
  const currentAction = searchParams.get("_action");

  const setPendingMilestones = useSetAtom(pendingMilestonesAtom);
  const setIsAddMilestone = useSetAtom(isAddMilestoneAtom);

  const data = useCurrentCheckpointDetails();

  const [form, fields] = useForm({
    id: "milestone",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: milestoneSchema });
    },
    onSubmit(e) {
      e.preventDefault();

      const form = e.currentTarget;
      const incomingFormData = new FormData(form);

      const id = String(incomingFormData.get("id"));
      const status = String(
        incomingFormData.get("status")
      ) as MileStoneEntry["status"];
      const description = String(incomingFormData.get("description"));
      const deadline = new Date(String(incomingFormData.get("deadline")));

      setPendingMilestones((prev) => [
        ...prev,
        {
          id,
          status,
          description,
          deadline,
        },
      ]);

      setIsAddMilestone(false);

      if (currentAction !== "add") {
        const outgoingFormData = new FormData();
        outgoingFormData.append("checkpointId", data?.results?.id ?? "");
        outgoingFormData.append(
          "milestone",
          JSON.stringify({ id, status, description, deadline })
        );

        submit(outgoingFormData, {
          action: "/ressource/form/milestone",
          method: "POST",
          fetcherKey: "create-new-milestone",
          navigate: false,
          unstable_flushSync: true,
        });
      }

      form.reset();
    },

    shouldRevalidate: shouldRevalidate,
  });

  return [form, fields];
}
