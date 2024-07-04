import { useSetAtom } from "jotai";
import { FormProvider } from "@conform-to/react";
import { getFormProps, getTextareaProps } from "@conform-to/react";

import { Form as RemixForm } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { TextAreaConform } from "~/components/conform/TextArea";

import { useCKForm } from "~/hooks/forms/checkpoint/useCKForm";

import { isAddFailureAtom } from "~/utils/atoms";

export function Form() {
  const [form, fields] = useCKForm({
    shouldRevalidate: "onBlur",
    model: "failure",
  });

  return (
    <FormProvider context={form.context}>
      <RemixForm
        {...getFormProps(form)}
        key={form.key}
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
            key={fields.description.key}
            meta={fields.description}
          />
          {<p>{fields.description.errors}</p>}
        </div>
        <div className="mt-4 row-start-4 col-span-2 flex items-center justify-end gap-3">
          <CloseFailureFormBtn />
          <Button type="submit" size="sm" variant="primary">
            Create
          </Button>
        </div>
      </RemixForm>
    </FormProvider>
  );
}

function CloseFailureFormBtn() {
  const setIsFailureFormOpen = useSetAtom(isAddFailureAtom);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="neutral"
        className="w-[72px]"
        onClick={() => setIsFailureFormOpen(false)}
      >
        Cancel
      </Button>
    </>
  );
}
