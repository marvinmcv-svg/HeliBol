import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-mask-expand",
  name: "Scroll Mask Expand",
  description: "A small rounded window between two words grows to full screen as you scroll, pushing the words apart and zooming the photo out — curtains-open reveal.",
  category: "scroll",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll","clip-path","mask","hero","reveal"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["GSAP Demo Hub — Image mask on scroll"],
  a11y: "Words are a decorative duplicate (aria-hidden); real heading lives in children. Reduced motion shows the full image.",
  perf: "clip-path + transforms in one scrubbed timeline.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "image", type: "string", description: "Image URL." },
    { name: "words", type: "[string, string]", default: "[\"Into\",\"the wild\"]", description: "Words either side of the window." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroller." },
    { name: "children", type: "ReactNode", description: "Caption shown at the end." },
  ],
};
