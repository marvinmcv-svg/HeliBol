import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "transition-ink-blot",
  name: "Transition — Ink Blot",
  description: "Page transition where ink spills from the exact point you clicked: a turbulence-displaced SVG circle grows into a wobbly blot that floods the screen, the page swaps, then the blot drains to the opposite corner.",
  category: "transitions",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","transition","ink","blot","page","svg-filter","organic"],
  pageTypes: ["portfolio","landing","media"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Overlay is aria-hidden; nav uses aria-current. Reduced motion swaps instantly.",
  perf: "One SVG circle with feTurbulence + feDisplacementMap; only r and cx/cy change.",
  status: "stable",
  priority: "P1",
  previewHeight: 480,
  props: [
    { name: "pages", type: "{ title; content }[]", description: "Pages." },
    { name: "ink", type: "string", default: "#0a0a0a", description: "Ink colour." },
  ],
};
