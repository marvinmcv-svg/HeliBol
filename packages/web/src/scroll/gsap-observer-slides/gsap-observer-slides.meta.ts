import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-observer-slides",
  name: "Observer Fullscreen Slides",
  description: "Full-screen slides that move one step per wheel flick, swipe or arrow key (GSAP Observer), with a sliding mask, counter-zooming image and rolling title letters. Loops forever.",
  category: "scroll",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["slides","observer","fullscreen","carousel","storytelling"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["GSAP Demo Hub — Infinite looped panels / Observe events"],
  a11y: "Focusable region with aria-roledescription carousel; arrow keys work; inactive slides aria-hidden. Reduced motion swaps instantly.",
  perf: "One timeline per transition; input locked while animating.",
  status: "stable",
  priority: "P1",
  previewHeight: 480,
  props: [
    { name: "slides", type: "{ title, image, kicker? }[]", description: "Slides." },
  ],
};
