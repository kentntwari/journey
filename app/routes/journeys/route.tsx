import type { LoaderFunctionArgs } from "@remix-run/node";

import { Fragment } from "react";

import { useSearchParams, Form } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import { Button } from "~/components/ui/button";
import { Form as CreateNewJourney } from "../ressource.form.journey/route";

import { Journey } from "./Journey";

import { verifyUser, redirectIfNotAuthenticated } from "~/.server/verifyUser";
import * as db from "./db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await verifyUser(request);

  if (!user) throw redirectIfNotAuthenticated();

  const data = await db.getUserJourneys(user.email);

  return typedjson({
    journeys: data?.journeys || [],
    currentUser: {
      id: user.id,
      email: user.email,
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
        journeys.length === 0 ? "m-auto" : "auto"
      } space-y-4`}
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
        <div className="h-8 flex items-center justify-between">
          <span className="font-semibold text-base">
            {journeys.length} {journeys.length > 1 ? "journeys" : "journey"}{" "}
            found
          </span>
          <div className="space-x-2">
            <Button variant="neutral" size="xs">
              Filters
            </Button>
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

      {currentAction === "new-journey" ? <CreateNewJourney /> : null}

      {journeys.length > 0 ? (
        <>
          {journeys.map((journey) => (
            <Fragment key={journey.id}>
              <Journey data={journey} />
            </Fragment>
          ))}
        </>
      ) : null}
    </section>
  );
}

export function ErrorBoundary() {
  return <p>Error</p>;
}
