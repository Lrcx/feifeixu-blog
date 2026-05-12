import { getAllPosts } from "@/lib/mdx";
import HomePageClient from "./HomePageClient";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  return <HomePageClient posts={posts} />;
}
