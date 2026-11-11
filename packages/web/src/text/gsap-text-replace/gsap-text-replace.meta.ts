import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-text-replace",
  name: "Text Replace",
  description: "Animated text replacement with GSAP's TextPlugin: each phrase is rewritten into the next, by character or by word, with a highlight sweeping behind it.",
  category: "text",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["gsap","text plugin","headline","typewriter","rotate"],
  pageTypes: ["landing"],
  inspiration: ["GSAP Demo Hub — Animate text replacement"],
  a11y: "The text node is aria-live=polite; reduced motion swaps phrases with a fade.",
  perf: "One repeating timeline; TextPlugin edits a single text node.",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "phrases", type: "string[]", description: "Phrases to cycle." },
    { name: "mode", type: "'char' | 'word'", default: "'char'", description: "Replace granularity." },
    { name: "hold", type: "number", default: "1.6", description: "Seconds per phrase." },
  ],
};
