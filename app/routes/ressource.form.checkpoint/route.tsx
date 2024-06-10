import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { ShouldRevalidateFunctionArgs } from "@remix-run/react";

import { parseWithZod } from "@conform-to/zod";
import {
  FormProvider,
  useForm,
  getFormProps,
  getTextareaProps,
  getInputProps,
} from "@conform-to/react";

import { Ellipsis, XIcon } from "lucide-react";

import { useParams } from "@remix-run/react";

import { Milestones } from "./milestones";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import * as Dialog from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import * as zodSchema from "~/utils/schemas";

export async function loader({ params, request }: LoaderFunctionArgs) {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  return null;
}

export async function shouldRevalidate({
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  return false;
}

export function Form() {
  const params = useParams();

  const [form, fields] = useForm({
    id: "checkpoint",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: zodSchema.checkpointSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const milestones = fields.milestones.getFieldList();
  const challenges = fields.challenges.getFieldList();
  const failures = fields.failures.getFieldList();

  return (
    <>
      <section className="px-3">
        <FormProvider context={form.context}>
          <form
            {...getFormProps(form)}
            method="POST"
            action="/ressource/form/checkpoint"
            onSubmit={(e) => e.preventDefault()}
          >
            <header className="flex items-center justify-between">
              <h3 className="font-semibold text-xl">New checkpoint</h3>
              <div className="flex items-center gap-3">
                <Button type="submit" size="sm" className="w-[72px]">
                  Save
                </Button>
                <button type="button">
                  <Ellipsis size={24} className="text-neutral-grey-1000" />
                </button>
                <Dialog.DialogClose>
                  <XIcon size={24} className="text-neutral-grey-1000" />
                </Dialog.DialogClose>
              </div>
            </header>

            <fieldset className="mt-10 space-y-6">
              <button type="button" className="uppercase text-blue-900">
                SELECT START DATE
              </button>

              <div className="space-y-4">
                <div className="flex flex-col gap-y-[5px]">
                  <label htmlFor="title" className="font-medium text-sm">
                    Title*
                  </label>
                  <Input
                    {...getInputProps(fields.title, {
                      type: "text",
                    })}
                    id="title"
                    placeholder="Write title here..."
                    className="bg-white border-neutral-grey-500 rounded-lg shadow-none placeholder:font-normal placeholder:text-sm placeholder:text-neutral-grey-900"
                  />
                  <small className="text-2xs text-neutral-grey-900">
                    Must be less than 50 words
                  </small>
                </div>

                <div className="flex flex-col gap-y-[5px]">
                  <label htmlFor="title" className="font-medium text-sm">
                    Description*
                  </label>
                  <Textarea
                    {...getTextareaProps(fields.description)}
                    id="description"
                    className="h-24 bg-white border-neutral-grey-500 rounded-lg shadow-none"
                  />
                  <small className="text-2xs text-neutral-grey-900">
                    Must be less than 1000 words
                  </small>
                </div>
              </div>
            </fieldset>
          </form>
        </FormProvider>
      </section>
      <section className="mt-8">
        <Tabs defaultValue="milestones">
          <TabsList className="px-3 py-0 w-full justify-start items-end border border-l-0 border-r-0 border-t-0 border-b-neutral-grey-500 rounded-none">
            {checkpointTabs.map(({ tab, colors }) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={`px-2 min-w-[140px] h-10 flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:font-semibold capitalize ${colors}`}
              >
                <span className="block inherit">{tab}</span>
                <small
                  className={`block min-w-5 h-[18px] tabular-nums rounded`}
                >
                  {tab === "milestones"
                    ? milestones.length
                    : tab === "challenges"
                    ? challenges.length
                    : failures.length}
                </small>
              </TabsTrigger>
            ))}
          </TabsList>
          {checkpointTabs.map(({ tab }) => (
            <TabsContent
              key={tab}
              value={tab}
              className="relative min-h-[240px] mt-4 px-3"
            >
              {tab === "milestones" ? (
                <>
                  {!!params.checkpoint ? null : (
                    <Milestones initialValues={[]} />
                  )}
                </>
              ) : null}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </>
  );
}

const checkpointTabs = [
  {
    tab: "milestones",
    colors:
      "data-[state=active]:text-green-700 data-[state=active]:border-green-700",
  },
  {
    tab: "challenges",
    colors:
      "data-[state=active]:text-squash-700 data-[state=active]:border-squash-700",
  },
  {
    tab: "failures",
    colors:
      "data-[state=active]:text-red-700 data-[state=active]:border-red-700",
  },
] as const;