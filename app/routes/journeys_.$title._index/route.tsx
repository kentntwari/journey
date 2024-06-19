import type { LoaderFunctionArgs } from "@remix-run/node";

import { Suspense, Fragment } from "react";
import { Ellipsis, ListFilter } from "lucide-react";
import { ScopeProvider as JotaiScopedProvider } from "jotai-scope";

import { useParams, redirect, Form } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { useTypedLoaderData, TypedAwait, typeddefer } from "remix-typedjson";

import { getJourneyCheckpoints } from "./db.server";
import { verifyUser, redirectIfNotAuthenticated } from "~/.server/verifyUser";

import { Modal } from "./Modal";
import { Checkpoint } from "./Checkpoint";

import { Button } from "~/components/ui/button";

import { isDialogOpenAtom } from "~/utils/atoms";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (params.title) {
    const { user } = await verifyUser(request);

    if (!user) throw redirectIfNotAuthenticated(params.title);

    return typeddefer({ checkpoints: getJourneyCheckpoints(params.title) });
  }

  throw redirect("/journeys");
}

export default function Journey() {
  const params = useParams();

  const { checkpoints } = useTypedLoaderData<typeof loader>();

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
      <footer className="grow bg-neutral-grey-300 px-2 py-4 rounded-lg border border-neutral-grey-500 shadow-none">
        <Suspense fallback={<p>Loading...</p>}>
          <TypedAwait resolve={checkpoints} errorElement={<p>Error</p>}>
            {(checkpoints) => (
              <ClientOnly>
                {() => (
                  <JotaiScopedProvider atoms={[isDialogOpenAtom]}>
                    <Modal>
                      {checkpoints.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-[280px] space-y-4">
                            <span className="block text-sm text-center text-neutral-grey-900">
                              No checkpoints yet
                            </span>
                            <Form>
                              <Modal.Btn
                                size="md"
                                variant="primary"
                                name="_action"
                                value="add"
                              >
                                Add checkpoint
                              </Modal.Btn>
                            </Form>
                          </div>
                        </div>
                      ) : null}

                      {checkpoints.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="block font-semibold text-sm text-neutral-grey-900">
                              {checkpoints.length}{" "}
                              {checkpoints.length > 1
                                ? "checkpoints"
                                : "checkpoint"}{" "}
                              found
                            </span>

                            <div className="flex items-center gap-2">
                              <Button
                                size="xs"
                                variant="neutral"
                                className="w-fit bg-neutral-grey-500"
                              >
                                <ListFilter size="20" />
                              </Button>
                              <Form>
                                <Modal.Btn
                                  size="xs"
                                  variant="primary"
                                  name="_action"
                                  value="add"
                                >
                                  Add checkpoint
                                </Modal.Btn>
                              </Form>
                            </div>
                          </div>
                          <ul className="p-0 m-0 mt-7">
                            {checkpoints.map((checkpoint, _, arr) => (
                              <Fragment key={checkpoint.id}>
                                <Checkpoint
                                  data={checkpoint}
                                  isLast={
                                    checkpoint === arr.at(-1) ? true : false
                                  }
                                />
                              </Fragment>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </Modal>
                  </JotaiScopedProvider>
                )}
              </ClientOnly>
            )}
          </TypedAwait>
        </Suspense>
      </footer>
    </section>
  );
}

export function ErrorBoundary() {
  return <p>Error</p>;
}
