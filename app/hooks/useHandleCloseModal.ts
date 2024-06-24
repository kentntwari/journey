import { useSetAtom } from "jotai";

import { useCallback } from "react";

import { useParams, useNavigate, useNavigation } from "@remix-run/react";
import { useHydrated } from "remix-utils/use-hydrated";

import { isDialogOpenAtom } from "~/utils/atoms";

export function useHandleCloseModal() {
  const params = useParams();

  const hydrated = useHydrated();

  const navigate = useNavigate();

  const navigation = useNavigation();

  const setCloseModal = useSetAtom(isDialogOpenAtom);

  const handleCloseModal = useCallback(() => {
    if (navigation.state !== "idle") return;

    if (hydrated) {
      setCloseModal(false);
      navigate("/journeys/" + params.title);
    }
  }, []);

  return { handleCloseModal };
}
