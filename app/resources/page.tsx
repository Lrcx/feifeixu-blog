import type { Metadata } from "next";
import { getAllResources } from "@/data/resources";
import ResourcesPageClient from "./ResourcesPageClient";

export const metadata: Metadata = {
  title: "Agent 资源库",
  description: "持续收藏的 Agent 学习网站、框架、论文、工具、课程和项目。",
};

export default function ResourcesPage() {
  const resources = getAllResources();
  return <ResourcesPageClient resources={resources} />;
}
