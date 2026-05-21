"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Filter, Library, Star, Tags } from "lucide-react";
import { Header, Footer, Container } from "@/components/layout/header";
import type { AgentResource, ResourceLevel } from "@/data/resources";

const allCategories = "全部分类";
const allLevels = "全部难度";
const levelOptions: Array<ResourceLevel | typeof allLevels> = [
  allLevels,
  "入门",
  "进阶",
  "深入",
];

export default function ResourcesPageClient({
  resources,
}: {
  resources: AgentResource[];
}) {
  const [selectedCategory, setSelectedCategory] = useState(allCategories);
  const [selectedLevel, setSelectedLevel] = useState<ResourceLevel | typeof allLevels>(allLevels);

  const categories = useMemo(
    () => [allCategories, ...Array.from(new Set(resources.map((resource) => resource.category)))],
    [resources]
  );

  const filteredResources = resources.filter((resource) => {
    const categoryMatched =
      selectedCategory === allCategories || resource.category === selectedCategory;
    const levelMatched = selectedLevel === allLevels || resource.level === selectedLevel;
    return categoryMatched && levelMatched;
  });

  const featuredCount = resources.filter((resource) => resource.featured).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <Container>
          <motion.section
            className="mb-12 grid gap-8 md:grid-cols-[1fr_18rem] md:items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-sm font-medium text-secondary">
                <Library className="size-4 text-accent" aria-hidden="true" />
                持续收藏的 Agent 学习资源
              </div>
              <h1 className="text-4xl font-bold leading-tight text-primary md:text-5xl">
                Agent 资源库
              </h1>
              <p className="mt-4 max-w-2xl text-secondary leading-8">
                这里放我筛过、想反复回看的 Agent 网站、框架、论文、工具和课程。它不是堆链接，更像一张可以长期维护的学习索引。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
                <p className="text-3xl font-bold text-primary">{resources.length}</p>
                <p className="mt-1 text-sm text-secondary">个资源入口</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
                <p className="text-3xl font-bold text-primary">{featuredCount}</p>
                <p className="mt-1 text-sm text-secondary">个精选推荐</p>
              </div>
            </div>
          </motion.section>

          <div className="mb-8 rounded-2xl border border-border bg-card/90 p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
              <Filter className="size-4 text-accent" aria-hidden="true" />
              筛选资源
            </div>

            <div className="grid gap-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-secondary">分类</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-primary text-white"
                          : "bg-muted text-secondary hover:bg-blue-50 hover:text-accent"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase text-secondary">难度</p>
                <div className="flex flex-wrap gap-2">
                  {levelOptions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedLevel(level)}
                      className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedLevel === level
                          ? "bg-accent text-white"
                          : "bg-muted text-secondary hover:bg-blue-50 hover:text-accent"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm text-secondary">
              当前展示 {filteredResources.length} / {resources.length} 个资源
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredResources.map((resource, index) => (
              <motion.article
                key={resource.url}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index, 8) * 0.04 }}
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {resource.category}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-secondary">
                      {resource.level}
                    </span>
                    {resource.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        <Star className="size-3.5 fill-current" aria-hidden="true" />
                        精选
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold leading-7 text-primary transition-colors group-hover:text-accent">
                    {resource.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-secondary">
                    {resource.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-white/70 px-2.5 py-1 text-xs text-secondary"
                      >
                        <Tags className="size-3" aria-hidden="true" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    打开资源
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </a>
              </motion.article>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="rounded-2xl border border-border bg-card/80 py-16 text-center">
              <p className="text-secondary">这个筛选条件下暂时没有资源。</p>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
