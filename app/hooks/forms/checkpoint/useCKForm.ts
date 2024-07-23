import type {
  ChallengeEntry,
  FailureEntry,
  MileStoneEntry,
  JourneyEntry,
  UpdateDescriptionEntry,
  UpdateTitleEntry,
  UpdateStartDateEntry,
  NewCheckpointEntry,
} from "~/types";
import type {
  FormMetadata,
  SubmissionResult,
  DefaultValue,
} from "@conform-to/react";

import { z } from "zod";
import { useAtomValue } from "jotai";
import { useForm as useConform } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useSubmit, useSearchParams, useParams } from "@remix-run/react";

import { useCKMilestones } from "./useCKMilestones";
import { useCKChallenges } from "./useCKChallenges";
import { useCKFailures } from "./useCKFailures";
import { useCurrentCheckpointDetails } from "../../useCurrentCheckpointDetails";

import {
  milestoneSchema,
  challengeSchema,
  failureSchema,
  newCheckpointSchema,
  updateCheckpointTitleSchema,
  updateCheckpointDescriptionSchema,
  updateCheckpointStartDateSchema,
  newJourneyschema,
} from "~/utils/schemas";
import { submitCKUpdates, submitNewCK, deleteCK } from "~/utils/conform";

import {
  pendingChallengesAtom,
  pendingFailuresAtom,
  pendingMilestonesAtom,
} from "~/utils/atoms";

export const targets = [
  "journey",
  "create-checkpoint",
  "delete-checkpoint",
  "milestone",
  "challenge",
  "failure",
  "title",
  "description",
  "startDate",
] as const;

const schema = {
  journey: newJourneyschema,
  milestone: milestoneSchema,
  challenge: challengeSchema,
  failure: failureSchema,
  title: updateCheckpointTitleSchema,
  description: updateCheckpointDescriptionSchema,
  startDate: updateCheckpointStartDateSchema,
  "create-checkpoint": newCheckpointSchema,
  "delete-checkpoint": z.object({}),
};

interface ICFRMArgs<K extends (typeof targets)[number]> {
  shouldRevalidate?: "onSubmit" | "onInput" | "onBlur" | undefined;
  lastResult?: SubmissionResult<string[]> | null | undefined;
  model: K;
}

export function useCKForm(
  args: ICFRMArgs<"delete-checkpoint">
): [
  FormMetadata<{}, string[]>,
  ReturnType<FormMetadata<{}, string[]>["getFieldset"]>
];
export function useCKForm(
  args: ICFRMArgs<"create-checkpoint"> & {
    defaultValue?: DefaultValue<NewCheckpointEntry>;
  }
): [
  FormMetadata<NewCheckpointEntry, string[]>,
  ReturnType<FormMetadata<NewCheckpointEntry, string[]>["getFieldset"]>
];
export function useCKForm(
  args: ICFRMArgs<"journey"> & { defaultValue?: DefaultValue<JourneyEntry> }
): [
  FormMetadata<JourneyEntry, string[]>,
  ReturnType<FormMetadata<JourneyEntry, string[]>["getFieldset"]>
];
export function useCKForm(
  args: ICFRMArgs<"milestone"> & { defaultValue?: DefaultValue<MileStoneEntry> }
): [
  FormMetadata<MileStoneEntry, string[]>,
  ReturnType<FormMetadata<MileStoneEntry, string[]>["getFieldset"]>
];
export function useCKForm(
  args: ICFRMArgs<"challenge"> & { defaultValue?: DefaultValue<ChallengeEntry> }
): [
  FormMetadata<ChallengeEntry, string[]>,
  ReturnType<FormMetadata<ChallengeEntry, string[]>["getFieldset"]>
];
export function useCKForm(
  args: ICFRMArgs<"failure"> & { defaultValue?: DefaultValue<FailureEntry> }
): [
  FormMetadata<FailureEntry, string[]>,
  ReturnType<FormMetadata<FailureEntry, string[]>["getFieldset"]>
];
export function useCKForm(
  args: ICFRMArgs<"title"> & { defaultValue?: DefaultValue<UpdateTitleEntry> }
): [
  FormMetadata<UpdateTitleEntry, string[]>,
  ReturnType<FormMetadata<UpdateTitleEntry, string[]>["getFieldset"]>
];
export function useCKForm(
  args: ICFRMArgs<"description"> & {
    defaultValue?: DefaultValue<UpdateDescriptionEntry>;
  }
): [
  FormMetadata<UpdateDescriptionEntry, string[]>,
  ReturnType<FormMetadata<UpdateDescriptionEntry, string[]>["getFieldset"]>
];
export function useCKForm(
  args: ICFRMArgs<"startDate"> & {
    defaultValue?: DefaultValue<UpdateStartDateEntry>;
  }
): [
  FormMetadata<UpdateStartDateEntry, string[]>,
  ReturnType<FormMetadata<UpdateStartDateEntry, string[]>["getFieldset"]>
];
export function useCKForm<
  T extends (typeof targets)[number],
  F extends MileStoneEntry | ChallengeEntry | FailureEntry
