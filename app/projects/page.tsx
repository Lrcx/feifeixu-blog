"use client";

import { motion } from "framer-motion";
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
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">作品集</h1>
            <p className="text-secondary mb-12">
              AI 应用和开源项目
            </p>
          </motion.div>

          <div className="space-y-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="border border-border rounded-lg p-6 hover:border-accent/50 transition-colors bg-card"
              >
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-semibold">{project.name}</h2>
                  <span className="text-sm text-secondary">★ {project.stars}</span>
                </div>
                <p className="text-sm text-secondary mb-4">{project.desc}</p>
                <div className="flex gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 bg-muted rounded"
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