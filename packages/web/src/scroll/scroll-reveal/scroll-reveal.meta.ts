import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "scroll-reveal",
  name: "Scroll Reveal",
  description: "Six reveal variants (fade-up, scale, blur, slide-left/right, fade) scrubbed by native CSS scroll-driven animations, with an IntersectionObserver fallback.",
  category: "scroll",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll", "reveal", "in-view", "scroll-driven", "sections"],
  pageTypes: ["landing", "portfolio", "blog", "ecommerce"],
  inspiration: ["Chrome scroll-driven animation demos", "Magic UI Blur Fade"],
  a11y: "Content is in the DOM and readable without JS. Reduced motion: everything visible immediately.",
  perf: "animation-timeline: view() runs on the compositor — no scroll listeners, better INP/LCP than JS reveal libraries.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "variant", type: '"fade-up" | "fade" | "scale" | "blur" | "slide-left" | "slide-right"', default: '"fade-up"', description: "Entrance style." },
    { name: "index", type: "number", default: "0", description: "Stagger index for the fallback path (×80ms)." },
    { name: "as", type: "ElementType", default: '"div"', description: "Element to render." },
  ],
};
