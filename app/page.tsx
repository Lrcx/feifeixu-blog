"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header, Footer, Container } from "@/components/layout/header";

const posts = [
  {
    slug: "exploring-ai-agent",
    title: "探索 AI Agent 的无限可能",
    excerpt: "深入理解 Agent 设计理念，从概念到应用",
    date: "2024年4月20日",
    category: "LLM",
  },
  {
    slug: "rag-enhance-llm",
    title: "用 RAG 增强 LLM 的知识边界",
    excerpt: "检索增强生成技术让 LLM 获得精准领域知识",
    date: "2024年4月18日",
    category: "LLM",
  },
  {
    slug: "prompt-engineering",
    title: "Prompt Engineering 最佳实践",
    excerpt: "从基础到进阶，掌握与 LLM 有效沟通的艺术",
    date: "2024年4月15日",
    category: "技巧",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 py-24">
        <Container>
          {/* Hero */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4">
              你好，我是肥肥旭
            </h1>
            <p className="text-lg text-secondary max-w-xl mb-6">
              AI/LLM 工程师，探索智能系统前沿。
              分享 Agent、RAG 以及 AI 应用开发的技术洞察。
            </p>
            <div className="flex gap-4">
              <Link
                href="/blog"
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
              >
                阅读博客
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 border border-border text-secondary rounded-md hover:border-accent hover:text-accent transition-colors"
              >
                关于我
              </Link>
            </div>
          </motion.section>

          {/* Recent Posts */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold">最新文章</h2>
              <Link
                href="/blog"
                className="text-sm text-accent hover:text-accent/80"
              >
                查看全部 →
              </Link>
            </div>

            <div className="space-y-4">
              {posts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block p-4 border border-border rounded-lg hover:border-accent/50 transition-colors bg-card"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-accent">{post.category}</span>
                      <span className="text-xs text-secondary">{post.date}</span>
                    </div>
                    <h3 className="font-medium mb-1">{post.title}</h3>
                    <p className="text-sm text-secondary">{post.excerpt}</p>
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