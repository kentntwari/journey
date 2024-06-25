import type { ActionFunctionArgs } from "@remix-run/node";

import { useSetAtom, useAtomValue } from "jotai";
import { FormProvider, useForm } from "@conform-to/react";
import { getFormProps, getTextareaProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Form as RemixForm, useSearchParams } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import { TextAreaConform } from "~/components/conform/TextArea";

import { failureSchema } from "~/utils/schemas";
import { pendingFailuresAtom, isAddFailureAtom } from "~/utils/atoms";

export async function action({ request, params }: ActionFunctionArgs) {
  return null;
}

export function Form() {
  const setPendingFailures = useSetAtom(pendingFailuresAtom);

  const setIsAddFailure = useSetAtom(isAddFailureAtom);

  const isAddFailure = useAtomValue(isAddFailureAtom);

  const [searchParams] = useSearchParams();

  const currentAction = searchParams.get("_action");

  const [form, fields] = useForm({
    id: "failure",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: failureSchema });
    },
    onSubmit(e) {
      e.preventDefault();

      const form = e.currentTarget;
      const formData = new FormData(form);
      const result = parseWithZod(formData, { schema: failureSchema });

      if (currentAction === "add") {
        const id = String(formData.get("id"));
        const description = String(formData.get("description"));

        setPendingFailures((prev) => [
          ...prev,
          {
            id,
            description,
          },
        ]);

        isAddFailure === true && setIsAddFailure(false);
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
        action="/ressource/form/failure"
        onSubmit={form.onSubmit}
      >
        <p className="mb-4 font-semibold text-base">New Failure</p>
        <input hidden name="key" defaultValue="failure" />
        <input hidden name="id" defaultValue={window.crypto.randomUUID()} />

        <div className="row-start-3 col-span-2">
          <Label htmlFor={fields.description.id}>Description</Label>
          <TextAreaConform
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
            Create
          </Button>
        </div>
      </RemixForm>
    </FormProvider>
  );
}
