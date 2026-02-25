import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

// Contentful calls this URL when an editor clicks "Open Live Preview".
// It validates the secret, enables Next.js draft mode, and redirects
// to the page so it fetches draft content via the preview token.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  // Validate the secret to prevent unauthorized draft mode activation
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }

  if (!slug) {
    return new Response("Missing slug parameter", { status: 400 });
  }

  // Turn on Next.js draft mode — this sets a __prerender_bypass cookie
  (await draftMode()).enable();

  // The site loads inside an iframe in the Contentful editor, so the
  // cookie must be SameSite=None (cross-origin) and Secure. Without
  // this override, the browser blocks the cookie and draft mode won't
  // persist across navigations in the iframe.
  const cookieStore = await cookies();
  const cookie = cookieStore.get("__prerender_bypass")!;
  cookieStore.set({
    name: "__prerender_bypass",
    value: cookie?.value,
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });

  // Redirect to the actual page — it will now fetch draft content
  redirect(`/${slug}`);
}
