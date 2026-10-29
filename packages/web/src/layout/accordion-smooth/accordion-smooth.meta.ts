import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "accordion-smooth",
  name: "Smooth Accordion",
  description: "Height-auto accordion with asymmetric easing (slow open, quick close) and a rotating plus icon.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["faq", "accordion", "disclosure", "height auto"],
  pageTypes: ["pricing", "landing", "docs", "settings"],
  inspiration: ["Linear FAQ", "Radix accordion"],
  a11y: "Disclosure pattern: button inside heading, aria-expanded/controls, region labelled by its header.",
  perf: "Animates height (unavoidable for content reflow) on one panel at a time; opacity is composited.",
  status: "stable",
  priority: "P1",
  previewHeight: 400,
  props: [
    { name: "items", type: "{ id, title, content }[]", description: "Sections." },
    { name: "multiple", type: "boolean", default: "false", description: "Allow multiple open panels." },
    { name: "defaultOpen", type: "string[]", default: "[]", description: "Initially open ids." },
  ],
};
