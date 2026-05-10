"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header, Footer, Container } from "@/components/layout/header";
import type { Post } from "@/lib/mdx";

function formatDateChinese(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function BlogPageClient({ posts }: { posts: Post[] }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">博客</h1>
            <p className="text-secondary mb-12">
              关于 AI、LLM 以及构建智能系统的思考
            </p>
          </motion.div>

          <div className="space-y-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <div className="flex items-center gap-2 mb-2">
                    {post.frontmatter.category && (
                      <span className="text-xs font-medium text-accent">
                        {post.frontmatter.category}
                      </span>
                    )}
                    <span className="text-xs text-secondary">
                      {formatDateChinese(post.frontmatter.date)}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors">
                    {post.frontmatter.title}
                  </h2>
                  {post.frontmatter.excerpt && (
                    <p className="text-sm text-secondary">
                      {post.frontmatter.excerpt}
                    </p>
                  )}
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
