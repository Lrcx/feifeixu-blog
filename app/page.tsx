import { getAllPosts } from "@/lib/mdx";
import { getAllResources } from "@/data/resources";
import HomePageClient from "./HomePageClient";

export default function Home() {
  const posts = getAllPosts();
  const resources = getAllResources();
  return <HomePageClient posts={posts} resourceCount={resources.length} />;
}
