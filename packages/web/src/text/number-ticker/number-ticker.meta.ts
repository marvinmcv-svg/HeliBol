import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "number-ticker",
  name: "Number Ticker",
  description: "Counts up to a value when it scrolls into view, with locale-aware formatting, decimals, prefix and suffix.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["stats", "kpi", "counter", "pricing"],
  pageTypes: ["landing", "pricing", "dashboard"],
  inspiration: ["Magic UI Number Ticker"],
  a11y: "Renders the final number for SSR/no-JS under reduced motion; tabular-nums prevents jitter. Reduced motion: jumps straight to the value.",
  perf: "Writes textContent directly from a motion value — zero React re-renders per frame.",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [
    { name: "value", type: "number", description: "Target value." },
    { name: "from", type: "number", default: "0", description: "Start value." },
    { name: "decimals", type: "number", default: "0", description: "Fraction digits." },
    { name: "prefix / suffix", type: "string", description: "Text around the number, e.g. $ and %." },
    { name: "locale", type: "string", description: "Intl locale; defaults to the user's." },
    { name: "duration", type: "number", default: "1.8", description: "Seconds." },
  ],
};
