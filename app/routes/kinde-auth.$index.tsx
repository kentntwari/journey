import { handleAuth } from "@kinde-oss/kinde-remix-sdk";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params, request }: LoaderFunctionArgs) {
  return await handleAuth(request, params.index);
}
