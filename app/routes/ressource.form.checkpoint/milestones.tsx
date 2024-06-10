import type React from "react";

import { z } from "zod";
import { Plus } from "lucide-react";
import { FormProvider, useForm } from "@conform-to/react";
import {
  getFormProps,
  getTextareaProps,
  getInputProps,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { useState } from "react";

import { useFetchers, Form as RemixForm, useSubmit } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import { SelectConform } from "~/components/conform/Select";
import { TextareaConform } from "~/components/conform/TextArea";
import { DatePickerConform } from "~/components/conform/DatePicker";

import { milestoneSchema } from "~/utils/schemas";

interface Milestonesprops {
  initialValues: z.infer<typeof milestoneSchema>[];
  children?: React.ReactNode;
}

let pendingMilestones: Milestonesprops["initialValues"] = [];

Milestones.Form = Form;

export function usePendingMilestones() {
  const fetchers = useFetchers();

  const formEntries = fetchers
    .filter((f) => {
      if (!f.formData) return false;
      if (f.state !== "submitting") return false;
      if (f.key == "milestone") return true;
    })
    .map((f) => {
      if (f.formData) {
        const id = String(f.formData.get("id"));
        const status = String(
          f.formData.get("status")
        ) as Milestonesprops["initialValues"][number]["status"];
        const description = "Find out why it is null when submitted";
        const deadline = new Date(String(f.formData.get("deadline")));

        return { id, status, description, deadline };
      }
    });

  for (const entry of formEntries) {
    if (entry && !pendingMilestones.some((e) => e.id === entry.id))
      pendingMilestones.push(entry);
  }

  return pendingMilestones;
}

export function Milestones({ initialValues, children }: Milestonesprops) {
  const [addMilestone, setAddMilestone] = useState(false);

  const pendingMilestones = usePendingMilestones();

  if ([...pendingMilestones, ...initialValues].length === 0)
    return (
      <>
        {!addMilestone ? (
          <>
            <div className="mt-20 space-y-4 text-center">
              <p className="font-semibold text-sm text-neutral-grey-900">
                No milestones yet!
              </p>

              <Button
                size="md"
                type="button"
                variant="neutral"
                className="space-x-3"
                onClick={() => setAddMilestone(true)}
              >
                <Plus size={20} />
                <span className="block inherit">Add milestone</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="form-wrapper-milestone">
            <Milestones.Form />
          </div>
        )}
      </>
    );

  return <>{JSON.stringify([...pendingMilestones, ...initialValues])}</>;
}

export function Form() {
  const submit = useSubmit();

  const [form, fields] = useForm({
    id: "milestone",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: milestoneSchema });
    },
    onSubmit(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      // const result = parseWithZod(formData, { schema: milestoneSchema });

      submit(formData, {
        method: "post",
        action: "/ressource/form/checkpoint",
        fetcherKey: "milestone",
        navigate: false,
      });
    },

    shouldRevalidate: "onInput",
  });

  return (
    <FormProvider context={form.context}>
      <RemixForm
        {...getFormProps(form)}
        method="POST"
        className="grid grid-cols-2 gap-2"
        action="/ressource/form/checkpoint"
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
