import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "zoom-through",
  name: "Zoom Through Text",
  description: "Scrolling zooms through a giant word until its letterform fills the screen, revealing the image behind it.",
  category: "scroll",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll","zoom","mask","hero","cinematic"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Awwwards zoom-through intros"],
  a11y: "The word is real text; reduced motion shows the image without the zoom.",
  perf: "Single scale transform on a blended layer.",
  status: "stable",
  priority: "P2",
  previewHeight: 440,
  props: [
    { name: "word", type: "string", description: "Word to fly through." },
    { name: "image", type: "string", description: "Revealed image." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroller." },
  ],
};
