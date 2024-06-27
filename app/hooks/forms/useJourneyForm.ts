import type { SubmissionResult } from "@conform-to/react";

import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";

import { useSubmit } from "@remix-run/react";

import { newJourneyschema } from "~/utils/schemas";

export function useJourneyForm({
  shouldRevalidate,
  lastResult,
}: {
  shouldRevalidate?: "onSubmit" | "onInput" | "onBlur" | undefined;
  lastResult?: SubmissionResult<string[]> | null | undefined;
} = {}): [typeof form, typeof fields] {
  const submit = useSubmit();

  const [form, fields] = useForm({
    // // Sync the result of last submission
    lastResult,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: newJourneyschema });
    },
    onSubmit(event) {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      submit(formData, {
        method: "POST",
        action: "/ressource/form/journey",
        fetcherKey: "new-journey",
        navigate: false,
      });
    },

    shouldRevalidate: shouldRevalidate,
  });

  return [form, fields];
}
