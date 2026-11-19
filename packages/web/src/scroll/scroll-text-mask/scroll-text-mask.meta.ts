import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "scroll-text-mask",
  name: "Scroll Text Mask",
  description: "Giant knockout type as a window: the photo shows only through the letters, then scroll scales the type ~40× from inside a letter until the image fills the screen and the next content fades in.",
  category: "scroll",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","scroll","mask","typography","reveal","hero"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "The word is available as sr-only text; reduced motion shows the image with the content on top.",
  perf: "One SVG mask scaled with a transform; sheet fades as a fallback.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "text", type: "string", description: "Mask word." },
    { name: "image", type: "string", description: "Photo." },
    { name: "children", type: "ReactNode", description: "Content after the reveal." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroller." },
  ],
};
