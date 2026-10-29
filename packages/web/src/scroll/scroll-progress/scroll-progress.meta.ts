import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "scroll-progress",
  name: "Scroll Progress",
  description: "Reading-progress bar or ring linked to scroll with CSS scroll timelines (zero JS on modern browsers) and a passive-listener fallback.",
  category: "scroll",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["progress", "reading", "blog", "scroll-driven"],
  pageTypes: ["blog", "docs"],
  inspiration: ["Medium reading bar", "MDN scroll-timeline examples"],
  a11y: "Decorative (role=presentation). Scroll-linked motion is user-driven so it's allowed under reduced motion.",
  perf: "animation-timeline: scroll(nearest) — compositor-only. Fallback uses one passive listener.",
  status: "stable",
  priority: "P1",
  previewHeight: 400,
  props: [
    { name: "variant", type: '"bar" | "circle"', default: '"bar"', description: "Horizontal bar or ring." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Scroll container for the JS fallback (CSS path uses the nearest scroller)." },
  ],
};
