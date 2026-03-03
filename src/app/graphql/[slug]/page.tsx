import { getDemoPageBySlug } from "@/lib/contentful-graphql";
import { DemoPage } from "@/components/demo-page";
import { parseTimelinePreviewToken } from "@contentful/timeline-preview";

export default async function GraphQLPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ timeline?: string }>;
}) {
  const { slug } = await params;
  const { timeline: timelineToken } = await searchParams;

  const timelineParams = timelineToken
    ? parseTimelinePreviewToken(timelineToken)
    : undefined;

  const data = await getDemoPageBySlug(slug, !!timelineParams, timelineParams ?? undefined);

  if (!data) {
    return <p className="p-16 text-center text-zinc-500">Entry not found</p>;
  }

  return <DemoPage data={data} />;
}
