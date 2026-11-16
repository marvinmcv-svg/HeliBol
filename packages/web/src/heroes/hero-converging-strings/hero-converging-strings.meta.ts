import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-converging-strings",
  name: "Hero — Converging Strings",
  description: "Branding-agency hero: dozens of hand-strung lines fan down from the top edge and converge behind the team area, swaying like tensioned string.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","branding","lines","strings","grayscale","agency"],
  pageTypes: ["portfolio"],
  inspiration: ["Mobbin — Büro hero (mobbin.com/sites/sections/42aaad97-8c45-41d3-be1e-c4b9b9654332)"],
  a11y: "Real h1 paragraph; SVG and silhouettes aria-hidden; reduced motion shows drawn, still strings.",
  perf: "~22 SVG quadratic paths drawn once; two group skew loops.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
