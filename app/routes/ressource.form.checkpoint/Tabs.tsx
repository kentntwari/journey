import { z } from "zod";
import { nanoid } from "nanoid";
import { Plus } from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { useSearchParams } from "@remix-run/react";

import { Fragment } from "react";

import * as UITabs from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import * as Popover from "~/components/ui/popover";

import { useCurrentCheckpointDetails } from "~/hooks/useCurrentCheckpointDetails";

import { Challenges } from "./Challenges";
import { Failures } from "./Failures";

import { Form } from "../ressource.form.milestone/Form";

import {
  pendingMilestonesAtom,
  pendingChallengesAtom,
  pendingFailuresAtom,
  isAddMilestoneAtom,
} from "~/utils/atoms";

import {
  milestoneSchema,
  challengeSchema,
  failureSchema,
} from "~/utils/schemas";

const checkpointTabs = [
  {
    tab: "milestones",
    colors:
      "data-[state=active]:text-green-700 data-[state=active]:border-green-700",
  },
  {
    tab: "challenges",
    colors:
      "data-[state=active]:text-squash-700 data-[state=active]:border-squash-700",
  },
  {
    tab: "failures",
    colors:
      "data-[state=active]:text-red-700 data-[state=active]:border-red-700",
  },
] as const;

interface IUITabsWithInitialValues {
  defaultValue?: (typeof checkpointTabs)[number]["tab"];
  showTicker?: boolean;
  initialValues: {
    milestones: z.infer<typeof milestoneSchema>[];
    challenges: z.infer<typeof challengeSchema>[];
    failures: z.infer<typeof failureSchema>[];
  };
  children?: never;
}
interface IUITabsWithChildren {
  defaultValue?: (typeof checkpointTabs)[number]["tab"];
  showTicker?: boolean;
  initialValues?: never;
  children: (
    currentTab: (typeof checkpointTabs)[number]["tab"]
  ) => React.ReactNode;
}

export function Tabs({
  defaultValue = "milestones",
  showTicker = true,
  initialValues,
  children,
}: IUITabsWithInitialValues | IUITabsWithChildren) {
  return (
    <>
      <UITabs.Tabs defaultValue={defaultValue}>
        <UITabs.TabsList className="px-3 py-0 w-full justify-start items-end border border-l-0 border-r-0 border-t-0 border-b-neutral-grey-500 rounded-none">
          {checkpointTabs.map(({ tab, colors }) => (
            <UITabs.TabsTrigger
              key={tab}
              value={tab}
              className={`px-2 min-w-[140px] h-10 flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:font-semibold capitalize ${colors}`}
            >
              <span className="block inherit">{tab}</span>
              {showTicker ? <Ticker tab={tab} /> : null}
            </UITabs.TabsTrigger>
          ))}
        </UITabs.TabsList>
        {checkpointTabs.map(({ tab }) => (
          <UITabs.TabsContent
            key={tab}
            value={tab}
            className="relative min-h-[240px] mt-4 px-3"
          >
            <>
              {typeof initialValues !== "undefined" && (
                <>
                  {tab === "milestones" ? (
                    <Milestones initialValues={initialValues.milestones} />
                  ) : null}

                  {tab === "challenges" ? (
                    <Challenges initialValues={initialValues.challenges} />
                  ) : null}

                  {tab === "failures" ? (
                    <Failures initialValues={initialValues.failures} />
                  ) : null}
                </>
              )}

              {typeof initialValues === "undefined" && children(tab)}
            </>
          </UITabs.TabsContent>
        ))}
      </UITabs.Tabs>
    </>
  );
}

