import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-like-counter",
  name: "Button — Like Counter",
  description: "Like button with the full ceremony: the heart squashes then bursts — a ring expands and confetti dots fly out — and the counter rolls digit by digit, only the digits that change, up for a like and down for an unlike.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","button","like","heart","counter","social","confetti"],
  pageTypes: ["social","media"],
  inspiration: ["kinetik Premium collection"],
  a11y: "aria-pressed with the count in the label. Reduced motion skips burst and roll.",
  perf: "Short-lived transform animations; digits are separate spans keyed by value.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "count", type: "number", description: "Base count." },
    { name: "defaultLiked", type: "boolean", default: "false", description: "Start liked." },
    { name: "onChange", type: "(liked: boolean) => void", description: "Toggle handler." },
  ],
};
