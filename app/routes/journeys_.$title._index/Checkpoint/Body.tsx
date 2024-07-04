import { z } from "zod";
import { format } from "date-fns";
import { useAtom } from "jotai";
import { Pen } from "lucide-react";
import {
  FormProvider,
  unstable_useControl as useControl,
  getFormProps,
  getTextareaProps,
} from "@conform-to/react";

import { useRef } from "react";

import { Form, useFetcher } from "@remix-run/react";

import { useCKForm } from "~/hooks/forms/checkpoint/useCKForm";
import { useCurrentCheckpointDetails } from "~/hooks/useCurrentCheckpointDetails";

import { Tabs } from "~/routes/ressource.form.checkpoint/Tabs";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import * as Popover from "~/components/ui/popover";
import { TextAreaConform } from "~/components/conform/TextArea";

import * as Skeletons from "../Skeletons";

import { milestoneSchema } from "~/utils/schemas";
import {
  isEditCheckpointStartDateAtom,
  isEditCheckpointTitleAtom,
  isEditCheckpointDescriptionAtom,
} from "~/utils/atoms";

export function Body() {
  const data = useCurrentCheckpointDetails();

  if (!data) return <Skeletons.FetchingBodySkeleton />;

  if (data.error)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
        Couldn't find this checkpoint
      </div>
    );

  if (data.results)
    return (
      <>
        <header className="space-y-3">
          <StartDate date={data.results.startDate} />
          <Title title={data.results.title} />
        </header>

        <Description description={data.results.description} />

        <footer className="mt-8">
          <Tabs
            initialValues={{
              milestones: data.results.milestones as z.infer<
                typeof milestoneSchema
              >[],
              challenges: data.results.challenges,
              failures: data.results.failures,
            }}
          />
        </footer>
      </>
    );
}

function StartDate({ date }: { date: Date }) {
  const changesDetectedRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const confirmActionRef = useRef<HTMLDivElement>(null);

  const [isEditStartDate, setIsEditStartDate] = useAtom(
    isEditCheckpointStartDateAtom
  );

  const [form, fields] = useCKForm({
    shouldRevalidate: "onBlur",
    model: "startDate",
    defaultValue: {
      startDate: date,
    },
  });

  const control = useControl(fields.startDate);

  return (
    <Popover.Popover open={isEditStartDate} onOpenChange={setIsEditStartDate}>
      <FormProvider context={form.context}>
        <Form
          {...getFormProps(form)}
          key={form.key}
          method="POST"
          action="/ressource/form/checkpoint"
          onChange={(e) => {
            changesDetectedRef.current = true;
            confirmActionRef.current?.classList.remove(
              "invisible",
              "pointer-events-none"
            );
            confirmActionRef.current?.classList.add(
              "visible",
              "pointer-events-auto"
            );
          }}
          onReset={() => {
            changesDetectedRef.current = false;
            confirmActionRef.current?.classList.remove(
              "visible",
              "pointer-events-auto"
            );
            confirmActionRef.current?.classList.add(
              "invisible",
              "pointer-events-none"
            );
          }}
          onSubmit={(e) => {
            e.preventDefault();

            changesDetectedRef.current = false;

            confirmActionRef.current?.classList.remove(
              "visible",
              "pointer-events-auto"
            );
            confirmActionRef.current?.classList.add(
              "invisible",
              "pointer-events-none"
            );

            form.onSubmit(e);
          }}
        >
          <input
            className="sr-only"
            aria-hidden
            tabIndex={-1}
            ref={control.register}
            name={fields.startDate.name}
            defaultValue={fields.startDate.value}
            onFocus={() => {
              triggerRef.current?.focus();
            }}
          />
          <Popover.PopoverTrigger>
            <span ref={triggerRef} className="badge-date">
              {control.value ? format(control.value, "PPP") : ""}
            </span>
          </Popover.PopoverTrigger>
          <div
            ref={confirmActionRef}
            className="invisible pointer-events-none ml-8 inline-flex items-center gap-2"
          >
            <span>New changes?</span>
            <div className="space-x-3">
              <button
                type="submit"
                disabled={!changesDetectedRef.current}
                className="uppercase text-2xs text-blue-900"
              >
                Confirm
              </button>
              <button
                type="reset"
                disabled={!changesDetectedRef.current}
                className="uppercase text-2xs text-red-800"
              >
                Discard
              </button>
            </div>
          </div>

          <Popover.PopoverContent className="w-auto p-0 form-wrapper">
            <Calendar
              mode="single"
              selected={new Date(control.value ?? "")}
              onSelect={(value) => control.change(value?.toISOString() ?? "")}
              initialFocus
            />
            <input type="text" />
          </Popover.PopoverContent>
        </Form>
      </FormProvider>
    </Popover.Popover>
  );
}

