import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-image-sequence",
  name: "Scroll Image Sequence",
  description: "Apple-style product spin: a pinned canvas paints frame N of a sequence as you scroll. Works with real frame URLs or a procedural painter.",
  category: "scroll",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll","canvas","image sequence","product","apple"],
  pageTypes: ["landing","ecommerce"],
  inspiration: ["GSAP Demo Hub — Image sequence","Apple product pages"],
  a11y: "Canvas is aria-hidden; put the message in real text children. Reduced motion shows the last frame, unpinned.",
  perf: "Frames preloaded; tween a { frame } object with snap; repaint only when the frame number changes; DPR capped at 2.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "frames", type: "number", description: "Frame count." },
    { name: "frameUrl", type: "(i) => string", description: "URL of frame i." },
    { name: "draw", type: "(ctx, frame, w, h) => void", description: "Procedural painter instead of images." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroller." },
    { name: "length", type: "number", default: "3", description: "Scroll length (viewport heights)." },
  ],
};
