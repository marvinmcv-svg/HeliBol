import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-scroll-highlight",
  name: "Scroll Highlight Text",
  description: "Words light up one by one, scrubbed to scroll position — the 'read along' manifesto paragraph.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll", "manifesto", "scrub", "storytelling"],
  pageTypes: ["landing", "portfolio"],
  inspiration: ["Apple / Linear manifesto sections"],
  a11y: "Full sentence in aria-label; words aria-hidden. Reduced motion: plain paragraph at full opacity.",
  perf: "One scroll listener (Motion), opacity-only per word.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "children", type: "string", description: "Paragraph text." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroll container; defaults to window." },
    { name: "dim", type: "number", default: "0.15", description: "Opacity of unread words." },
  ],
};
