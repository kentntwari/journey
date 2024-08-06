import type { LoaderFunctionArgs } from "@remix-run/node";

import { Fragment } from "react";

import { useSearchParams, Form } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import { Button } from "~/components/ui/button";
import { Form as CreateNewJourney } from "../ressource.form.journey/Form";

import { Journey } from "./Journey";

import { verifyUser, redirectIfNotAuthenticated } from "~/.server/verifyUser";
import * as db from "./db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await verifyUser(request);
  if (!user) throw redirectIfNotAuthenticated();

  const journeys = await db.getUserJourneys({
    id: user.id,
    firstName: user.given_name,
    lastName: user.family_name,
  });

  return typedjson({
    journeys,
    currentUser: {
      firstName: user.given_name,
      lastName: user.family_name,
    },
  });
}
export default function Journeys() {
  const { journeys, currentUser } = useTypedLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const currentAction = searchParams.get("_action");

  return (
    <section
      className={`mt-4 px-3 min-h-[30rem] ${
        journeys.length === 0
          ? "mx-auto"
          : "grid grid-rows-[auto_1fr] gap-y-4 xl:gap-y-8 "
      }`}
    >
      {journeys.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold text-base text-center text-balance">
            Hi {currentUser.firstName}, <br /> So good to see you here where you
            can finally document your career journey
          </p>
          <Form>
            <Button size="md" name="_action" value="new-journey">
              Get started
            </Button>
          </Form>
        </div>
      ) : (
        <div className="row-start-1 col-start-1 col-end-[-1] h-8 flex items-center justify-between">
          <span className="font-semibold text-xl">
            {journeys.length} {journeys.length > 1 ? "journeys" : "journey"}{" "}
            found
          </span>
          <div className="space-x-2">
            <Form className="inline">
              <Button
                variant="primary"
                size="xs"
                name="_action"
                value="new-journey"
              >
                Create
              </Button>
            </Form>
          </div>
        </div>
      )}

      <div className="grid [grid-auto-rows:max-content] grid-cols-[repeat(auto-fill,minmax(390px,1fr))] gap-4">
        {currentAction === "new-journey" ? (
          <CreateNewJourney className="col-start-1 xl:*:h-full" />
        ) : null}

        {journeys.length > 0 ? (
          <>
            {journeys.map((journey) => (
              <Fragment key={journey.slug}>
                <Journey data={journey} />
              </Fragment>
            ))}
          </>
        ) : null}
      </div>
    </section>
  );
}

export function ErrorBoundary() {
  return (
    <div className="absolute left-1/2 right-1/2 translate-y-1/2 -translate-x-1/2 w-fit">
      An error occurred
    </div>
  );
}
