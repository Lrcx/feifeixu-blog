#!/usr/bin/env python3
"""
AI 日报静态发布脚本。

Cloudflare Pages + GitHub 模式下，不再向博客服务器 POST 写文件。
这个脚本会在仓库内生成 content/daily/*.mdx，并可选执行 git commit/push，
由 Cloudflare Pages 监听 GitHub 更新后自动构建发布。
"""

import argparse
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parents[1]
DAILY_DIR = ROOT_DIR / "content" / "daily"


def slugify(title: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", title.lower(), flags=re.UNICODE)
    slug = re.sub(r"\s+", "-", slug).strip("-")
    return slug[:50] or "ai-daily"


def normalize_date(date: str | None) -> str:
    if not date:
        return datetime.now().strftime("%Y-%m-%d")

    for fmt in ("%Y-%m-%d", "%Y/%m/%d"):
        try:
            return datetime.strptime(date, fmt).strftime("%Y-%m-%d")
        except ValueError:
            pass

    raise ValueError(f"Invalid date: {date}. Expected YYYY-MM-DD or YYYY/MM/DD.")


def escape_yaml(value: Any) -> str:
    return str(value).replace("\\", "\\\\").replace('"', '\\"')


def build_mdx(item: dict[str, Any]) -> tuple[str, str]:
    title = item.get("title")
    content = item.get("content")

    if not title or not content:
        raise ValueError("Each item must include title and content.")

    date = normalize_date(item.get("date"))
    source = item.get("source", "AI 日报")
    category = item.get("category", "AI日报")
    tags = item.get("tags", ["AI日报"])
    slug = item.get("slug") or f"{date}-ai-daily"

    if item.get("slug") is None and title:
        title_slug = slugify(title)
        if title_slug and title_slug != "ai-daily":
            slug = f"{date}-{title_slug}"

    tags_yaml = ", ".join(f'"{escape_yaml(tag)}"' for tag in tags)
    frontmatter = "\n".join(
        [
            "---",
            f'title: "{escape_yaml(title)}"',
            f'date: "{date}"',
            f'source: "{escape_yaml(source)}"',
            f'category: "{escape_yaml(category)}"',
            f"tags: [{tags_yaml}]",
            "---",
            "",
        ]
    )

    return slug, frontmatter + str(content).strip() + "\n"


def write_item(item: dict[str, Any]) -> Path:
    DAILY_DIR.mkdir(parents=True, exist_ok=True)
    slug, mdx = build_mdx(item)
    path = DAILY_DIR / f"{slug}.mdx"
    path.write_text(mdx, encoding="utf-8")
    return path


def run_git(paths: list[Path], message: str, push: bool) -> None:
    rel_paths = [str(path.relative_to(ROOT_DIR)) for path in paths]
    subprocess.run(["git", "add", *rel_paths], cwd=ROOT_DIR, check=True)
    subprocess.run(["git", "commit", "-m", message], cwd=ROOT_DIR, check=True)

    if push:
        subprocess.run(["git", "push"], cwd=ROOT_DIR, check=True)


def load_items(args: argparse.Namespace) -> list[dict[str, Any]]:
    if args.push:
        return [json.loads(args.push)]

    if args.batch:
        data = json.loads(Path(args.batch).read_text(encoding="utf-8"))
        if isinstance(data, dict):
            return [data]
        if isinstance(data, list):
            return data
        raise ValueError("Batch JSON must be an object or an array.")

    raise ValueError("Use --push JSON or --batch file.json.")


def main() -> None:
    parser = argparse.ArgumentParser(description="生成 AI 日报 MDX，并可选提交到 GitHub")
    parser.add_argument("--push", help="单条日报 JSON")
    parser.add_argument("--batch", help="批量日报 JSON 文件")
    parser.add_argument("--commit", action="store_true", help="生成后自动 git commit")
    parser.add_argument("--push-git", action="store_true", help="commit 后自动 git push")
    parser.add_argument("--message", default=None, help="Git commit message")
    args = parser.parse_args()

    items = load_items(args)
    paths = [write_item(item) for item in items]

    for path in paths:
        print(f"✓ 写入 {path.relative_to(ROOT_DIR)}")

    if args.commit or args.push_git:
        message = args.message or f"add ai daily report {datetime.now().strftime('%Y-%m-%d')}"
        run_git(paths, message, args.push_git)
        print("✓ Git 提交完成")
        if args.push_git:
            print("✓ GitHub 推送完成，Cloudflare Pages 将自动重新部署")
    else:
        print("提示：检查无误后执行 git add/commit/push，触发 Cloudflare Pages 发布。")


if __name__ == "__main__":
    main()
