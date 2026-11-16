import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-notebook-windows",
  name: "Hero — Notebook Windows",
  description: "Data-platform hero on dotted paper: italic serif meets heavy sans with a sparkle accent, then three product windows rise and overlap.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","data","notebook","windows","serif","dotted"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["Mobbin — Hex hero (mobbin.com/sites/sections/244a3027-1e39-4c49-af30-126271204c62)"],
  a11y: "Real h1 with serif + sans spans; windows aria-hidden; reduced motion shows windows in place.",
  perf: "Three window entrances and one tape marquee.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
