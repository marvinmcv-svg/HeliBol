import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-wave",
  name: "Wave Letters",
  description: "Letters ripple upward one after another like a stadium wave — on hover/focus or continuously.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hover","nav","playful","letters"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["Animata jumping text"],
  a11y: "aria-label with the full word; hover variant also triggers on keyboard focus. Reduced motion: still.",
  perf: "Per-letter transform keyframes; remount-by-key to replay.",
  status: "stable",
  priority: "P2",
  previewHeight: 260,
  props: [
    { name: "children", type: "string", description: "Text." },
    { name: "trigger", type: "\"hover\" | \"loop\"", default: "\"hover\"", description: "When to wave." },
    { name: "height", type: "number", default: "10", description: "Jump height (px)." },
  ],
};
