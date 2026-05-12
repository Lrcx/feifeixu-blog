"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers3 } from "lucide-react";
import Link from "next/link";
import { Header, Footer, Container } from "@/components/layout/header";
import type { Post } from "@/lib/mdx";

function formatDateChinese(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function BlogPageClient({ posts }: { posts: Post[] }) {
  const categories = Array.from(
    new Set(posts.map((post) => post.frontmatter.category).filter(Boolean))
  );

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
              <Layers3 className="size-4 text-accent" aria-hidden="true" />
              {posts.length} 篇文章
            </div>
            <h1 className="text-4xl font-bold leading-tight text-primary md:text-5xl">博客</h1>
            <p className="mt-4 max-w-2xl text-secondary leading-8">
              关于 AI、LLM 以及构建智能系统的思考。按时间沉淀，适合顺着问题一路读下去。
            </p>
            {categories.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-border bg-card px-3 py-1 text-sm text-secondary"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          <div className="grid gap-4">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + Math.min(i, 8) * 0.04 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid gap-4 rounded-2xl border border-border bg-card/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md sm:grid-cols-[10rem_1fr_auto] sm:items-center"
                >
                  <div className="text-sm text-secondary">
                    <time>{formatDateChinese(post.frontmatter.date)}</time>
                    {post.frontmatter.category && (
                      <span className="mt-2 block w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {post.frontmatter.category}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold leading-7 text-primary transition-colors group-hover:text-accent">
                      {post.frontmatter.title}
                    </h2>
                    {post.frontmatter.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-secondary">
                        {post.frontmatter.excerpt}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent sm:justify-self-end">
                    阅读
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
