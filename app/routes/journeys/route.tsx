import { getKindeSession } from "@kinde-oss/kinde-remix-sdk";

import { useState } from "react";
import { useLoaderData, useFetcher, json } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

import Button from "~/components/base/Button";

import prisma from "~/utils/prisma";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getUser } = await getKindeSession(request);
  const user = await getUser();

  if (!user) throw redirect("/kinde-auth/login?returnTo=/journeys");

  const data = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
    select: {
      journeys: {
        select: {
          id: true,
          title: true,
          checkpoints: true,
          updatedAt: true,
        },
      },
    },
  });

  return json({ journeys: data?.journeys || [], currentUser: user.given_name });
}

export default function Journeys() {
  const [isFirstJourney, setIsFirstJourney] = useState(false);

  const { journeys, currentUser } = useLoaderData<typeof loader>();

  const fetcher = useFetcher({ key: "journeys" });

  return (
    <>
      <fetcher.Form>
        {journeys.length === 0 && (
          <>
            <section className="px-3 m-auto flex flex-col items-center gap-4">
              <p className="font-semibold text-base text-center text-balance">
                Hi {currentUser}, <br /> So good to see you here where you can
                finally document your career journey
              </p>
              {!isFirstJourney ? (
                <Button
                  type="button"
                  variant="primary"
                  size="medium"
                  onClick={() => setIsFirstJourney(true)}
                >
                  Get started
                </Button>
              ) : (
                <div className="w-full h-44 p-4 flex flex-col justify-between items-end bg-global-blue-200 border border-global-blue-900 rounded-lg">
                  <div className="w-full space-y-1">
                    <input
                      type="text"
                      placeholder="Write title here..."
                      className="w-full h-[72px] bg-transparent border border-global-neutral-grey-500 rounded-lg"
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
                      onClick={() => setIsFirstJourney(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="button" variant="primary" size="2xs">
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </fetcher.Form>
    </>
  );
}
