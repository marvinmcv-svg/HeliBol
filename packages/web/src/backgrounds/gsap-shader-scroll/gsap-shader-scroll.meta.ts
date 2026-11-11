import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-shader-scroll",
  name: "Shader on Scroll",
  description: "A full-screen fragment shader (raw WebGL) whose uniforms are scrubbed by ScrollTrigger: scrolling twists and zooms an fbm noise field and crossfades the palette panel by panel.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap"],
  registryDependencies: ["kinetik-core"],
  tags: ["gsap","webgl","shader","scroll","storytelling"],
  pageTypes: ["landing"],
  inspiration: ["GSAP Demo Hub — Shader on scroll"],
  a11y: "Canvas aria-hidden; text panels are real HTML. Reduced motion: time stops, scroll still changes the palette. CSS gradient fallback without WebGL.",
  perf: "One fullscreen triangle; DPR capped at 1.5; rAF pauses off-screen; context released on unmount.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "panels", type: "ReactNode[]", description: "Panels scrolled over the shader." },
    { name: "palettes", type: "[string, string][]", default: "4 presets", description: "Colour pair per panel." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroll container." },
  ],
};
