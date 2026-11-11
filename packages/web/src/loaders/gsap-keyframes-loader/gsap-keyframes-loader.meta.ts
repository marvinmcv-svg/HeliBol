import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-keyframes-loader",
  name: "Keyframes Loader",
  description: "A loader choreographed entirely with GSAP percentage keyframes: four blocks hop, squash on landing, travel around a square and spin, staggered in time.",
  category: "loaders",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["gsap","keyframes","loader","playful","spinner"],
  pageTypes: ["dashboard","onboarding"],
  inspiration: ["GSAP Demo Hub — Keyframes"],
  a11y: "role=status with a label and sr-only text. Reduced motion: gentle opacity pulse.",
  perf: "One tween with keyframes + stagger; transforms only.",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "label", type: "string", default: "'Loading'", description: "Accessible label." },
    { name: "colors", type: "string[]", default: "4 colours", description: "Block colours." },
    { name: "size", type: "number", default: "18", description: "Block size." },
  ],
};
