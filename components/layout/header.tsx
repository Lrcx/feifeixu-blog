"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "博客" },
  { href: "/projects", label: "作品" },
  { href: "/ai-daily-report", label: "AI日报" },
  { href: "/search", label: "AI搜索" },
  { href: "/about", label: "关于" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-semibold text-lg text-black">
          肥肥旭
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 mt-auto bg-white">
      <div className="max-w-3xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
        <span>© {new Date().getFullYear()} 肥肥旭</span>
        <div className="flex items-center gap-6">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            GitHub
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="max-w-3xl mx-auto px-6">{children}</div>;
}