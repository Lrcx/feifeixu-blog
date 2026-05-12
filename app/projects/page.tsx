"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Header, Footer, Container } from "@/components/layout/header";

const projects = [
  {
    name: "AI Agent 框架",
    desc: "基于 LLM 的智能 Agent 框架，支持工具调用",
    tech: ["Python", "LangChain", "OpenAI"],
    stars: 128,
  },
  {
    name: "RAG 知识库",
    desc: "检索增强生成知识系统",
    tech: ["TypeScript", "Next.js", "Pinecone"],
    stars: 96,
  },
  {
    name: "LLM 聊天应用",
    desc: "多模型对话应用",
    tech: ["React", "AI SDK", "Vercel"],
    stars: 64,
  },
];

export default function ProjectsPage() {
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
            <p className="mb-3 text-sm font-medium text-accent">Projects</p>
            <h1 className="text-4xl font-bold leading-tight text-primary md:text-5xl">作品集</h1>
            <p className="mt-4 max-w-2xl text-secondary leading-8">
              AI 应用和开源项目。这里展示的是我关注的工程方向和可复用的产品实验。
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-primary">{project.name}</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.035] px-2 py-1 text-xs font-medium text-secondary">
                    <Star className="size-3.5 fill-current" aria-hidden="true" />
                    {project.stars}
                  </span>
                </div>
                <p className="mb-5 text-sm leading-6 text-secondary">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
