import { z } from "zod";
import { useAtomValue } from "jotai";

import { useSearchParams } from "@remix-run/react";

import * as UITabs from "~/components/ui/tabs";

import { useCurrentCheckpointDetails } from "~/hooks/useCurrentCheckpointDetails";

import { Challenges } from "./Challenges";
import { Failures } from "./Failures";
import { Milestones } from "../../components/Milestones";

import {
  pendingMilestonesAtom,
  pendingChallengesAtom,
  pendingFailuresAtom,
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
