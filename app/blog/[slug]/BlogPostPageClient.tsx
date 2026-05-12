"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header, Footer, Container } from "@/components/layout/header";
import type { Post } from "@/lib/mdx";

function formatDateChinese(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function BlogPostPageClient({ post }: { post: Post }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <Container size="narrow">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:border-accent/40 hover:text-accent"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              返回博客列表
            </Link>

            <header className="mb-10 rounded-3xl border border-border bg-card/90 p-6 shadow-sm md:p-8">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                {post.frontmatter.category && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {post.frontmatter.category}
                  </span>
                )}
                <time className="inline-flex items-center gap-1.5 text-sm text-secondary">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {formatDateChinese(post.frontmatter.date)}
                </time>
              </div>
              <h1 className="text-3xl font-bold leading-tight text-primary md:text-5xl">
                {post.frontmatter.title}
              </h1>
              {post.frontmatter.excerpt && (
                <p className="mt-5 text-base leading-8 text-secondary">
                  {post.frontmatter.excerpt}
                </p>
              )}
            </header>

            <div className="article-content space-y-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: () => null,
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-primary">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-primary">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p>{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-2 my-4 list-decimal pl-5">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li>{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-7 rounded-r-2xl border-l-4 border-accent bg-blue-50/60 px-5 py-4">
                      <div className="text-secondary">{children}</div>
                    </blockquote>
                  ),
                  hr: () => (
                    <hr className="my-10 border-gray-200" />
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-primary">{children}</strong>
                  ),
                  code: ({ children }) => (
                    <code className="rounded-md bg-muted px-1.5 py-0.5 text-sm text-primary">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="overflow-x-auto rounded-2xl bg-gray-950 p-5 text-sm leading-7 text-gray-100">
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent underline decoration-blue-200 underline-offset-4 transition-colors hover:text-primary"
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => {
                    if (typeof src !== "string" || !src) return null;

                    return (
                      <figure className="my-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <Image
                          src={src}
                          alt={alt || ""}
                          width={960}
                          height={540}
                          className="h-auto w-full"
                          unoptimized
                        />
                        {alt && (
                          <figcaption className="border-t border-border px-4 py-3 text-center text-xs text-secondary">
                            {alt}
                          </figcaption>
                        )}
                      </figure>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </motion.article>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
