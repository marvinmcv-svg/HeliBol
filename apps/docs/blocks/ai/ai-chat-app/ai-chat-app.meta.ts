import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "ai-chat-app", name: "AI Chat App", category: "ai", platforms: ["web"], engine: "motion",
  description: "Full AI assistant screen: empty state with suggestion chips → reasoning trace → streaming reply, with a prompt composer pinned below.",
  dependencies: ["motion", "lucide-react"], registryDependencies: ["kinetik-core", "ai-prompt-box", "ai-suggestions", "ai-thinking", "ai-chat-stream"], tags: ["ai", "chat", "assistant", "app shell"],
  pageTypes: ["ai-app"], a11y: "Log region for messages, labelled composer, disclosure for reasoning.", perf: "Only the active message streams.",
  status: "stable", priority: "P1", previewHeight: 620,
};
