import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-batch-reveal",
  name: "Batch Scroll Reveal",
  description: "Grid items that enter the viewport together animate together — ScrollTrigger.batch groups them so a fast scroll reveals whole rows instead of a long queue.",
  category: "scroll",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll","stagger","grid","reveal","ecommerce"],
  pageTypes: ["ecommerce","blog","landing"],
  inspiration: ["GSAP Demo Hub — Stagger items in on scroll"],
  a11y: "Content is in the DOM and visible to assistive tech; reduced motion shows everything immediately.",
  perf: "One batched ScrollTrigger set; transforms + opacity.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "children", type: "ReactNode", description: "Mark items with data-batch." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroller." },
    { name: "batchMax", type: "number", default: "6", description: "Max items per batch." },
  ],
};
