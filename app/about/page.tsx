"use client";

import { motion } from "framer-motion";
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
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">关于我</h1>
            <p className="text-secondary mb-12">
              AI/LLM 工程师，中国
            </p>
          </motion.div>

          {/* Bio */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-secondary leading-relaxed">
              我是一名专注于 AI/LLM 的工程师，热衷于探索智能技术的边界。
              从传统软件开发到 AI 应用构建，我一直在追寻技术演进的脚步。
              我相信 AI 将深刻改变我们与世界交互的方式，而我有幸站在这个变革的前沿。
            </p>
          </motion.section>

          {/* Skills */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6">技能</h2>
            <div className="space-y-4">
              {skills.map((skill, i) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-secondary">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
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

          {/* Timeline */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-6">时间线</h2>
            <div className="space-y-4">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <span className="text-sm font-medium text-accent w-12">
                    {item.year}
                  </span>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-secondary">{item.desc}</p>
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