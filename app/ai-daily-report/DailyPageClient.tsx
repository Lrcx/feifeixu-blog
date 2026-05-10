"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header, Footer, Container } from "@/components/layout/header";
import type { DailyItem } from "@/lib/daily";

function formatDateChinese(date: string): string {
  const d = new Date(date);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function DailyPageClient({ items }: { items: DailyItem[] }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">AI 日报</h1>
            <p className="text-gray-500 leading-relaxed">
              每日精选 AI 资讯，紧跟技术前沿
            </p>
          </motion.div>

          <div className="grid gap-4">
            {items.map((item, i) => (
              <motion.article
                key={item.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.03 }}
              >
                <Link
                  href={`/ai-daily-report/${item.slug}`}
                  className="group block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-500 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {item.frontmatter.category}
                    </span>
                    <time className="text-xs text-gray-500">
                      {formatDateChinese(item.frontmatter.date)}
                    </time>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{item.frontmatter.source}</span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {item.frontmatter.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {item.content.slice(0, 150).replace(/[#*>\-]/g, '').trim()}
                  </p>
                </Link>
              </motion.article>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">暂无日报内容</p>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}