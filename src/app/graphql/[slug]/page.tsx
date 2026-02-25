import { draftMode } from "next/headers";
import { getDemoPageBySlug } from "@/lib/contentful-graphql";
import { DemoPage } from "@/components/demo-page";

export default async function GraphQLPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  const data = await getDemoPageBySlug(slug, isEnabled);

  if (!data) {
    return <p className="p-16 text-center text-zinc-500">Entry not found</p>;
  }

  return <DemoPage data={data} />;
}
