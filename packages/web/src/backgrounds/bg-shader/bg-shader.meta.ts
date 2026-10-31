import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-shader",
  name: "Liquid Shader Gradient",
  description: "A raw WebGL fragment shader paints a slow, liquid, grain-dithered gradient — no three.js, ~1 KB.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["shader","webgl","gradient","glsl"],
  pageTypes: ["landing","pricing"],
  inspiration: ["Stripe gradient","Shadergradient"],
  a11y: "aria-hidden; renders a single frame under reduced motion.",
  perf: "Full-screen triangle, DPR capped at 1.5, paused off-screen/hidden.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "colors", type: "[string, string, string]", description: "Three hex colors." },
  ],
};
