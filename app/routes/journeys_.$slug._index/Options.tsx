import { useAtom, useSetAtom } from "jotai";
import { useFetcher } from "@remix-run/react";

import * as Popover from "~/components/ui/popover";

import { Alert } from "./Alert";

import { isEndJourneyAtom } from "~/utils/atoms";

interface IOptionsProps
  extends React.ComponentPropsWithoutRef<typeof Popover.Popover> {
  status: boolean;
}

export function Options({ children, status }: IOptionsProps) {
  const [isOpen, setIsOpen] = useAtom(isEndJourneyAtom);

  return (
    <Alert>
      <Popover.Popover open={isOpen} onOpenChange={setIsOpen}>
        <Popover.PopoverTrigger asChild>{children}</Popover.PopoverTrigger>
        <Popover.PopoverContent className="w-fit px-3 py-2 border-0">
          <EndJourneyBtn isEnded={status} />

          <Alert.Trigger
            name="_action"
            value="delete"
            className="bg-transparent px-0 py-1.5 block text-sm font-semibold text-red-800"
          >
            Delete journey
          </Alert.Trigger>
        </Popover.PopoverContent>
      </Popover.Popover>

      <>
        <Alert.Header>
          <Alert.Title>Are you absolutely sure?</Alert.Title>
          <Alert.Description>
            This action cannot be undone. This will permanently delete this
            journey and all related data
          </Alert.Description>
        </Alert.Header>
        <Alert.Cancel>Cancel</Alert.Cancel>
        <DeleteJourneyBtn />
      </>
    </Alert>
  );
}

function DeleteJourneyBtn() {
  const fetcher = useFetcher({ key: "delete-journey" });

  return (
    <fetcher.Form
      method="DELETE"
      onSubmit={(e) => {
        fetcher.submit(e.currentTarget, {
          method: "DELETE",
          navigate: false,
        });
      }}
    >
      <input name="intent" defaultValue="delete" hidden />
      <Alert.Action type="submit" className="w-full bg-red-800">
        Delete
      </Alert.Action>
    </fetcher.Form>
  );
}

interface IEndJourneyBtnProps {
  isEnded: boolean;
}

function EndJourneyBtn({ isEnded }: IEndJourneyBtnProps) {
  const setEndJourney = useSetAtom(isEndJourneyAtom);

  const fetcher = useFetcher({
    key: isEnded ? "resume-journey" : "end-journey",
  });

  return (
    <fetcher.Form
      method="PUT"
      onSubmit={(e) => {
        fetcher.submit(e.currentTarget);
        setEndJourney(false);
      }}
    >
      <input name="intent" defaultValue={isEnded ? "resume" : "end"} hidden />
      <button
        type="submit"
        className="py-1.5 block text-sm font-medium capitalize"
      >
        {isEnded ? "Resume journey" : "End journey"}
      </button>
    </fetcher.Form>
  );
}
