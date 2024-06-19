import type * as React from "react";

import { useAtom, useSetAtom, useAtomValue } from "jotai";

import { useNavigate, useNavigation, useParams } from "@remix-run/react";
import { useHydrated } from "remix-utils/use-hydrated";

import * as CheckPoint from "~/routes/ressource.form.checkpoint/route";

import * as Dialog from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

import { isDialogOpenAtom } from "~/utils/atoms";

export function Modal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useAtom(isDialogOpenAtom);

  const params = useParams();

  const hydrated = useHydrated();

  const navigate = useNavigate();

  const navigation = useNavigation();

  return (
    <Dialog.Dialog open={open} onOpenChange={setOpen}>
      {children}

      <Dialog.DialogPortal>
        <Dialog.DialogOverlay className="bg-black/60">
          <Dialog.DialogContent
            className="inset-0 top-32 translate-x-0 translate-y-0 py-4 px-0 bg-neutral-grey-200 rounded-t-lg overflow-auto"
            onInteractOutside={(e) => {
              if (navigation.state !== "idle") return;

              if (hydrated) {
                setOpen(false);
                navigate("/journeys/" + params.title);
              }
            }}
          >
            <CheckPoint.Form />
          </Dialog.DialogContent>
        </Dialog.DialogOverlay>
      </Dialog.DialogPortal>
    </Dialog.Dialog>
  );
}

interface ToggleModalBtnProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

export function ToggleModalBtn({ children }: ToggleModalBtnProps) {
  const open = useAtomValue(isDialogOpenAtom);
  const setOpen = useSetAtom(isDialogOpenAtom);
  const navigation = useNavigation();

  return (
    <Button
      disabled={navigation.state !== "idle"}
      className="w-full "
      onClick={() => !open && setOpen(true)}
    >
      {children}
    </Button>
  );
}

Modal.Btn = ToggleModalBtn;
