import { z } from "zod";
import { nanoid } from "nanoid";
import { Plus } from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { useSearchParams } from "@remix-run/react";

import { Fragment } from "react";

import { Button } from "~/components/ui/button";
import * as Popover from "~/components/ui/popover";

import { Form } from "../routes/ressource.form.milestone/Form";

import { pendingMilestonesAtom, isAddMilestoneAtom } from "~/utils/atoms";
import { milestoneSchema } from "~/utils/schemas";

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
