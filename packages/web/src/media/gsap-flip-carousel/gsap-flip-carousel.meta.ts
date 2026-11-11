import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-flip-carousel",
  name: "Flip Carousel",
  description: "A carousel where DOM order is the truth: next/prev rotates the array and GSAP Flip animates every card from its old box to its new one — the centre slot is bigger, so cards grow as they pass through.",
  category: "media",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["gsap","flip","carousel","gallery","layout"],
  pageTypes: ["portfolio","ecommerce","media"],
  inspiration: ["GSAP Demo Hub — Flip carousel"],
  a11y: "Arrow keys on the focused region, labelled buttons, aria-live title; non-centre cards aria-hidden. Reduced motion: instant re-order.",
  perf: "Flip.getState before the React update, Flip.from in a layout effect after — no manual measuring.",
  status: "stable",
  priority: "P1",
  previewHeight: 400,
  props: [
    { name: "items", type: "{ image, title }[]", description: "Cards." },
  ],
};
