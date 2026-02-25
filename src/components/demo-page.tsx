"use client";

import {
  useContentfulLiveUpdates,
  useContentfulInspectorMode,
} from "@contentful/live-preview/react";

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

  // HOOK 2: useContentfulInspectorMode
  // Pass in the entry ID — returns a function you call per field.
  // It generates data-contentful-* attributes. When an editor hovers
  // over the element in the preview, they see an "edit" button that
  // jumps them to that exact field in the Contentful editor.
  // NOTE - like live updates, this is a no-op when enableInspectorMode is false.
  //
  // ALTERNATIVE (Premium plan only): Content Source Maps
  // Instead of manually tagging every element with inspectorProps, Contentful
  // can embed invisible Unicode characters (steganography) in text responses
  // that the SDK reads to automatically map elements to fields.
  //
  // To enable:
  //   GraphQL — add @contentSourceMaps directive: query @contentSourceMaps { ... }
  //   REST    — set includeContentSourceMaps: true on the preview client
  //
  // With Content Source Maps, text fields (title, slug, body) would NOT need
  // inspectorProps — the SDK tags them automatically. However, non-text fields
  // (images, references, booleans) still require manual inspectorProps.
  // Only works with the Preview API, not Delivery.
  const inspectorProps = useContentfulInspectorMode({ entryId: data.sys.id });

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <h1
        className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        {...inspectorProps({ fieldId: "title" })}
      >
        {page.title}
      </h1>

      <p
        className="mb-8 text-sm text-zinc-400"
        {...inspectorProps({ fieldId: "slug" })}
      >
        /{page.slug}
      </p>

      {page.image?.url && (
        <div className="mb-8 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.image.url.startsWith("//") ? `https:${page.image.url}` : page.image.url}
            alt={page.image.title ?? ""}
            className="w-full"
            {...inspectorProps({ fieldId: "image" })}
          />
        </div>
      )}

      <div
        className="prose dark:prose-invert"
        {...inspectorProps({ fieldId: "boby" })}
      >
        <p className="text-zinc-600 dark:text-zinc-300">
          [Rich text body renders here]
        </p>
      </div>
    </article>
  );
}
