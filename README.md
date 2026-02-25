# Contentful Live Preview Demo

A demo app showing how the `@contentful/live-preview` SDK works with Next.js. Demonstrates real-time content updates and inspector mode (click-to-edit) inside the Contentful editor.

## What this demos

- **`useContentfulLiveUpdates`** — real-time content updates as editors type in Contentful
- **`useContentfulInspectorMode`** — click-to-edit buttons that jump editors to the correct field
- **GraphQL content fetching** — querying Contentful's GraphQL API with encoding (`sys { id }`, `__typename`)
- **Rich text rendering** — converting Contentful's rich text JSON to React components

## Setup

### 1. Clone and install

```bash
git clone https://github.com/jonesyjs/livepreview.git
cd livepreview
npm install
```

### 2. Create a `.env` file

```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
```

Get these from **Contentful dashboard > Settings > API Keys**.

### 3. Create the content model

In Contentful, create a content type with ID `livePreviewTestBlog` and these fields:

| Field | Type |
|-------|------|
| Title | Short text |
| Slug | Short text |
| Boby | Rich text |
| Image | Media |

Create and **publish** at least one entry with slug `test`.

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000/graphql/test` to see your entry.

### 5. Set up Contentful preview URL

In Contentful go to **Settings > Content Preview** and create a preview platform with URL:

```
https://your-deployed-url.com/graphql/{entry.fields.slug}
```

> Note: Live preview requires your app to be accessible via HTTPS (e.g. deployed to Vercel). Localhost won't work inside Contentful's iframe due to browser private network restrictions.

### 6. Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Add the env variables in the Vercel dashboard under **Settings > Environment Variables**.

## Project structure

```
src/
  app/
    layout.tsx                  # Wraps app in ContentfulPreviewProvider
    graphql/[slug]/page.tsx     # Page route — fetches and renders entry
  components/
    contentful-preview-provider.tsx  # Client wrapper for the SDK provider
    demo-page.tsx               # Client component with both hooks
  lib/
    contentful-graphql.ts       # GraphQL fetching layer
    contentful-rest.ts          # REST fetching layer (for reference)
```

## Key concepts

- **Encoding** — GraphQL queries must include `sys { id }` and `__typename` so the SDK can match live updates to the correct entry. The REST SDK does this automatically.
- **postMessage bridge** — the SDK communicates between Contentful's editor and your site (loaded in an iframe) using the browser's `postMessage` API. No WebSockets or server needed.
- **Content Source Maps** (premium) — an alternative to manual `inspectorProps` that uses invisible Unicode characters to automatically tag text fields.
