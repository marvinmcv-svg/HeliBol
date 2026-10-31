import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "mockup-browser",
  name: "Browser Mockup",
  description: "Safari-style window chrome — traffic lights and a centered URL bar with lock — around any content.",
  category: "mockups",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["mockup","browser","safari","frame","css-only"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Magic UI Safari"],
  a11y: "Presentational chrome; content keeps its own semantics.",
  perf: "Plain markup; 0 KB JS.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "url", type: "string", default: "\"kinetik.dev\"", description: "Shown in the address bar." },
  ],
};