function Ticker({ tab }: { tab: (typeof checkpointTabs)[number]["tab"] }) {
  const initialValues = useCurrentCheckpointDetails();

  const defaultmilestones = initialValues?.results
    ? [...initialValues.results.milestones]
    : [];

  const defaultChallenges = initialValues?.results
    ? [...initialValues.results.challenges]
    : [];

  const defaultFailures = initialValues?.results
    ? [...initialValues.results.failures]
    : [];

  const pendingMilestones = useAtomValue(pendingMilestonesAtom);
  const pendingChallenges = useAtomValue(pendingChallengesAtom);
  const pendingFailures = useAtomValue(pendingFailuresAtom);

  const [searchParams] = useSearchParams();

  const currentAction = searchParams.get("_action");

  switch (tab) {
    case "milestones":
      return (
        <small>
          {currentAction === "add"
            ? [...pendingMilestones].length
            : [...pendingMilestones, ...defaultmilestones].length}
        </small>
      );

    case "challenges":
      return (
        <small>
          {currentAction === "add"
            ? [...pendingChallenges].length
            : [...pendingChallenges, ...defaultChallenges].length}
        </small>
      );

    case "failures":
      return (
        <small>
          {currentAction === "add"
            ? [...pendingFailures].length
            : [...pendingFailures, ...defaultFailures].length}
        </small>
      );

    default:
      return null;
  }
}

//TODO::Extract in its own component
interface IMilestonesProps {
  initialValues: z.infer<typeof milestoneSchema>[];
  children?: React.ReactNode;
}

interface ISingleMilestoneProps extends React.ComponentProps<"article"> {
  status: z.infer<typeof milestoneSchema>["status"];
  description: string;
}

Milestones.Form = Form;

export function Milestones({ initialValues }: IMilestonesProps) {
  const [isAddMilestone, setIsAddMilestone] = useAtom(isAddMilestoneAtom);

  const pendingMilestones = useAtomValue(pendingMilestonesAtom);

  const [searchParams] = useSearchParams();
  const currentAction = searchParams.get("_action");

  if ([...pendingMilestones, ...initialValues].length === 0)
    return (
      <>
        {isAddMilestone ? (
          <div className="form-wrapper">
            <Milestones.Form />
          </div>
        ) : (
          <div className="mt-20 w-full flex flex-col justify-center items-center gap-4">
            <p className="w-fit font-semibold text-sm text-neutral-grey-900">
              No milestones yet!
            </p>
            <ToggleMilestoneFormBtn />
          </div>
        )}
      </>
    );

  return (
    <>
      <Popover.Popover open={isAddMilestone} onOpenChange={setIsAddMilestone}>
        <div className="space-y-4">
          <div className="w-full flex items-center justify-between">
            {currentAction === "add" && pendingMilestones.length > 0 ? (
              <p className="font-semibold text-sm text-neutral-900">
                {pendingMilestones.length}{" "}
                {pendingMilestones.length === 1 ? "milestone" : "milestones"}{" "}
                added
              </p>
            ) : null}
            <Popover.PopoverTrigger asChild>
              <Button type="button" variant="neutral" size="md">
                <Plus /> <span className="inherit">Add milestone</span>
              </Button>
            </Popover.PopoverTrigger>
            <Popover.PopoverContent className="p-0 border-none">
              <div className="form-wrapper">
                <Milestones.Form />
              </div>
            </Popover.PopoverContent>{" "}
          </div>

          <section className="space-y-3">
            {[...pendingMilestones, ...initialValues].map((milestone) => (
              <Fragment key={nanoid()}>
                <SingleMilestone
                  status={milestone.status}
                  description={milestone.description}
                />
              </Fragment>
            ))}
          </section>
        </div>
      </Popover.Popover>
    </>
  );
}

function SingleMilestone({ status, description }: ISingleMilestoneProps) {
  return (
    <article
      className={`px-4 py-3 font-medium text-sm text-neutral-grey-1000
       space-y-2 rounded-lg ${
         status === "completed"
           ? "bg-green-100 border border-green-500"
           : "bg-neutral-grey-200 border border-neutral-grey-600"
       }`}
    >
      <header className="flex items-center gap-2">
        <span
          className={`min-w-[72px] h-5 capitalize font-medium text-center
          text-2xs text-white rounded-[5px] ${
            status === "completed" ? "bg-green-800" : "bg-neutral-grey-1000"
          }`}
        >
          {status}
        </span>
      </header>
      <footer className="capitalize font-medium text-sm text-balance">
        {description}
      </footer>
    </article>
  );
}

function ToggleMilestoneFormBtn() {
  const setIsAddMilestone = useSetAtom(isAddMilestoneAtom);

  return (
    <Button
      type="button"
      variant="neutral"
      size="md"
      onClick={() => setIsAddMilestone(true)}
    >
      <Plus /> <span className="inherit">Add milestone</span>
    </Button>
  );
}
