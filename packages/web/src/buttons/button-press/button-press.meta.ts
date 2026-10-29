import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-press",
  name: "Press Button",
  description: "The foundation button: 2px hover lift, 0.97 press squash, layered shadow and a crisp focus ring. CSS only.",
  category: "buttons",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["button", "cta", "press", "css-only", "foundation"],
  pageTypes: ["landing", "pricing", "auth", "dashboard", "settings"],
  inspiration: ["Linear & Vercel buttons", "Emil Kowalski's 'scale on press'"],
  a11y: "Native <button>; focus-visible ring with offset; disabled state removes pointer events. Reduced motion: no lift or squash.",
  perf: "transform + box-shadow transitions only; 0 KB JS.",
  status: "stable",
  priority: "P1",
  previewHeight: 220,
  props: [
    { name: "variant", type: '"primary" | "secondary" | "ghost"', default: '"primary"', description: "Visual style." },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Height and padding." },
    { name: "...props", type: "ButtonHTMLAttributes", description: "All native button props." },
  ],
};
