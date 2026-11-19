import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "scroll-zoom-parallax",
  name: "Zoom Parallax",
  description: "A collage of seven photos pinned in place; as you scroll every tile scales up around the centre at its own rate, so the outer images fly past the edges and the centre photo fills the screen.",
  category: "scroll",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","scroll","zoom","parallax","gallery","storytelling"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Images are decorative; reduced motion shows a static grid instead.",
  perf: "Seven transforms driven by one scroll progress.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "images", type: "string[]", description: "Seven images; the first is the centre." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroller." },
  ],
};
