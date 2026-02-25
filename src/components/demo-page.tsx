"use client";

import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

export interface DemoPageData {
  sys: { id: string };
  __typename: string;
  title: string;
  slug: string;
  boby?: { json: unknown } | null;
  image?: {
    sys?: { id: string };
    __typename?: string;
    url?: string;
    title?: string;
    width?: number;
    height?: number;
  } | null;
}

export function DemoPage({ data }: { data: DemoPageData }) {
  // HOOK 1: useContentfulLiveUpdates
  // Pass in the raw GraphQL response — returns a live-updating copy.
  // As the editor types in Contentful, this updates in real time via postMessage.
  const page = useContentfulLiveUpdates(data);
  //NOTE - this is pass through in production mode.

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {page.title}
      </h1>

      <p className="mb-8 text-sm text-zinc-400">
        /{page.slug}
      </p>

      {page.image?.url && (
        <div className="mb-8 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.image.url.startsWith("//") ? `https:${page.image.url}` : page.image.url}
            alt={page.image.title ?? ""}
            className="w-full"
          />
        </div>
      )}

      <div className="prose dark:prose-invert">
        <p className="text-zinc-600 dark:text-zinc-300">
          [Rich text body renders here]
        </p>
      </div>
    </article>
  );
}
