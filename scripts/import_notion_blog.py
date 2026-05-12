#!/usr/bin/env python3
"""
Import Notion-exported blog zip files into content/blog/*.mdx.
"""

import argparse
import re
import shutil
import zipfile
from datetime import datetime
from pathlib import Path

SOURCE_DIR = Path("~/Downloads/博客").expanduser()
TARGET_DIR = Path("content/blog")
IMAGE_DIR = Path("public/blog-images")


def safe_slug(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^\w\s-]", "", value, flags=re.UNICODE)
    value = re.sub(r"[\s_]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value[:80] or "notion-post"


def normalize_date(value: str) -> str:
    value = value.strip()
    for fmt in ("%Y/%m/%d", "%Y-%m-%d"):
        try:
            return datetime.strptime(value, fmt).strftime("%Y-%m-%d")
        except ValueError:
            pass
    return datetime.now().strftime("%Y-%m-%d")


def extract_zip(zip_path: Path, target_dir: Path) -> None:
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(target_dir)

    for nested in list(target_dir.glob("*.zip")):
        with zipfile.ZipFile(nested, "r") as zf:
            zf.extractall(target_dir)
        nested.unlink()


def parse_notion_markdown(markdown: str) -> dict:
    lines = markdown.strip().splitlines()
    title = ""
    metadata: dict[str, str] = {}
    summary_lines: list[str] = []
    body_start = 0
    current_key = ""

    if lines and lines[0].startswith("# "):
        title = lines[0][2:].strip()
        body_start = 1

    def has_upcoming_property(start_index: int) -> bool:
        for future_line in lines[start_index + 1:start_index + 8]:
            future = future_line.strip()
            if future == "":
                break
            if re.match(r"^(type|status|date|slug|summary|tags|category):\s*", future):
                return True
        return False

    for index, line in enumerate(lines[1:], start=1):
        stripped = line.strip()
        match = re.match(r"^(type|status|date|slug|summary|tags|category):\s*(.*)$", stripped)
        if match:
            current_key = match.group(1)
            if current_key == "summary":
                summary_lines = [match.group(2).strip()]
            else:
                metadata[current_key] = match.group(2).strip()
            body_start = index + 1
            continue

        if stripped == "":
            body_start = index + 1
            continue

        if (
            (current_key == "summary" and stripped.startswith(("-", "*")))
            or has_upcoming_property(index)
        ):
            summary_lines.append(stripped)
            body_start = index + 1
            continue

        break

    if summary_lines:
        metadata["summary"] = "\n".join(line for line in summary_lines if line)

    body = "\n".join(lines[body_start:]).strip()
    date = normalize_date(metadata.get("date", ""))
    slug = safe_slug(metadata.get("slug") or title)
    tags = [
        tag.strip()
        for tag in metadata.get("tags", "").split(",")
        if tag.strip()
    ]

    return {
        "title": title or slug,
        "date": date,
        "slug": slug,
        "summary": metadata.get("summary", ""),
        "tags": tags,
        "category": metadata.get("category", "博客"),
        "body": body,
    }


def escape_yaml(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def rewrite_local_images(body: str, extract_dir: Path, slug: str) -> str:
    post_image_dir = IMAGE_DIR / slug
    copied: dict[str, str] = {}

    def replace(match: re.Match[str]) -> str:
        alt = match.group(1)
        src = match.group(2)

        if src.startswith(("http://", "https://", "/")):
            return match.group(0)

        decoded_src = src.replace("%20", " ")
        local_path = extract_dir / decoded_src
        if not local_path.exists():
            candidates = list(extract_dir.rglob(Path(decoded_src).name))
            local_path = candidates[0] if candidates else local_path

        if not local_path.exists() or not local_path.is_file():
            return match.group(0)

        post_image_dir.mkdir(parents=True, exist_ok=True)
        target_name = safe_slug(local_path.stem) + local_path.suffix.lower()
        target_path = post_image_dir / target_name
        shutil.copy(local_path, target_path)
        copied[src] = f"/blog-images/{slug}/{target_name}"
        return f"![{alt}]({copied[src]})"

    return re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", replace, body)


def to_mdx(parsed: dict, body: str) -> str:
    tags = ", ".join(f'"{escape_yaml(tag)}"' for tag in parsed["tags"])
    frontmatter = [
        "---",
        f'title: "{escape_yaml(parsed["title"])}"',
        f'date: "{parsed["date"]}"',
        f'excerpt: "{escape_yaml(parsed["summary"])}"',
        f"tags: [{tags}]",
        f'category: "{escape_yaml(parsed["category"])}"',
        'author: "肥肥旭"',
        "---",
        "",
    ]
    return "\n".join(frontmatter) + body.strip() + "\n"


def iter_source_files() -> list[Path]:
    return sorted(path for path in SOURCE_DIR.iterdir() if path.is_file())


def import_one(source: Path, force: bool) -> Path | None:
    temp_dir = Path("/private/tmp") / f"notion-blog-{safe_slug(source.stem)}"
    shutil.rmtree(temp_dir, ignore_errors=True)
    temp_dir.mkdir(parents=True, exist_ok=True)

    try:
      extract_zip(source, temp_dir)
    except zipfile.BadZipFile:
      extract_zip(source.with_suffix(".zip"), temp_dir)

    md_files = sorted(temp_dir.rglob("*.md"))
    if not md_files:
        print(f"跳过，没有找到 Markdown: {source.name}")
        return None

    md_file = md_files[0]
    parsed = parse_notion_markdown(md_file.read_text(encoding="utf-8"))
    body = rewrite_local_images(parsed["body"], temp_dir, parsed["slug"])
    target = TARGET_DIR / f"{parsed['slug']}.mdx"

    if target.exists() and not force:
        print(f"跳过，已存在: {target.name}")
        return None

    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    target.write_text(to_mdx(parsed, body), encoding="utf-8")
    print(f"导入: {source.name} -> {target.name}")
    return target


def main() -> None:
    parser = argparse.ArgumentParser(description="Import Notion blog exports")
    parser.add_argument("--force", action="store_true", help="overwrite existing posts")
    args = parser.parse_args()

    imported = []
    for source in iter_source_files():
        result = import_one(source, args.force)
        if result:
            imported.append(result)

    print(f"\n完成，导入 {len(imported)} 篇文章。")


if __name__ == "__main__":
    main()
