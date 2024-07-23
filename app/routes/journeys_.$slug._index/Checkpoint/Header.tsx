import type { loader } from "../route";

import { useSetAtom } from "jotai";
import { FormProvider, getFormProps } from "@conform-to/react";
import { X, ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";

import { Suspense } from "react";

import {
  useSubmit,
  useNavigation,
  useSearchParams,
  Form as RemixForm,
} from "@remix-run/react";
import { useTypedRouteLoaderData, TypedAwait } from "remix-typedjson";

import { useCKForm } from "~/hooks/forms/checkpoint/useCKForm";
import { useHandleCloseModal } from "~/hooks/useHandleCloseModal";
import { useCurrentCheckpointDetails } from "~/hooks/useCurrentCheckpointDetails";
import { useResetCheckpointRelatedAtoms } from "~/hooks/useResetCheckpointRelatedAtoms";

import * as Popover from "~/components/ui/popover";
import { Alert } from "../Alert";

import {
  isEditCheckpointStartDateAtom,
  isEditCheckpointTitleAtom,
  isEditCheckpointDescriptionAtom,
} from "~/utils/atoms";

import { getJourney } from "../db.server";
import { generateCheckpointId, getCurrentPosition } from "./generate";

interface ILoadPositionProps {
  checkpoints: Awaited<ReturnType<typeof getJourney>>["checkpoints"];
}

export function Header() {
  const deferred = useTypedRouteLoaderData<typeof loader>(
    "routes/journeys_.$title._index"
  );

  return (
    <Alert>
      <header className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-medium text-sm">View checkpoint</span>

          {deferred ? (
            <Suspense fallback={<p>Loading positions...</p>}>
              <TypedAwait
                resolve={deferred.data}
                errorElement={<p>Failed to load</p>}
              >
                {({ checkpoints }) => (
                  <LoadPositions checkpoints={checkpoints} />
                )}
              </TypedAwait>
            </Suspense>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <ToggleEditOptionsBtn />
          <ExitBtn />
        </div>
      </header>

      <>
        <Alert.Header>
          <Alert.Title>Are you absolutely sure?</Alert.Title>
          <Alert.Description>
            This action cannot be undone. This will permanently delete this
            checkpoint and all related data
          </Alert.Description>
        </Alert.Header>
        <Alert.Cancel>Cancel</Alert.Cancel>
        <DeleteCheckpointBtn />
      </>
    </Alert>
  );
}

export function LoadPositions({ checkpoints }: ILoadPositionProps) {
  const submit = useSubmit();

  const data = useCurrentCheckpointDetails();

  const { resetAtoms } = useResetCheckpointRelatedAtoms();

  function loadCheckpoint(id: string) {
    submit(null, {
      action: "/ressource/checkpoint/" + id,
      method: "POST",
      navigate: false,
      fetcherKey: "get-checkpoint-details",
    });
  }

  function disableLoading() {
    if (!data) return true;

    if (checkpoints.length === 1) return true;

    return false;
  }

  const currentPosition = !data?.results?.slug
    ? "-"
    : getCurrentPosition(data.results.slug, checkpoints) + 1;

  const id = generateCheckpointId(data?.results?.slug, checkpoints);

  return (
    <>
      <div className="pl-2 inline-flex items-center gap-2 border-l border-neutral-grey-700">
        <button
          type="button"
          disabled={disableLoading()}
          onClick={() => {
            if (id?.prev) loadCheckpoint(id.prev);
            resetAtoms();
          }}
        >
          <ChevronLeft size={20} className="text-neutral-grey-1000" />
        </button>
        <button
          type="button"
          disabled={disableLoading()}
          onClick={() => {
            if (id?.next) loadCheckpoint(id.next);
            resetAtoms();
          }}
        >
          <ChevronRight size={20} className="text-neutral-grey-1000" />
        </button>
        <span className="font-medium text-xs text-neutral-grey-800">
          {currentPosition} of {checkpoints.length}
        </span>
      </div>
    </>
  );
}

function ToggleEditOptionsBtn() {
  const navigation = useNavigation();

  const [, setSearchParams] = useSearchParams();

  return (
    <Popover.Popover>
      <Popover.PopoverTrigger asChild>
        <button
          type="button"
          className="w-6 inline-flex justify-end"
          disabled={navigation.state !== "idle"}
        >
          <Ellipsis size={20} />
        </button>
      </Popover.PopoverTrigger>
      <Popover.PopoverContent className="w-fit px-3 py-2 border-0">
        <EditDateBtn />
        <EditTitleBtn />
        <EditDescriptionBtn />

        <Popover.PopoverClose asChild>
          <Alert.Trigger
            name="_action"
            value="delete"
            className="bg-transparent px-0 py-1.5 block text-sm font-semibold text-red-800"
            onClick={() => {
              setSearchParams((prev) => {
                prev.set("_action", "delete");
                return prev;
              });
            }}
          >
            Delete checkpoint
          </Alert.Trigger>
        </Popover.PopoverClose>
      </Popover.PopoverContent>
    </Popover.Popover>
  );
}

function EditDateBtn() {
  const setIsEditStartDate = useSetAtom(isEditCheckpointStartDateAtom);

  return (
    <button
      className="py-1.5 block text-sm font-semibold"
      onClick={() => setIsEditStartDate(true)}
    >
      Change date
    </button>
  );
}

function EditTitleBtn() {
  const setIsEditTitle = useSetAtom(isEditCheckpointTitleAtom);

  return (
    <button
      className="py-1.5 block text-sm font-semibold"
      onClick={() => setIsEditTitle(true)}
    >
      Change title
    </button>
  );
}

function EditDescriptionBtn() {
  const setIsEditDescription = useSetAtom(isEditCheckpointDescriptionAtom);

  return (
    <button
      className="py-1.5 block text-sm font-semibold"
      onClick={() => setIsEditDescription(true)}
    >
      Change description
    </button>
  );
}

function DeleteCheckpointBtn() {
  const [form] = useCKForm({
    shouldRevalidate: "onSubmit",
    model: "delete-checkpoint",
  });

  const { handleCloseModal } = useHandleCloseModal();

  return (
    <>
      <FormProvider context={form.context}>
        <RemixForm
          key={form.key}
          {...getFormProps(form)}
          method="post"
          action="/ressource/form/checkpoint"
          onSubmit={(e) => {
            form.onSubmit(e);
            handleCloseModal();
          }}
        >
          <Alert.Action type="submit" className="w-full bg-red-800">
            Delete
          </Alert.Action>
        </RemixForm>
      </FormProvider>
    </>
  );
}

function ExitBtn() {
  const { handleCloseModal } = useHandleCloseModal({ shouldNavigate: true });

  return (
    <button
      type="button"
      className="w-6 inline-flex justify-end"
      onClick={handleCloseModal}
    >
      <X size={20} />
    </button>
  );
}
