import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "mockup-laptop",
  name: "Laptop Mockup",
  description: "CSS laptop — lid with notch, 16:10 screen, hinge and base — for hero shots of web apps.",
  category: "mockups",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["mockup","laptop","macbook","frame","css-only"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Cult UI Mac screen"],
  a11y: "Presentational frame.",
  perf: "Pure CSS frame; 0 KB JS.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "children", type: "ReactNode", description: "Screen content." },
  ],
};
