import { verifyUser } from "~/.server/verifyUser";

import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { isAuthenticated } = await verifyUser(request);

  if (!isAuthenticated) return null;

  throw redirect("/journeys");
}

export default function Index() {
  return (
    <>
      <div className="w-full px-3 m-auto">
        <h1 className="w-full m-auto font-bold text-center text-2xl text-balance text-global-neutral-grey-900">
          <span className="text-global-blue-900">Document your career</span> and
          keep tabs on the most valuable insights
        </h1>{" "}
      </div>
    </>
  );
}
