"use client";

import { motion } from "framer-motion";
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
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <Container>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back */}
            <Link
              href="/ai-daily-report"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回日报列表
            </Link>

            {/* Header */}
            <header className="mb-10 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {item.frontmatter.category}
                </span>
                <time className="text-sm text-gray-500">
                  {formatDateChinese(item.frontmatter.date)}
                </time>
                <span className="text-gray-300">·</span>
                <span className="text-sm text-gray-500">{item.frontmatter.source}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {item.frontmatter.title}
              </h1>
            </header>

            {/* Content */}
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
                        <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3">
                          {children}
                        </h3>
                      );
                    }
                    return (
                      <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">
                        {children}
                      </h2>
                    );
                  },
                  h2: ({ children }) => (
                    <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-600 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 my-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-2 my-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => {
                    const text = String(children);
                    // 列表项不带链接图标
                    return (
                      <li className="text-gray-600 leading-relaxed flex items-start">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 mr-3 shrink-0" />
                        <span>{children}</span>
                      </li>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="px-4 py-3 bg-gray-50 border-l-4 border-blue-500 rounded-r-lg my-6">
                      <div className="text-gray-600 italic">{children}</div>
                    </blockquote>
                  ),
                  hr: () => (
                    <hr className="my-8 border-gray-200" />
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">{children}</strong>
                  ),
                  img: ({ src, alt }) => {
                    if (typeof src !== "string" || !src) return null;
                    const isRemoteImage = /^https?:\/\//i.test(src) || src.startsWith("//");
                    const localImagePath = src.replace(/^images\//, "");
                    const imgSrc = isRemoteImage || src.startsWith("/")
                      ? src
                      : `/daily-images/${item.frontmatter.date}/${localImagePath}`;
                    return (
                      <figure className="my-6">
                        <Image
                          src={imgSrc}
                          alt={alt || ""}
                          width={700}
                          height={400}
                          className="rounded-lg w-full h-auto"
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
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
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

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 italic">
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
