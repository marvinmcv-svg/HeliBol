import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-shimmer",
  name: "Shimmer Text",
  description: "A light band sweeps across text — the universal 'AI is working' / loading label. Inherits your text color.",
  category: "text",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  tags: ["loading", "ai", "status", "css-only"],
  pageTypes: ["dashboard", "landing"],
  inspiration: ["Motion Primitives Text Shimmer", "ChatGPT / Claude thinking states"],
  a11y: "Plain text; pair with aria-live / role=status when used as loading feedback. Reduced motion: static text.",
  perf: "0 KB JS, single background-position animation.",
  status: "stable",
  priority: "P1",
  previewHeight: 240,
  props: [
    { name: "duration", type: "number", default: "2", description: "Seconds per sweep." },
    { name: "spread", type: "number", default: "40", description: "Highlight band half-width in px." },
  ],
};
