import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-stagger-grid",
  name: "Ripple Stagger Grid",
  description: "Click any dot and a shock-wave ripples outward from it — GSAP grid stagger from an index — each dot lifting, swelling and recolouring by distance.",
  category: "layout",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["stagger","grid","ripple","playful","loading"],
  pageTypes: ["landing"],
  inspiration: ["GSAP Demo Hub — Staggering"],
  a11y: "Each cell is a labelled button (keyboard-triggerable). Reduced motion: a quick opacity flash.",
  perf: "One timeline with two staggered tweens; transforms + colour.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "rows", type: "number", default: "9", description: "Rows." },
    { name: "cols", type: "number", default: "15", description: "Columns." },
    { name: "autoplayFrom", type: "number | \"center\" | \"random\"", default: "\"center\"", description: "Wave on mount." },
  ],
};
