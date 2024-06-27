import type * as React from "react";

import { useAtom, useSetAtom, useAtomValue } from "jotai";

import { useMemo } from "react";

import { useNavigation, useSearchParams } from "@remix-run/react";

import { useHandleCloseModal } from "~/hooks/useHandleCloseModal";
import { useResetCheckpointRelatedAtoms } from "~/hooks/useResetCheckpointRelatedAtoms";

import { Checkpoint } from "./Checkpoint";

import * as Dialog from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

import { cn } from "~/utils/cn";
import { isDialogOpenAtom } from "~/utils/atoms";

interface IModalProps {
  children: React.ReactNode;
  shouldResetCheckpointRelatedAtoms?: boolean;
}

interface IToggleModalBtnProps
  extends Omit<React.ComponentProps<typeof Button>, "type"> {
  children?: React.ReactNode;
  executeFn?: () => void;
}

Modal.ToggleBtn = ToggleModalBtn;

export function Modal({
  children,
  shouldResetCheckpointRelatedAtoms = false,
}: IModalProps) {
  const [open, setOpen] = useAtom(isDialogOpenAtom);

  const [searchParams] = useSearchParams();
  const action = searchParams.get("_action");

  const { handleCloseModal } = useHandleCloseModal({ shouldNavigate: true });

  const { resetAtoms } = useResetCheckpointRelatedAtoms();

  const memoizedChildren = useMemo(() => {
    if (!action)
      return (
        <div className="px-3">
          <Checkpoint.Skeleton.Header />
          <Checkpoint.Skeleton.Body />
        </div>
      );

    switch (action) {
      case "add":
        return <Checkpoint.Form />;

      case "read":
        return (
          <div className="px-3">
            <Checkpoint.DetailsHeader />
            <section className="relative mt-8 min-h-[300px]">
              <Checkpoint.DetailsBody />
            </section>
          </div>
        );

      default:
        return "Not found";
    }
  }, [action]);

  return (
    <Dialog.Dialog open={open} onOpenChange={setOpen}>
      {children}

      <Dialog.DialogPortal>
        <Dialog.DialogOverlay className="bg-black/60">
          <Dialog.DialogContent
            className="inset-0 top-32 translate-x-0 translate-y-0 py-4 px-0 bg-neutral-grey-200 rounded-t-lg overflow-auto"
            onInteractOutside={() => {
              handleCloseModal();
              if (shouldResetCheckpointRelatedAtoms) resetAtoms();
            }}
          >
            {memoizedChildren}
          </Dialog.DialogContent>
        </Dialog.DialogOverlay>
      </Dialog.DialogPortal>
    </Dialog.Dialog>
  );
}

export function ToggleModalBtn({
  name,
  value,
  className,
  children,
  executeFn,
  ...props
}: IToggleModalBtnProps) {
  const open = useAtomValue(isDialogOpenAtom);
  const setOpen = useSetAtom(isDialogOpenAtom);

  const navigation = useNavigation();

  const [, setSearchParams] = useSearchParams();

  return (
    <Button
      {...props}
      type="button"
      disabled={navigation.state !== "idle"}
      className={cn("w-full", className)}
      onClick={() => {
        !open && setOpen(true);

        if (name && value)
          setSearchParams((prev) => {
            prev.set(name, String(value));
            return prev;
          });

        if (executeFn) executeFn();
      }}
    >
      {children}
    </Button>
  );
}
