import React from "react";

import { z } from "zod";
import { format } from "date-fns";

import { Link } from "@remix-run/react";

import { Separator } from "~/components/ui/separator";

import { journeySchema } from "~/utils/schemas";

interface JourneyProps extends React.ComponentProps<"article"> {
  data: z.infer<typeof journeySchema>;
}

export function Journey({ data }: JourneyProps) {
  return (
    <>
      <article>
        <Link
          to={`/journeys/${data.title}`}
          prefetch="intent"
          className="bg-white p-4 min-h-[138px] max-h-[216px] flex flex-col justify-between items-start rounded-lg shadow-sm"
        >
          <div className="grow space-y-4">
            <header>
              <p className="font-semibold text-base">{data.title}</p>
            </header>
            {data.checkpoints.length > 0 ? (
              <></>
            ) : (
              <span className="block text-xs text-neutral-grey-900">
                No checkpoints yet!
              </span>
            )}
          </div>
          <Separator className="bg-neutral-grey-500 mb-2" />
          <footer className="text-xs text-neutral-grey-900">
            Last updated: {format(data.updatedAt, "PPP")}
          </footer>
        </Link>
      </article>
    </>
  );
}
