import type { SubmissionResult } from "@conform-to/react";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useSetAtom } from "jotai";

import { useSubmit, useSearchParams } from "@remix-run/react";

import { useCurrentCheckpointDetails } from "../useCurrentCheckpointDetails";

import { failureSchema } from "~/utils/schemas";
import { pendingFailuresAtom, isAddFailureAtom } from "~/utils/atoms";

export function useFailureForm({
  shouldRevalidate,
  lastResult,
}: {
  shouldRevalidate?: "onSubmit" | "onInput" | "onBlur" | undefined;
  lastResult?: SubmissionResult<string[]> | null | undefined;
} = {}): [typeof form, typeof fields] {
  const setPendingFailures = useSetAtom(pendingFailuresAtom);
  const setIsAddFailure = useSetAtom(isAddFailureAtom);

  const [searchParams] = useSearchParams();
  const currentAction = searchParams.get("_action");

  const submit = useSubmit();

  const data = useCurrentCheckpointDetails();

  const [form, fields] = useForm({
    id: "failure",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: failureSchema });
    },
    onSubmit(e) {
      e.preventDefault();

      const form = e.currentTarget;
      const incomingFormData = new FormData(form);

      const id = String(incomingFormData.get("id"));
      const description = String(incomingFormData.get("description"));

      setPendingFailures((prev) => [
        ...prev,
        {
          id,
          description,
        },
      ]);

      setIsAddFailure(false);

      if (currentAction !== "add") {
        const outgoingFormData = new FormData();
        outgoingFormData.append("checkpointId", data?.results?.id ?? "");
        outgoingFormData.append("failure", JSON.stringify({ id, description }));

        submit(outgoingFormData, {
          action: "/ressource/form/failure",
          method: "POST",
          fetcherKey: "create-new-failure",
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
