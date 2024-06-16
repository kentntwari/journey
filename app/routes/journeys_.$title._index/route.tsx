import type { LoaderFunctionArgs } from "@remix-run/node";

import { Suspense } from "react";
import { Ellipsis } from "lucide-react";

import {
  useParams,
  useLoaderData,
  defer,
  redirect,
  Await,
} from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";

import { getJourneyCheckpoints } from "./db.server";
import { verifyUser, redirectIfNotAuthenticated } from "~/.server/verifyUser";

import { Modal } from "./Modal";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (params.title) {
    const { user } = await verifyUser(request);

    if (!user) throw redirectIfNotAuthenticated(params.title);

    return defer({ checkpoints: getJourneyCheckpoints(params.title) });
  }

  throw redirect("/journeys");
}

export default function Journey() {
  const params = useParams();

  const { checkpoints } = useLoaderData<typeof loader>();

  return (
    <section className="mt-6 px-3 flex flex-col gap-4">
      <header className="bg-transparent space-y-4 border-none rounded-none shadow-none">
        <div className="flex items-center justify-between">
          <div className="bg-blue-300 h-7 px-2 flex items-center justify-center font-medium text-sm text-blue-1000 rounded-full">
            Current journey
          </div>
          <Ellipsis size={24} className="text-neutral-grey-1000" />
        </div>
        <h2 className="capitalize font-semibold text-xl truncate overflow-hidden">
          {params.title}
        </h2>
      </header>
      <footer className="grow bg-neutral-grey-300 rounded-lg border border-neutral-grey-500 shadow-none">
        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={checkpoints} errorElement={<p>Error</p>}>
            {(checkpoints) => (
              <ClientOnly>
                {() => (
                  <Modal>
                    {checkpoints.length === 0 ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-[280px] space-y-4">
                          <span className="block text-sm text-center text-neutral-grey-900">
                            No checkpoints yet
                          </span>

                          <Modal.Btn>Add checkpoint</Modal.Btn>
                        </div>
                      </div>
                    ) : null}

                    {checkpoints.length > 0 ? (
                      <>
                        {checkpoints.map((checkpoint) => (
                          <div key={checkpoint.id}>
                            {checkpoint.milestones.map((milestone) => (
                              <div key={milestone.id}>
                                {milestone.description}
                              </div>
                            ))}
                          </div>
                        ))}
                      </>
                    ) : null}
                  </Modal>
                )}
              </ClientOnly>
            )}
          </Await>
        </Suspense>
      </footer>
    </section>
  );
}

export function ErrorBoundary() {
  return <p>Error</p>;
}
