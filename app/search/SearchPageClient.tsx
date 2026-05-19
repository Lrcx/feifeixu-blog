"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, FileSearch, Newspaper, Search } from "lucide-react";
import Link from "next/link";
import { Header, Footer, Container } from "@/components/layout/header";

export interface SearchItem {
  id: string;
  type: "blog" | "daily";
  title: string;
  href: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string;
}

interface SearchResult extends SearchItem {
  score: number;
  snippet: string;
  matchedTerms: string[];
}

const suggestions = ["Mem0 记忆检索", "RAG 技术原理", "Agent 工作流", "AI 日报 模型发布"];

function formatDateChinese(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function getQueryTerms(query: string): string[] {
  const normalized = normalizeText(query);
  const basicTerms = normalized
    .split(/[^\p{L}\p{N}]+/u)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);

  const cjkText = normalized.replace(/[^\p{Script=Han}]/gu, "");
  const cjkBigrams =
    cjkText.length >= 4
      ? Array.from({ length: cjkText.length - 1 }, (_, index) => cjkText.slice(index, index + 2))
      : [];

  return Array.from(new Set([normalized, ...basicTerms, ...cjkBigrams])).filter(
    (term) => term.length >= 2
  );
}

function createSnippet(item: SearchItem, terms: string[]): string {
  const source = item.content || item.excerpt;
  const normalizedSource = normalizeText(source);
  const hit = terms.find((term) => normalizedSource.includes(term));

  if (!hit) return item.excerpt;

  const index = Math.max(0, normalizedSource.indexOf(hit) - 56);
  const snippet = source.slice(index, index + 150).replace(/\s+/g, " ").trim();
  return `${index > 0 ? "..." : ""}${snippet}${index + 150 < source.length ? "..." : ""}`;
}

function scoreItem(item: SearchItem, terms: string[], query: string): SearchResult | null {
  const title = normalizeText(item.title);
  const excerpt = normalizeText(item.excerpt);
  const content = normalizeText(item.content);
  const category = normalizeText(item.category);
  const tags = item.tags.map(normalizeText);
  const normalizedQuery = normalizeText(query);

  let score = 0;
  const matchedTerms: string[] = [];

  if (title.includes(normalizedQuery)) score += 45;
  if (excerpt.includes(normalizedQuery)) score += 24;
  if (content.includes(normalizedQuery)) score += 18;

  for (const term of terms) {
    let termScore = 0;
    if (title.includes(term)) termScore += 16;
    if (category.includes(term)) termScore += 10;
    if (tags.some((tag) => tag.includes(term))) termScore += 10;
    if (excerpt.includes(term)) termScore += 7;
    if (content.includes(term)) termScore += 2;

    if (termScore > 0) {
      matchedTerms.push(term);
      score += termScore;
    }
  }

  if (score === 0) return null;

  return {
    ...item,
    score,
    matchedTerms: Array.from(new Set(matchedTerms)).slice(0, 5),
    snippet: createSnippet(item, terms),
  };
}

export default function SearchPageClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();

  const results = useMemo(() => {
    if (!trimmedQuery) return [];

    const terms = getQueryTerms(trimmedQuery);
    return items
      .map((item) => scoreItem(item, terms, trimmedQuery))
      .filter((item): item is SearchResult => Boolean(item))
      .sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [items, trimmedQuery]);

  const resultSummary = trimmedQuery
    ? results.length > 0
      ? `找到 ${results.length} 条相关内容，优先展示标题、标签和正文都更匹配的结果。`
      : "暂时没找到明显匹配的内容，可以换一个关键词试试。"
    : `已索引 ${items.length} 篇博客和 AI 日报。`;

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
                用自然语言检索站内博客、源码笔记和 AI 日报。当前版本在浏览器本地完成匹配，不依赖运行时 API。
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card/90 p-5 shadow-sm md:p-6">
              <label htmlFor="site-search" className="mb-2 block text-sm font-medium text-primary">
                你想找什么？
              </label>
              <div className="flex gap-2 rounded-2xl border border-border bg-white px-4 py-3 transition-colors focus-within:border-accent">
                <FileSearch className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden="true" />
                <input
                  id="site-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="例如：Mem0 如何检索记忆？"
                  className="w-full bg-transparent text-primary outline-none placeholder:text-secondary/70"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="cursor-pointer rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-blue-50 hover:text-accent"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              className="mt-5 rounded-2xl border border-border bg-card/90 p-5 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm leading-6 text-secondary">{resultSummary}</p>
            </motion.div>

            {results.length > 0 && (
              <div className="mt-6 grid gap-4">
                {results.map((result, index) => (
                  <motion.article
                    key={result.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index, 6) * 0.04 }}
                  >
                    <Link
                      href={result.href}
                      className="group block rounded-2xl border border-border bg-card/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {result.type === "blog" ? (
                            <BookOpen className="size-3.5" aria-hidden="true" />
                          ) : (
                            <Newspaper className="size-3.5" aria-hidden="true" />
                          )}
                          {result.type === "blog" ? "博客" : "AI日报"}
                        </span>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-secondary">
                          {result.category}
                        </span>
                        <time className="text-xs text-secondary">{formatDateChinese(result.date)}</time>
                      </div>

                      <h2 className="text-lg font-semibold leading-7 text-primary transition-colors group-hover:text-accent">
                        {result.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-secondary">{result.snippet}</p>

                      {result.matchedTerms.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {result.matchedTerms.map((term) => (
                            <span
                              key={term}
                              className="rounded-full border border-border bg-white/70 px-2.5 py-1 text-xs text-secondary"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                        打开内容
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
