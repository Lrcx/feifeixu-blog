import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllDailyItems, getDailyItemBySlug } from "@/lib/daily";
import DailyDetailPageClient from "./DailyDetailPageClient";

export const dynamicParams = false;

// Generate static params for all daily items
export async function generateStaticParams() {
  const items = getAllDailyItems();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

// Generate metadata for each page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getDailyItemBySlug(slug);

  if (!item) {
    return { title: "未找到" };
  }

  return {
    title: item.frontmatter.title,
    description: item.content.slice(0, 160),
  };
}

export default async function DailyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getDailyItemBySlug(slug);

  if (!item) {
    notFound();
  }

  return <DailyDetailPageClient item={item} />;
}
