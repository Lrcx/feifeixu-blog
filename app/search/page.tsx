"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header, Footer, Container } from "@/components/layout/header";

const suggestions = ["什么是 AI Agent?", "RAG 技术原理", "Prompt 工程技巧"];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 py-24">
        <Container>
          <motion.div
            className="max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-center">AI 搜索</h1>
            <p className="text-secondary mb-8 text-center">
              智能对话式内容发现
            </p>

            {/* Search Input */}
            <div className="mb-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="输入你的问题..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:border-accent focus:outline-none transition-colors bg-card"
              />
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="text-sm px-3 py-1 bg-muted rounded hover:bg-border transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Placeholder result */}
            {query && (
              <motion.div
                className="border border-border rounded-lg p-6 bg-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-secondary">
                  AI 搜索功能即将上线。配置 OpenAI API Key 即可启用智能内容搜索。
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