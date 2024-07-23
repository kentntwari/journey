import type React from "react";

import { z } from "zod";
import { nanoid } from "nanoid";
import { Plus } from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { useSearchParams } from "@remix-run/react";

import { Form } from "~/routes/ressource.form.failure/Form";

import { Button } from "~/components/ui/button";
import * as Popover from "~/components/ui/popover";

import { failureSchema } from "~/utils/schemas";
import { isAddFailureAtom, pendingFailuresAtom } from "~/utils/atoms";

interface IFailuresProps {
  initialValues: z.infer<typeof failureSchema>[];
  children?: React.ReactNode;
}

Failures.Form = Form;

export function Failures({ initialValues }: IFailuresProps) {
  const pendingFailures = useAtomValue(pendingFailuresAtom);
  const [isAddFailure, setIsAddFailure] = useAtom(isAddFailureAtom);

  const [searchParams] = useSearchParams();
  const currentAction = searchParams.get("_action");

  if ([...pendingFailures, ...initialValues].length === 0)
    return (
      <>
        {isAddFailure ? (
          <div className="form-wrapper">
            <Failures.Form />
          </div>
        ) : (
          <div className="mt-20 w-full flex flex-col justify-center items-center gap-4">
            <p className="w-fit font-semibold text-sm text-neutral-grey-900">
              No failures yet!
            </p>
            <ToggleFailureFormBtn />
          </div>
        )}
      </>
    );

  return (
    <Popover.Popover open={isAddFailure} onOpenChange={setIsAddFailure}>
      <div className="space-y-4">
        <div className="w-full flex items-center justify-between">
          {currentAction === "add" && pendingFailures.length > 0 ? (
            <p className="font-semibold text-sm text-neutral-900">
              {pendingFailures.length}{" "}
              {pendingFailures.length === 1 ? "failure" : "failures"} added
            </p>
          ) : null}
          <Popover.PopoverTrigger asChild>
            <Button type="button" variant="neutral" size="md">
              <Plus /> <span className="inherit">Add failure</span>
            </Button>
          </Popover.PopoverTrigger>
          <Popover.PopoverContent className="p-0 border-none">
            <div className="form-wrapper">
              <Failures.Form />
            </div>
          </Popover.PopoverContent>{" "}
        </div>

        <section className="space-y-3">
          {[...pendingFailures, ...initialValues].map((failure) => (
            <article
              key={nanoid()}
              className={`px-4 py-3 bg-neutral-grey-200 border border-neutral-grey-600 capitalize font-medium text-sm text-neutral-grey-1000 space-y-2 rounded-lg`}
            >
              {failure.description}
            </article>
          ))}
        </section>
      </div>
    </Popover.Popover>
  );
}

function ToggleFailureFormBtn() {
  const setIsAddFailure = useSetAtom(isAddFailureAtom);

  return (
    <Button
      type="button"
      variant="neutral"
      size="md"
      onClick={() => setIsAddFailure(true)}
    >
      <Plus /> <span className="inherit">Add failure</span>
    </Button>
  );
}
