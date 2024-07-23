import type * as React from "react";

import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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

interface IForceOpenBtnProps
  extends Omit<React.ComponentProps<typeof Button>, "type"> {
  children?: React.ReactNode;
  executeFn?: () => void;
}

Modal.ForceOpenBtn = ForceOpenBtn;

Modal.Close = Dialog.DialogClose;

const NEW_CHECKPOINT_FORM_MODAL_BODY = <Checkpoint.Form />;

const CHECKPOINT_MODAL_BODY = (
  <div className="px-3">
    <Checkpoint.DetailsHeader />
    <section className="relative mt-8 min-h-[300px]">
      <Checkpoint.DetailsBody />
    </section>
  </div>
);

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
        return NEW_CHECKPOINT_FORM_MODAL_BODY;

      case "read":
        return CHECKPOINT_MODAL_BODY;

      // deepcode ignore DuplicateCaseBody: delete does not change modal body
      case "delete":
        return CHECKPOINT_MODAL_BODY;

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
            className="inset-0 md:inset-auto md:right-0 top-32 md:top-0 md:h-full translate-x-0 translate-y-0 py-4 px-0 bg-neutral-grey-200 rounded-t-lg overflow-auto"
            onInteractOutside={() => {
              handleCloseModal();
              if (shouldResetCheckpointRelatedAtoms) resetAtoms();
            }}
          >
            <VisuallyHidden asChild>
              <Dialog.DialogTitle />
            </VisuallyHidden>

            <VisuallyHidden asChild>
              <Dialog.DialogDescription />
            </VisuallyHidden>
            {memoizedChildren}
          </Dialog.DialogContent>
        </Dialog.DialogOverlay>
      </Dialog.DialogPortal>
    </Dialog.Dialog>
  );
}

export function ForceOpenBtn({
  name,
  value,
  className,
  children,
  executeFn,
  ...props
}: IForceOpenBtnProps) {
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
