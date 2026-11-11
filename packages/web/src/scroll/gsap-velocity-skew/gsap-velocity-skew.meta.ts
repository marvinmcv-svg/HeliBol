import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-velocity-skew",
  name: "Velocity Skew",
  description: "Images lean with your scroll speed — ScrollTrigger velocity drives a clamped skewY that eases back to straight when you stop.",
  category: "scroll",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll","velocity","skew","gallery","editorial"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["GSAP Demo Hub — Velocity Skew"],
  a11y: "Skew is decorative; disabled under reduced motion.",
  perf: "One ScrollTrigger + one quickSetter for all items; only a bigger velocity starts a new tween.",
  status: "stable",
  priority: "P2",
  previewHeight: 460,
  props: [
    { name: "children", type: "ReactNode", description: "Content; mark skewing items with data-skew." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroll container." },
    { name: "max", type: "number", default: "14", description: "Max skew (deg)." },
  ],
};
