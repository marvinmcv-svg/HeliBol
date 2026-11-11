import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-throw-board",
  name: "Throwable Sticker Board",
  description: "A desk of polaroids and stickers you can pick up and throw — Draggable with InertiaPlugin keeps momentum, bounds keep them on the board, the held item lifts and tilts.",
  category: "cards",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["draggable","inertia","stickers","playful","moodboard"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["GSAP Demo Hub — Make elements draggable / Inertia"],
  a11y: "Decorative play surface; don't put essential content only here. Reduced motion keeps drag without inertia or entrance.",
  perf: "Draggable uses transforms; inertia computed once per throw.",
  status: "stable",
  priority: "P2",
  previewHeight: 440,
  props: [
    { name: "items", type: "{ node, x, y, rotate? }[]", description: "Stickers with % positions." },
  ],
};
