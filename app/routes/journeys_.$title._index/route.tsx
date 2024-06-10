import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { Suspense } from "react";
import { Ellipsis } from "lucide-react";
import { Provider as JotaiProvider } from "jotai";

import {
  useParams,
  useLoaderData,
  defer,
  redirect,
  Await,
} from "@remix-run/react";

import { Button } from "~/components/ui/button";
import * as Dialog from "~/components/ui/dialog";

import * as CheckPoint from "~/routes/ressource.form.checkpoint/route";
import { getJourneyCheckpoints } from "./db.server";
import { verifyUser, redirectIfNotAuthenticated } from "~/.server/verifyUser";

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
              <Dialog.Dialog>
                {checkpoints.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-[280px] space-y-4">
                      <span className="block text-sm text-center text-neutral-grey-900">
                        No checkpoints yet
                      </span>
                      <Dialog.DialogTrigger asChild>
                        <Button size="md" className="w-full">
                          Add checkpoint
                        </Button>
                      </Dialog.DialogTrigger>
                    </div>
                  </div>
                ) : null}

                {checkpoints.length > 0 ? (
                  <>{JSON.stringify(checkpoints)}</>
                ) : null}

                <Dialog.DialogPortal>
                  <Dialog.DialogOverlay className="bg-black/60">
                    <Dialog.DialogContent className="inset-0 top-32 translate-x-0 translate-y-0 py-4 px-0 bg-neutral-grey-200 rounded-t-lg overflow-auto">
                      <JotaiProvider>
                        <CheckPoint.Form />
                      </JotaiProvider>
                    </Dialog.DialogContent>
                  </Dialog.DialogOverlay>
                </Dialog.DialogPortal>
              </Dialog.Dialog>
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
