import type { ActionFunctionArgs } from "@remix-run/node";

import { json } from "@remix-run/node";

import * as db from "./db.server";

export async function action({ params }: ActionFunctionArgs) {
  try {
    return json({
      results: await db.getDetails(String(params.slug)),
    });
  } catch (error) {
    return { results: null, error: true };
  }
}
