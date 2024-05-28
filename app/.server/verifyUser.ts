import { getKindeSession } from "@kinde-oss/kinde-remix-sdk";

import { redirect } from "@remix-run/node";

import prisma from "~/utils/prisma";

export async function verifyUser(request: Request) {
  const { getUser } = await getKindeSession(request);
  const user = await getUser();

  return { isAuthenticated: !!user, user };
}

export function redirectIfNotAuthenticated(redirectUrl?: string) {
  if (typeof redirectUrl === "undefined")
    throw redirect("/kinde-auth/login?returnTo=/journeys");
  else throw redirect(redirectUrl);
}
