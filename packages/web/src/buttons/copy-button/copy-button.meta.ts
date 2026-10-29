import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "copy-button",
  name: "Copy Button",
  description: "Clipboard icon pops into a self-drawing checkmark, then returns. Tiny, but it's on every docs site.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["clipboard", "docs", "icon morph", "feedback"],
  pageTypes: ["docs", "dashboard"],
  inspiration: ["Vercel docs", "shadcn copy button"],
  a11y: "aria-label switches to Copied and an sr-only role=status announces it.",
  perf: "Two tiny SVGs swapped with AnimatePresence.",
  status: "stable",
  priority: "P1",
  previewHeight: 200,
  props: [
    { name: "value", type: "string", description: "Text to copy." },
    { name: "timeout", type: "number", default: "1600", description: "ms before resetting." },
  ],
};
