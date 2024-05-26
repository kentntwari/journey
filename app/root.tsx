import { getKindeSession } from "@kinde-oss/kinde-remix-sdk";

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";

import {
  json,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { getUser } = await getKindeSession(request);
  const user = await getUser();

  return json({ isAuthenticated: !!user, user });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const t = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={`pb-4 min-h-screen min-h-[100dvh] flex flex-col text-sm text-global-neutral-grey-1000 ${
          t.isAuthenticated
            ? "bg-global-neutral-grey-200"
            : "lg:px-[120px] bg-global-neutral-grey-300"
        }`}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const t = useLoaderData<typeof loader>();
  return (
    <>
      <nav className="px-3 w-full h-[72px] flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-black">
          Journey.
        </Link>
        {!t.user ? (
          <Link
            to={`/journeys`}
            className="bg-global-blue-900 w-[104px] h-[36px] flex items-center justify-center font-medium text-sm text-white rounded-md"
          >
            Get started
          </Link>
        ) : (
          <Link to={"/kinde-auth/logout"} className="cursor-pointer">
            {t.user?.picture && (
              <img
                src={t.user.picture}
                alt="profile-picture"
                className="w-10 h-10 rounded-full"
              />
            )}
          </Link>
        )}
      </nav>

      <main className="grow border-t border-global-neutral-grey-600">
        <Outlet />
      </main>
    </>
  );
}
