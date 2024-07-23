import type React from "react";

import { nan, z } from "zod";
import { nanoid } from "nanoid";
import { Plus } from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { useSearchParams } from "@remix-run/react";

import { Form } from "~/routes/ressource.form.challenge/Form";

import { Button } from "~/components/ui/button";
import * as Popover from "~/components/ui/popover";

import { challengeSchema } from "~/utils/schemas";
import { isAddChallengeAtom, pendingChallengesAtom } from "~/utils/atoms";

interface IchallengesProps {
  initialValues: z.infer<typeof challengeSchema>[];
  children?: React.ReactNode;
}

Challenges.Form = Form;

export function Challenges({ initialValues }: IchallengesProps) {
  const pendingChallenges = useAtomValue(pendingChallengesAtom);
  const [isAddChallenge, setIsAddChallenge] = useAtom(isAddChallengeAtom);

  const [searchParams] = useSearchParams();
  const currentAction = searchParams.get("_action");

  if ([...pendingChallenges, ...initialValues].length === 0)
    return (
      <>
        {isAddChallenge ? (
          <div className="form-wrapper">
            <Challenges.Form />
          </div>
        ) : (
          <div className="mt-20 w-full flex flex-col justify-center items-center gap-4">
            <p className="w-fit font-semibold text-sm text-neutral-grey-900">
              No challenges yet!
            </p>
            <ToggleChallengeFormBtn />
          </div>
        )}
      </>
    );

  return (
    <Popover.Popover open={isAddChallenge} onOpenChange={setIsAddChallenge}>
      <div className="space-y-4">
        <div className="w-full flex items-center justify-between">
          {currentAction === "add" && pendingChallenges.length > 0 ? (
            <p className="font-semibold text-sm text-neutral-900">
              {pendingChallenges.length}{" "}
              {pendingChallenges.length === 1 ? "challenge" : "challenges"}{" "}
              added
            </p>
          ) : null}
          <Popover.PopoverTrigger asChild>
            <Button type="button" variant="neutral" size="md">
              <Plus /> <span className="inherit">Add challenge</span>
            </Button>
          </Popover.PopoverTrigger>
          <Popover.PopoverContent className="p-0 border-none">
            <div className="form-wrapper">
              <Challenges.Form />
            </div>
          </Popover.PopoverContent>{" "}
        </div>

        <section className="space-y-3">
          {[...pendingChallenges, ...initialValues].map((challenge) => (
            <article
              key={nanoid()}
              className={`px-4 py-3 bg-neutral-grey-200 border border-neutral-grey-600 capitalize font-medium text-sm text-neutral-grey-1000 space-y-2 rounded-lg`}
            >
              {challenge.description}
            </article>
          ))}
        </section>
      </div>
    </Popover.Popover>
  );
}

function ToggleChallengeFormBtn() {
  const setIsAddChallenge = useSetAtom(isAddChallengeAtom);

  return (
    <Button
      type="button"
      variant="neutral"
      size="md"
      onClick={() => setIsAddChallenge(true)}
    >
      <Plus /> <span className="inherit">Add challenge</span>
    </Button>
  );
}
