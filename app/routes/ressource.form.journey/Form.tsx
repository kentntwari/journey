import { parseWithZod } from "@conform-to/zod";
import {
  useForm,
  getFormProps,
  getTextareaProps,
  FormProvider,
} from "@conform-to/react";

import { useRef } from "react";

import {
  useNavigate,
  useFetchers,
  useSubmit,
  Form as RemixForm,
} from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

import { cn } from "~/utils/cn";
import { newJourneyschema } from "~/utils/schemas";

interface IFormProps extends React.ComponentPropsWithoutRef<typeof RemixForm> {}

export function Form({ className, ...props }: IFormProps) {
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const submit = useSubmit();

  const navigate = useNavigate();

  const fetchers = useFetchers();

  const fetcherInFlight = fetchers
    .map((f) => {
      if (f.key === "new-journey" && f.formData) return f;
    })
    .filter(Boolean)
    .find((f) => f.state === "submitting");

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: newJourneyschema });
    },
    onSubmit(event) {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      submit(formData, {
        method: "POST",
        action: "/ressource/form/journey",
        fetcherKey: "new-journey",
        navigate: false,
      });

      form.reset();
    },

    shouldRevalidate: "onInput",
  });

  return (
    <FormProvider context={form.context}>
      <RemixForm
        {...getFormProps(form)}
        method="POST"
        key={form.key}
        action="/ressource/form/journey"
        className={cn("w-full", className)}
        onSubmit={form.onSubmit}
      >
        <div className="w-full min-h-44 max-h-[216px] p-4 flex flex-col justify-between items-end bg-blue-200 border border-blue-900 rounded-lg">
          <div className="w-full space-y-1">
            <Textarea
              {...getTextareaProps(fields.title)}
              key={fields.title.key}
              ref={textInputRef}
              maxLength={100}
              placeholder="Write title here..."
              className="w-full h-[72px] pl-3 pr-2 pt-2 bg-transparent border border-neutral-grey-500 rounded-lg resize-none"
            />
            <small className="block text-2xs text-global-neutral-grey-900">
              Must be less than 500 words
            </small>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="neutral"
              size="2xs"
              onClick={() => navigate("/journeys")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="2xs"
              disabled={fetcherInFlight ? true : false}
            >
              Save
            </Button>
          </div>
        </div>
      </RemixForm>
    </FormProvider>
  );
}
