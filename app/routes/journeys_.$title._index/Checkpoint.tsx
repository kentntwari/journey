import { z } from "zod";
import { nanoid } from "nanoid";
import { format } from "date-fns";

import { cn } from "~/utils/cn";
import { skimmedCheckpointSchema } from "~/utils/schemas";

interface CheckPointsProps extends React.ComponentProps<"div"> {
  data: z.infer<typeof skimmedCheckpointSchema>;
  isLast: boolean;
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

export function Checkpoint({ data, isLast, className }: CheckPointsProps) {
  return (
    <li
      className={cn(
        "grid grid-cols-[12px_repeat(3,1fr)] grid-rows-[28px_1fr]",
        className
      )}
    >
      <div className="ml-2 -mt-[4px] col-start-2 row-start-1 h-fit">
        <span className="text-sm">{format(data.startDate, "PPP")}</span>
      </div>
      <div className="col-start-1 row-start-1 row-span-2 flex flex-col items-center">
        <span className="block w-3 h-3 bg-neutral-grey-900 rounded-full"></span>
        <span
          className={`block ${
            isLast ? "invisible" : ""
          } w-[1px] h-40 text-center bg-neutral-grey-900`}
        ></span>
      </div>
      <div className="col-start-2 col-span-3 row-start-2 h-[112px] ml-2 -mt-[4px] px-4 py-3 flex flex-col justify-between bg-white rounded-lg shadow-sm">
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
                  ? data.milestones.length
                  : metric.title === "challenges"
                  ? data.challenges.length
                  : data.failures.length}
              </span>
            </div>
          ))}
        </footer>
      </div>
    </li>
  );
}
