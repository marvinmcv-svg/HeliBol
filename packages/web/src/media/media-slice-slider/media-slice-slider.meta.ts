import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "media-slice-slider",
  name: "Slice Transition Slider",
  description: "Editorial slider whose transition cuts the incoming photo into vertical slices that drop in with a staggered, alternating direction; the caption and title rise line by line.",
  category: "media",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","slider","carousel","slices","editorial","hero"],
  pageTypes: ["landing","portfolio","media"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Carousel region with arrow keys, labelled buttons, aria-live title, autoplay paused on hover/focus and disabled under reduced motion (crossfade).",
  perf: "N slices each with one transform; previous image stays underneath.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "slides", type: "{ image, title, caption? }[]", description: "Slides." },
    { name: "slices", type: "number", default: "6", description: "Slice count." },
    { name: "autoplay", type: "number", default: "4500", description: "ms; 0 = off." },
  ],
};
