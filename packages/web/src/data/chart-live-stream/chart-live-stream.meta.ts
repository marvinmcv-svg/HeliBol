import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "chart-live-stream",
  name: "Chart — Live Stream",
  description: "Streaming line chart that scrolls smoothly between ticks: new points arrive every interval while the path translates continuously, the y-range eases to fit, and a pulsing head dot shows the latest value.",
  category: "data",
  platforms: ["web"],
  engine: "svg",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","chart","realtime","streaming","line","sparkline","monitoring"],
  pageTypes: ["dashboard"],
  inspiration: ["kinetik Premium collection"],
  a11y: "role=img with an aria-label holding the latest value; pause button; reduced motion updates per tick without the scroll.",
  perf: "One SVG path rebuilt per tick; between ticks only a transform changes via rAF.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "next", type: "(prev: number) => number", default: "random walk", description: "Generates the next value." },
    { name: "points", type: "number", default: "40", description: "Window size." },
    { name: "interval", type: "number", default: "700", description: "ms between points." },
    { name: "label", type: "string", default: "Requests / s", description: "Readout label." },
    { name: "unit", type: "string", description: "Value unit." },
    { name: "color", type: "string", default: "#38bdf8", description: "Line colour." },
  ],
};
