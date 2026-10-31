import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-loop-lines",
  name: "Line Loop",
  description: "Cycles whole lines or nodes vertically through a masked slot — status messages, rotating taglines, mini tickers.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["status","rotating","ticker","loop"],
  pageTypes: ["dashboard","landing","ai-app"],
  inspiration: ["Motion Primitives Text Loop"],
  a11y: "aria-live=polite so updates are announced; reduced motion crossfades.",
  perf: "One item mounted at a time plus the exiting one.",
  status: "stable",
  priority: "P2",
  previewHeight: 260,
  props: [
    { name: "items", type: "ReactNode[]", description: "Lines to cycle." },
    { name: "interval", type: "number", default: "2400", description: "ms per line." },
    { name: "direction", type: "\"up\" | \"down\"", default: "\"up\"", description: "Travel direction." },
  ],
};
