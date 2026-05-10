# 肥肥旭 Blog

面向 AI/LLM 工程师个人品牌的静态博客。项目使用 Next.js App Router、MDX 内容文件和 Cloudflare Pages 部署。

## 本地开发

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

## 内容管理

博客文章：

```txt
content/blog/*.mdx
```

AI 日报：

```txt
content/daily/*.mdx
```

新增文章后提交到 GitHub，Cloudflare Pages 会自动构建发布。

## 静态构建

```bash
npm run build
```

构建产物输出到：

```txt
out/
```

## Cloudflare Pages

- Framework preset: `Next.js`
- Build command: `npm run build`
- Build output directory: `out`
- Node.js version: `22`
