import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-terminal",
  name: "Animated Terminal",
  description: "Terminal that types its commands character by character and reveals output lines with a beat in between.",
  category: "widgets",
  platforms: ["web"],
  engine: "js",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["terminal","cli","install","dev tools","typing"],
  pageTypes: ["landing","docs"],
  inspiration: ["Magic UI Terminal"],
  a11y: "role=log; reduced motion shows all lines immediately.",
  perf: "Single timeout chain.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "lines", type: "({ cmd } | { out, tone? })[]", description: "Script." },
    { name: "title", type: "string", description: "Window title." },
  ],
};
