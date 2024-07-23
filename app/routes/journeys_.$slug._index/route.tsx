import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

import { Suspense, Fragment } from "react";
import { Ellipsis, MoveLeft } from "lucide-react";
import { ScopeProvider as JotaiScopedProvider } from "jotai-scope";

import { redirect, useSubmit, useNavigate } from "@remix-run/react";
import { useTypedLoaderData, TypedAwait, typeddefer } from "remix-typedjson";

import * as db from "./db.server";
import { verifyUser, redirectIfNotAuthenticated } from "~/.server/verifyUser";

import { Button } from "~/components/ui/button";

import { Title } from "./Title";
import { Modal } from "./Modal";
import { Options } from "./Options";
import { Checkpoint } from "./Checkpoint";
import { FetchingJourneySkeleton } from "./Skeletons";

import { isDialogOpenAtom } from "~/utils/atoms";

Journey.Skeleton = FetchingJourneySkeleton;

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (params.slug) {
    const { user } = await verifyUser(request);
    if (!user) throw redirectIfNotAuthenticated(params.slug);

    return typeddefer({ data: db.getJourney(params.slug) });
  }

  throw redirect("/journeys");
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { user } = await verifyUser(request);
  if (!user) throw redirectIfNotAuthenticated(params.slug);

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (!intent) return null;

  switch (String(intent)) {
    case "update-title":
      try {
        const title = String(formData.get("title"));
        await db.updateJourneyTitle(params.slug ?? "", title);
        return redirect(`/journeys/${title}`);
      } catch (error) {
        return null;
      }

    case "end":
      try {
        await db.endJourney(params.slug ?? "");
        return redirect(`/journeys/${params.slug}`);
      } catch (error) {
        return null;
      }

    case "resume":
      try {
        await db.resumeJourney(params.slug ?? "");
        return redirect(`/journeys/${params.slug}`);
      } catch (error) {
        return null;
      }

    case "delete":
      try {
        await db.deleteJourney(params.slug ?? "");
        return redirect("/journeys");
      } catch (error) {
        return null;
      }

    default:
      return null;
  }
}

export default function Journey() {
  const submit = useSubmit();

  const { data } = useTypedLoaderData<typeof loader>();

  return (
    <Suspense fallback={<Journey.Skeleton />}>
      <TypedAwait resolve={data} errorElement={<ErrorElement />}>
        {({ checkpoints, currentJourney }) => (
          <section className="mt-6 px-3 flex flex-col gap-4">
            <header className="bg-transparent space-y-4 border-none rounded-none shadow-none">
              <div className="flex items-center justify-between">
                <div className="bg-blue-300 h-7 px-2 flex items-center justify-center font-medium text-sm text-blue-1000 rounded-full">
                  Current journey
                </div>
                <Options status={currentJourney.isEnded ?? false}>
                  <Button
                    size={"xs"}
                    variant="neutral"
                    className="bg-transparent border-none shadow-none"
                  >
                    <Ellipsis size={24} className="text-neutral-grey-1000" />
                  </Button>
                </Options>
              </div>
              <Title />
            </header>
            <footer className="grow bg-neutral-grey-300 px-2 py-4 rounded-lg border border-neutral-grey-500 shadow-none">
              <JotaiScopedProvider atoms={[isDialogOpenAtom]}>
                <Modal shouldResetCheckpointRelatedAtoms>
                  {checkpoints.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-[280px] space-y-4">
                        <span className="block text-sm text-center text-neutral-grey-900">
                          No checkpoints yet
                        </span>
                        {currentJourney.isEnded ? null : (
                          <Modal.ForceOpenBtn
                            size="md"
                            variant="primary"
                            name="_action"
                            value="add"
                          >
                            Add checkpoint
                          </Modal.ForceOpenBtn>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {checkpoints.length > 0 ? (
                    <>
                      <div
                        className={`flex items-center ${
                          currentJourney.isEnded
                            ? "justify-start"
                            : "justify-between"
                        }`}
                      >
                        <span className="block font-semibold text-sm text-neutral-grey-900">
                          {checkpoints.length}{" "}
                          {checkpoints.length > 1
                            ? "checkpoints"
                            : "checkpoint"}{" "}
                          found
                        </span>

                        {currentJourney.isEnded ? null : (
                          <div className="flex items-center gap-2">
                            <Modal.ForceOpenBtn
                              size="xs"
                              variant="primary"
                              name="_action"
                              value="add"
                            >
                              Add checkpoint
                            </Modal.ForceOpenBtn>
                          </div>
                        )}
                      </div>
                      <ul className="p-0 m-0 mt-7 md:mt-28 md:max-w-[680px] md:mx-auto">
                        {checkpoints.map((checkpoint, _, arr) => (
                          <Fragment key={checkpoint.slug}>
                            <Checkpoint.Snippet
                              data={{
                                title: checkpoint.title,
                                slug: checkpoint.slug,
                                startDate: checkpoint.startDate,
                                milestones: checkpoint._count.milestones,
                                challenges: checkpoint._count.challenges,
                                failures: checkpoint._count.failures,
                              }}
                              isLast={checkpoint === arr.at(-1) ? true : false}
                              className="relative"
                            >
                              <Modal.ForceOpenBtn
                                name="_action"
                                value="read"
                                variant="neutral"
                                className="absolute w-full h-full inset-0"
                                style={{ opacity: 0 }}
                                executeFn={() => {
                                  submit(null, {
                                    action:
                                      "/ressource/checkpoint/" +
                                      checkpoint.slug,
                                    method: "POST",
                                    fetcherKey: "get-checkpoint-details",
                                    navigate: false,
                                  });
                                }}
                              ></Modal.ForceOpenBtn>
                            </Checkpoint.Snippet>
                          </Fragment>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </Modal>
              </JotaiScopedProvider>
            </footer>
          </section>
        )}
      </TypedAwait>
    </Suspense>
  );
}

function ErrorElement() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center gap-2">
      <h2 className="font-bold text-xl">Oops...</h2>
      <p className="text-base">It seems that this journey does not exist</p>
      <Button
        variant="neutral"
        className="mt-2 flex items-center gap-2"
        onClick={() => navigate("/journeys")}
      >
        <MoveLeft size={16} className="text-neutral-grey-900" />
        Expore other
      </Button>
    </div>
  );
}
