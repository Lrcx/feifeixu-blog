"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header, Footer, Container } from "@/components/layout/header";
import type { Post } from "@/lib/mdx";

function formatDateChinese(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function BlogPostPageClient({ post }: { post: Post }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <Container>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回博客列表
            </Link>

            <header className="mb-10 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                {post.frontmatter.category && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {post.frontmatter.category}
                  </span>
                )}
                <time className="text-sm text-gray-500">
                  {formatDateChinese(post.frontmatter.date)}
                </time>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {post.frontmatter.title}
              </h1>
              {post.frontmatter.excerpt && (
                <p className="mt-4 text-gray-500 leading-relaxed">
                  {post.frontmatter.excerpt}
                </p>
              )}
            </header>

            <div className="article-content space-y-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => null,
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-gray-900 mt-12 mb-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-600 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 my-4">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-2 my-4 list-decimal pl-5">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-600 leading-relaxed">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="px-4 py-3 bg-gray-50 border-l-4 border-blue-500 rounded-r-lg my-6">
                      <div className="text-gray-600 italic">{children}</div>
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-gray-800">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100">
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </motion.article>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
