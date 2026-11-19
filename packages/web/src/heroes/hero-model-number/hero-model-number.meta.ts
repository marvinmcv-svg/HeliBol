import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-model-number",
  name: "Hero — Model Number",
  description: "Product-glamour hero: neon promo strip, a floating boxed header, and a moody machined e-bike close-up with a pulsing red lamp, a huge model number and a reserve line.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","product","glamour","dark","promo bar","bike"],
  pageTypes: ["ecommerce","landing"],
  inspiration: ["Mobbin — VanMoof hero (mobbin.com/sites/sections/33eaa6a1-4089-4d0c-9f7b-0c9cf0b30b62)"],
  a11y: "Real h1 (model number); promo copy is readable once (duplicates aria-hidden); reduced motion freezes lamp and strip.",
  perf: "One SVG scene, a drop-shadow pulse and a marquee.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
