import type { ActionFunctionArgs } from "@remix-run/node";

import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { parseWithZod } from "@conform-to/zod";
import {
  FormProvider,
  useForm,
  getFormProps,
  getTextareaProps,
  getInputProps,
} from "@conform-to/react";
import { Ellipsis, XIcon } from "lucide-react";

import { redirect, json } from "@remix-run/node";
import { useParams, useSubmit, Form as RemixForm } from "@remix-run/react";

import * as db from "./db.server";
import { Tabs } from "./Tabs";
import { Milestones } from "./Milestones";
import { Challenges } from "./Challenges";
import { Failures } from "./Failures";
import { StartDateConform } from "./StartDateConform";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import * as Dialog from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";

import { checkpointSchema } from "~/utils/schemas";
import {
  pendingMilestonesAtom,
  pendingChallengesAtom,
  pendingFailuresAtom,
  isDialogOpenAtom,
  isAddChallengeAtom,
  isAddMilestoneAtom,
  isAddFailureAtom,
} from "~/utils/atoms";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

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

export function Form() {
  const params = useParams();

  const submit = useSubmit();

  const [pendingMilestones, setPendingMilestones] = useAtom(
    pendingMilestonesAtom
  );
  const [pendingChallenges, setPendingChallenges] = useAtom(
    pendingChallengesAtom
  );

  const [pendingFailures, setPendingFailures] = useAtom(pendingFailuresAtom);

  const setIsDialogOpen = useSetAtom(isDialogOpenAtom);
  const setIsAddMilestone = useSetAtom(isAddMilestoneAtom);
  const setIsAddChallenge = useSetAtom(isAddChallengeAtom);
  const setIsAddFailure = useSetAtom(isAddFailureAtom);

  const [form, fields] = useForm({
    id: "checkpoint",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: checkpointSchema });
    },
    onSubmit(e) {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      if (pendingMilestones.length > 0) {
        for (let [index, milestone] of pendingMilestones.entries()) {
          console.log(milestone);
          formData.append(`milestones[${index}]`, JSON.stringify(milestone));
        }
      }

      if (pendingChallenges.length > 0) {
        console.log(pendingChallenges);
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

      setIsDialogOpen(false);
      setIsAddChallenge(false);
      setIsAddMilestone(false);
      setIsAddFailure(false);
      setPendingMilestones([]);
      setPendingChallenges([]);
      setPendingFailures([]);
    },
    shouldRevalidate: "onInput",
  });

  return (
    <>
      <section className="px-3">
        <FormProvider context={form.context}>
          <RemixForm
            {...getFormProps(form)}
            method="POST"
            action="/ressource/form/checkpoint"
            onSubmit={form.onSubmit}
          >
            <header className="flex items-center justify-between">
              <h3 className="font-semibold text-xl">New checkpoint</h3>
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  name="intent"
                  value="create-checkout"
                  size="sm"
                  className="w-[72px]"
                >
                  Save
                </Button>
                <button type="button">
                  <Ellipsis size={24} className="text-neutral-grey-1000" />
                </button>
                <Dialog.DialogClose>
                  <XIcon size={24} className="text-neutral-grey-1000" />
                </Dialog.DialogClose>
              </div>
            </header>

            <input
              hidden
              name={fields.journeyTitle.name}
              defaultValue={params.title}
            />
            <fieldset className="mt-10 space-y-6">
              <StartDateConform meta={fields.startDate}>
                {(date) => (
                  <div className="flex items-center gap-4">
                    <label htmlFor={fields.startDate.name}>Start date</label>
                    <span className="badge-date">{date}</span>
                  </div>
                )}
              </StartDateConform>

              <div className="space-y-4">
                <div className="flex flex-col gap-y-[5px]">
                  <label
                    htmlFor={fields.title.name}
                    className="font-medium text-sm"
                  >
                    Title*
                  </label>
                  <Input
                    {...getInputProps(fields.title, {
                      type: "text",
                    })}
                    id="title"
                    placeholder="Write title here..."
                    className="bg-white border-neutral-grey-500 rounded-lg shadow-none placeholder:font-normal placeholder:text-sm placeholder:text-neutral-grey-900"
                  />
                  <small className="text-2xs text-neutral-grey-900">
                    Must be less than 50 words
                  </small>
                </div>

                <div className="flex flex-col gap-y-[5px]">
                  <label
                    htmlFor={fields.description.name}
                    className="font-medium text-sm"
                  >
                    Description*
                  </label>
                  <Textarea
                    {...getTextareaProps(fields.description)}
                    className="h-24 bg-white border-neutral-grey-500 rounded-lg shadow-none"
                  />
                  <small className="text-2xs text-neutral-grey-900">
                    Must be less than 1000 words
                  </small>
                </div>
              </div>
            </fieldset>
          </RemixForm>
        </FormProvider>
      </section>
      <section className="mt-8">
        <Tabs>
          {(tab) => (
            <>
              {tab === "milestones" ? <Milestones initialValues={[]} /> : null}
              {tab === "challenges" ? <Challenges initialValues={[]} /> : null}
              {tab === "failures" ? <Failures initialValues={[]} /> : null}
            </>
          )}
        </Tabs>
      </section>
    </>
  );
}
