import { z } from "zod";
import { nanoid } from "nanoid";
import { format } from "date-fns";

import { cn } from "~/utils/cn";
import { skimmedCheckpointSchema } from "~/utils/schemas";

interface ISnippetProps extends React.ComponentProps<"div"> {
  data: z.infer<typeof skimmedCheckpointSchema>;
  isLast: boolean;
  children?: React.ReactNode;
}

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

export function Snippet({ data, isLast, className, children }: ISnippetProps) {
  return (
    <li
      className={cn(
        "grid grid-cols-[12px_repeat(3,1fr)] md:grid-cols-[0.5fr_12px_1fr] grid-rows-[28px_1fr]",
        className
      )}
    >
      <div className="ml-2 md:ml-0 -mt-[4px] col-start-2 md:col-start-1 row-start-1 h-fit md:flex md:items-center md:gap-4">
        <span className="text-sm text-nowrap">
          {format(data.startDate, "PPP")}
        </span>
        <span className="hidden md:block h-[1px] w-full bg-neutral-grey-900"></span>
      </div>
      <div className="col-start-1 md:col-start-2 row-start-1 row-span-2 flex flex-col items-center">
        <span className="block w-3 h-3 bg-neutral-grey-900 rounded-full"></span>
        <span
          className={`block ${
            isLast ? "invisible" : ""
          } w-[1px] h-40 text-center bg-neutral-grey-900`}
        ></span>
      </div>
      <div className="col-start-2 md:col-start-3 col-span-3 row-start-2 md:row-start-1 h-[112px] ml-2 md:ml-6 -mt-[4px] px-4 py-3 flex flex-col justify-between bg-white rounded-lg shadow-sm">
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
