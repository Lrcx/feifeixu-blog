import { Metadata } from "next";
import { getAllDailyItems, formatDateChinese } from "@/lib/daily";
import DailyPageClient from "./DailyPageClient";

export const metadata: Metadata = {
  title: "AI 日报",
  description: "每日精选 AI 资讯，紧跟技术前沿",
};

export default function DailyPage() {
  const items = getAllDailyItems();
  return <DailyPageClient items={items} />;
}