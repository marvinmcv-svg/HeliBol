import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "smooth-scroll",
  name: "Smooth Scroll (Lenis)",
  description: "Lenis provider with GSAP ticker sync, anchor links, a useLenis() hook and an optional contained mode for scrolling a panel.",
  category: "foundations",
  platforms: ["web"],
  engine: "lenis",
  dependencies: ["lenis", "gsap"],
  registryDependencies: ["kinetik-core"],
  tags: ["smooth scroll", "lenis", "provider", "scrolltrigger"],
  pageTypes: ["landing", "portfolio"],
  inspiration: ["darkroom.engineering Lenis", "Locomotive Scroll v5"],
  a11y: "Keeps the native scrollbar and keyboard scrolling. Disabled entirely under reduced motion. Add data-lenis-prevent to nested scroll areas (modals, code blocks).",
  perf: "Single RAF via gsap.ticker shared with ScrollTrigger (no double loops).",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "lerp", type: "number", default: "0.09", description: "Interpolation factor; lower is smoother." },
    { name: "contained", type: "boolean", default: "false", description: "Smooth-scroll this element instead of the window." },
    { name: "syncTouch", type: "boolean", default: "false", description: "Also smooth touch input (usually leave off)." },
    { name: "useLenis()", type: "hook", description: "Returns the Lenis instance (scrollTo, stop, start…)." },
  ],
};
