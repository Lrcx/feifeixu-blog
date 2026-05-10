import { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "博客",
  description: "关于 AI、LLM 以及构建智能系统的思考",
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogPageClient posts={posts} />;
}
