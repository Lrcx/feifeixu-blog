"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Header, Footer, Container } from "@/components/layout/header";

const skills = [
  { name: "LLM/Agent", level: 90 },
  { name: "Python", level: 85 },
  { name: "TypeScript", level: 80 },
  { name: "React/Next.js", level: 75 },
];

const timeline = [
  { year: "2024", title: "AI Agent 研究", desc: "深入探索 Agent 技术" },
  { year: "2023", title: "LLM 应用开发", desc: "构建 AI 产品" },
  { year: "2022", title: "软件工程师", desc: "全栈开发" },
  { year: "2021", title: "技术之旅开启", desc: "开始学习编程" },
];

export default function AboutPage() {
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
            <p className="mb-3 text-sm font-medium text-accent">About</p>
            <h1 className="text-4xl font-bold leading-tight text-primary md:text-5xl">关于我</h1>
            <p className="mt-4 max-w-2xl text-secondary leading-8">
              AI/LLM 工程师，中国。关注智能系统如何真正落地，也关心技术写作如何帮助后来的人少踩坑。
            </p>
          </motion.div>

          <motion.section
            className="mb-12 rounded-3xl border border-border bg-card/90 p-6 shadow-sm md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="max-w-3xl text-secondary leading-8">
              我是一名专注于 AI/LLM 的工程师，热衷于探索智能技术的边界。
              从传统软件开发到 AI 应用构建，我一直在追寻技术演进的脚步。
              我相信 AI 将深刻改变我们与世界交互的方式，而我有幸站在这个变革的前沿。
            </p>
          </motion.section>

          <motion.section
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-6 flex items-center justify-between border-t border-border pt-8">
              <h2 className="text-2xl font-bold text-primary">技能</h2>
              <ArrowUpRight className="size-5 text-accent" aria-hidden="true" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {skills.map((skill, i) => (
                <div key={skill.name} className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-primary">{skill.name}</span>
                    <span className="text-sm text-secondary">{skill.level}%</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="mb-6 border-t border-border pt-8 text-2xl font-bold text-primary">时间线</h2>
            <div className="grid gap-4">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  className="grid gap-2 rounded-2xl border border-border bg-card/90 p-5 shadow-sm sm:grid-cols-[5rem_1fr]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <span className="text-sm font-semibold text-accent">
                    {item.year}
                  </span>
                  <div>
                    <h3 className="font-semibold text-primary">{item.title}</h3>
                    <p className="mt-1 text-sm text-secondary">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