>({
  shouldRevalidate,
  lastResult,
  defaultValue,
  model,
}: ICFRMArgs<T> & { defaultValue?: DefaultValue<F> }): [
  FormMetadata<F, string[]>,
  ReturnType<FormMetadata<F, string[]>["getFieldset"]>
] {
  const submit = useSubmit();

  const [searchParams] = useSearchParams();
  const currentAction = searchParams.get("_action");

  const params = useParams();

  const data = useCurrentCheckpointDetails();

  const { set: setMilestones } = useCKMilestones();
  const { set: setChallenges } = useCKChallenges();
  const { set: setFailures } = useCKFailures();

  const pendingMilestones = useAtomValue(pendingMilestonesAtom);
  const pendingChallenges = useAtomValue(pendingChallengesAtom);
  const pendingFailures = useAtomValue(pendingFailuresAtom);

  const [form, fields] = useConform<F>({
    id: model,
    lastResult,
    defaultValue,
    onValidate({ formData }) {
      const res = parseWithZod(formData, { schema: schema[model] });
      console.log(res);
      return res;
    },
    onSubmit(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const incomingFormData = new FormData(form);

      if (currentAction !== "add" && model === "milestone") {
        setMilestones(incomingFormData);
        data?.results?.slug &&
          submitCKUpdates(
            data.results.slug,
            incomingFormData,
            submit,
            "milestone"
          );
      }

      if (currentAction !== "add" && model === "challenge") {
        setChallenges(incomingFormData);
        data?.results?.slug &&
          submitCKUpdates(
            data.results.slug,
            incomingFormData,
            submit,
            "challenge"
          );
      }

      if (currentAction !== "add" && model === "failure") {
        setFailures(incomingFormData);
        data?.results?.slug &&
          submitCKUpdates(
            data.results.slug,
            incomingFormData,
            submit,
            "failure"
          );
      }

      if (currentAction !== "add" && model === "title") {
        data?.results?.slug &&
          submitCKUpdates(
            data.results.slug,
            incomingFormData,
            submit,
            "main",
            "update-title"
          );
      }

      if (currentAction !== "add" && model === "description") {
        data?.results?.slug &&
          submitCKUpdates(
            data.results.slug,
            incomingFormData,
            submit,
            "main",
            "update-description"
          );
      }

      if (currentAction !== "add" && model === "startDate") {
        data?.results?.slug &&
          submitCKUpdates(
            data.results.slug,
            incomingFormData,
            submit,
            "main",
            "update-startDate"
          );
      }

      if (currentAction === "add" && model === "milestone") {
        setMilestones(incomingFormData);
      }

      if (currentAction === "add" && model === "challenge") {
        setChallenges(incomingFormData);
      }

      if (currentAction === "add" && model === "failure") {
        setFailures(incomingFormData);
      }

      if (currentAction === "add" && model === "create-checkpoint") {
        submitNewCK(
          incomingFormData,
          pendingMilestones,
          pendingChallenges,
          pendingFailures,
          submit
        );
      }

      if (currentAction === "delete" && model === "delete-checkpoint") {
        data?.results?.slug &&
          params.slug &&
          deleteCK(data.results.slug, params.slug, submit);
      }

      form.reset();
    },

    shouldRevalidate: shouldRevalidate,
  });

  return [form, fields];
}
