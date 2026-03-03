// =============================================================
// GraphQL approach — uses native fetch() to Contentful's GraphQL API
// =============================================================

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN!;
const PREVIEW_ACCESS_TOKEN = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!;

const GRAPHQL_ENDPOINT = `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}`;

/**
 * Core GraphQL fetch helper.
 * - preview = false → uses Delivery token (published content only)
 * - preview = true  → uses Preview token (draft + published content)
 */
export interface TimelineParams {
  releaseId?: string;
  timestamp?: string;
}

async function fetchGraphQL(query: string, preview = false) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${preview ? PREVIEW_ACCESS_TOKEN : ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query }),
    // Next.js caching — revalidate every 60s in production, skip cache in preview
    next: { revalidate: preview ? 0 : 60 },
  });

  const json = await res.json();

  if (json.errors) {
    console.error("GraphQL errors:", JSON.stringify(json.errors, null, 2));
    throw new Error("Failed to fetch from Contentful GraphQL");
  }

  return json.data;
}

// ----- DemoPage (livePreviewTestBlog) queries -----

// ENCODING (manual):
// With GraphQL, we must explicitly request `sys { id }` and `__typename`
// in every query. These are the identifiers the live preview SDK uses to
// map data on screen back to entries in Contentful. If you remove them,
// live updates will silently stop working.
const DEMO_PAGE_FIELDS = `
  sys { id }
  __typename
  title
  slug
  boby {
    json
  }
  image {
    sys { id }
    __typename
    url
    title
    width
    height
  }
`;

export async function getDemoPages(preview = false) {
  const data = await fetchGraphQL(
    `{
      livePreviewTestBlogCollection(preview: ${preview}) {
        items {
          ${DEMO_PAGE_FIELDS}
        }
      }
    }`,
    preview
  );

  return data.livePreviewTestBlogCollection.items;
}

export async function getDemoPageBySlug(
  slug: string,
  preview = false,
  timeline?: TimelineParams
) {
  let timelineDirective = "";
  if (timeline?.releaseId || timeline?.timestamp) {
    const whereParts: string[] = [];
    if (timeline.releaseId) whereParts.push(`release_lte: "${timeline.releaseId}"`);
    if (timeline.timestamp) whereParts.push(`timestamp_lte: "${timeline.timestamp}"`);
    timelineDirective = ` @timeline(where: { ${whereParts.join(", ")} }, preview: true)`;
  }

  const data = await fetchGraphQL(
    `query${timelineDirective} {
      livePreviewTestBlogCollection(where: { slug: "${slug}" }, limit: 1, preview: ${preview || !!timelineDirective}) {
        items {
          ${DEMO_PAGE_FIELDS}
        }
      }
    }`,
    preview || !!timelineDirective
  );

  return data.livePreviewTestBlogCollection.items[0] ?? null;
}
