"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Header, Footer, Container } from "@/components/layout/header";
import type { DailyItem } from "@/lib/daily";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

function formatDateChinese(date: string): string {
  const d = new Date(date);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function DailyDetailPageClient({ item }: { item: DailyItem }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <Container size="narrow">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/ai-daily-report"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:border-accent/40 hover:text-accent"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              返回日报列表
            </Link>

            <header className="mb-10 rounded-3xl border border-border bg-card/90 p-6 shadow-sm md:p-8">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {item.frontmatter.category}
                </span>
                <time className="inline-flex items-center gap-1.5 text-sm text-secondary">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {formatDateChinese(item.frontmatter.date)}
                </time>
                <span className="text-sm text-secondary">{item.frontmatter.source}</span>
              </div>
              <h1 className="text-3xl font-bold leading-tight text-primary md:text-5xl">
                {item.frontmatter.title}
              </h1>
            </header>

            <div className="article-content space-y-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => {
                    const text = String(children);
                    // 跳过日期标题（已在 header 显示）
                    if (text.includes('AI 早报') || text.includes('AI 日报') || text.includes('—')) {
                      return null;
                    }
                    // 带 emoji 的标题 -> 章节标题
                    if (text.includes('📋') || text.includes('🚀') || text.includes('🛠️') ||
                        text.includes('💡') || text.includes('🔬') || text.includes('🌐')) {
                      return (
                        <h2 className="text-lg font-bold text-gray-900 mt-12 mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                          {children}
                        </h2>
                      );
                    }
                    // 数字编号的标题 -> 子标题
                    if (text.match(/^\d+\./)) {
                      return (
                        <h3 className="text-base font-semibold text-primary">
                          {children}
                        </h3>
                      );
                    }
                    return (
                      <h2 className="text-xl font-bold text-primary">
                        {children}
                      </h2>
                    );
                  },
                  h2: ({ children }) => (
                    <h3 className="text-lg font-semibold text-primary">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p>
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li>{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="my-7 rounded-r-2xl border-l-4 border-accent bg-blue-50/60 px-5 py-4">
                      <div className="text-secondary">{children}</div>
                    </blockquote>
                  ),
                  hr: () => (
                    <hr className="my-8 border-gray-200" />
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-primary">{children}</strong>
                  ),
                  img: ({ src, alt }) => {
                    if (typeof src !== "string" || !src) return null;
                    const isRemoteImage = /^https?:\/\//i.test(src) || src.startsWith("//");
                    const localImagePath = src.replace(/^images\//, "");
                    const imgSrc = isRemoteImage || src.startsWith("/")
                      ? src
                      : `/daily-images/${item.frontmatter.date}/${localImagePath}`;
                    return (
                      <figure className="my-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <Image
                          src={imgSrc}
                          alt={alt || ""}
                          width={700}
                          height={400}
                          className="h-auto w-full"
                          unoptimized
                        />
                      </figure>
                    );
                  },
                  a: ({ href, children }) => {
                    if (!href) return <span>{children}</span>;
                    const text = String(children);
                    // 原文链接显示带图标，独立成行
                    if (text.includes('原文链接')) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-accent underline decoration-blue-200 underline-offset-4 transition-colors hover:text-primary"
                        >
                          <svg className="mr-1.5 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {children}
                        </a>
                      );
                    }
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent underline decoration-blue-200 underline-offset-4 transition-colors hover:text-primary"
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {item.content}
              </ReactMarkdown>
            </div>

            <footer className="mt-12 rounded-2xl border border-border bg-card/80 p-5">
              <p className="text-sm text-secondary">
                *以上内容由 AI 自动生成并整理，仅供参考。
              </p>
            </footer>
          </motion.article>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
