import type React from "react";

import { z } from "zod";
import { Plus } from "lucide-react";

import { useAtomValue, useSetAtom } from "jotai";

import { useSearchParams } from "@remix-run/react";

import { Form } from "~/routes/ressource.form.milestone/route";

import { Button } from "~/components/ui/button";
import * as Popover from "~/components/ui/popover";

import { milestoneSchema } from "~/utils/schemas";
import { isAddMilestoneAtom, pendingMilestonesAtom } from "~/utils/atoms";

interface Milestonesprops {
  initialValues: z.infer<typeof milestoneSchema>[];
  children?: React.ReactNode;
}

Milestones.Form = Form;

export function Milestones({ initialValues }: Milestonesprops) {
  const pendingMilestones = useAtomValue(pendingMilestonesAtom);

  const isAddMilestone = useAtomValue(isAddMilestoneAtom);

  const [searchParams] = useSearchParams();

  const currentAction = searchParams.get("_action");

  if ([...pendingMilestones, ...initialValues].length === 0)
    return (
      <>
        {isAddMilestone ? (
          <div className="form-wrapper-milestone">
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
    <Popover.Popover>
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
            <div className="form-wrapper-milestone">
              <Milestones.Form />
            </div>
          </Popover.PopoverContent>{" "}
        </div>

        <div>{JSON.stringify(pendingMilestones)}</div>
      </div>
    </Popover.Popover>
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
