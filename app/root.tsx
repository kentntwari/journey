import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import stylesheet from "~/tailwind.css?url";

import { ScopeProvider as JotaiScopedProvider } from "jotai-scope";

import {
  json,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";

import { Button } from "./components/ui/button";

import { verifyUser } from "./.server/verifyUser";

import { isDialogOpenAtom } from "~/utils/atoms";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://rsms.me/inter/inter.css",
    crossOrigin: "anonymous",
  },
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { isAuthenticated, user } = await verifyUser(request);

  return json({ isAuthenticated, user });
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
        className={`pb-4 min-h-screen min-h-[100dvh] grid grid-rows-[72px_1fr] text-sm text-neutral-grey-1000 ${
          t.isAuthenticated
            ? "bg-neutral-grey-200"
            : "lg:px-[120px] bg-neutral-grey-300"
        }`}
      >
        <JotaiScopedProvider atoms={[isDialogOpenAtom]}>
          {children}
        </JotaiScopedProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const t = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <>
      <nav className="px-3 w-full h-full flex items-center justify-between border-b border-neutral-grey-600">
        <Link to="/" className="font-bold text-lg text-black">
          Journey.
        </Link>
        {!t.user ? (
          <Button size="sm" onClick={() => navigate("/journeys")}>
            Get started
          </Button>
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

      <main className="grow grid">
        <Outlet />
      </main>
    </>
  );
}
