import type { loader } from "./route";

import { z } from "zod";
import { nanoid } from "nanoid";
import { format } from "date-fns";
import { X, Ellipsis, ChevronLeft, ChevronRight } from "lucide-react";

import { Suspense } from "react";

import { useNavigation, useSubmit } from "@remix-run/react";
import { useTypedRouteLoaderData, TypedAwait } from "remix-typedjson";

import { useHandleCloseModal } from "~/hooks/useHandleCloseModal";
import { useCurrentCheckpointDetails } from "~/hooks/useCurrentCheckpointDetails";
import { useResetCheckpointRelatedAtoms } from "~/hooks/useResetCheckpointRelatedAtoms";

import { Form } from "~/routes/ressource.form.checkpoint/route";
import { Tabs } from "~/routes/ressource.form.checkpoint/Tabs";

import * as Skeletons from "./Skeletons";

import { cn } from "~/utils/cn";
import { skimmedCheckpointSchema, milestoneSchema } from "~/utils/schemas";

import { getJourneyCheckpoints } from "./db.server";
import { generateCheckpointId, getCurrentPosition } from "./generate";

const metrics = [
  {
    title: "milestones",
    hue: "text-green-800",
    order: 0,
  },
  {
    title: "challenges",
    hue: "text-squash-900",
    order: 1,
  },
  {
    title: "failures",
    hue: "text-red-900",
    order: 2,
  },
] as const;

export const Checkpoint = {
  Snippet,
  Form,
  DetailsHeader: Header,
  DetailsBody: Body,
  Skeleton: {
    Header: Skeletons.FetchingHeaderSkeleton,
    Body: Skeletons.FetchingBodySkeleton,
  },
} as const;

interface ICheckPointsProps extends React.ComponentProps<"div"> {
  data: z.infer<typeof skimmedCheckpointSchema>;
  isLast: boolean;
  children?: React.ReactNode;
}

function Snippet({ data, isLast, className, children }: ICheckPointsProps) {
  return (
    <li
      className={cn(
        "grid grid-cols-[12px_repeat(3,1fr)] grid-rows-[28px_1fr]",
        className
      )}
    >
      <div className="ml-2 -mt-[4px] col-start-2 row-start-1 h-fit">
        <span className="text-sm">{format(data.startDate, "PPP")}</span>
      </div>
      <div className="col-start-1 row-start-1 row-span-2 flex flex-col items-center">
        <span className="block w-3 h-3 bg-neutral-grey-900 rounded-full"></span>
        <span
          className={`block ${
            isLast ? "invisible" : ""
          } w-[1px] h-40 text-center bg-neutral-grey-900`}
        ></span>
      </div>
      <div className="col-start-2 col-span-3 row-start-2 h-[112px] ml-2 -mt-[4px] px-4 py-3 flex flex-col justify-between bg-white rounded-lg shadow-sm">
        <header>
          <p className="font-medium text-sm">{data.title}</p>
        </header>
        <footer className="w-full flex justify-between">
          {metrics.map((metric, index) => (
            <div
              key={nanoid()}
              className={`h-10 w-fit order-[${metric.order}]`}
            >
              <span className={`block uppercase text-2xs ${metric.hue}`}>
                {index === 0
                  ? "Milestones"
                  : index === 1
                  ? "Challenges"
                  : "Failures"}
              </span>
              <span className={`block font-bold text-base ${metric.hue}`}>
                {metric.title == "milestones"
                  ? data.milestones
                  : metric.title === "challenges"
                  ? data.challenges
                  : data.failures}
              </span>
            </div>
          ))}
        </footer>
      </div>
      {children}
    </li>
  );
}

function Header() {
  const navigation = useNavigation();

  const { handleCloseModal } = useHandleCloseModal({ shouldNavigate: true });

  const deferredCheckpoints = useTypedRouteLoaderData<typeof loader>(
    "routes/journeys_.$title._index"
  );

  return (
    <header className="w-full flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="font-medium text-sm">View checkpoint</span>

        {deferredCheckpoints ? (
          <Suspense fallback={<p>Loading positions...</p>}>
            <TypedAwait
              resolve={deferredCheckpoints.checkpoints}
              errorElement={<p>Failed to load</p>}
            >
              {(checkpoints) => <LoadPosition checkpoints={checkpoints} />}
            </TypedAwait>
          </Suspense>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          name="_action"
          value="edit"
          disabled={navigation.state !== "idle"}
        >
          <span className="block h-5 uppercase font-medium text-sm text-blue-900">
            Edit
          </span>
        </button>
        <button type="button" className="w-6 inline-flex justify-end">
          <Ellipsis size={20} />
        </button>
        <button
          type="button"
          className="w-6 inline-flex justify-end"
          onClick={handleCloseModal}
        >
          <X size={20} />
        </button>
      </div>
    </header>
  );
}

interface ILoadPositionProps {
  checkpoints: Awaited<ReturnType<typeof getJourneyCheckpoints>>;
}

function LoadPosition({ checkpoints }: ILoadPositionProps) {
  const submit = useSubmit();

  const data = useCurrentCheckpointDetails();

  const { resetAtoms } = useResetCheckpointRelatedAtoms();

  function loadCheckpoint(id: string) {
    submit(null, {
      action: "/ressource/checkpoint/" + id,
      method: "POST",
      navigate: false,
      fetcherKey: "get-checkpoint-details",
    });
  }

  function disableLoading() {
    if (!data) return true;

    if (checkpoints.length === 1) return true;

    return false;
  }

  const currentPosition = !data?.results?.id
    ? "-"
    : getCurrentPosition(data.results.id, checkpoints) + 1;

  const id = generateCheckpointId(data?.results?.id, checkpoints);

  return (
    <>
      <div className="pl-2 inline-flex items-center gap-2 border-l border-neutral-grey-700">
        <button
          type="button"
          disabled={disableLoading()}
          onClick={() => {
            if (id?.prev) loadCheckpoint(id.prev);
            resetAtoms();
          }}
        >
          <ChevronLeft size={20} className="text-neutral-grey-1000" />
        </button>
        <button
          type="button"
          disabled={disableLoading()}
          onClick={() => {
            if (id?.next) loadCheckpoint(id.next);
            resetAtoms();
          }}
        >
          <ChevronRight size={20} className="text-neutral-grey-1000" />
        </button>
        <span className="font-medium text-xs text-neutral-grey-800">
          {currentPosition} of {checkpoints.length}
        </span>
      </div>
    </>
  );
}
//
function Body() {
  const data = useCurrentCheckpointDetails();

  if (!data) return <Checkpoint.Skeleton.Body />;

  if (data.error)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
        Couldn't find this checkpoint
      </div>
    );

  if (data.results)
    return (
      <>
        <header className="space-y-3">
          <span className="badge-date">
            {format(data.results.startDate, "PPP")}
          </span>
          <h2 className="capitalize font-semibold text-xl">
            {data.results.title}
          </h2>
        </header>

        <div className="mt-4 p-3 space-y-2 min-h-[200px] border border-neutral-grey-500 rounded-lg">
          <span className="block uppercase text-2xs text-neutral-grey-900">
            Description
          </span>
          <p className="text-sm">{data.results.description}</p>
        </div>

        <footer className="mt-8">
          <Tabs
            initialValues={{
              milestones: data.results.milestones as z.infer<
                typeof milestoneSchema
              >[],
              challenges: data.results.challenges,
              failures: data.results.failures,
            }}
          />
        </footer>
      </>
    );
}
