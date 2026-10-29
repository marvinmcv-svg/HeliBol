import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "horizontal-scroll-section",
  name: "Horizontal Scroll Section",
  description: "Vertical scrolling slides a pinned track sideways — the classic portfolio / case-study gallery.",
  category: "scroll",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap", "@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["horizontal", "pin", "gallery", "portfolio", "scrolltrigger"],
  pageTypes: ["portfolio", "landing"],
  inspiration: ["GSAP horizontal scroll demos", "Awwwards case studies"],
  a11y: "Reduced motion swaps to a native horizontally scrollable, snap-aligned row that works with keyboard and trackpads.",
  perf: "Native sticky pinning + one scrubbed transform. invalidateOnRefresh recomputes on resize.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "length", type: "number", default: "3", description: "Section height as multiples of the viewport (how long the pin lasts)." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroller; defaults to window." },
    { name: "trackClassName", type: "string", description: "Classes for the moving flex track." },
  ],
};
