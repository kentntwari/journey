import {
  FormProvider,
  getFormProps,
  getInputProps,
  getTextareaProps,
} from "@conform-to/react";
import { Ellipsis, XIcon } from "lucide-react";
import { useAtomValue } from "jotai";

import { useParams, Form as RemixForm } from "@remix-run/react";

import { useCKForm } from "~/hooks/forms/checkpoint/useCKForm";
import { useHandleCloseModal } from "~/hooks/useHandleCloseModal";
import { useResetCheckpointRelatedAtoms } from "~/hooks/useResetCheckpointRelatedAtoms";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

import { Tabs } from "./Tabs";
import { StartDate } from "./StartDate";

import {
  isAddChallengeAtom,
  isAddFailureAtom,
  isAddMilestoneAtom,
} from "~/utils/atoms";

export function Form() {
  const params = useParams();

  const [form, fields] = useCKForm({
    shouldRevalidate: "onInput",
    model: "create-checkpoint",
  });

  const { handleCloseModal } = useHandleCloseModal();

  const { resetAtoms } = useResetCheckpointRelatedAtoms();

  const isAddChallenge = useAtomValue(isAddChallengeAtom);
  const isAddFailure = useAtomValue(isAddFailureAtom);
  const isAddMilestone = useAtomValue(isAddMilestoneAtom);

  return (
    <>
      <section className="px-3">
        <FormProvider context={form.context}>
          <RemixForm
            {...getFormProps(form)}
            key={form.key}
            method="POST"
            action="/ressource/form/checkpoint"
            onSubmit={(e) => {
              form.onSubmit(e);
              handleCloseModal();
              resetAtoms();
            }}
          >
            <header className="flex items-center justify-between">
              <h3 className="font-semibold text-xl">New checkpoint</h3>
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  size="sm"
                  className="w-[72px]"
                  disabled={isAddChallenge || isAddFailure || isAddMilestone}
                >
                  Save
                </Button>
                <button
                  type="button"
                  disabled={isAddChallenge || isAddFailure || isAddMilestone}
                  onClick={handleCloseModal}
                >
                  <Ellipsis size={24} className="text-neutral-grey-1000" />
                </button>
                <ExitBtn />
              </div>
            </header>

            <input
              hidden
              name={fields.journeySlug.name}
              defaultValue={params.slug}
            />
            <fieldset className="mt-10 space-y-6">
              <StartDate meta={fields.startDate}>
                {(date) => (
                  <div className="flex items-center gap-4">
                    <label htmlFor={fields.startDate.name}>Start date</label>
                    <span className="badge-date">{date}</span>
                  </div>
                )}
              </StartDate>

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
        <Tabs
          initialValues={{
            milestones: [],
            challenges: [],
            failures: [],
          }}
        />
      </section>
    </>
  );
}

function ExitBtn() {
  const { handleCloseModal } = useHandleCloseModal({ shouldNavigate: true });

  return (
    <button type="button" onClick={handleCloseModal}>
      <XIcon size={24} className="text-neutral-grey-1000" />
    </button>
  );
}
