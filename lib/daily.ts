import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DAILY_DIR = path.join(process.cwd(), "content/daily");

export interface DailyFrontmatter {
  title: string;
  date: string;
  source: string;
  category: string;
  tags?: string[];
}

export interface DailyItem {
  slug: string;
  frontmatter: DailyFrontmatter;
  content: string;
}

export function getAllDailyItems(): DailyItem[] {
  if (!fs.existsSync(DAILY_DIR)) return [];

  const files = fs.readdirSync(DAILY_DIR);
  const items = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(DAILY_DIR, file);
      const rawContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(rawContent);

      return {
        slug: file.replace(/\.(mdx|md)$/, ""),
        frontmatter: data as DailyFrontmatter,
        content,
      };
    })
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

  return items;
}

export function getDailyItemBySlug(slug: string): DailyItem | null {
  const filePath = path.join(DAILY_DIR, `${slug}.mdx`);
  const mdPath = path.join(DAILY_DIR, `${slug}.md`);

  const actualPath = fs.existsSync(filePath) ? filePath : mdPath;

  if (!fs.existsSync(actualPath)) return null;

  const rawContent = fs.readFileSync(actualPath, "utf-8");
  const { data, content } = matter(rawContent);

  return {
    slug,
    frontmatter: data as DailyFrontmatter,
    content,
  };
}

export function formatDateChinese(date: string): string {
  const d = new Date(date);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}