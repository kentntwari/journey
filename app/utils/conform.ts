import type { MileStoneEntry, ChallengeEntry, FailureEntry } from "~/types";
import type { SubmitFunction } from "@remix-run/react";
import { i } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

const targets = ["milestone", "challenge", "failure", "main"] as const;

export function extractCKData(
  formData: FormData,
  target: "challenge"
): ChallengeEntry;

export function extractCKData(
  formData: FormData,
  target: "failure"
): FailureEntry;

export function extractCKData(
  formData: FormData,
  target: "milestone"
): MileStoneEntry;

export function extractCKData(
  formData: FormData,
  target: "main"
): {
  title: string | undefined;
  description: string | undefined;
  startDate: Date | undefined;
};

export function extractCKData(
  formData: FormData,
  target: (typeof targets)[number]
) {
  if (target === "challenge" || target === "failure") {
    const slug = formData.get("slug")
      ? String(formData.get("slug"))
      : undefined;
    const description = String(formData.get("description"));

    if (typeof slug !== "undefined") return { slug, description };
    return { description };
  }

  if (target === "milestone") {
    const slug = formData.get("slug")
      ? String(formData.get("slug"))
      : undefined;
    const status = String(formData.get("status")) as MileStoneEntry["status"];
    const description = String(formData.get("description"));
    const deadline = new Date(String(formData.get("deadline")));

    if (typeof slug !== "undefined")
      return { slug, status, description, deadline };

    return { status, description, deadline };
  }

  if (target === "main") {
    const title = formData.has("title")
      ? String(formData.get("title"))
      : undefined;
    const description = formData.has("description")
      ? String(formData.get("description"))
      : undefined;
    const startDate = formData.has("startDate")
      ? new Date(String(formData.get("startDate")))
      : undefined;

    return { title, description, startDate };
  }
}

export function submitCKUpdates(
  checkpointSlug: string,
  formData: FormData,
  submit: SubmitFunction,
  target: (typeof targets)[number],
  intent?: string
) {
  const outgoingFormData = new FormData();
  outgoingFormData.append("checkpointSlug", checkpointSlug);

  switch (target) {
    case "milestone":
      outgoingFormData.append(
        "milestone",
        JSON.stringify({ ...extractCKData(formData, "milestone") })
      );

      submit(outgoingFormData, {
        action: "/ressource/form/milestone",
        method: "POST",
        fetcherKey: "create-new-milestone",
        navigate: false,
        unstable_flushSync: true,
      });
      break;

    case "challenge":
      outgoingFormData.append(
        "challenge",
        JSON.stringify({ ...extractCKData(formData, "challenge") })
      );

      submit(outgoingFormData, {
        action: "/ressource/form/challenge",
        method: "POST",
        fetcherKey: "create-new-challenge",
        navigate: false,
        unstable_flushSync: true,
      });
      break;

    case "failure":
      outgoingFormData.append(
        "failure",
        JSON.stringify({ ...extractCKData(formData, "failure") })
      );

      submit(outgoingFormData, {
        action: "/ressource/form/failure",
        method: "POST",
        fetcherKey: "create-new-failure",
        navigate: false,
        unstable_flushSync: true,
      });
      break;

    case "main":
      const { title, description, startDate } = extractCKData(formData, "main");

      if (intent === "update-title" && typeof title !== "undefined") {
        outgoingFormData.append("title", title);
        outgoingFormData.append("intent", intent);

        submit(outgoingFormData, {
          action: "/ressource/form/checkpoint",
          method: "POST",
          fetcherKey: "update-checkpoint-title",
          navigate: false,
          unstable_flushSync: true,
        });
      }

      if (
        intent === "update-description" &&
        typeof description !== "undefined"
      ) {
        outgoingFormData.append("description", description);
        outgoingFormData.append("intent", intent);

        submit(outgoingFormData, {
          action: "/ressource/form/checkpoint",
          method: "POST",
          fetcherKey: "update-checkpoint-description",
          navigate: false,
          unstable_flushSync: true,
        });
      }

      if (intent === "update-startDate" && typeof startDate !== "undefined") {
        outgoingFormData.append("startDate", startDate.toISOString());
        outgoingFormData.append("intent", intent);

        submit(outgoingFormData, {
          action: "/ressource/form/checkpoint",
          method: "POST",
          fetcherKey: "update-checkpoint-start-date",
          navigate: false,
          unstable_flushSync: true,
        });
      }

    default:
      break;
  }
}
export function submitNewCK(
  formData: FormData,
  pendingMilestones: Omit<MileStoneEntry, "slug">[] = [],
  pendingChallenges: Pick<ChallengeEntry, "description">[] = [],
  pendingFailures: Pick<FailureEntry, "description">[] = [],
  submit: SubmitFunction
) {
  if (pendingMilestones.length > 0) {
    for (let [index, milestone] of pendingMilestones.entries()) {
      formData.append(`milestones[${index}]`, JSON.stringify(milestone));
    }
  }

  if (pendingChallenges.length > 0) {
    for (let [index, challenge] of pendingChallenges.entries()) {
      formData.append(`challenges[${index}]`, JSON.stringify(challenge));
    }
  }

  if (pendingFailures.length > 0) {
    for (let [index, failure] of pendingFailures.entries()) {
      formData.append(`failures[${index}]`, JSON.stringify(failure));
    }
  }

  submit(formData, {
    method: "POST",
    action: "/ressource/form/checkpoint",
    fetcherKey: "checkpoint",
    navigate: false,
    unstable_flushSync: true,
  });
}

export function deleteCK(
  checkpointSlug: string,
  journeySlug: string,
  submit: SubmitFunction
) {
  const formData = new FormData();
  formData.append("slug", checkpointSlug);
  formData.append("intent", "delete");
  formData.append("journeySlug", journeySlug);

  submit(formData, {
    method: "DELETE",
    action: "/ressource/form/checkpoint",
    fetcherKey: "delete-checkpoint",
    navigate: false,
    unstable_flushSync: true,
  });
}
