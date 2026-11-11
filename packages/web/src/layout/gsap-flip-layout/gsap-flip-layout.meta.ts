import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-flip-layout",
  name: "Flip Layout Switch",
  description: "Grid ↔ list ↔ featured toggle: React re-renders with new classes and Flip animates every card and its nested image from the old box to the new one.",
  category: "layout",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["flip","layout","grid","list","view switcher"],
  pageTypes: ["dashboard","ecommerce"],
  inspiration: ["GSAP Demo Hub — Animate CSS grid positions"],
  a11y: "Segmented control is a radiogroup with aria-checked; reduced motion swaps instantly.",
  perf: "Flip state captured right before setState, played in useGSAP after commit; nested: true.",
  status: "stable",
  priority: "P2",
  previewHeight: 460,
  props: [
    { name: "items", type: "{ id, image, title, meta }[]", description: "Items." },
  ],
};
