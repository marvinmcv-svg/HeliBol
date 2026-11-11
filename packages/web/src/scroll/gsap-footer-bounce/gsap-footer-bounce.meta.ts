import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-footer-bounce",
  name: "Bouncy Footer",
  description: "The footer's top edge is an SVG curve pulled down by your scroll speed as you land, then it springs back like a trampoline.",
  category: "scroll",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["footer","scroll","elastic","svg","fun"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["GSAP Demo Hub — Footer bounce"],
  a11y: "Curve is decorative (aria-hidden); footer content unaffected. Disabled under reduced motion.",
  perf: "Tweens one control-point value and rewrites a tiny path; one ScrollTrigger.",
  status: "stable",
  priority: "P2",
  previewHeight: 440,
  props: [
    { name: "children", type: "ReactNode", description: "Footer content." },
    { name: "color", type: "string", default: "var(--foreground)", description: "Footer colour." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroller." },
  ],
};
