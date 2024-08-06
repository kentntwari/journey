import React from "react";

import { z } from "zod";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

import { Link } from "@remix-run/react";

import { Separator } from "~/components/ui/separator";

import { cn } from "~/utils/cn";
import { journeySchema } from "~/utils/schemas";

interface JourneyProps extends React.ComponentProps<"article"> {
  data: z.infer<typeof journeySchema>;
}

export function Journey({ data, className }: JourneyProps) {
  return (
    <>
      <article className={cn("", className)}>
        <Link
          to={`/journeys/${data.slug}`}
          prefetch="intent"
          className="bg-white p-4 min-h-[138px] xl:min-h-[216px] h-full flex flex-col justify-between items-start rounded-lg shadow-sm"
        >
          <div className="grow space-y-4">
            <header>
              <p className="font-semibold text-base">{data.title}</p>
            </header>
            <Checkpoints data={data.checkpoints} />
            {data.checkpoints.length > 2 && (
              <small className="block text-xs text-neutral-grey-900">
                {data.checkpoints.length - 2} more checkpoints
              </small>
            )}
          </div>
          <Separator className="bg-neutral-grey-500 mt-4 mb-2" />
          <footer className="text-xs text-neutral-grey-900">
            Last updated: {format(data.updatedAt, "PPP")}
          </footer>
        </Link>
      </article>
    </>
  );
}

interface ICheckpointsProps {
  data: z.infer<typeof journeySchema>["checkpoints"];
}

function Checkpoints({ data }: ICheckpointsProps) {
  if (data.length === 0)
    return (
      <span className="block text-xs text-neutral-grey-900">
        No checkpoints yet!
      </span>
    );

  const sliced = [...data].slice(0, 2);

  return (
    <div className="flex flex-col gap-[2px]">
      {sliced.map((checkpoint, _, arr) => (
        <React.Fragment key={checkpoint.slug}>
          <div className="flex items-center gap-2">
            <ChevronRight size={12} />
            <small className="text-xs">{checkpoint.title}</small>
          </div>
          {checkpoint !== arr.at(-1) ? (
            <div className="flex flex-col gap-[2px]">
              {new Array(4).fill(null).map((_, i) => (
                <span
                  key={i}
                  className="bg-neutral-grey-700 w-[4px] h-[4px] rounded-full"
                ></span>
              ))}
            </div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}
