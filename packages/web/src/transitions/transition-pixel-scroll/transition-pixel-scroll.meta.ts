import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "transition-pixel-scroll",
  name: "Pixel Scroll Transition",
  description: "A scroll-scrubbed pixel dissolve between two sections: squares fill in random order to cover the first, then clear in a new order to reveal the second.",
  category: "transitions",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["pixel","scroll","transition","dissolve","storytelling"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["unlumen UI — Pixel Scroll Transition"],
  a11y: "Pixel grid is aria-hidden; both sections stay in the DOM. Reduced motion: a simple crossfade at the midpoint.",
  perf: "Opacity toggles on a few hundred cells, only in a rAF-throttled scroll handler.",
  status: "stable",
  priority: "P2",
  previewHeight: 420,
  props: [
    { name: "from", type: "ReactNode", description: "First section." },
    { name: "to", type: "ReactNode", description: "Second section." },
    { name: "columns", type: "number", default: "16", description: "Grid columns." },
    { name: "color", type: "string", default: "'#18181b'", description: "Pixel colour." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroll container." },
  ],
};
