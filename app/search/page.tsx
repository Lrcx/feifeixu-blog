"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Header, Footer, Container } from "@/components/layout/header";

const suggestions = ["什么是 AI Agent?", "RAG 技术原理", "Prompt 工程技巧"];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-10 text-center">
              <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full border border-border bg-card shadow-sm">
                <Search className="size-5 text-accent" aria-hidden="true" />
              </div>
              <h1 className="text-4xl font-bold leading-tight text-primary md:text-5xl">AI 搜索</h1>
              <p className="mx-auto mt-4 max-w-xl text-secondary leading-8">
                用自然语言找到站内文章、日报和技术笔记。
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card/90 p-5 shadow-sm md:p-6">
              <label htmlFor="site-search" className="mb-2 block text-sm font-medium text-primary">
                你想找什么？
              </label>
              <input
                id="site-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="输入你的问题..."
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-primary outline-none transition-colors focus:border-accent"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="cursor-pointer rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-blue-50 hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {query && (
              <motion.div
                className="mt-5 rounded-2xl border border-border bg-card/90 p-5 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm leading-6 text-secondary">
                  AI 搜索功能即将上线。配置 OpenAI API Key 即可启用智能内容搜索。当前查询：
                  <span className="font-semibold text-primary"> {query}</span>
                </p>
              </motion.div>
            )}
          </motion.div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
