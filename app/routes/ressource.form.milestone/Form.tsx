import { FormProvider } from "@conform-to/react";
import { getFormProps, getTextareaProps } from "@conform-to/react";
import { useSetAtom } from "jotai";

import { Form as RemixForm, useFetcher } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import { SelectConform } from "~/components/conform/Select";
import { TextAreaConform } from "~/components/conform/TextArea";
import { DatePickerConform } from "~/components/conform/DatePicker";

import { useCKForm } from "~/hooks/forms/checkpoint/useCKForm";

import { isAddMilestoneAtom } from "~/utils/atoms";

export function Form() {
  const [form, fields] = useCKForm({
    shouldRevalidate: "onInput",
    model: "milestone",
  });

  const fetcher = useFetcher({ key: "create-new-milestone" });

  return (
    <FormProvider context={form.context}>
      <RemixForm
        {...getFormProps(form)}
        key={form.key}
        method="POST"
        className="grid grid-cols-2 gap-2"
        action="/ressource/form/milestone"
        onSubmit={form.onSubmit}
      >
        <p className="mb-4 font-semibold text-base">New milestone</p>
        <input hidden name="key" defaultValue="milestone" />
        <input hidden name="id" defaultValue={window.crypto.randomUUID()} />
        <div className="row-start-2 col-start-1 col-span-1 space-y-[5px]">
          <Label htmlFor={fields.status.id}>Status</Label>
          <SelectConform
            meta={fields.status}
            defaultValue="in progress"
            placeholder="Select status"
            items={[
              { name: "In progress", value: "in progress" },
              { name: "Completed", value: "completed" },
            ]}
          />
        </div>
        <div className="row-start-2 col-start-2 col-span-1 space-y-[5px]">
          <Label htmlFor={fields.deadline.id}>Deadline</Label>
          <DatePickerConform meta={fields.deadline} />
          <small className="text-red-800">{fields.deadline.errors}</small>
        </div>
        <div className="mt-2 row-start-3 col-span-2">
          <Label htmlFor={fields.description.id}>Description</Label>
          <TextAreaConform
            {...getTextareaProps(fields.description)}
            key={fields.description.key}
            meta={fields.description}
          />
          {<p>{fields.description.errors}</p>}
        </div>
        <div className="mt-4 row-start-4 col-span-2 flex items-center justify-end gap-3">
          <CloseMilestoneFormBtn />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            disabled={fetcher.state !== "idle"}
          >
            Create
          </Button>
        </div>
      </RemixForm>
    </FormProvider>
  );
}

function CloseMilestoneFormBtn() {
  const setIsMilestoneFormOpen = useSetAtom(isAddMilestoneAtom);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="neutral"
        className="w-[72px]"
        onClick={() => setIsMilestoneFormOpen(false)}
      >
        Cancel
      </Button>
    </>
  );
}
