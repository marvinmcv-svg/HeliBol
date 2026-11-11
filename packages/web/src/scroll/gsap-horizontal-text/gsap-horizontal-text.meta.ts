import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-horizontal-text",
  name: "Horizontal Text Scroll",
  description: "One giant line of type slides sideways as you scroll down, while each letter drops in, rotates and recolours as it crosses the screen (containerAnimation).",
  category: "scroll",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll","typography","horizontal","splittext","editorial"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["GSAP Demo Hub — Horizontal Text"],
  a11y: "Text stays a real heading; reduced motion renders it statically.",
  perf: "One x tween + per-char ScrollTriggers using containerAnimation; transforms only.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "text", type: "string", description: "The line." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroller." },
    { name: "length", type: "number", default: "4", description: "Scroll length (viewport heights)." },
  ],
};
