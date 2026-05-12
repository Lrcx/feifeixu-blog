"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Filter } from "lucide-react";
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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-sm font-medium text-secondary">
              <CalendarDays className="size-4 text-accent" aria-hidden="true" />
              每日精选
            </div>
            <h1 className="text-4xl font-bold leading-tight text-primary md:text-5xl">AI 日报</h1>
            <p className="mt-4 max-w-2xl text-secondary leading-8">
              快速扫描 AI 产品、模型、开源项目和工程动态，把零散资讯变成可回看的时间线。
            </p>
          </motion.div>

          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                {selectedYear && selectedMonth
                  ? `${selectedYear}年${Number(selectedMonth)}月`
                  : "暂无可筛选日报"}
              </p>
              <p className="text-xs text-secondary">
                共 {filteredItems.length} 篇日报
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex h-10 items-center gap-2 rounded-full bg-black/[0.035] px-3 text-sm font-medium text-secondary">
                <Filter className="size-4" aria-hidden="true" />
                筛选
              </span>
              <label className="sr-only" htmlFor="daily-year">
                年份
              </label>
              <select
                id="daily-year"
                value={selectedYear}
                onChange={(event) => handleYearChange(event.target.value)}
                className="h-10 cursor-pointer rounded-full border border-border bg-white px-3 text-sm text-primary outline-none transition-colors hover:border-accent/50 focus:border-accent"
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
                className="h-10 cursor-pointer rounded-full border border-border bg-white px-3 text-sm text-primary outline-none transition-colors hover:border-accent/50 focus:border-accent"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {Number(month)}月
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredItems.map((item, i) => (
              <motion.article
                key={item.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + Math.min(i, 8) * 0.03 }}
              >
                <Link
                  href={`/ai-daily-report/${item.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {item.frontmatter.category}
                    </span>
                    <time className="text-xs text-secondary">
                      {formatDateChinese(item.frontmatter.date)}
                    </time>
                    <span className="text-xs text-secondary">{item.frontmatter.source}</span>
                  </div>
                  <h2 className="text-base font-semibold leading-7 text-primary transition-colors group-hover:text-accent">
                    {item.frontmatter.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-secondary">
                    {item.content.slice(0, 150).replace(/[#*>\-]/g, '').trim()}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    查看日报
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="rounded-2xl border border-border bg-card/80 py-16 text-center">
              <p className="text-secondary">暂无日报内容</p>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
