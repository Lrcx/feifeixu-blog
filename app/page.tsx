import { getAllPosts } from "@/lib/mdx";
import HomePageClient from "./HomePageClient";

export default function Home() {
  const posts = getAllPosts();
  return <HomePageClient posts={posts} />;
}
