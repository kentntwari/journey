import { format } from "date-fns";
import * as React from "react";

import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/utils/cn";
import {
  FieldMetadata,
  unstable_useControl as useControl,
} from "@conform-to/react";

export function StartDate({
  meta,
  children,
  className,
}: {
  meta: FieldMetadata<Date>;
  children?: (date: string) => React.ReactNode;
  className?: string;
}) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const control = useControl(meta);

  return (
    <div>
      <input
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        ref={control.register}
        name={meta.name}
        defaultValue={
          meta.initialValue ? new Date(meta.initialValue).toISOString() : ""
        }
        onFocus={() => {
          triggerRef.current?.focus();
        }}
      />
      <div className={cn("flex items-center gap-2", className)}>
        {control.value && children
          ? children(format(control.value, "PPP"))
          : null}

        <Popover>
          <PopoverTrigger asChild>
            <button
              ref={triggerRef}
              className="bg-transparent uppercase text-blue-900"
            >
              {control.value ? (
                <span className="inherit">Change</span>
              ) : (
                <span className="inherit">Select start date</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date(control.value ?? "")}
              onSelect={(value) => control.change(value?.toISOString() ?? "")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
