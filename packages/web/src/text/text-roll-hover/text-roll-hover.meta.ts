import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-roll-hover",
  name: "Letter Roll Hover",
  description: "Every letter rolls up to reveal a duplicate of itself, staggered from start, center or end — the agency nav link hover.",
  category: "text",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hover","nav","links","css-only","agency"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["Fancy Components letter swap","Awwwards nav links"],
  a11y: "aria-label keeps the word; works on :focus-visible and when the parent link/button is hovered.",
  perf: "CSS translate transitions only.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "children", type: "string", description: "Text." },
    { name: "from", type: "\"start\" | \"center\" | \"end\"", default: "\"start\"", description: "Stagger origin." },
    { name: "stagger", type: "number", default: "0.025", description: "Seconds between letters." },
  ],
};
