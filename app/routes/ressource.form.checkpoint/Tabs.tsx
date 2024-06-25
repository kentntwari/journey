import { useAtomValue } from "jotai";

import * as UITabs from "~/components/ui/tabs";

import {
  pendingMilestonesAtom,
  pendingChallengesAtom,
  pendingFailuresAtom,
} from "~/utils/atoms";

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

interface IUITabs {
  defaultValue?: (typeof checkpointTabs)[number]["tab"];
  showTicker?: boolean;
  children: (
    currentTab: (typeof checkpointTabs)[number]["tab"]
  ) => React.ReactNode;
}

export function Tabs({
  defaultValue = "milestones",
  showTicker = true,
  children,
}: IUITabs) {
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
            {children(tab)}
          </UITabs.TabsContent>
        ))}
      </UITabs.Tabs>
      ;
    </>
  );
}

function Ticker({ tab }: { tab: (typeof checkpointTabs)[number]["tab"] }) {
  const pendingMilestones = useAtomValue(pendingMilestonesAtom);
  const pendingChallenges = useAtomValue(pendingChallengesAtom);
  const pendingFailures = useAtomValue(pendingFailuresAtom);

  switch (tab) {
    case "milestones":
      return <small>{pendingMilestones.length}</small>;

    case "challenges":
      return <small>{pendingChallenges.length}</small>;

    case "failures":
      return <small>{pendingFailures.length}</small>;

    default:
      return null;
  }
}
