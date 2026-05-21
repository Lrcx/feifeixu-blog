export type ResourceLevel = "入门" | "进阶" | "深入";

export interface AgentResource {
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  level: ResourceLevel;
  featured: boolean;
  addedAt: string;
}

export const agentResources: AgentResource[] = [
  {
    title: "1rgs/nanocode",
    url: "https://github.com/1rgs/nanocode",
    description: "极简 Claude Code 替代实现，单个 Python 文件、零依赖、约 250 行，适合快速理解 coding agent 的工具调用和循环结构。",
    category: "Agent 教程",
    tags: ["tutorial", "agent", "coding-agent", "python", "claude-code"],
    level: "入门",
    featured: true,
    addedAt: "2026-05-21",
  },
  {
    title: "HKUDS/nanobot",
    url: "https://github.com/HKUDS/nanobot",
    description: "轻量开源 Agent 项目，核心循环较小且可读，支持聊天渠道、Memory、MCP 和实际部署路径，适合学习 OpenClaw / Claude Code / Codex 这类个人 Agent 的工程结构。",
    category: "Agent 框架",
    tags: ["agent", "open-source", "mcp", "memory", "openclaw"],
    level: "入门",
    featured: true,
    addedAt: "2026-05-21",
  },
  {
    title: "datawhalechina/hello-agents",
    url: "https://github.com/datawhalechina/hello-agents",
    description: "Datawhale 开源的 Agent 教程，从核心原理、经典范式到多智能体应用实践，适合从大模型使用者过渡到智能体系统构建者。",
    category: "Agent 教程",
    tags: ["tutorial", "agent", "multi-agent", "open-source"],
    level: "入门",
    featured: true,
    addedAt: "2026-05-21",
  },
  {
    title: "microsoft/ai-agents-for-beginners",
    url: "https://github.com/microsoft/ai-agents-for-beginners",
    description: "微软开源的 AI Agent 入门课程，覆盖 Agent 基础、工具使用、Agentic RAG、多智能体、生产化、协议和记忆等主题，配套视频与 Python 示例。",
    category: "Agent 教程",
    tags: ["tutorial", "agent", "microsoft", "course", "agentic-rag"],
    level: "入门",
    featured: true,
    addedAt: "2026-05-21",
  },
  {
    title: "mem0ai/mem0",
    url: "https://github.com/mem0ai/mem0",
    description: "长期记忆系统的工程化入口，适合学习用户记忆、向量检索、图记忆和记忆更新策略。",
    category: "Memory",
    tags: ["memory", "retrieval", "agent", "open-source"],
    level: "进阶",
    featured: true,
    addedAt: "2026-05-21",
  },
  {
    title: "vibrantlabsai/ragas",
    url: "https://github.com/vibrantlabsai/ragas",
    description: "RAG 评测框架，适合建立回答质量、检索质量和端到端评估的基本方法。",
    category: "评测",
    tags: ["evaluation", "rag", "benchmark", "metrics"],
    level: "进阶",
    featured: false,
    addedAt: "2026-05-21",
  },
];

export function getAllResources(): AgentResource[] {
  return [...agentResources].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}
