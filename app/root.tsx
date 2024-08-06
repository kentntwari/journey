import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import stylesheet from "~/tailwind.css?url";

import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import { Button } from "./components/ui/button";

import { verifyUser } from "./.server/verifyUser";

const LOGOUT_URL = "/kinde-auth/logout";

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

  return typedjson({ isAuthenticated, user });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const t = useTypedLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={`pb-4 min-h-screen min-h-[100dvh] *:max-w-[1920px] *:mx-auto grid grid-rows-[72px_1fr] text-sm text-neutral-grey-1000 ${
          t.isAuthenticated
            ? "bg-neutral-grey-200"
            : "lg:px-[120px] bg-neutral-grey-300"
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
  const t = useTypedLoaderData<typeof loader>();

  return (
    <>
      <Navigation user={t.user} />

      <main className="w-full grow grid">
        <Outlet />
      </main>
    </>
  );
}

interface INavigationProps {
  user: Awaited<ReturnType<typeof verifyUser>>["user"];
}

export function Navigation({ user }: INavigationProps) {
  const navigate = useNavigate();

  return (
    <>
      <nav className="px-3 w-full h-full flex items-center justify-between border-b border-neutral-grey-600">
        <Link to="/" className="relative font-bold text-lg text-black">
          Journey.
          <small className="absolute -top-1.5 font-semibold uppercase text-2xs text-blue-900">
            ALPHA
          </small>
        </Link>
        {!user ? (
          <Button size="sm" onClick={() => navigate("/journeys")}>
            Get started
          </Button>
        ) : (
          <Link to={LOGOUT_URL} className="cursor-pointer">
            {user?.picture && (
              <img
                src={user.picture}
                alt="profile-picture"
                className="w-10 h-10 rounded-full"
              />
            )}
          </Link>
        )}
      </nav>
    </>
  );
}
