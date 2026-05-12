#!/usr/bin/env python3
"""
将 AI 早报 zip 文件转换为博客 MDX 格式
"""

import os
import re
import shutil
import zipfile
import argparse
from pathlib import Path
from datetime import datetime

# 源目录
SOURCE_DIR = Path("~/Downloads/AI日报").expanduser()
# 目标目录
TARGET_DIR = Path("content/daily")
# 图片目录
IMAGE_DIR = Path("public/daily-images")

def extract_nested_zip(zip_path: Path, extract_to: Path):
    """解压嵌套的 zip 文件"""
    temp_dir = extract_to / "temp"
    temp_dir.mkdir(parents=True, exist_ok=True)

    # 第一层解压
    with zipfile.ZipFile(zip_path, 'r') as zf:
        zf.extractall(temp_dir)

    # 查找嵌套的 zip
    for f in temp_dir.iterdir():
        if f.suffix == '.zip':
            # 第二层解压
            with zipfile.ZipFile(f, 'r') as zf:
                zf.extractall(extract_to)
            f.unlink()  # 删除嵌套 zip

    # 清理 temp
    shutil.rmtree(temp_dir, ignore_errors=True)

def parse_markdown(content: str) -> dict:
    """解析原始 markdown 格式"""
    lines = content.strip().split('\n')

    result = {
        'title': '',
        'date': '',
        'summary': '',
        'tags': [],
        'category': 'AI早报',
        'source': 'AI早报',
        'content': ''
    }

    # 解析头部
    in_header = True
    header_lines = []
    content_lines = []

    for i, line in enumerate(lines):
        if in_header:
            if line.startswith('# ') and i == 0:
                result['title'] = line[2:].strip()
            elif line.startswith('date:'):
                result['date'] = line.split(':')[1].strip().replace('/', '-')
            elif line.startswith('summary:'):
                result['summary'] = line.split(':')[1].strip()
            elif line.startswith('tags:'):
                tags_str = line.split(':')[1].strip()
                result['tags'] = [t.strip() for t in tags_str.split(',') if t.strip()]
            elif line.startswith('category:'):
                result['category'] = line.split(':')[1].strip()
            elif line.startswith('# ') and i > 0:  # 第二个标题，内容开始
                in_header = False
                content_lines.append(line)
            elif not any(line.startswith(k) for k in ['type:', 'status:', 'slug:']):
                if line.strip():
                    pass  # 跳过空行或其他元数据
        else:
            content_lines.append(line)

    result['content'] = '\n'.join(content_lines)
    return result

def generate_slug(date: str, title: str) -> str:
    """生成 slug"""
    date_str = date.replace('/', '-')
    return f"{date_str}-ai-daily"

def convert_to_mdx(parsed: dict, images: list = None) -> str:
    """转换为 MDX 格式"""
    # 构建 frontmatter
    frontmatter = f'''---
title: "{parsed['title'].replace('"', '\\"')}"
date: "{parsed['date']}"
source: "{parsed['source']}"
category: "{parsed['category']}"
tags: {parsed['tags']}
---

'''

    # 处理内容中的图片引用 - 使用正则表达式
    content = parsed['content']

    if images:
        # 用正则匹配所有图片引用并替换
        for img in images:
            old_name = img['original_name']
            new_path = f"/daily-images/{parsed['date']}/{img['new_name']}"
            pattern = rf'!\[\]\([^)]*{re.escape(old_name)}\)'
            content = re.sub(pattern, f'![{old_name}]({new_path})', content)

    # 处理原文链接：把 📎 [原文链接](url) 改成单独一行
    content = re.sub(r'📎 \[原文链接\]', '[原文链接]', content)

    return frontmatter + content

def process_all_zips():
    """处理所有 zip 文件"""
    parser = argparse.ArgumentParser(description="将 AI 日报 zip 文件转换为博客 MDX 格式")
    parser.add_argument("--start-date", help="开始日期，格式 YYYY-MM-DD")
    parser.add_argument("--end-date", help="结束日期，格式 YYYY-MM-DD")
    args = parser.parse_args()

    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)

    # 获取所有 zip 文件
    zip_files = sorted(SOURCE_DIR.glob("*.zip"))

    print(f"找到 {len(zip_files)} 个 zip 文件")

    for zip_file in zip_files:
        zip_date_match = re.search(r'(\d{4})年(\d{2})月(\d{2})日', zip_file.name)
        zip_date = (
            f"{zip_date_match.group(1)}-{zip_date_match.group(2)}-{zip_date_match.group(3)}"
            if zip_date_match
            else ""
        )

        if args.start_date and zip_date and zip_date < args.start_date:
            continue
        if args.end_date and zip_date and zip_date > args.end_date:
            continue

        print(f"\n处理: {zip_file.name}")

        # 创建临时目录
        temp_dir = Path(f"/tmp/ai-daily-{zip_file.stem}")
        temp_dir.mkdir(parents=True, exist_ok=True)

        try:
            # 解压
            extract_nested_zip(zip_file, temp_dir)

            # 查找 markdown 文件
            md_files = list(temp_dir.glob("*.md"))

            # 查找子目录中的 md 文件和图片目录
            subdirs = [d for d in temp_dir.iterdir() if d.is_dir()]

            for md_file in md_files:
                print(f"  读取: {md_file.name}")

                content = md_file.read_text(encoding='utf-8')
                parsed = parse_markdown(content)

                if not parsed['date']:
                    # 从文件名提取日期
                    match = re.search(r'(\d{4})年(\d{2})月(\d{2})日', zip_file.name)
                    if match:
                        parsed['date'] = f"{match.group(1)}-{match.group(2)}-{match.group(3)}"

                slug = generate_slug(parsed['date'], parsed['title'])

                # 查找对应的图片目录
                images = []
                img_folder_name = None

                # 图片目录通常与标题同名
                for subdir in subdirs:
                    subdir_name = subdir.name
                    # 检查是否是图片目录
                    if any(f.suffix in ['.png', '.jpg', '.jpeg', '.webp', '.gif'] for f in subdir.iterdir() if f.is_file()):
                        img_folder_name = subdir_name
                        date_img_dir = IMAGE_DIR / parsed['date']
                        date_img_dir.mkdir(parents=True, exist_ok=True)

                        for img_file in subdir.iterdir():
                            if img_file.suffix in ['.png', '.jpg', '.jpeg', '.webp', '.gif']:
                                new_name = img_file.name
                                new_path = date_img_dir / new_name
                                shutil.copy(img_file, new_path)
                                images.append({
                                    'original_name': img_file.name,
                                    'new_name': new_name,
                                    'new_path': str(new_path)
                                })
                                print(f"    复制图片: {new_name}")

                # 生成 MDX
                mdx_content = convert_to_mdx(parsed, images)

                # 写入目标文件
                target_file = TARGET_DIR / f"{slug}.mdx"
                target_file.write_text(mdx_content, encoding='utf-8')
                print(f"  ✓ 生成: {target_file.name}")

        except Exception as e:
            print(f"  ✗ 错误: {e}")
            import traceback
            traceback.print_exc()

        finally:
            # 清理临时目录
            shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == "__main__":
    process_all_zips()
    print("\n✅ 处理完成!")
