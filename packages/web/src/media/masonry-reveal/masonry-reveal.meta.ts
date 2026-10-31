import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "masonry-reveal",
  name: "Masonry Reveal",
  description: "Pinterest-style masonry whose tiles rise and unblur in a staggered wave as they scroll into view.",
  category: "media",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["masonry","gallery","pinterest","scroll reveal"],
  pageTypes: ["portfolio","social","blog"],
  inspiration: ["Pinterest","Dribbble shots"],
  a11y: "Real images with alt; reduced motion shows them immediately.",
  perf: "CSS columns layout; whileInView once per tile.",
  status: "stable",
  priority: "P2",
  previewHeight: 420,
  props: [
    { name: "items", type: "{ src, alt, ratio }[]", description: "Images with aspect ratios." },
    { name: "columns", type: "number", default: "3", description: "Columns." },
  ],
};
