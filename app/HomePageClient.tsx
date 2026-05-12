"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Newspaper, Sparkles } from "lucide-react";
import Link from "next/link";
import { Header, Footer, Container } from "@/components/layout/header";
import type { Post } from "@/lib/mdx";

function formatDateChinese(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function HomePageClient({ posts }: { posts: Post[] }) {
  const featured = posts.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <Container>
          <motion.section
            className="mb-16 grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-sm font-medium text-secondary shadow-sm">
                <Sparkles className="size-4 text-accent" aria-hidden="true" />
                AI 工程、Agent 与长期写作
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal text-primary md:text-6xl">
                把复杂的 AI 系统，写成可以复用的工程经验。
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-secondary md:text-lg">
                我是肥肥旭，记录 LLM 应用、RAG、Agent、源码阅读和产品工程里的真实问题。这里更像一张持续更新的技术工作台。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(24,24,27,0.18)] transition-colors duration-200 hover:bg-accent"
                >
                  阅读博客
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/ai-daily-report"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary transition-colors duration-200 hover:border-accent/50 hover:text-accent"
                >
                  看 AI 日报
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
              <Link
                href="/blog"
                className="group rounded-2xl border border-border bg-card/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <BookOpen className="mb-5 size-5 text-accent" aria-hidden="true" />
                <p className="text-3xl font-bold text-primary">{posts.length}</p>
                <p className="mt-1 text-sm text-secondary">篇技术文章与源码笔记</p>
              </Link>
              <Link
                href="/ai-daily-report"
                className="group rounded-2xl border border-border bg-card/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <Newspaper className="mb-5 size-5 text-accent" aria-hidden="true" />
                <p className="text-lg font-semibold text-primary">AI Daily</p>
                <p className="mt-1 text-sm leading-6 text-secondary">每天筛一遍新工具、新模型和工程动态。</p>
              </Link>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8 flex items-end justify-between gap-4 border-t border-border pt-8">
              <div>
                <p className="text-sm font-medium text-accent">Latest writing</p>
                <h2 className="mt-1 text-2xl font-bold text-primary">最新文章</h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-primary"
              >
                查看全部
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {featured.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-card/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {post.frontmatter.category && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{post.frontmatter.category}</span>
                      )}
                      <span className="text-xs text-secondary">
                        {formatDateChinese(post.frontmatter.date)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold leading-7 text-primary transition-colors group-hover:text-accent">{post.frontmatter.title}</h3>
                    {post.frontmatter.excerpt && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-secondary">{post.frontmatter.excerpt}</p>
                    )}
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      阅读
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.section>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
