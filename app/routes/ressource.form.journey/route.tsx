import type { ActionFunctionArgs } from "@remix-run/node";

import { parseWithZod } from "@conform-to/zod";
import { useForm, getFormProps, getTextareaProps } from "@conform-to/react";

import { useRef } from "react";

import {
  useNavigate,
  useSubmit,
  useActionData,
  useFetchers,
  json,
  redirect,
  Form as RemixForm,
} from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

import { verifyUser, redirectIfNotAuthenticated } from "~/.server/verifyUser";

import * as db from "./db.server";

import { newJourneyschema } from "~/utils/schemas";

export async function action({ request }: ActionFunctionArgs) {
  const { user: currentUser } = await verifyUser(request);

  if (!currentUser) throw redirectIfNotAuthenticated();

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: newJourneyschema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  await db.createUserJourney(
    {
      email: currentUser.email,
      firstName: currentUser.given_name,
      lastName: currentUser.family_name,
    },
    submission.value.title
  );

  json({ ok: true });

  return redirect(`/journeys?_action=new-journey`);
}

export function Form() {
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();

  const fetchers = useFetchers();

  const fetcherInFlight = fetchers
    .map((f) => {
      if (f.key === "new-journey" && f.formData) return f;
    })
    .filter(Boolean)
    .find((f) => f.state === "submitting");

  const submit = useSubmit();

  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    // // Sync the result of last submission
    lastResult,

    // Reuse the validation logic on the client
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
    },

    shouldRevalidate: "onInput",
  });

  return (
    <RemixForm
      method="POST"
      action="/ressource/form/journey"
      className="w-full"
      {...getFormProps(form)}
      onSubmit={form.onSubmit}
    >
      <div className="w-full h-44 p-4 flex flex-col justify-between items-end bg-blue-200 border border-blue-900 rounded-lg">
        <div className="w-full space-y-1">
          <Textarea
            ref={textInputRef}
            maxLength={100}
            placeholder="Write title here..."
            {...getTextareaProps(fields.title)}
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
  );
}
