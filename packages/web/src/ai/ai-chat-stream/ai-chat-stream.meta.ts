import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-chat-stream",
  name: "Streaming Chat",
  description: "Chat thread where messages spring in and assistant replies stream word-by-word after a typing indicator.",
  category: "ai",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["ai","chat","streaming","messages","typing"],
  pageTypes: ["ai-app","social"],
  inspiration: ["iMessage","Vercel AI SDK chat"],
  a11y: "role=log with aria-live polite; reduced motion shows replies whole.",
  perf: "Only the streaming bubble re-renders per token.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "script", type: "{ role, text }[]", description: "Messages to play (swap for your stream)." },
  ],
};
