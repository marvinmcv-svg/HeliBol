import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-lines-scroll",
  name: "Line Reveal on Scroll",
  description: "Paragraph lines rise out of their masks and un-blur one after another, scrubbed by scroll. Lines re-split automatically on resize so they always match the layout.",
  category: "scroll",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll","splittext","lines","manifesto","editorial"],
  pageTypes: ["landing","blog","portfolio"],
  inspiration: ["GSAP Demo Hub — Responsive line splits on scroll / Text masking"],
  a11y: "SplitText keeps an aria-label with the full text; reduced motion renders plain text.",
  perf: "autoSplit reverts/re-splits on resize and font load; transform + opacity + small blur.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "children", type: "string", description: "Text." },
    { name: "as", type: "ElementType", default: "\"p\"", description: "Element." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroller." },
  ],
};
