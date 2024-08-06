import { useRef } from "react";

import { useAtom } from "jotai";
import { parseWithZod } from "@conform-to/zod";
import {
  useForm,
  FormProvider,
  getFormProps,
  getTextareaProps,
} from "@conform-to/react";

import { useParams, useSubmit, useFetcher, Form } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import * as Popover from "~/components/ui/popover";
import { TextAreaConform } from "~/components/conform/TextArea";

import { journeySchema } from "~/utils/schemas";
import { isEditJourneyTitleAtom } from "~/utils/atoms";

export function Title() {
  const params = useParams();

  const submit = useSubmit();

  const titleRef = useRef<HTMLHeadingElement>(null);

  const [isEditTitle, setIsEditTitle] = useAtom(isEditJourneyTitleAtom);

  const [form, fields] = useForm({
    id: "update-journey-title",
    defaultValue: {
      title: params.title,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: journeySchema.pick({ title: true }),
      });
    },
    onSubmit(e) {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      formData.append("intent", "update-title");
      submit(formData, {
        method: "PUT",
        navigate: false,
        fetcherKey: form.id,
      });

      form.reset();
    },
  });

  const fetcher = useFetcher({ key: form.id });

  return (
    <Popover.Popover open={isEditTitle} onOpenChange={setIsEditTitle}>
      <Popover.PopoverTrigger>
        <h1
          ref={titleRef}
          className={`capitalize font-semibold text-xl truncate overflow-hidden ${
            isEditTitle ? "opacity-60" : "opacity-100"
          }`}
        >
          {params.slug}
        </h1>
      </Popover.PopoverTrigger>
      <Popover.PopoverContent className="p-0 border-none">
        <FormProvider context={form.context}>
          <Form
            {...getFormProps(form)}
            key={form.key}
            method="POST"
            onKeyUp={() => {
              if (titleRef.current && fields.title.value) {
                titleRef.current.innerText = fields.title.value;
              }
            }}
            onReset={() => setIsEditTitle(false)}
            onSubmit={form.onSubmit}
          >
            <div className="form-wrapper">
              <p className="mb-4 font-semibold text-base">Edit title</p>
              <div className="mt-2 row-start-3 col-span-2">
                <TextAreaConform
                  {...getTextareaProps(fields.title)}
                  key={fields.title.key}
                  meta={fields.title}
                />
                {<p>{fields.title.errors}</p>}
              </div>
              <div className="mt-4 row-start-4 col-span-2 flex items-center justify-end gap-3">
                <Popover.PopoverClose asChild>
                  <Button type="reset" size="sm" variant="neutral">
                    Cancel
                  </Button>
                </Popover.PopoverClose>

                <Popover.PopoverClose asChild>
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    disabled={fetcher.state !== "idle"}
                  >
                    Save
                  </Button>
                </Popover.PopoverClose>
              </div>
            </div>
          </Form>
        </FormProvider>
      </Popover.PopoverContent>
    </Popover.Popover>
  );
}
