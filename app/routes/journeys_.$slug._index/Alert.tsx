import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { useNavigation } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import * as AlertDialog from "~/components/ui/alert-dialog";

import { cn } from "~/utils/cn";
import { isAlertDialogOpenAtom } from "~/utils/atoms";

interface IAlertProps
  extends React.ComponentPropsWithoutRef<
    typeof AlertDialog.AlertDialogContent
  > {
  children: [React.ReactNode, React.ReactNode];
}

export function Alert({ children, className }: IAlertProps) {
  const [open, setOpen] = useAtom(isAlertDialogOpenAtom);

  return (
    <AlertDialog.AlertDialog open={open} onOpenChange={setOpen}>
      {children[0]}
      <AlertDialog.AlertDialogPortal>
        <AlertDialog.AlertDialogOverlay
          className="bg-black/60"
          onClick={() => setOpen(false)}
        />
        <AlertDialog.AlertDialogContent
          className={cn("w-11/12 rounded-lg", className)}
        >
          {children[1]}
        </AlertDialog.AlertDialogContent>
      </AlertDialog.AlertDialogPortal>
    </AlertDialog.AlertDialog>
  );
}

interface IForceOpenBtnProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "type"> {
  children?: React.ReactNode;
  executeFn?: () => void;
}

Alert.ForceOpenBtn = ({
  children,
  className,
  executeFn,
  ...props
}: IForceOpenBtnProps) => {
  const open = useAtomValue(isAlertDialogOpenAtom);
  const setOpen = useSetAtom(isAlertDialogOpenAtom);

  const navigation = useNavigation();

  return (
    <Button
      {...props}
      type="button"
      disabled={navigation.state !== "idle"}
      className={className}
      onClick={() => {
        !open && setOpen(true);

        if (executeFn) executeFn();
      }}
    >
      {children}
    </Button>
  );
};

Alert.Title = AlertDialog.AlertDialogTitle;
Alert.Header = AlertDialog.AlertDialogHeader;
Alert.Overlay = AlertDialog.AlertDialogOverlay;
Alert.Action = AlertDialog.AlertDialogAction;
Alert.Cancel = AlertDialog.AlertDialogCancel;
Alert.Footer = AlertDialog.AlertDialogFooter;
Alert.Trigger = AlertDialog.AlertDialogTrigger;
Alert.Description = AlertDialog.AlertDialogDescription;
