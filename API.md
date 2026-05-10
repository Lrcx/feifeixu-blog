# 肥肥旭博客发布说明

本项目已切换为 **Cloudflare Pages + GitHub 仓库发布** 架构。

## 核心原则

- 线上站点是静态文件，不依赖 Node.js 常驻服务。
- 博客文章放在 `content/blog/`。
- AI 日报放在 `content/daily/`。
- 新增或修改文章后提交到 GitHub，Cloudflare Pages 会自动构建发布。

## 发布 AI 日报

### 写入单条日报

```bash
python3 scripts/daily_publish.py --push '{
  "title": "OpenAI 发布新模型",
  "date": "2026-05-10",
  "source": "AI News",
  "category": "AI日报",
  "tags": ["OpenAI", "模型"],
  "content": "日报正文内容..."
}'
```

### 批量写入日报

```bash
python3 scripts/daily_publish.py --batch daily_items.json
```

### 自动提交并推送

```bash
python3 scripts/daily_publish.py --batch daily_items.json --commit --push-git
```

推送到 GitHub 后，Cloudflare Pages 会自动重新部署。

## Cloudflare Pages 配置

- Framework preset: `Next.js`
- Build command: `npm run build`
- Build output directory: `out`
- Node.js version: `22`

## 注意

静态导出不支持运行时写文件 API。原来的 `/api/ai-daily-report` 已移除，日报服务应改为在仓库中生成 MDX 文件并推送 GitHub。
