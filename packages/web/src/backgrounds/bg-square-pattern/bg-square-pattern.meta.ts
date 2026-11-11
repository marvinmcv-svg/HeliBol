import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-square-pattern",
  name: "Square Pattern",
  description: "A grid of small squares lit by a travelling wave — diagonal sweep, radial pulse or digital rain — with a soft glow under the cursor.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["grid","squares","canvas","pattern","tech"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["unlumen UI — Square Pattern"],
  a11y: "Decorative canvas. Reduced motion: one static frame.",
  perf: "fillRect per cell (~2–3k cells), paused off-screen.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "cell", type: "number", default: "18", description: "Cell size." },
    { name: "gap", type: "number", default: "3", description: "Gap between squares." },
    { name: "color", type: "string", default: "'167,139,250'", description: "RGB triplet." },
    { name: "pattern", type: "'diagonal' | 'radial' | 'rain'", default: "'diagonal'", description: "Wave pattern." },
  ],
};
