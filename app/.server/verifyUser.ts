import { getKindeSession } from "@kinde-oss/kinde-remix-sdk";

import { redirect } from "@remix-run/node";

export async function verifyUser(request: Request) {
  const { getUser } = await getKindeSession(request);
  const user = await getUser();

  return { isAuthenticated: !!user, user };
}

export function redirectIfNotAuthenticated(redirectToPage?: string) {
  const baseUrl = process.env.KINDE_SITE_URL + "/journeys";

  if (typeof redirectToPage === "undefined")
    throw redirect("/kinde-auth/login?returnTo=/journeys");

  // Regular expression to check if the string starts with a forward slash
  const regex = /^\//;

  switch (!regex.test(redirectToPage)) {
    case true:
      const prepended = "/" + redirectToPage;
      throw redirect("/kinde-auth/login?returnTo=" + baseUrl + prepended);

    default:
      throw redirect("/kinde-auth/login?returnTo=" + baseUrl + redirectToPage);
  }
}
