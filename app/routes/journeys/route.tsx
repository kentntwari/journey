import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { useForm, getFormProps, getTextareaProps } from "@conform-to/react";

import { useState } from "react";
import {
  useLoaderData,
  useActionData,
  useFetcher,
  json,
  redirect,
} from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";

import { verifyUser, redirectIfNotAuthenticated } from "~/.server/verifyUser";
import * as db from "./db.server";

const schema = z.object({
  user: z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  title: z.string().min(1).max(100),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await verifyUser(request);

  if (!user) throw redirectIfNotAuthenticated();

  const data = await db.getUserJourneys(user.email);

  return json({
    journeys: data?.journeys || [],
    currentUser: {
      id: user.id,
      email: user.email,
      firstName: user.given_name,
      lastName: user.family_name,
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  await db.createUserJourney(
    {
      email: submission.value.user.email,
      firstName: submission.value.user.firstName,
      lastName: submission.value.user.lastName,
    },
    submission.value.title
  );

  json({ ok: true });

  return redirect(`/?value=${JSON.stringify(submission.value.title)}`);
}

export default function Journeys() {
  const [addJourney, setAddJourney] = useState(false);

  const { journeys, currentUser } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const fetcher = useFetcher<typeof action>({ key: "journeys" });

  const [form, fields] = useForm({
    // // Sync the result of last submission
    lastResult,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },

    shouldValidate: "onBlur",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set("user.email", currentUser.email);
    formData.set("user.firstName", currentUser.firstName);
    formData.set("user.lastName", currentUser.lastName);

    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  }

  return (
    <section
      className={`px-3 min-h-[30rem] ${
        journeys.length === 0 ? "m-auto" : "auto"
      } space-y-4`}
    >
      {journeys.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold text-base text-center text-balance">
            Hi {currentUser.firstName}, <br /> So good to see you here where you
            can finally document your career journey
          </p>
          {!addJourney ? (
            <Button size="md" onClick={() => setAddJourney(true)}>
              Get started
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="h-8 flex items-center justify-between">
          <span className="font-semibold text-base">
            {journeys.length} {journeys.length > 1 ? "journeys" : "journey"}{" "}
            found
          </span>
          <div className="space-x-2">
            <Button variant="neutral" size="xs">
              Filters
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={() => setAddJourney(true)}
            >
              Create
            </Button>
          </div>
        </div>
      )}

      {addJourney && (
        <>
          <fetcher.Form
            method="POST"
            className="w-full"
            {...getFormProps(form)}
            onSubmit={handleSubmit}
          >
            <div className="w-full h-44 p-4 flex flex-col justify-between items-end bg-blue-200 border border-blue-900 rounded-lg">
              <div className="w-full space-y-1">
                <Textarea
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
                  onClick={() => setAddJourney(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="2xs">
                  Save
                </Button>
              </div>
            </div>
          </fetcher.Form>
        </>
      )}

      {journeys.length > 0 ? (
        <>
          {journeys.map((journey) => (
            <article
              key={journey.id}
              className="bg-white p-4 min-h-[138px] max-h-[216px] flex flex-col justify-between items-start rounded-lg shadow-sm"
            >
              <header className="grow space-y-4">
                <p className="font-semibold text-base">{journey.title}</p>
                {journey.checkpoints.length > 0 ? (
                  <></>
                ) : (
                  <span className="block text-xs text-neutral-grey-900">
                    No checkpoints yet!
                  </span>
                )}
              </header>
              <Separator className="bg-neutral-grey-500 mb-2" />
              <footer className="text-xs text-neutral-grey-900">
                Last updated: {journey.updatedAt}
              </footer>
            </article>
          ))}
        </>
      ) : null}
    </section>
  );
}
