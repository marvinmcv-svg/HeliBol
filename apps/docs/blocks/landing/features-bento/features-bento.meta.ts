import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "features-bento",
  name: "Features — Animated Bento",
  description: "Feature section with a bento grid whose tiles each carry a live micro-animation: beams, tickers, shimmer.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core", "bento-grid", "animated-beam", "number-ticker", "text-shimmer", "scroll-reveal"],
  tags: ["features", "bento", "landing", "section"],
  pageTypes: ["landing"],
  a11y: "Tiles focusable; all decorative motion aria-hidden or reduced-motion aware.",
  perf: "Tile animations only start in view.",
  status: "stable",
  priority: "P1",
  previewHeight: 640,
};
