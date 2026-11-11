import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-infinite-slider",
  name: "Infinite Drag Slider",
  description: "Seamless infinite slider — drag or flick it with momentum, snap to cards, use arrows or keys; cards scale and fade by their distance from centre. No cloned slides.",
  category: "media",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["slider","carousel","draggable","inertia","infinite"],
  pageTypes: ["landing","ecommerce","portfolio"],
  inspiration: ["GSAP Demo Hub — Infinite card slider / Swipe slider"],
  a11y: "Focusable carousel region with arrow-key support, labelled prev/next buttons and an index readout; off-centre cards aria-hidden. Reduced motion disables inertia and autoplay.",
  perf: "Every card's x = gsap.utils.wrap of one shared offset; Draggable on an invisible proxy.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "slides", type: "ReactNode[]", description: "Slides." },
    { name: "itemWidth", type: "number", default: "240", description: "Card width (px)." },
    { name: "gap", type: "number", default: "20", description: "Gap (px)." },
    { name: "autoplay", type: "number", default: "0", description: "Seconds between auto-advances." },
  ],
};
