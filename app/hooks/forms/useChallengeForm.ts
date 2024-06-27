import type { SubmissionResult } from "@conform-to/react";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useSetAtom } from "jotai";

import { useSubmit, useSearchParams } from "@remix-run/react";

import { useCurrentCheckpointDetails } from "../useCurrentCheckpointDetails";

import { challengeSchema } from "~/utils/schemas";
import { pendingChallengesAtom, isAddChallengeAtom } from "~/utils/atoms";

export function useChallengeForm({
  shouldRevalidate,
  lastResult,
}: {
  shouldRevalidate?: "onSubmit" | "onInput" | "onBlur" | undefined;
  lastResult?: SubmissionResult<string[]> | null | undefined;
} = {}): [typeof form, typeof fields] {
  const setPendingChallenges = useSetAtom(pendingChallengesAtom);
  const setIsAddChallenge = useSetAtom(isAddChallengeAtom);

  const [searchParams] = useSearchParams();
  const currentAction = searchParams.get("_action");

  const data = useCurrentCheckpointDetails();

  const submit = useSubmit();

  const [form, fields] = useForm({
    id: "challenge",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: challengeSchema });
    },
    onSubmit(e) {
      e.preventDefault();

      const form = e.currentTarget;
      const incomingFormData = new FormData(form);

      const id = String(incomingFormData.get("id"));
      const description = String(incomingFormData.get("description"));

      setPendingChallenges((prev) => [
        ...prev,
        {
          id,
          description,
        },
      ]);

      setIsAddChallenge(false);

      if (currentAction !== "add") {
        const outgoingFormData = new FormData();
        outgoingFormData.append("checkpointId", data?.results?.id ?? "");
        outgoingFormData.append(
          "challenge",
          JSON.stringify({ id, description })
        );

        submit(outgoingFormData, {
          action: "/ressource/form/challenge",
          method: "POST",
          fetcherKey: "create-new-challenge",
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
