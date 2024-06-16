import type { ActionFunctionArgs } from "@remix-run/node";
import type { MileStoneEntry } from "~/types";

import { useSetAtom, useAtomValue } from "jotai";
import { FormProvider, useForm } from "@conform-to/react";
import { getFormProps, getTextareaProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Form as RemixForm, useSearchParams } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import { SelectConform } from "~/components/conform/Select";
import { TextareaConform } from "~/components/conform/TextArea";
import { DatePickerConform } from "~/components/conform/DatePicker";

import { milestoneSchema } from "~/utils/schemas";
import { pendingMilestonesAtom, isAddMilestoneAtom } from "~/utils/atoms";

export async function action({ request, params }: ActionFunctionArgs) {
  return null;
}

export function Form() {
  const setPendingMilestones = useSetAtom(pendingMilestonesAtom);

  const setIsAddMilestone = useSetAtom(isAddMilestoneAtom);

  const isAddMilestone = useAtomValue(isAddMilestoneAtom);

  const [searchParams] = useSearchParams();

  const currentAction = searchParams.get("_action");

  const [form, fields] = useForm({
    id: "milestone",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: milestoneSchema });
    },
    onSubmit(e) {
      e.preventDefault();

      const form = e.currentTarget;
      const formData = new FormData(form);
      const result = parseWithZod(formData, { schema: milestoneSchema });

      if (currentAction === "add") {
        const id = String(formData.get("id"));
        const status = String(
          formData.get("status")
        ) as MileStoneEntry["status"];
        const description = String(formData.get("description"));
        const deadline = new Date(String(formData.get("deadline")));

        setPendingMilestones((prev) => [
          ...prev,
          {
            id,
            status,
            description,
            deadline,
          },
        ]);

        isAddMilestone === true && setIsAddMilestone(false);
      }
    },

    shouldValidate: "onBlur",
  });

  return (
    <FormProvider context={form.context}>
      <RemixForm
        {...getFormProps(form)}
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
          <TextareaConform
            {...getTextareaProps(fields.description)}
            meta={fields.description}
          />
          {<p>{fields.description.errors}</p>}
        </div>
        <div className="mt-4 row-start-4 col-span-2 flex items-center justify-end gap-3">
          <Button
            type="button"
            size="sm"
            variant="neutral"
            className="w-[72px]"
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" variant="primary">
            Save & Create
          </Button>
        </div>
      </RemixForm>
    </FormProvider>
  );
}
