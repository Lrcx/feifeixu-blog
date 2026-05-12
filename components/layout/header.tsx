"use client";

import { ArrowUpRight, GitBranch, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "博客" },
  { href: "/ai-daily-report", label: "AI日报" },
  { href: "/projects", label: "作品" },
  { href: "/about", label: "关于我" },
];

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-black/10 bg-[#FFFDF8]/90 px-3 shadow-[0_10px_35px_rgba(24,24,27,0.08)] backdrop-blur-md sm:px-5">
        <Link
          href="/"
          className="group inline-flex min-w-0 items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
          aria-label="返回首页"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white transition-colors group-hover:bg-accent">
            旭
          </span>
          <span className="hidden sm:inline">肥肥旭</span>
        </Link>

        <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-full bg-black/[0.035] p-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                isActive(link.href)
                  ? "bg-primary text-white shadow-sm"
                  : "text-secondary hover:bg-white hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/search"
          className={`ml-2 grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-200 ${
            isActive("/search")
              ? "bg-accent text-white"
              : "text-secondary hover:bg-white hover:text-primary"
          }`}
          aria-label="搜索"
          title="搜索"
        >
          <Search className="size-4" aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-[#FFFDF8]/80 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 text-sm text-secondary sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-primary">肥肥旭</p>
          <p className="mt-1">© {new Date().getFullYear()} AI 工程与长期写作</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/70 px-3 py-1.5 transition-colors hover:border-accent/40 hover:text-accent"
          >
            <GitBranch className="size-4" aria-hidden="true" />
            GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/70 px-3 py-1.5 transition-colors hover:border-accent/40 hover:text-accent"
          >
            Twitter
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export function Container({
  children,
  className = "",
  size = "wide",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "narrow" | "wide";
}) {
  const width = size === "narrow" ? "max-w-3xl" : "max-w-5xl";
  return <div className={`${width} mx-auto px-5 sm:px-6 ${className}`}>{children}</div>;
}
