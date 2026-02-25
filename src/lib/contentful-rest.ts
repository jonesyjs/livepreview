// =============================================================
// REST approach — uses the official `contentful` JS SDK
// =============================================================

import { createClient } from "contentful";

// Delivery client — fetches published content only
const deliveryClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// Preview client — fetches draft + published content
const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!,
  host: "preview.contentful.com",
});

/** Pick the right client based on preview mode */
function getClient(preview = false) {
  return preview ? previewClient : deliveryClient;
}

// ----- DemoPage (livePreviewTestBlog) queries -----

// ENCODING (automatic):
// The `contentful` SDK automatically includes `sys.id` and all metadata
// the live preview SDK needs in every response. No manual encoding step
// required — this was handled by `encodeCPAResponse()` in v3, but since
// v4 the SDK does it for you.
export async function getDemoPages(preview = false) {
  const client = getClient(preview);

  const entries = await client.getEntries({
    content_type: "livePreviewTestBlog",
  });

  return entries.items;
}

export async function getDemoPageBySlug(slug: string, preview = false) {
  const client = getClient(preview);

  const entries = await client.getEntries({
    content_type: "livePreviewTestBlog",
    "fields.slug": slug,
    limit: 1,
  });

  return entries.items[0] ?? null;
}
