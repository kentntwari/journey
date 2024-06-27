import type { SubmissionResult } from "@conform-to/react";

import { useAtomValue } from "jotai";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { useSubmit } from "@remix-run/react";

import { useHandleCloseModal } from "../useHandleCloseModal";
import { useResetCheckpointRelatedAtoms } from "../useResetCheckpointRelatedAtoms";

import { checkpointSchema } from "~/utils/schemas";
import {
  pendingMilestonesAtom,
  pendingChallengesAtom,
  pendingFailuresAtom,
} from "~/utils/atoms";

export function useCheckpointForm({
  shouldRevalidate,
  lastResult,
}: {
  shouldRevalidate?: "onSubmit" | "onInput" | "onBlur" | undefined;
  lastResult?: SubmissionResult<string[]> | null | undefined;
} = {}): [typeof form, typeof fields] {
  const pendingMilestones = useAtomValue(pendingMilestonesAtom);
  const pendingChallenges = useAtomValue(pendingChallengesAtom);
  const pendingFailures = useAtomValue(pendingFailuresAtom);

  const { handleCloseModal } = useHandleCloseModal();

  const { resetAtoms } = useResetCheckpointRelatedAtoms();

  const submit = useSubmit();

  const [form, fields] = useForm({
    id: "checkpoint",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: checkpointSchema });
    },
    onSubmit(e) {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      if (pendingMilestones.length > 0) {
        for (let [index, milestone] of pendingMilestones.entries()) {
          formData.append(`milestones[${index}]`, JSON.stringify(milestone));
        }
      }

      if (pendingChallenges.length > 0) {
        for (let [index, challenge] of pendingChallenges.entries()) {
          formData.append(`challenges[${index}]`, JSON.stringify(challenge));
        }
      }

      if (pendingFailures.length > 0) {
        for (let [index, failure] of pendingFailures.entries()) {
          formData.append(`failures[${index}]`, JSON.stringify(failure));
        }
      }

      submit(formData, {
        method: "post",
        action: "/ressource/form/checkpoint",
        fetcherKey: "checkpoint",
        navigate: false,
      });

      handleCloseModal();

      resetAtoms();
    },

    shouldRevalidate: shouldRevalidate,
  });

  return [form, fields];
}
