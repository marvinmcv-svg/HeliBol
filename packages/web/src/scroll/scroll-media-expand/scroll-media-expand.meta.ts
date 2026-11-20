import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "scroll-media-expand",
  name: "Scroll — Media Expand",
  description: "Keynote-style reveal: a small rounded image sits between the two halves of a headline; scrolling grows it to full-bleed, squares its corners and settles its zoom while the headline halves slide apart, then the caption rises in.",
  category: "scroll",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","scroll","expand","keynote","video","hero","pinned"],
  pageTypes: ["landing","media"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Headline stays real text; reduced motion shows the full-bleed image with the headline.",
  perf: "Width/height/radius from scroll progress; image scale on the GPU.",
  status: "stable",
  priority: "P1",
  previewHeight: 480,
  props: [
    { name: "image", type: "string", description: "Media source." },
    { name: "title", type: "[string, string]", description: "Headline halves." },
    { name: "children", type: "ReactNode", description: "Caption revealed at the end." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroll container." },
  ],
};
