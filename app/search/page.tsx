import { getAllDailyItems } from "@/lib/daily";
import { getAllPosts } from "@/lib/mdx";
import SearchPageClient, { type SearchItem } from "./SearchPageClient";

function stripContent(content: string): string {
  return content
    .replace(/---[\s\S]*?---/, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
    .replace(/[#>*_`|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function SearchPage() {
  const posts: SearchItem[] = getAllPosts().map((post) => ({
    id: `blog-${post.slug}`,
    type: "blog",
    title: post.frontmatter.title,
    href: `/blog/${post.slug}`,
    date: post.frontmatter.date,
    category: post.frontmatter.category || "博客",
    tags: post.frontmatter.tags || [],
    excerpt: post.frontmatter.excerpt || stripContent(post.content).slice(0, 140),
    content: stripContent(post.content).slice(0, 12000),
  }));

  const dailyItems: SearchItem[] = getAllDailyItems().map((item) => ({
    id: `daily-${item.slug}`,
    type: "daily",
    title: item.frontmatter.title,
    href: `/ai-daily-report/${item.slug}`,
    date: item.frontmatter.date,
    category: item.frontmatter.category || "AI日报",
    tags: item.frontmatter.tags || [],
    excerpt: stripContent(item.content).slice(0, 160),
    content: stripContent(item.content).slice(0, 12000),
  }));

  return <SearchPageClient items={[...posts, ...dailyItems]} />;
}
