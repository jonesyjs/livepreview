"use client";

// This must be a client component because the live preview SDK uses
// browser APIs (postMessage) to communicate with the Contentful editor.

import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";
import type { ContentfulLivePreviewInitConfig } from "@contentful/live-preview";
import { PropsWithChildren } from "react";

// INITIALISATION:
// The SDK can be initialised in two ways:
//
// 1. React — using this provider (wraps init() in a context provider):
//    <ContentfulLivePreviewProvider locale="en-US" enableLiveUpdates={true} />
//
// 2. Vanilla JS — calling init() directly (works with Vue, Svelte, or anything):
//    import { ContentfulLivePreview } from "@contentful/live-preview";
//    ContentfulLivePreview.init({ locale: "en-US", enableLiveUpdates: true });
//
// Both do the same thing — open a postMessage channel to the Contentful editor.
// The React provider is just a convenience wrapper around the vanilla JS API.
export function ContentfulPreviewProvider({
  children,
  ...props
}: PropsWithChildren<ContentfulLivePreviewInitConfig>) {
  return (
    <ContentfulLivePreviewProvider {...props}>
      {children}
    </ContentfulLivePreviewProvider>
  );
}
