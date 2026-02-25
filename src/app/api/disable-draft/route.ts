import { draftMode } from "next/headers";

// Turns off draft mode — clears the __prerender_bypass cookie
// so the site goes back to fetching published content only.
export async function GET() {
  (await draftMode()).disable();
  return new Response("Draft mode disabled");
}
