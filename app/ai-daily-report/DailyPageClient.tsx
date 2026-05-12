"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header, Footer, Container } from "@/components/layout/header";
import type { DailyItem } from "@/lib/daily";

function formatDateChinese(date: string): string {
  const d = new Date(date);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function getDateParts(date: string) {
  const d = new Date(date);
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, "0"),
  };
}

export default function DailyPageClient({ items }: { items: DailyItem[] }) {
  const latest = items[0] ? getDateParts(items[0].frontmatter.date) : null;
  const [selectedYear, setSelectedYear] = useState(latest?.year ?? "");
  const [selectedMonth, setSelectedMonth] = useState(latest?.month ?? "");

  const years = Array.from(
    new Set(items.map((item) => getDateParts(item.frontmatter.date).year))
  );

  const months = Array.from(
    new Set(
      items
        .filter((item) => getDateParts(item.frontmatter.date).year === selectedYear)
        .map((item) => getDateParts(item.frontmatter.date).month)
    )
  ).sort((a, b) => Number(b) - Number(a));

  const filteredItems = items.filter((item) => {
    const { year, month } = getDateParts(item.frontmatter.date);
    return year === selectedYear && month === selectedMonth;
  });

  function handleYearChange(year: string) {
    const nextMonths = Array.from(
      new Set(
        items
          .filter((item) => getDateParts(item.frontmatter.date).year === year)
          .map((item) => getDateParts(item.frontmatter.date).month)
      )
    ).sort((a, b) => Number(b) - Number(a));

    setSelectedYear(year);
    setSelectedMonth(nextMonths[0] ?? "");
  }

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

          <div className="mb-8 flex flex-col gap-3 border-y border-gray-200 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {selectedYear && selectedMonth
                  ? `${selectedYear}年${Number(selectedMonth)}月`
                  : "暂无可筛选日报"}
              </p>
              <p className="text-xs text-gray-500">
                共 {filteredItems.length} 篇日报
              </p>
            </div>

            <div className="flex gap-3">
              <label className="sr-only" htmlFor="daily-year">
                年份
              </label>
              <select
                id="daily-year"
                value={selectedYear}
                onChange={(event) => handleYearChange(event.target.value)}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>

              <label className="sr-only" htmlFor="daily-month">
                月份
              </label>
              <select
                id="daily-month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-blue-500"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {Number(month)}月
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredItems.map((item, i) => (
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

          {filteredItems.length === 0 && (
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
