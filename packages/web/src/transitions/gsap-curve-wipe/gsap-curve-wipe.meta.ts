import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-curve-wipe",
  name: "Curved Wipe Transition",
  description: "Page transition with a liquid curved wipe: an SVG path bulges up to cover the screen, the content swaps, then it peels away with the opposite bend.",
  category: "transitions",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["page transition","wipe","svg","liquid","router"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["GSAP Demo Hub — Curve swipe"],
  a11y: "Overlay is aria-hidden; nav buttons expose aria-current. Reduced motion swaps content instantly.",
  perf: "attr:{d} tweens on one path; no plugin required.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "screens", type: "{ label, node }[]", description: "Screens." },
    { name: "color", type: "string", default: "var(--foreground)", description: "Wipe colour." },
  ],
};
