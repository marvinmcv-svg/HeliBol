import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "carousel-drag",
  name: "Drag Carousel",
  description: "Flick-able carousel with velocity-projected snapping, scaled neighbours, morphing pagination dots and button/keyboard controls.",
  category: "media",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["carousel", "slider", "drag", "gallery", "inertia"],
  pageTypes: ["ecommerce", "portfolio", "landing"],
  inspiration: ["App Store screenshots", "Embla carousel"],
  a11y: "WAI-ARIA carousel roles, labelled slides, prev/next buttons, ←/→ keys, clickable dots with aria-current.",
  perf: "Single x motion value; ResizeObserver for widths.",
  status: "stable",
  priority: "P1",
  previewHeight: 400,
  props: [
    { name: "items", type: "ReactNode[]", description: "Slides." },
    { name: "slideWidth", type: "number", default: "0.78", description: "Slide width as fraction of viewport." },
    { name: "gap", type: "number", default: "16", description: "px between slides." },
  ],
};
