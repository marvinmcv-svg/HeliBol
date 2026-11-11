import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-card-stack",
  name: "Cycling Card Stack",
  description: "A fanned deck: drag the top card away (or press Next/Space) and it arcs off then tucks in behind the pile while the rest step forward. Loops forever.",
  category: "media",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["cards","stack","deck","draggable","gallery"],
  pageTypes: ["landing","social","ecommerce"],
  inspiration: ["GSAP Demo Hub — Card stack"],
  a11y: "Focusable with Space/→ to advance and a visible Next button; only the top card is exposed to assistive tech.",
  perf: "Positions recomputed from an order array; transforms only.",
  status: "stable",
  priority: "P2",
  previewHeight: 460,
  props: [
    { name: "cards", type: "ReactNode[]", description: "Cards." },
  ],
};