function Title({ title }: { title: string }) {
  const titleRef = useRef<HTMLSpanElement>(null);

  const fetcher = useFetcher({ key: "update-checkpoint-title" });

  const [isEditTitle, setIsEditTitle] = useAtom(isEditCheckpointTitleAtom);

  const [form, fields] = useCKForm({
    shouldRevalidate: "onInput",
    model: "title",
    defaultValue: {
      title,
    },
  });

  return (
    <Popover.Popover open={isEditTitle} onOpenChange={setIsEditTitle}>
      <Popover.PopoverTrigger asChild>
        <button type="button" onClick={() => setIsEditTitle(true)}>
          <span
            ref={titleRef}
            className={`capitalize font-semibold text-xl ${
              isEditTitle ? "opacity-50" : "opacity-100"
            }`}
          >
            {title}
          </span>
        </button>
      </Popover.PopoverTrigger>
      <Popover.PopoverContent className="p-0 border-none">
        <FormProvider context={form.context}>
          <Form
            {...getFormProps(form)}
            key={form.key}
            method="POST"
            action="/ressource/form/checkpoint"
            onReset={() => {
              setIsEditTitle(false);
            }}
            onKeyUp={() => {
              if (titleRef.current && fields.title.value) {
                titleRef.current.innerText = fields.title.value;
              }
            }}
            onSubmit={form.onSubmit}
          >
            <div className="form-wrapper">
              <p className="mb-4 font-semibold text-base">Edit title</p>
              <div className="mt-2 row-start-3 col-span-2">
                <TextAreaConform
                  {...getTextareaProps(fields.title)}
                  key={fields.title.key}
                  meta={fields.title}
                />
                {<p>{fields.title.errors}</p>}
              </div>
              <div className="mt-4 row-start-4 col-span-2 flex items-center justify-end gap-3">
                <Button type="reset" size="sm" variant="neutral">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={fetcher.state !== "idle"}
                >
                  Save
                </Button>
              </div>
            </div>{" "}
          </Form>
        </FormProvider>
      </Popover.PopoverContent>{" "}
    </Popover.Popover>
  );
}

function Description({ description }: { description: string }) {
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const [isEditDescription, setIsEditDescription] = useAtom(
    isEditCheckpointDescriptionAtom
  );

  const fetcher = useFetcher({ key: "update-checkpoint-description" });

  const [form, fields] = useCKForm({
    shouldRevalidate: "onInput",
    model: "description",
    defaultValue: {
      description,
    },
  });

  return (
    <Popover.Popover
      open={isEditDescription}
      onOpenChange={setIsEditDescription}
    >
      <div className="mt-4 p-3 space-y-2 min-h-[200px] border border-neutral-grey-500 rounded-lg">
        <div className="w-full flex items-center justify-between">
          <span className="block uppercase text-2xs text-neutral-grey-900">
            Description
          </span>
          <Popover.PopoverAnchor asChild>
            <button type="button" onClick={() => setIsEditDescription(true)}>
              <Pen size={14} className="text-neutral-grey-900" />
            </button>
          </Popover.PopoverAnchor>
          <Popover.PopoverContent className="p-0 border-none">
            <FormProvider context={form.context}>
              <Form
                {...getFormProps(form)}
                key={form.key}
                method="POST"
                action="/ressource/form/checkpoint"
                onReset={() => {
                  setIsEditDescription(false);
                }}
                onKeyUp={() => {
                  if (descriptionRef.current && fields.description.value) {
                    descriptionRef.current.innerText = fields.description.value;
                  }
                }}
                onSubmit={form.onSubmit}
              >
                <div className="form-wrapper">
                  <p className="mb-4 font-semibold text-base">
                    Edit description
                  </p>
                  <div className="mt-2 row-start-3 col-span-2">
                    <TextAreaConform
                      {...getTextareaProps(fields.description)}
                      key={fields.description.key}
                      meta={fields.description}
                    />
                    {<p>{fields.description.errors}</p>}
                  </div>
                  <div className="mt-4 row-start-4 col-span-2 flex items-center justify-end gap-3">
                    <Button type="reset" size="sm" variant="neutral">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      variant="primary"
                      disabled={fetcher.state !== "idle"}
                    >
                      Save
                    </Button>
                  </div>
                </div>{" "}
              </Form>
            </FormProvider>
          </Popover.PopoverContent>{" "}
        </div>

        <p
          ref={descriptionRef}
          className={`text-sm ${
            isEditDescription ? "opacity-50" : "opacity-100"
          }`}
        >
          {description}
        </p>
      </div>
    </Popover.Popover>
  );
}
