import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-stock",
  name: "Live Stock Ticker",
  description: "Ticker card with a streaming sparkline, a price that flashes green/red on each change, and a delta badge.",
  category: "widgets",
  platforms: ["web"],
  engine: "js",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["stocks","finance","sparkline","live"],
  pageTypes: ["dashboard"],
  inspiration: ["Robinhood","Apple Stocks"],
  a11y: "Chart has role=img with a label; color is paired with ▲/▼ glyphs.",
  perf: "40-point series updated ~1×/s; polyline re-render.",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "symbol / name", type: "string", description: "Instrument." },
    { name: "start", type: "number", default: "182.4", description: "Starting price." },
  ],
};
