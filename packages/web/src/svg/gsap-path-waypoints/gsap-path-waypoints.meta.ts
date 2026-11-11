import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-path-waypoints",
  name: "Motion Path Waypoints",
  description: "Delivery-tracker route: a marker drives along a winding path to any waypoint (from wherever it is), facing the road, while the travelled route draws itself.",
  category: "svg",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["motion path","tracking","svg","timeline","delivery"],
  pageTypes: ["ecommerce","dashboard"],
  inspiration: ["GSAP Demo Hub — MotionPath waypoints / Animate along a path"],
  a11y: "SVG labelled with the current stop; stops are buttons with aria-pressed and a text detail line. Reduced motion jumps.",
  perf: "motionPath start/end on one marker + one drawSVG tween.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "waypoints", type: "{ label, at (0..1), detail? }[]", description: "Stops." },
    { name: "d", type: "string", default: "route", description: "Path in 600×300 viewBox." },
  ],
};
