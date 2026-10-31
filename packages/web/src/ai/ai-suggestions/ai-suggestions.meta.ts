import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-suggestions",
  name: "Prompt Suggestions",
  description: "Suggested-prompt chips cascade in with blur and lift on hover; picking one hands its text to your composer.",
  category: "ai",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["ai","suggestions","chips","empty state"],
  pageTypes: ["ai-app"],
  inspiration: ["Claude / Gemini starter prompts"],
  a11y: "Real buttons in a list.",
  perf: "One stagger on mount.",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "items", type: "{ icon?, label }[]", description: "Suggestions." },
    { name: "onPick", type: "(label) => void", description: "Pick handler." },
  ],
};
