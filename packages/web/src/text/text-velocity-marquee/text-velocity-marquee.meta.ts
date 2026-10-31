import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-velocity-marquee",
  name: "Scroll Velocity Marquee",
  description: "Giant looping text lines that speed up, reverse direction and skew with your scroll velocity.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["marquee","scroll","velocity","skew","editorial"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Magic UI Scroll Based Velocity","Motion docs velocity example"],
  a11y: "aria-label holds the text once; repeated copies are aria-hidden. Reduced motion: static line.",
  perf: "useAnimationFrame + springs; transforms only.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "text", type: "string", description: "Text to repeat." },
    { name: "baseVelocity", type: "number", default: "4", description: "Base speed (% per second, negative reverses)." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroll container." },
  ],
};
